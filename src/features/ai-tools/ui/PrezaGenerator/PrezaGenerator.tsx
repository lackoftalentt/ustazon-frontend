import { useState } from 'react';
import { aiApi } from '@/shared/api/ai';
import { Presentation, CheckCircle, LayoutTemplate, Image, List, Edit3, AlertCircle } from 'lucide-react';
import { AIGeneratorLayout } from '@/features/ai-tools/ui/components/AIGeneratorLayout/AIGeneratorLayout';
import { AIInput } from '@/features/ai-tools/ui/components/AIInput/AIInput';
import { AISelect } from '@/features/ai-tools/ui/components/AISelect/AISelect';
import { AIButton } from '@/features/ai-tools/ui/components/AIButton/AIButton';
import styles from './PrezaGenerator.module.scss';

export const PrezaGenerator = () => {
    const [subject, setSubject] = useState('');
    const [grade, setGrade] = useState('');
    const [topic, setTopic] = useState('');
    const [slidesCount, setSlidesCount] = useState(12);
    const [model, setModel] = useState('gemini-2.5-flash');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!subject || !grade || !topic) {
            setError('Пожалуйста, заполните все обязательные поля');
            return;
        }

        if (slidesCount < 5 || slidesCount > 30) {
            setError('Количество слайдов должно быть от 5 до 30');
            return;
        }

        try {
            setIsGenerating(true);
            setIsSuccess(false);
            setError(null);

            const blob = await aiApi.generatePresentation(
                subject,
                grade,
                topic,
                slidesCount,
                model
            );

            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${topic.replace(/\s+/g, '_')}_${grade.replace(/\s+/g, '_')}.pptx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            setIsSuccess(true);
            setSubject('');
            setTopic('');
            setSlidesCount(12);
        } catch (err: any) {
            console.error('Error generating presentation:', err);
            if (err.response?.status === 401) {
                setError('Сессия истекла. Пожалуйста, войдите снова');
            } else if (err.response?.status === 500) {
                setError('Ошибка на сервере. Попробуйте еще раз');
            } else if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
                setError('Превышено время ожидания. Попробуйте уменьшить количество слайдов');
            } else if (!navigator.onLine) {
                setError('Нет подключения к интернету');
            } else {
                setError(err.response?.data?.detail || 'Не удалось создать презентацию. Попробуйте еще раз');
            }
        } finally {
            setIsGenerating(false);
        }
    };

    const form = (
        <>
            <AIInput
                label="Предмет"
                placeholder="Например: История"
                value={subject}
                onChange={e => setSubject(e.target.value)}
            />

            <AISelect
                label="Класс"
                value={grade}
                onChange={e => setGrade(e.target.value)}
            >
                <option value="">Выберите класс</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(n => (
                    <option key={n} value={`${n} класс`}>{n} класс</option>
                ))}
            </AISelect>

            <AIInput
                label="Тема урока"
                placeholder="Например: Великий шелковый путь"
                value={topic}
                onChange={e => setTopic(e.target.value)}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <AIInput
                    label="Количество слайдов"
                    type="number"
                    min={5}
                    max={30}
                    value={slidesCount}
                    onChange={e => setSlidesCount(parseInt(e.target.value))}
                />
                <AISelect
                    label="AI Модель"
                    value={model}
                    onChange={e => setModel(e.target.value)}
                >
                    <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                    <option value="gemini-2.0-flash-exp">Gemini 2.0 Flash Exp</option>
                    <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
                </AISelect>
            </div>

            <AIButton
                onClick={handleGenerate}
                disabled={isGenerating || !subject || !grade || !topic}
                style={{ marginTop: '1rem' }}
                icon={isGenerating ? <Presentation className="animate-pulse" /> : <Presentation />}
            >
                {isGenerating ? 'Создаем презентацию...' : 'Сгенерировать презентацию'}
            </AIButton>
        </>
    );

    const errorPreview = error ? (
        <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s ease' }}>
            <AlertCircle size={64} color="#dc2626" style={{ marginBottom: '1.5rem' }} />
            <h3 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#991b1b', marginBottom: '1rem' }}>
                Ошибка
            </h3>
            <p style={{ color: '#737373', marginBottom: '2rem' }}>
                {error}
            </p>
            <AIButton variant="secondary" onClick={() => setError(null)}>
                Попробовать снова
            </AIButton>
        </div>
    ) : null;

    const successPreview = isSuccess ? (
        <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s ease' }}>
            <CheckCircle size={64} color="#16a34a" style={{ marginBottom: '1.5rem' }} />
            <h3 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1b5a42', marginBottom: '1rem' }}>
                Презентация готова!
            </h3>
            <p style={{ color: '#737373', marginBottom: '2rem' }}>
                Файл PowerPoint (.pptx) успешно скачан.
            </p>
            <AIButton variant="secondary" onClick={() => setIsSuccess(false)}>
                Создать новую
            </AIButton>
        </div>
    ) : null;

    const featuresPreview = !isSuccess && !error ? (
        <div className={styles.featuresPreview}>
    <h3 className={styles.featuresHeading}>Состав презентации</h3>

    <div className={styles.featuresGrid}>
        <div className={styles.featureCard}>
            <div className={styles.featureIconBox}>
                <LayoutTemplate size={22} />
            </div>
            <div>
                <div className={styles.featureTitle}>Структура</div>
                <div className={styles.featureText}>Логическое изложение</div>
            </div>
        </div>

        <div className={styles.featureCard}>
            <div className={styles.featureIconBox}>
                <List size={22} />
            </div>
            <div>
                <div className={styles.featureTitle}>Содержание</div>
                <div className={styles.featureText}>Цели, теория, выводы</div>
            </div>
        </div>

        <div className={styles.featureCard}>
            <div className={styles.featureIconBox}>
                <Image size={22} />
            </div>
            <div>
                <div className={styles.featureTitle}>Оформление</div>
                <div className={styles.featureText}>Места для изображений</div>
            </div>
        </div>

        <div className={styles.featureCard}>
            <div className={styles.featureIconBox}>
                <Edit3 size={22} />
            </div>
            <div>
                <div className={styles.featureTitle}>Редактируемость</div>
                <div className={styles.featureText}>Полный формат PPTX</div>
            </div>
        </div>
    </div>
</div>
    ) : null;

    return (
        <AIGeneratorLayout
            title="Генератор презентаций"
            description="Создавайте красивые презентации для уроков"
            icon={<Presentation color="#2f8450" size={28} />}
            form={form}
            preview={error ? errorPreview : (isSuccess ? successPreview : featuresPreview)}
            isGenerating={isGenerating}
        />
    );
};

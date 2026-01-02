import { useState } from 'react';
import { aiApi } from '@/shared/api/ai';
import { Presentation, CheckCircle, LayoutTemplate, Image, List, Edit3 } from 'lucide-react';
import { AIGeneratorLayout } from '@/features/ai-tools/ui/components/AIGeneratorLayout/AIGeneratorLayout';
import { AIInput } from '@/features/ai-tools/ui/components/AIInput/AIInput';
import { AISelect } from '@/features/ai-tools/ui/components/AISelect/AISelect';
import { AIButton } from '@/features/ai-tools/ui/components/AIButton/AIButton';
import { AICard } from '@/features/ai-tools/ui/components/AICard/AICard';

export const PrezaGenerator = () => {
    const [subject, setSubject] = useState('');
    const [grade, setGrade] = useState('');
    const [topic, setTopic] = useState('');
    const [slidesCount, setSlidesCount] = useState(12);
    const [model, setModel] = useState('gemini-2.5-flash');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleGenerate = async () => {
        if (!subject || !grade || !topic) return;

        try {
            setIsGenerating(true);
            setIsSuccess(false);

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
        } catch (err) {
            console.error('Error generating presentation:', err);
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

    const featuresPreview = !isSuccess ? (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1b5a42' }}>
                Состав презентации:
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <AICard hoverable className="flex flex-col gap-3 items-start">
                    <LayoutTemplate size={24} color="#2f8450" />
                    <span className="font-medium">Структура</span>
                    <span className="text-sm text-slate-500">Логическое изложение</span>
                </AICard>
                <AICard hoverable className="flex flex-col gap-3 items-start">
                    <List size={24} color="#2f8450" />
                    <span className="font-medium">Содержание</span>
                    <span className="text-sm text-slate-500">Цели, теория, выводы</span>
                </AICard>
                <AICard hoverable className="flex flex-col gap-3 items-start">
                    <Image size={24} color="#2f8450" />
                    <span className="font-medium">Оформление</span>
                    <span className="text-sm text-slate-500">Места для изображений</span>
                </AICard>
                <AICard hoverable className="flex flex-col gap-3 items-start">
                    <Edit3 size={24} color="#2f8450" />
                    <span className="font-medium">Редактируемость</span>
                    <span className="text-sm text-slate-500">Полный формат PPTX</span>
                </AICard>
            </div>
        </div>
    ) : null;

    return (
        <AIGeneratorLayout
            title="Генератор презентаций"
            description="Создавайте красивые презентации для уроков"
            icon={<Presentation color="#2f8450" size={28} />}
            form={form}
            preview={isSuccess ? successPreview : featuresPreview}
            isGenerating={isGenerating}
        />
    );
};

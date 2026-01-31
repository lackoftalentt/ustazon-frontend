import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { aiApi, UserTest } from '@/shared/api/ai';
import { FileCheck, AlertCircle, Loader2 } from 'lucide-react';
import { AIGeneratorLayout } from '@/features/ai-tools/ui/components/AIGeneratorLayout/AIGeneratorLayout';
import { AIInput } from '@/features/ai-tools/ui/components/AIInput/AIInput';
import { AISelect } from '@/features/ai-tools/ui/components/AISelect/AISelect';
import { AIButton } from '@/features/ai-tools/ui/components/AIButton/AIButton';
import styles from './TestGenerator.module.scss';

export const TestGenerator = () => {
    const [subject, setSubject] = useState('');
    const [grade, setGrade] = useState('');
    const [topic, setTopic] = useState('');
    const [questionCount, setQuestionCount] = useState(15);
    const [difficulty, setDifficulty] = useState('medium');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const SUBJECTS = [
        'Балабақша',
        'Бастауыш',
        'Математика',
        'Қазақ тілі | әдебиеті',
        'Тарих',
        'География',
        'Биология',
        'Информатика',
        'Физика',
        'Химия',
        'Орыс тілі',
        'Ағылшын тілі',
        'Еңбек',
        'Дене шынықтыру',
        'Геометрия',
        'Қазақ тілі',
        'Қазақ әдебиеті',
        'Қазақстан тарихы',
        'Дүниежүзі тарих',
        'Python',
        ];

    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const {
        data: tests = [],
        isLoading: isTestsLoading,
    } = useQuery({
        queryKey: ['user-tests'],
        queryFn: aiApi.getUserTests,
        refetchOnWindowFocus: false,
        staleTime: 5_000,
    });

    const handleGenerate = async () => {
        if (!subject || !grade || !topic) {
            setError('Пожалуйста, заполните все обязательные поля');
            return;
        }

        if (questionCount < 5 || questionCount > 50) {
            setError('Количество вопросов должно быть от 5 до 50');
            return;
        }

        try {
            setIsGenerating(true);
            setError(null);

            await aiApi.generateTestToDb(
                subject,
                grade,
                topic,
                questionCount,
                difficulty
            );

            setSubject('');
            setGrade('');
            setTopic('');
            setQuestionCount(15);

            queryClient.invalidateQueries({ queryKey: ['user-tests'] });
        } catch (err: any) {
            console.error('Error generating test:', err);
            setError(
                err.response?.data?.detail ||
                'Не удалось создать тест. Попробуйте еще раз'
            );
        } finally {
            setIsGenerating(false);
        }
    };

    const handleTestClick = (t: UserTest) => {
        navigate(`/take-test/${t.id}`);
    };

    const renderDifficulty = (t: UserTest) => {
        const map: Record<string, { label: string; cls: string }> = {
            easy: { label: 'Базовый', cls: styles.difficultyEasy },
            medium: { label: 'Средний', cls: styles.difficultyMedium },
            hard: { label: 'Высокий', cls: styles.difficultyHard },
        };
        const info = map[t.difficulty] || { label: t.difficulty, cls: styles.difficultyMedium };
        return (
            <span className={`${styles.statusBadge} ${info.cls}`}>
                {info.label}
            </span>
        );
    };

    const form = (
        <>
            <AIInput
                label="Предмет"
                placeholder="Например: Физика"
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
                label="Тема теста"
                placeholder="Например: Законы Ньютона"
                value={topic}
                onChange={e => setTopic(e.target.value)}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <AIInput
                    label="Количество вопросов"
                    type="number"
                    min={5}
                    max={50}
                    value={questionCount}
                    onChange={e => setQuestionCount(parseInt(e.target.value))}
                />
                <AISelect
                    label="Сложность"
                    value={difficulty}
                    onChange={e => setDifficulty(e.target.value)}
                >
                    <option value="easy">Базовый</option>
                    <option value="medium">Средний</option>
                    <option value="hard">Высокий</option>
                </AISelect>
            </div>

            <AIButton
                onClick={handleGenerate}
                disabled={isGenerating || !subject || !grade || !topic}
                style={{ marginTop: '1rem' }}
                icon={<FileCheck />}
            >
                {isGenerating ? 'Создаем тест...' : 'Сгенерировать тест'}
            </AIButton>
        </>
    );

    const preview = error ? (
        <div className={styles.errorState}>
            <AlertCircle size={48} />
            <p>{error}</p>
            <AIButton variant="secondary" onClick={() => setError(null)}>
                Попробовать снова
            </AIButton>
        </div>
    ) : (
        <div className={styles.testsPreview}>
            <h3>Мои тесты</h3>

            {isTestsLoading ? (
                <Loader2 className={styles.spinner} />
            ) : tests.length === 0 ? (
                <p>Тесты еще не созданы</p>
            ) : (
                <div className={styles.testsList}>
                    {tests.map(t => (
                        <div
                            key={t.id}
                            className={`${styles.testItem} ${styles.testClickable}`}
                            onClick={() => handleTestClick(t)}
                        >
                            <div className={styles.cardHeader}>
                                <FileCheck size={16} className={styles.cardIcon} />
                                {renderDifficulty(t)}
                            </div>
                            <div className={styles.cardTitle}>
                                {t.title || 'Без названия'}
                            </div>
                            <div className={styles.cardMeta}>
                                {t.subject} · {t.questions_count} вопросов
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <AIGeneratorLayout
            title="Генератор тестов"
            description="СОР, СОЧ и проверочные работы за пару кликов"
            icon={<FileCheck color="#2f8450" size={28} />}
            form={form}
            preview={preview}
            isGenerating={isGenerating}
        />
    );
};

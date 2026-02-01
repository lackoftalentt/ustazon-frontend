import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { aiApi, UserTest } from '@/shared/api/ai';
import { FileCheck, AlertCircle, Loader2 } from 'lucide-react';
import { AIGeneratorLayout } from '@/features/ai-tools/ui/components/AIGeneratorLayout/AIGeneratorLayout';
import { AIInput } from '@/features/ai-tools/ui/components/AIInput/AIInput';
import { AISelect } from '@/features/ai-tools/ui/components/AISelect/AISelect';
import { AIButton } from '@/features/ai-tools/ui/components/AIButton/AIButton';
import { SUBJECTS } from '@/shared/constants/subjects';
import styles from './TestGenerator.module.scss';

export const TestGenerator = () => {
    const [subject, setSubject] = useState('');
    const [grade, setGrade] = useState('');
    const [topic, setTopic] = useState('');
    const [questionCount, setQuestionCount] = useState(15);
    const [difficulty, setDifficulty] = useState('medium');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
            setError('Барлық міндетті өрістерді толтырыңыз');
            return;
        }

        if (questionCount < 5 || questionCount > 20) {
            setError('Сұрақтар саны 5-тен 20-ге дейін болуы керек');
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
                'Тест жасау мүмкін болмады. Қайта көріңіз'
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
            easy: { label: 'Базалық', cls: styles.difficultyEasy },
            medium: { label: 'Орташа', cls: styles.difficultyMedium },
            hard: { label: 'Жоғары', cls: styles.difficultyHard },
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
            <AISelect
                label="Пән"
                value={subject}
                onChange={e => setSubject(e.target.value)}
            >
                <option value="">Пәнді таңдаңыз</option>
                {SUBJECTS.map(s => (
                    <option key={s} value={s}>{s}</option>
                ))}
            </AISelect>

            <AISelect
                label="Сынып"
                value={grade}
                onChange={e => setGrade(e.target.value)}
            >
                <option value="">Сыныпты таңдаңыз</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(n => (
                    <option key={n} value={`${n} сынып`}>{n} сынып</option>
                ))}
            </AISelect>

            <AIInput
                label="Тест тақырыбы"
                placeholder="Мысалы: Ньютон заңдары"
                value={topic}
                onChange={e => setTopic(e.target.value)}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <AIInput
                    label="Сұрақтар саны"
                    type="number"
                    min={5}
                    max={20}
                    value={questionCount}
                    onChange={e => setQuestionCount(parseInt(e.target.value))}
                />
                <AISelect
                    label="Күрделілік"
                    value={difficulty}
                    onChange={e => setDifficulty(e.target.value)}
                >
                    <option value="easy">Базалық</option>
                    <option value="medium">Орташа</option>
                    <option value="hard">Жоғары</option>
                </AISelect>
            </div>

            <AIButton
                onClick={handleGenerate}
                disabled={isGenerating || !subject || !grade || !topic}
                style={{ marginTop: '1rem' }}
                icon={<FileCheck />}
            >
                {isGenerating ? 'Тест жасалуда...' : 'Тест жасау'}
            </AIButton>
        </>
    );

    const preview = error ? (
        <div className={styles.errorState}>
            <AlertCircle size={48} />
            <p>{error}</p>
            <AIButton variant="secondary" onClick={() => setError(null)}>
                Қайта көру
            </AIButton>
        </div>
    ) : (
        <div className={styles.testsPreview}>
            <h3>Менің тесттерім</h3>

            {isTestsLoading ? (
                <Loader2 className={styles.spinner} />
            ) : tests.length === 0 ? (
                <p>Тесттер әлі жасалмаған</p>
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
                                {t.title || 'Тақырыпсыз'}
                            </div>
                            <div className={styles.cardMeta}>
                                {t.subject} · {t.questions_count} сұрақ
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <AIGeneratorLayout
            title="Тест генераторы"
            description="СОР, СОЧ және тексеру жұмыстары бірнеше клик арқылы"
            icon={<FileCheck color="#2f8450" size={28} />}
            form={form}
            preview={preview}
            isGenerating={isGenerating}
        />
    );
};

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { BookOpen, AlertCircle, Loader2 } from 'lucide-react';
import { AIToolLayout } from '@/features/ai-tools/ui/AIToolLayout/AIToolLayout';
import { AIGeneratorLayout } from '@/features/ai-tools/ui/components/AIGeneratorLayout/AIGeneratorLayout';
import { AIInput } from '@/features/ai-tools/ui/components/AIInput/AIInput';
import { AISelect } from '@/features/ai-tools/ui/components/AISelect/AISelect';
import { AIButton } from '@/features/ai-tools/ui/components/AIButton/AIButton';
import { SUBJECTS } from '@/shared/constants/subjects';
import { lessonApi } from '@/shared/api/lessonApi';
import type { UserLesson } from '@/shared/api/lessonApi';
import styles from './AILessonGeneratorPage.module.scss';

export const AILessonGeneratorPage = () => {
    const [subject, setSubject] = useState('');
    const [grade, setGrade] = useState('');
    const [topic, setTopic] = useState('');
    const [language, setLanguage] = useState('kk');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const {
        data: lessons = [],
        isLoading: isLessonsLoading,
    } = useQuery({
        queryKey: ['user-lessons'],
        queryFn: lessonApi.getUserLessons,
        refetchOnWindowFocus: false,
        staleTime: 5_000,
    });

    const handleGenerate = async () => {
        if (!subject || !grade || !topic) {
            setError('Барлық міндетті өрістерді толтырыңыз');
            return;
        }

        try {
            setIsGenerating(true);
            setError(null);

            const result = await lessonApi.generateLesson(
                subject,
                grade,
                topic,
                language,
            );

            queryClient.invalidateQueries({ queryKey: ['user-lessons'] });
            navigate(`/ai-lesson/${result.id}`);
        } catch (err: any) {
            console.error('Error generating lesson:', err);
            setError(
                err.response?.data?.detail ||
                'Сабақ жасау мүмкін болмады. Қайта көріңіз',
            );
        } finally {
            setIsGenerating(false);
        }
    };

    const handleLessonClick = (lesson: UserLesson) => {
        navigate(`/ai-lesson/${lesson.id}`);
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
                label="Сабақ тақырыбы"
                placeholder="Мысалы: Ньютон заңдары"
                value={topic}
                onChange={e => setTopic(e.target.value)}
            />

            <AISelect
                label="Тілі"
                value={language}
                onChange={e => setLanguage(e.target.value)}
            >
                <option value="kk">Қазақша</option>
                <option value="ru">Орысша</option>
            </AISelect>

            <AIButton
                onClick={handleGenerate}
                disabled={isGenerating || !subject || !grade || !topic}
                style={{ marginTop: '1rem' }}
                icon={<BookOpen />}
                loading={isGenerating}
            >
                {isGenerating ? 'Сабақ жасалуда...' : 'Сабақ жасау'}
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
        <div className={styles.lessonsPreview}>
            <h3>Менің сабақтарым</h3>

            {isLessonsLoading ? (
                <div className={styles.loadingState}>
                    <Loader2 size={24} className={styles.spinner} />
                    <p>Жүктелуде...</p>
                </div>
            ) : lessons.length === 0 ? (
                <div className={styles.emptyState}>
                    <BookOpen size={40} strokeWidth={1.5} />
                    <p>Сабақтар әлі жоқ</p>
                    <span>Жаңа сабақ жасаңыз</span>
                </div>
            ) : (
                <div className={styles.lessonsList}>
                    {lessons.map(lesson => (
                        <div
                            key={lesson.id}
                            className={styles.lessonItem}
                            onClick={() => handleLessonClick(lesson)}
                        >
                            <div className={styles.cardHeader}>
                                <BookOpen size={16} className={styles.cardIcon} />
                                <span className={styles.statusBadge}>Дайын</span>
                            </div>
                            <div className={styles.cardTitle}>
                                {lesson.topic || lesson.title || 'Тақырыпсыз'}
                            </div>
                            <div className={styles.cardMeta}>
                                {lesson.grade || 'Көрсетілмеген'}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <AIToolLayout>
            <AIGeneratorLayout
                title="Сабақ генераторы"
                description="AI көмегімен толық сабақ құжатын жасаңыз — теория, сөздік, тест және ашық сұрақтар"
                icon={<BookOpen color="#2f8450" size={28} />}
                form={form}
                preview={preview}
                isGenerating={isGenerating}
            />
        </AIToolLayout>
    );
};

export default AILessonGeneratorPage;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FileText, AlertCircle, Loader2 } from 'lucide-react';
import { FullScreenLoader } from '@/features/ai-tools/ui/components/FullScreenLoader/FullScreenLoader';
import { AIToolLayout } from '@/features/ai-tools/ui/AIToolLayout/AIToolLayout';
import { AIGeneratorLayout } from '@/features/ai-tools/ui/components/AIGeneratorLayout/AIGeneratorLayout';
import { AIInput } from '@/features/ai-tools/ui/components/AIInput/AIInput';
import { AISelect } from '@/features/ai-tools/ui/components/AISelect/AISelect';
import { AIButton } from '@/features/ai-tools/ui/components/AIButton/AIButton';
import { SUBJECTS } from '@/shared/constants/subjects';
import { qmjAiApi } from '@/shared/api/qmjAiApi';
import type { UserQMJ } from '@/shared/api/qmjAiApi';
import styles from './AIQMJGeneratorPage.module.scss';

export const AIQMJGeneratorPage = () => {
    const [subject, setSubject] = useState('');
    const [grade, setGrade] = useState('');
    const [topic, setTopic] = useState('');
    const [language, setLanguage] = useState('kk');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const {
        data: qmjList = [],
        isLoading: isListLoading,
    } = useQuery({
        queryKey: ['user-qmjs'],
        queryFn: qmjAiApi.getUserQMJs,
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

            const result = await qmjAiApi.generateQMJ(
                subject,
                grade,
                topic,
                language,
            );

            queryClient.invalidateQueries({ queryKey: ['user-qmjs'] });
            navigate(`/ai-qmj/${result.id}`);
        } catch (err: any) {
            console.error('Error generating QMJ:', err);
            setError(
                err.response?.data?.detail ||
                'ҚМЖ жасау мүмкін болмады. Қайта көріңіз',
            );
        } finally {
            setIsGenerating(false);
        }
    };

    const handleQMJClick = (qmj: UserQMJ) => {
        navigate(`/ai-qmj/${qmj.id}`);
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
                icon={<FileText />}
                loading={isGenerating}
            >
                {isGenerating ? 'ҚМЖ жасалуда...' : 'ҚМЖ жасау'}
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
        <div className={styles.qmjPreview}>
            <h3>Менің ҚМЖ-ларым</h3>

            {isListLoading ? (
                <div className={styles.loadingState}>
                    <Loader2 size={24} className={styles.spinner} />
                    <p>Жүктелуде...</p>
                </div>
            ) : qmjList.length === 0 ? (
                <div className={styles.emptyState}>
                    <FileText size={40} strokeWidth={1.5} />
                    <p>ҚМЖ әлі жоқ</p>
                    <span>Жаңа ҚМЖ жасаңыз</span>
                </div>
            ) : (
                <div className={styles.qmjList}>
                    {qmjList.map(qmj => (
                        <div
                            key={qmj.id}
                            className={styles.qmjItem}
                            onClick={() => handleQMJClick(qmj)}
                        >
                            <div className={styles.cardHeader}>
                                <FileText size={16} className={styles.cardIcon} />
                                <span className={styles.statusBadge}>Дайын</span>
                            </div>
                            <div className={styles.cardTitle}>
                                {qmj.topic || qmj.title || 'Тақырыпсыз'}
                            </div>
                            <div className={styles.cardMeta}>
                                {qmj.grade || 'Көрсетілмеген'}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <AIToolLayout>
            {isGenerating && (
                <FullScreenLoader
                    message="ҚМЖ жасалуда..."
                    tips={[
                        'ҚМЖ-ны PDF ретінде жүктей аласыз',
                        'Қазақстан стандартына сай жоспар жасалады',
                        'Сабақтың барлық кезеңдері қамтылады',
                        'Дифференциация мен рефлексия қосылады',
                    ]}
                />
            )}
            <AIGeneratorLayout
                title="ҚМЖ генераторы"
                description="AI көмегімен қысқа мерзімді жоспар жасаңыз — сабақ мақсаттары, кезеңдер, бағалау, рефлексия"
                icon={<FileText color="#2f8450" size={28} />}
                form={form}
                preview={preview}
                isGenerating={isGenerating}
            />
        </AIToolLayout>
    );
};

export default AIQMJGeneratorPage;

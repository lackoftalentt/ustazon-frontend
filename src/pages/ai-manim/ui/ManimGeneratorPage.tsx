import { useState, useEffect, useCallback } from 'react';
import { AIToolLayout } from '@/features/ai-tools/ui/AIToolLayout/AIToolLayout';
import { AIGeneratorLayout } from '@/features/ai-tools/ui/components/AIGeneratorLayout/AIGeneratorLayout';
import { AiUsageBanner } from '@/features/ai-tools/ui/components/AiUsageBanner/AiUsageBanner';
import { AIInput } from '@/features/ai-tools/ui/components/AIInput/AIInput';
import { AISelect } from '@/features/ai-tools/ui/components/AISelect/AISelect';
import { AIButton } from '@/features/ai-tools/ui/components/AIButton/AIButton';
import { aiApi } from '@/shared/api/ai';
import type { AiUsageResponse } from '@/shared/api/ai';
import { getFileUrl } from '@/shared/lib/fileUrl';
import { SUBJECTS } from '@/shared/constants/subjects';
import { Video, AlertCircle, Download } from 'lucide-react';
import { FullScreenLoader } from '@/features/ai-tools/ui/components/FullScreenLoader/FullScreenLoader';

export const ManimGeneratorPage = () => {
    const [subject, setSubject] = useState('');
    const [topic, setTopic] = useState('');
    const [detailLevel, setDetailLevel] = useState('medium');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [usage, setUsage] = useState<AiUsageResponse | null>(null);

    const fetchUsage = useCallback(async () => {
        try {
            const data = await aiApi.getGeneratorUsage();
            setUsage(data);
        } catch { /* ignore */ }
    }, []);

    useEffect(() => { fetchUsage(); }, [fetchUsage]);

    const handleGenerate = async () => {
        if (!subject || !topic) {
            setError('Барлық міндетті өрістерді толтырыңыз');
            return;
        }

        try {
            setIsGenerating(true);
            setError(null);
            setVideoUrl(null);

            const result = await aiApi.generateManimVideo(subject, topic, detailLevel);

            // video_url is a relative path like /uploads/videos/<id>.mp4
            // Use getFileUrl (same as other features) + cache-buster to prevent stale video
            const fullUrl = `${getFileUrl(result.video_url)}?t=${Date.now()}`;
            setVideoUrl(fullUrl);
            fetchUsage();
        } catch (err: any) {
            console.error('Manim generation error:', err);
            const detail = err.response?.data?.detail;
            if (err.response?.status === 403 && detail?.code === 'ai_free_limit_exceeded') {
                setError(detail.message || 'Тегін лимит аяқталды. Жазылым алыңыз.');
            } else if (err.response?.status === 429) {
                const minutes = detail?.retry_after ? Math.ceil(detail.retry_after / 60) : 15;
                setError(`Сұраныс лимиті асып кетті. ${minutes} минуттан кейін қайталап көріңіз.`);
            } else {
                setError(
                    typeof detail === 'string' ? detail : 'Видео жасау мүмкін болмады. Сұранысты жеңілдетіп көріңіз.'
                );
            }
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDownload = () => {
        if (!videoUrl) return;
        const a = document.createElement('a');
        a.href = videoUrl;
        a.download = `manim_video_${Date.now()}.mp4`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
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

            <AIInput
                label="Тақырып"
                placeholder="Мысалы: Пифагор теоремасы, синус графигі..."
                value={topic}
                onChange={e => setTopic(e.target.value)}
            />

            <AISelect
                label="Детализация деңгейі"
                value={detailLevel}
                onChange={e => setDetailLevel(e.target.value)}
            >
                <option value="low">Жылдам</option>
                <option value="medium">Стандартты</option>
                <option value="high">Жоғары</option>
            </AISelect>

            <AIButton
                onClick={handleGenerate}
                disabled={isGenerating || !subject || !topic}
                style={{ marginTop: '1rem' }}
                icon={<Video />}
            >
                {isGenerating ? 'Видео жасалуда...' : 'Видео жасау'}
            </AIButton>
        </>
    );

    const preview = error ? (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '3rem 1rem',
            gap: '1rem',
            textAlign: 'center',
            color: '#991b1b',
        }}>
            <AlertCircle size={48} />
            <p style={{ margin: 0, color: '#737373' }}>{error}</p>
            <AIButton variant="secondary" onClick={() => setError(null)}>
                Қайта көру
            </AIButton>
        </div>
    ) : videoUrl ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
            <div style={{
                flex: 1,
                background: '#000',
                borderRadius: '12px',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <video
                    key={videoUrl}
                    src={videoUrl}
                    controls
                    autoPlay
                    playsInline
                    style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: '12px' }}
                />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <AIButton
                    variant="primary"
                    onClick={handleDownload}
                    icon={<Download size={18} />}
                >
                    Видеоны жүктеу (.mp4)
                </AIButton>
            </div>
        </div>
    ) : null;

    return (
        <AIToolLayout>
            {isGenerating && (
                <FullScreenLoader
                    message="Видео жасалуда..."
                    icon={<Video size={48} color="#10b981" />}
                    tips={[
                        'Видеоны .mp4 ретінде жүктей аласыз',
                        'Тест жасап, оқушылардың білімін тексеріңіз',
                        'Сабақ генераторы арқылы толық сабақ жоспарын жасаңыз',
                        'Презентация генераторын қолданып көріңіз',
                    ]}
                />
            )}
            <AIGeneratorLayout
                title="Manim визуализация"
                description="Математикалық анимация видеолар жасаңыз"
                icon={<Video size={28} color="#10b981" />}
                form={form}
                preview={preview}
                isGenerating={isGenerating}
                usageBanner={<AiUsageBanner usage={usage} />}
            />
        </AIToolLayout>
    );
};

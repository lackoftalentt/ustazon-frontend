import { useState, useRef } from 'react';
import { AIToolLayout } from '@/features/ai-tools/ui/AIToolLayout/AIToolLayout';
import { AIGeneratorLayout } from '@/features/ai-tools/ui/components/AIGeneratorLayout/AIGeneratorLayout';
import { AISelect } from '@/features/ai-tools/ui/components/AISelect/AISelect';
import { AIButton } from '@/features/ai-tools/ui/components/AIButton/AIButton';
import { aiApi } from '@/shared/api/ai';
import { Download, Video, Film, AlertCircle } from 'lucide-react';

export const ManimGeneratorPage = () => {
    const [topic, setTopic] = useState('');
    const [model, setModel] = useState('gemini-2.5-flash');
    const [detailLevel, setDetailLevel] = useState('medium');
    const [isLoading, setIsLoading] = useState(false);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleGenerate = async () => {
        if (!topic.trim()) return;

        setIsLoading(true);
        if (videoUrl) URL.revokeObjectURL(videoUrl);
        setVideoUrl(null);
        setError(null);

        try {
            const blob = await aiApi.generateManimVideo(topic, detailLevel, model);
            const url = URL.createObjectURL(blob);
            setVideoUrl(url);

            // Auto play when ready
            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.play().catch(e => console.log('Autoplay failed:', e));
                }
            }, 100);

        } catch (err: any) {
            console.error('Failed to generate Manim video', err);
            setError('Не удалось сгенерировать видео. Возможно, запрос слишком сложный или возникла ошибка на сервере. Попробуйте упростить запрос.');
        } finally {
            setIsLoading(false);
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

    const renderForm = () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: '#334155' }}>
                    Что нужно визуализировать?
                </label>
                <textarea
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Например: Показать вращение куба, график синуса, теорема Пифагора..."
                    style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        minHeight: '120px',
                        fontSize: '15px',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        resize: 'vertical'
                    }}
                />
                <p style={{ marginTop: '8px', fontSize: '13px', color: '#64748b' }}>
                    💡 Совет: Используйте простые запросы. LaTeX формулы пока поддерживаются ограниченно.
                </p>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                    <AISelect
                        label="Детализация"
                        value={detailLevel}
                        onChange={(e) => setDetailLevel(e.target.value)}
                        options={[
                            { value: 'low', label: 'Быстрая' },
                            { value: 'medium', label: 'Стандартная' },
                            { value: 'high', label: 'Высокая' }
                        ]}
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <AISelect
                        label="Модель AI"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        options={[
                            { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
                            { value: 'gemini-2.0-flash-exp', label: 'Gemini 2.0 Flash' },
                            { value: 'claude-3-5-sonnet', label: 'Claude 3.5 Sonnet' },
                            { value: 'gpt-4o', label: 'GPT-4o' },
                            { value: 'gpt-4o-mini', label: 'GPT-4o Mini' }
                        ]}
                    />
                </div>
            </div>

            {error && (
                <div style={{
                    padding: '12px',
                    borderRadius: '8px',
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    color: '#ef4444',
                    fontSize: '14px',
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'start'
                }}>
                    <AlertCircle size={16} style={{ marginTop: '2px', flexShrink: 0 }} />
                    <span>{error}</span>
                </div>
            )}

            <AIButton
                variant="primary"
                onClick={handleGenerate}
                loading={isLoading}
                icon={<Film size={20} />}
                fullWidth
            >
                {isLoading ? 'Рендеринг (это займет 1-2 мин)...' : 'Создать видео'}
            </AIButton>
        </div>
    );

    const renderPreview = () => (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {videoUrl ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', overflow: 'hidden' }}>

                    <div style={{
                        flex: 1,
                        background: '#000',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}>
                        <video
                            ref={videoRef}
                            src={videoUrl}
                            controls
                            style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: '12px' }}
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <AIButton
                            variant="primary"
                            onClick={handleDownload}
                            icon={<Download size={18} />}
                        >
                            Скачать видео (.mp4)
                        </AIButton>
                    </div>
                </div>
            ) : (
                <div style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#94a3b8',
                    gap: '16px',
                    opacity: 0.6
                }}>
                    <Film size={64} color="#cbd5e1" />
                    <div style={{ textAlign: 'center' }}>
                        <h3 style={{ margin: '0 0 8px 0', color: '#64748b' }}>Видео-генератор Manim</h3>
                        <p style={{ margin: 0, maxWidth: '300px' }}>
                            Создавайте настоящие математические анимации.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <AIToolLayout>
            <AIGeneratorLayout
                title="Manim Visualizer"
                description="Генерация видео-анимаций (без LaTeX)"
                icon={<Video size={24} color="#10b981" />}
                form={renderForm()}
                preview={renderPreview()}
                isGenerating={isLoading}
            />
        </AIToolLayout>
    );
};

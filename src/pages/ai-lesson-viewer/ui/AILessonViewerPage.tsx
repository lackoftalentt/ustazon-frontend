import { useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Printer, FileDown, ClipboardList } from 'lucide-react';
import { lessonApi, type TestBlock } from '@/shared/api/lessonApi';
import { LessonDocument } from '@/features/lesson-viewer';

const buttonStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.6rem 1.25rem',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
};

export const AILessonViewerPage = () => {
    const { id } = useParams<{ id: string }>();
    const lessonId = Number(id);
    const navigate = useNavigate();
    const documentRef = useRef<HTMLDivElement>(null);
    const [isExporting, setIsExporting] = useState(false);

    const { data, isLoading, error } = useQuery({
        queryKey: ['lesson', lessonId],
        queryFn: () => lessonApi.getLessonById(lessonId),
        enabled: !isNaN(lessonId),
        refetchOnWindowFocus: false,
        staleTime: 60_000,
    });

    const handleExportPdf = async () => {
        const element = documentRef.current;
        if (!element) return;

        setIsExporting(true);
        try {
            const html2pdf = (await import('html2pdf.js')).default;
            const title = data?.content?.meta?.topic || 'lesson';

            await html2pdf()
                .set({
                    margin: [10, 10, 10, 10],
                    filename: `${title}.pdf`,
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { scale: 2, useCORS: true },
                    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
                    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
                })
                .from(element)
                .save();
        } catch (err) {
            console.error('PDF export failed:', err);
        } finally {
            setIsExporting(false);
        }
    };

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', gap: '0.75rem', color: '#666' }}>
                <Loader2 size={28} className="animate-spin" />
                <span>Сабақ жүктелуде...</span>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', color: '#b91c1c' }}>
                <p>Сабақты жүктеу мүмкін болмады</p>
            </div>
        );
    }

    return (
        <>
            <div className="lesson-export-bar" style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '0.75rem',
                padding: '1rem',
                background: '#f0f0f0',
            }}>
                <button
                    onClick={handleExportPdf}
                    disabled={isExporting}
                    style={{ ...buttonStyle, background: '#2563eb', opacity: isExporting ? 0.7 : 1 }}
                >
                    {isExporting
                        ? <><Loader2 size={18} className="animate-spin" /> PDF жасалуда...</>
                        : <><FileDown size={18} /> PDF жүктеу</>
                    }
                </button>
                <button
                    onClick={() => window.print()}
                    style={{ ...buttonStyle, background: '#2f8450' }}
                >
                    <Printer size={18} />
                    Басып шығару
                </button>
                {(() => {
                    const testBlock = data.content.blocks.find((b): b is TestBlock => b.type === 'test');
                    if (!testBlock) return null;
                    return (
                        <button
                            onClick={() => navigate(`/take-test/${testBlock.test_id}`)}
                            style={{ ...buttonStyle, background: '#9333ea' }}
                        >
                            <ClipboardList size={18} />
                            Тестке өту
                        </button>
                    );
                })()}
            </div>
            <div ref={documentRef}>
                <LessonDocument document={data.content} />
            </div>
        </>
    );
};

export default AILessonViewerPage;

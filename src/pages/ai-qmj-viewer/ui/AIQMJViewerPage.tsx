import { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Printer, FileDown } from 'lucide-react';
import { qmjAiApi } from '@/shared/api/qmjAiApi';
import { QMJDocument } from '@/features/qmj-viewer';

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

export const AIQMJViewerPage = () => {
    const { id } = useParams<{ id: string }>();
    const qmjId = Number(id);
    const documentRef = useRef<HTMLDivElement>(null);
    const [isExporting, setIsExporting] = useState(false);

    const { data, isLoading, error } = useQuery({
        queryKey: ['qmj', qmjId],
        queryFn: () => qmjAiApi.getQMJById(qmjId),
        enabled: !isNaN(qmjId),
        refetchOnWindowFocus: false,
        staleTime: 60_000,
    });

    const handleExportPdf = async () => {
        const element = documentRef.current;
        if (!element) return;

        setIsExporting(true);
        try {
            const html2pdf = (await import('html2pdf.js')).default;
            const title = data?.content?.meta?.topic || 'qmj';

            await html2pdf()
                .set({
                    margin: [10, 10, 10, 10],
                    filename: `ҚМЖ - ${title}.pdf`,
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
                <span>ҚМЖ жүктелуде...</span>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', color: '#b91c1c' }}>
                <p>ҚМЖ-ны жүктеу мүмкін болмады</p>
            </div>
        );
    }

    return (
        <>
            <div className="qmj-export-bar" style={{
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
            </div>
            <div ref={documentRef}>
                <QMJDocument content={data.content} />
            </div>
        </>
    );
};

export default AIQMJViewerPage;

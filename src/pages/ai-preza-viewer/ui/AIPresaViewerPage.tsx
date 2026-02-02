import { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Printer, FileDown, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { aiApi } from '@/shared/api/ai';
import type { PresentationSlide } from '@/shared/api/ai';
import s from './AIPresaViewerPage.module.scss';

export const AIPresaViewerPage = () => {
    const { id } = useParams<{ id: string }>();
    const presentationId = Number(id);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isExporting, setIsExporting] = useState(false);
    const slidesRef = useRef<HTMLDivElement>(null);

    const { data, isLoading, error } = useQuery({
        queryKey: ['presentation', presentationId],
        queryFn: () => aiApi.getPresentationById(presentationId),
        enabled: !isNaN(presentationId),
        refetchOnWindowFocus: false,
        staleTime: 60_000,
    });

    const handleExportPdf = async () => {
        const element = slidesRef.current;
        if (!element) return;

        setIsExporting(true);
        try {
            const html2pdf = (await import('html2pdf.js')).default;
            const title = data?.topic || 'presentation';

            await html2pdf()
                .set({
                    margin: [10, 10, 10, 10],
                    filename: `${title}.pdf`,
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { scale: 2, useCORS: true },
                    jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
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
            <div className={s.centered}>
                <Loader2 size={28} style={{ animation: 'spin 1s linear infinite' }} />
                <span>Презентация жүктелуде...</span>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className={s.errorState}>
                <p>Презентацияны жүктеу мүмкін болмады</p>
            </div>
        );
    }

    const slides: PresentationSlide[] = data.slides || [];

    if (slides.length === 0) {
        return (
            <div className={s.centered}>
                <span>Презентация деректері әлі дайын емес</span>
            </div>
        );
    }

    const slide = slides[currentSlide];
    const isFirst = currentSlide === 0;
    const isLast = currentSlide === slides.length - 1;

    return (
        <>
            <div className={s.toolbar}>
                <button
                    className={`${s.toolbarBtn} ${s.btnPdf}`}
                    onClick={handleExportPdf}
                    disabled={isExporting}
                >
                    {isExporting
                        ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> PDF жасалуда...</>
                        : <><FileDown size={18} /> PDF жүктеу</>
                    }
                </button>
                <button
                    className={`${s.toolbarBtn} ${s.btnPrint}`}
                    onClick={() => window.print()}
                >
                    <Printer size={18} />
                    Басып шығару
                </button>
                {data.gamma_url && (
                    <button
                        className={`${s.toolbarBtn} ${s.btnExternal}`}
                        onClick={() => window.open(data.gamma_url!, '_blank', 'noopener,noreferrer')}
                    >
                        <ExternalLink size={18} />
                        Gamma-да ашу
                    </button>
                )}
            </div>

            <div className={s.viewer}>
                <div className={s.slideArea}>
                    <button
                        className={s.navBtn}
                        onClick={() => setCurrentSlide(i => i - 1)}
                        disabled={isFirst}
                    >
                        <ChevronLeft size={28} />
                    </button>

                    <div className={s.slideCard}>
                        <div className={s.slideNumber}>
                            {slide.slide_number} / {slides.length}
                        </div>
                        <h1 className={s.slideTitle}>{slide.title}</h1>
                        {slide.content.length > 0 && (
                            <ul className={s.slideContent}>
                                {slide.content.map((item, i) => (
                                    <li key={i}>{item}</li>
                                ))}
                            </ul>
                        )}
                        {slide.notes && (
                            <div className={s.slideNotes}>
                                <strong>Ескерту:</strong> {slide.notes}
                            </div>
                        )}
                    </div>

                    <button
                        className={s.navBtn}
                        onClick={() => setCurrentSlide(i => i + 1)}
                        disabled={isLast}
                    >
                        <ChevronRight size={28} />
                    </button>
                </div>

                <div className={s.thumbnails}>
                    {slides.map((sl, i) => (
                        <button
                            key={sl.slide_number}
                            className={`${s.thumb} ${i === currentSlide ? s.thumbActive : ''}`}
                            onClick={() => setCurrentSlide(i)}
                        >
                            <span className={s.thumbNum}>{sl.slide_number}</span>
                            <span className={s.thumbTitle}>{sl.title}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Hidden element for PDF export — renders all slides */}
            <div ref={slidesRef} className={s.printOnly}>
                {slides.map(sl => (
                    <div key={sl.slide_number} className={s.printSlide}>
                        <div className={s.printSlideNum}>Слайд {sl.slide_number}</div>
                        <h2 className={s.printSlideTitle}>{sl.title}</h2>
                        {sl.content.length > 0 && (
                            <ul className={s.printSlideContent}>
                                {sl.content.map((item, i) => (
                                    <li key={i}>{item}</li>
                                ))}
                            </ul>
                        )}
                        {sl.notes && (
                            <p className={s.printSlideNotes}>
                                <strong>Ескерту:</strong> {sl.notes}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </>
    );
};

export default AIPresaViewerPage;

import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';
import '@cyntler/react-doc-viewer/dist/index.css';
import { useRef, useState, useCallback, useEffect } from 'react';
import s from './PresentationViewer.module.scss';

interface Document {
    uri: string;
    fileName?: string;
    fileType?: string;
}

interface PresentationViewerProps {
    documents: Document[];
    className?: string;
}

export const PresentationViewer = ({
    documents,
    className
}: PresentationViewerProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const toggleFullscreen = useCallback(() => {
        if (!containerRef.current) return;

        if (!document.fullscreenElement) {
            containerRef.current.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }, []);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener(
                'fullscreenchange',
                handleFullscreenChange
            );
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className={`${s.presentationViewer} ${isFullscreen ? s.fullscreen : ''} ${className || ''}`}
        >
            <button
                className={s.fullscreenButton}
                onClick={toggleFullscreen}
                title="Полноэкранный режим"
            >
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                </svg>
            </button>
            <DocViewer
                documents={documents}
                pluginRenderers={DocViewerRenderers}
                config={{
                    header: {
                        disableHeader: false,
                        disableFileName: false,
                        retainURLParams: false
                    },
                    pdfVerticalScrollByDefault: true
                }}
                style={{ height: '100%', width: '100%' }}
            />
        </div>
    );
};

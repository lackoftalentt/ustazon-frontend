import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import s from './Modal.module.scss';

type Props = {
    open: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
};

export const Modal = ({ open, onClose, title, children }: Props) => {
    useEffect(() => {
        if (!open) return;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [open, onClose]);

    if (!open) return null;

    return createPortal(
        <div
            className={s.overlay}
            onMouseDown={onClose}>
            <div
                className={s.dialog}
                role="dialog"
                aria-modal="true"
                aria-label={title}
                onMouseDown={e => e.stopPropagation()}>
                <div className={s.header}>
                    <div className={s.title}>{title}</div>
                    <button
                        className={s.close}
                        type="button"
                        onClick={onClose}
                        aria-label="Close">
                        ✕
                    </button>
                </div>

                <div className={s.body}>{children}</div>
            </div>
        </div>,
        document.body
    );
};

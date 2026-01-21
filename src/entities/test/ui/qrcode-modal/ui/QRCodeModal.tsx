import { type ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import s from './QRCodeModal.module.scss';

interface QRCodeModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

export const QRCodeModal = ({
    isOpen,
    onClose,
    children
}: QRCodeModalProps) => {
    useEffect(() => {
        if (!isOpen) return;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        document.addEventListener('keydown', onKeyDown);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div
            className={s.qrModal}
            onClick={onClose}>
            <div
                className={s.qrContent}
                onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </div>,
        document.body
    );
};

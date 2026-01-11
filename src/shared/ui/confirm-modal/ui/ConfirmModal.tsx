import { useCallback, useEffect } from 'react';
import { clsx } from 'clsx';
import { Button } from '@/shared/ui/button';
import s from './ConfirmModal.module.scss';

export type ConfirmVariant = 'danger' | 'warning' | 'info';

export interface ConfirmModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: ConfirmVariant;
    loading?: boolean;
}

const icons: Record<ConfirmVariant, React.ReactNode> = {
    danger: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
    ),
    warning: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
    ),
    info: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
    )
};

export const ConfirmModal = ({
    open,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Растау',
    cancelText = 'Бас тарту',
    variant = 'danger',
    loading = false
}: ConfirmModalProps) => {
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !loading) {
                onClose();
            }
        },
        [onClose, loading]
    );

    useEffect(() => {
        if (open) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [open, handleKeyDown]);

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget && !loading) {
            onClose();
        }
    };

    if (!open) return null;

    return (
        <div className={s.overlay} onClick={handleBackdropClick}>
            <div className={clsx(s.modal, s[variant])}>
                <div className={s.iconWrapper}>
                    {icons[variant]}
                </div>

                <h3 className={s.title}>{title}</h3>
                <p className={s.message}>{message}</p>

                <div className={s.actions}>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={loading}>
                        {cancelText}
                    </Button>
                    <Button
                        type="button"
                        variant="primary"
                        className={clsx(s.confirmBtn, s[variant])}
                        onClick={onConfirm}
                        loading={loading}>
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );
};

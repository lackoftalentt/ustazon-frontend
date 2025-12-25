import s from './AttachMenu.module.scss';
import ImageIcon from '@/shared/assets/icons/image.svg?react';
import DocumentIcon from '@/shared/assets/icons/document2.svg?react';

interface AttachMenuProps {
    open: boolean;
    onPickImage?: () => void;
    onPickDocument?: () => void;
}

export const AttachMenu = ({
    open,
    onPickImage,
    onPickDocument
}: AttachMenuProps) => {
    if (!open) return null;

    return (
        <div
            className={s.attachMenu}
            role="menu"
            aria-label="Вложения">
            <button
                className={s.attachItem}
                type="button"
                onClick={onPickImage}
                role="menuitem">
                <ImageIcon
                    className={s.attachIcon}
                    aria-hidden
                />

                <span>Изображение</span>
            </button>

            <button
                className={s.attachItem}
                type="button"
                onClick={onPickDocument}
                role="menuitem">
                <DocumentIcon
                    className={s.attachIcon}
                    aria-hidden
                />

                <span>Документы</span>
            </button>
        </div>
    );
};

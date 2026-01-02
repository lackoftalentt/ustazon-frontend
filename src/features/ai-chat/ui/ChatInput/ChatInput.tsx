import {
    useEffect,
    useMemo,
    useRef,
    useState,
    type KeyboardEvent
} from 'react';
import s from './ChatInput.module.scss';
import { AttachMenu } from '../AttachMenu/AttachMenu';
import DocumentIcon from '@/shared/assets/icons/document2.svg?react';

type AttachmentKind = 'image' | 'document';

type Attachment = {
    id: string;
    kind: AttachmentKind;
    file: File;
    previewUrl?: string;
};

interface ChatInputProps {
    onSend: (payload: { message: string; attachments: File[] }) => void;
    placeholder?: string;
    disabled?: boolean;
}

const uid = () => crypto.randomUUID?.() ?? String(Date.now() + Math.random());

export const ChatInput = ({
    onSend,
    placeholder = 'Введите текст',
    disabled = false
}: ChatInputProps) => {
    const [value, setValue] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const imageInputRef = useRef<HTMLInputElement | null>(null);
    const docInputRef = useRef<HTMLInputElement | null>(null);

    const filesToSend = useMemo(
        () => attachments.map(a => a.file),
        [attachments]
    );

    const addFiles = (files: FileList, kind: AttachmentKind) => {
        const next: Attachment[] = Array.from(files).map(file => {
            const att: Attachment = { id: uid(), kind, file };
            if (kind === 'image') att.previewUrl = URL.createObjectURL(file);
            return att;
        });

        setAttachments(prev => [...prev, ...next]);
    };

    const onPickImages: React.ChangeEventHandler<HTMLInputElement> = e => {
        if (e.target.files?.length) addFiles(e.target.files, 'image');
        e.target.value = '';
        setIsMenuOpen(false);
    };

    const onPickDocs: React.ChangeEventHandler<HTMLInputElement> = e => {
        if (e.target.files?.length) addFiles(e.target.files, 'document');
        e.target.value = '';
        setIsMenuOpen(false);
    };

    const removeAttachment = (id: string) => {
        setAttachments(prev => {
            const found = prev.find(x => x.id === id);
            if (found?.previewUrl) URL.revokeObjectURL(found.previewUrl);
            return prev.filter(x => x.id !== id);
        });
    };

    const handleSend = () => {
        if (disabled) return;

        const message = value.trim();
        if (!message && filesToSend.length === 0) return;

        onSend({ message, attachments: filesToSend });

        setValue('');
        setIsMenuOpen(false);
        setAttachments(prev => {
            prev.forEach(
                a => a.previewUrl && URL.revokeObjectURL(a.previewUrl)
            );
            return [];
        });
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
        if (e.key === 'Escape') setIsMenuOpen(false);
    };

    useEffect(() => {
        const onDocMouseDown = (event: MouseEvent) => {
            if (!wrapperRef.current) return;
            if (!wrapperRef.current.contains(event.target as Node))
                setIsMenuOpen(false);
        };

        document.addEventListener('mousedown', onDocMouseDown);
        return () => document.removeEventListener('mousedown', onDocMouseDown);
    }, []);

    useEffect(() => {
        return () => {
            attachments.forEach(
                a => a.previewUrl && URL.revokeObjectURL(a.previewUrl)
            );
        };
    }, [attachments]);

    return (
        <div
            ref={wrapperRef}
            className={s.inputWrapper}>
            <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={onPickImages}
            />

            <input
                ref={docInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                multiple
                hidden
                onChange={onPickDocs}
            />

            {attachments.length > 0 && (
                <div className={s.attachments}>
                    {attachments.map(a => (
                        <div
                            key={a.id}
                            className={s.attachment}>
                            {a.kind === 'image' && a.previewUrl ? (
                                <div className={s.previewWrap}>
                                    <img
                                        className={s.attachmentPreview}
                                        src={a.previewUrl}
                                        alt={a.file.name}
                                    />
                                    <button
                                        type="button"
                                        className={s.previewRemove}
                                        onClick={() => removeAttachment(a.id)}
                                        aria-label="Удалить вложение">
                                        ×
                                    </button>
                                </div>
                            ) : (
                                <div className={s.documentWrap}>
                                    <DocumentIcon className={s.documentIcon} />
                                    <div className={s.documentName}>
                                        {a.file.name}
                                    </div>
                                    <button
                                        type="button"
                                        className={s.documentRemove}
                                        onClick={() => removeAttachment(a.id)}
                                        aria-label="Удалить вложение">
                                        ×
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <div className={s.inputContainer}>
                <div className={s.attachButtonWrapper}>
                    <button
                        type="button"
                        className={s.attachButton}
                        onClick={() => setIsMenuOpen(v => !v)}
                        aria-label="Добавить вложение"
                        aria-expanded={isMenuOpen}>
                        <span
                            className={s.plus}
                            aria-hidden>
                            +
                        </span>
                    </button>
                    <AttachMenu
                        open={isMenuOpen}
                        onPickImage={() => imageInputRef.current?.click()}
                        onPickDocument={() => docInputRef.current?.click()}
                    />
                </div>

                <input
                    type="text"
                    className={s.input}
                    placeholder={placeholder}
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={disabled}
                />

                <button
                    className={s.sendButton}
                    onClick={handleSend}
                    disabled={disabled || (!value.trim() && attachments.length === 0)}
                    aria-label="Отправить сообщение"
                    type="button">
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none">
                        <path
                            d="M18 2L9 11M18 2L12 18L9 11M18 2L2 8L9 11"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
};

import {
    useEffect,
    useMemo,
    useRef,
    useState,
    type KeyboardEvent
} from 'react';
import s from './ChatInput.module.scss';
import { AttachMenu } from '../AttachMenu/AttachMenu';

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
}

const uid = () => crypto.randomUUID?.() ?? String(Date.now() + Math.random());

export const ChatInput = ({
    onSend,
    placeholder = 'Введите текст'
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
            if (kind === 'image') att.previewUrl = URL.createObjectURL(file); // превью [web:158]
            return att;
        });

        setAttachments(prev => [...prev, ...next]);
    };

    const onPickImages: React.ChangeEventHandler<HTMLInputElement> = e => {
        if (e.target.files?.length) addFiles(e.target.files, 'image');
        e.target.value = ''; // чтобы выбрать тот же файл повторно [web:159]
        setIsMenuOpen(false);
    };

    const onPickDocs: React.ChangeEventHandler<HTMLInputElement> = e => {
        if (e.target.files?.length) addFiles(e.target.files, 'document');
        e.target.value = ''; // [web:159]
        setIsMenuOpen(false);
    };

    const removeAttachment = (id: string) => {
        setAttachments(prev => {
            const found = prev.find(x => x.id === id);
            if (found?.previewUrl) URL.revokeObjectURL(found.previewUrl); // освобождаем память [web:158]
            return prev.filter(x => x.id !== id);
        });
    };

    const handleSend = () => {
        const message = value.trim();
        if (!message && filesToSend.length === 0) return;

        onSend({ message, attachments: filesToSend });

        // очистка
        setValue('');
        setIsMenuOpen(false);
        setAttachments(prev => {
            prev.forEach(
                a => a.previewUrl && URL.revokeObjectURL(a.previewUrl)
            ); // [web:158]
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

    // на размонтирование компонента — тоже чистим objectURL
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
            <AttachMenu
                open={isMenuOpen}
                onPickImage={() => imageInputRef.current?.click()} // открыть file dialog [web:142]
                onPickDocument={() => docInputRef.current?.click()} // открыть file dialog [web:142]
            />

            {/* скрытые input'ы */}
            <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={onPickImages}
            />
            {/* accept + multiple [web:142][web:145] */}

            <input
                ref={docInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                multiple
                hidden
                onChange={onPickDocs}
            />
            {/* accept [web:145] */}

            {/* превью/список прикреплений */}
            {attachments.length > 0 && (
                <div className={s.attachments}>
                    {attachments.map(a => (
                        <div
                            key={a.id}
                            className={s.attachment}>
                            {a.kind === 'image' && a.previewUrl ? (
                                <img
                                    className={s.attachmentPreview}
                                    src={a.previewUrl}
                                    alt={a.file.name}
                                />
                            ) : (
                                <span className={s.attachmentName}>
                                    {a.file.name}
                                </span>
                            )}

                            <button
                                type="button"
                                className={s.attachmentRemove}
                                onClick={() => removeAttachment(a.id)}
                                aria-label="Удалить вложение">
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div className={s.inputContainer}>
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

                <input
                    type="text"
                    className={s.input}
                    placeholder={placeholder}
                    value={value}
                    onChange={e => setValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                />

                <button
                    className={s.sendButton}
                    onClick={handleSend}
                    disabled={!value.trim() && attachments.length === 0}
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

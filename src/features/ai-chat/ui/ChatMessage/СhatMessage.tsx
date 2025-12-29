import s from './ChatMessage.module.scss';

interface ChatMessageProps {
    text: string;
    sender: 'ai' | 'user';
    timestamp: Date;
    images?: string[];
}

export const ChatMessage = ({ text, sender, images }: ChatMessageProps) => {
    if (sender === 'ai') {
        const lines = text.split('\n');

        return (
            <div className={s.row}>
                <div className={s.aiMessage}>
                    <div className={s.aiText}>
                        {lines.map((line, i) => (
                            <div
                                key={i}
                                className={i === 0 ? s.aiTitle : s.aiSubtitle}>
                                {line}
                            </div>
                        ))}
                    </div>
                    {images && images.length > 0 && (
                        <div className={s.imageGallery}>
                            {images.map((img, idx) => (
                                <img
                                    key={idx}
                                    src={img}
                                    alt={`AI response ${idx + 1}`}
                                    className={s.messageImage}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className={`${s.row} ${s.rowRight}`}>
            <div className={s.userMessage}>
                {images && images.length > 0 && (
                    <div className={s.imageGallery}>
                        {images.map((img, idx) => (
                            <img
                                key={idx}
                                src={img}
                                alt={`Attachment ${idx + 1}`}
                                className={s.messageImage}
                            />
                        ))}
                    </div>
                )}
                {text && <div className={s.userMessageContent}>{text}</div>}
            </div>
        </div>
    );
};

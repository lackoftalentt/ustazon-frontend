import s from './ChatMessage.module.scss';

interface ChatMessageProps {
    text: string;
    sender: 'ai' | 'user';
    timestamp: Date;
}

export const ChatMessage = ({
    text,
    sender /* timestamp */
}: ChatMessageProps) => {
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
                </div>
            </div>
        );
    }

    return (
        <div className={`${s.row} ${s.rowRight}`}>
            <div className={s.userMessage}>
                <div className={s.userMessageContent}>{text}</div>
            </div>
        </div>
    );
};

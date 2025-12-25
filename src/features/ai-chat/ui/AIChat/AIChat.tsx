import { useState, useRef } from 'react';
import { ChatMessage } from '../ChatMessage/СhatMessage';
import { ChatInput } from '../ChatInput/ChatInput';
import s from './AIChat.module.scss';
import BooksIcon from '@/shared/assets/icons/books.svg?react';

interface Message {
    id: string;
    text: string;
    sender: 'ai' | 'user';
    timestamp: Date;
}

export const AIChat = () => {
    const [messages, setMessages] = useState<Message[]>([]);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // const scrollToBottom = () => {
    //     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    // };

    // useEffect(() => {
    //     scrollToBottom();
    // }, [messages]);

    const handleSendMessage = (payload: {
        message: string;
        attachments: File[];
    }) => {
        const newMessage: Message = {
            id: Date.now().toString(),
            text: payload.message,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newMessage]);

        setTimeout(() => {
            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                text: 'Спасибо за ваше сообщение! Я обрабатываю ваш запрос...',
                sender: 'ai',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiResponse]);
        }, 1000);

        // пока вложения просто есть в payload.attachments
        // позже можешь отрендерить их отдельно или отправлять на сервер
    };

    return (
        <div className={s.aiChat}>
            <div className={s.chatContainer}>
                <div className={s.top}>
                    <div className={s.aiBadge}>
                        <BooksIcon className={s.aiIcon} />
                        <div className={s.aiTexts}>
                            <h2 className={s.aiTitle}>UstazOn AI</h2>
                            <p className={s.aiSubtitle}>
                                Онлайн Отвечает через пару секунд
                            </p>
                        </div>
                    </div>

                    {/* <div className={s.placeholderCards}>
                        <div className={s.placeholderCard}>
                            <div className={s.placeholderLabel}>Label</div>
                            <div className={s.placeholderText}>Text</div>
                        </div>
                        <div className={s.placeholderCard}>
                            <div className={s.placeholderLabel}>Label</div>
                            <div className={s.placeholderText}>Text</div>
                        </div>
                        <div className={s.placeholderCard}>
                            <div className={s.placeholderLabel}>Label</div>
                            <div className={s.placeholderText}>Text</div>
                        </div>
                    </div> */}
                </div>

                <div className={s.chatMessages}>
                    {messages.map(m => (
                        <ChatMessage
                            key={m.id}
                            text={m.text}
                            sender={m.sender}
                            timestamp={m.timestamp}
                        />
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <div className={s.chatFooter}>
                    <ChatInput onSend={handleSendMessage} />
                </div>
            </div>
        </div>
    );
};

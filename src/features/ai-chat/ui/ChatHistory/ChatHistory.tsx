import { useState, useRef, useEffect } from 'react';
import { History, Plus, MessageSquare, Trash2, X, ChevronDown } from 'lucide-react';
import s from './ChatHistory.module.scss';
import type { ConversationListItem } from '@/shared/api/ai';

interface ChatHistoryProps {
    conversations: ConversationListItem[];
    currentId: number | null;
    onSelect: (id: number) => void;
    onNewChat: () => void;
    onDelete: (id: number, e: React.MouseEvent) => void;
    isLoading?: boolean;
}

export const ChatHistory = ({
    conversations,
    currentId,
    onSelect,
    onNewChat,
    onDelete,
    isLoading = false
}: ChatHistoryProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const currentConversation = conversations.find(c => c.id === currentId);

    const handleSelect = (id: number) => {
        onSelect(id);
        setIsOpen(false);
    };

    const handleNewChat = () => {
        onNewChat();
        setIsOpen(false);
    };

    return (
        <div className={s.container} ref={dropdownRef}>
            <button
                className={`${s.toggleBtn} ${isOpen ? s.active : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <History size={18} />
                <span className={s.currentTitle}>
                    {currentConversation?.title || currentConversation?.subject || 'Жаңа чат'}
                </span>
                <ChevronDown size={16} className={`${s.chevron} ${isOpen ? s.rotated : ''}`} />
            </button>

            {isOpen && (
                <div className={s.dropdown}>
                    <div className={s.header}>
                        <span>Чат тарихы</span>
                        <button className={s.closeBtn} onClick={() => setIsOpen(false)}>
                            <X size={16} />
                        </button>
                    </div>

                    <button className={s.newChatBtn} onClick={handleNewChat}>
                        <Plus size={16} />
                        <span>Жаңа чат</span>
                    </button>

                    <div className={s.list}>
                        {isLoading ? (
                            <div className={s.loader}>Жүктелуде...</div>
                        ) : conversations.length === 0 ? (
                            <div className={s.empty}>
                                <MessageSquare size={24} opacity={0.3} />
                                <span>Тарих бос</span>
                            </div>
                        ) : (
                            conversations.map(conv => (
                                <div
                                    key={conv.id}
                                    className={`${s.item} ${currentId === conv.id ? s.active : ''}`}
                                    onClick={() => handleSelect(conv.id)}
                                >
                                    <MessageSquare size={16} className={s.icon} />
                                    <div className={s.info}>
                                        <span className={s.title}>
                                            {conv.title || conv.subject || 'Жаңа диалог'}
                                        </span>
                                        <span className={s.date}>
                                            {new Date(conv.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <button
                                        className={s.deleteBtn}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete(conv.id, e);
                                        }}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

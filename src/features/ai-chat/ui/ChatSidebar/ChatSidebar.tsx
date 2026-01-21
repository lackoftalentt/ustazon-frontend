import { Plus, MessageSquare, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import s from './ChatSidebar.module.scss';
import type { ConversationListItem } from '@/shared/api/ai';

interface ChatSidebarProps {
    conversations: ConversationListItem[];
    currentId: number | null;
    onSelect: (id: number) => void;
    onNewChat: () => void;
    onDelete: (id: number, e: React.MouseEvent) => void;
    isOpen: boolean;
    onToggle: () => void;
}

export const ChatSidebar = ({
    conversations,
    currentId,
    onSelect,
    onNewChat,
    onDelete,
    isOpen,
    onToggle
}: ChatSidebarProps) => {
    return (
        <div className={`${s.sidebar} ${isOpen ? s.open : s.closed}`}>
            <button
                className={s.toggleBtn}
                onClick={onToggle}
                title={isOpen ? "Свернуть историю" : "Показать историю"}
            >
                {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
            </button>

            <div className={s.content}>
                <button className={s.newChatBtn} onClick={onNewChat}>
                    <Plus size={18} />
                    <span>Новый чат</span>
                </button>

                <div className={s.list}>
                    {conversations.map(conv => (
                        <div
                            key={conv.id}
                            className={`${s.item} ${currentId === conv.id ? s.active : ''}`}
                            onClick={() => onSelect(conv.id)}
                        >
                            <MessageSquare size={18} className={s.icon} />
                            <div className={s.info}>
                                <span className={s.title}>
                                    {conv.title || conv.subject || 'Новый диалог'}
                                </span>
                                <span className={s.date}>
                                    {new Date(conv.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <button
                                className={s.deleteBtn}
                                onClick={(e) => onDelete(conv.id, e)}
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

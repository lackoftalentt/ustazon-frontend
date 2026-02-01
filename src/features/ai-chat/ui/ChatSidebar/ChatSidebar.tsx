import { Plus, MessageSquare, Trash2, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
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
    isLoading?: boolean;
}

export const ChatSidebar = ({
    conversations,
    currentId,
    onSelect,
    onNewChat,
    onDelete,
    isOpen,
    onToggle,
    isLoading = false
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
                    <span>Жаңа чат</span>
                </button>

                <div className={s.list}>
                    {isLoading ? (
                        <div className={s.loader}>
                            <Loader2 size={24} className={s.spinner} />
                            <span className={s.loaderText}>Загрузка истории...</span>
                        </div>
                    ) : conversations.length === 0 ? (
                        <div className={s.emptyState}>
                            <MessageSquare size={32} opacity={0.3} />
                            <span className={s.emptyText}>Нет диалогов</span>
                        </div>
                    ) : (
                        conversations.map(conv => (
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
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

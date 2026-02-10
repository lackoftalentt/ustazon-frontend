import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Bot, User, Sparkles, Check, RefreshCw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';
import s from './AIChat.module.scss';
import { aiApi } from '@/shared/api/ai';
import type { ConversationListItem, MultiModelResponse } from '@/shared/api/ai';
import { ChatHistory } from '../ChatHistory/ChatHistory';

const PAGE_SIZE = 20;

interface Message {
    id: string;
    text: string;
    sender: 'ai' | 'user';
    timestamp: Date;
    images?: string[];
    model?: string;
    provider?: string;
}

interface PendingResponses {
    responses: MultiModelResponse[];
    userMessageId: string;
}

export const AIChat = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [conversations, setConversations] = useState<ConversationListItem[]>([]);
    const [isLoadingConversations, setIsLoadingConversations] = useState(true);
    const [hasMoreConversations, setHasMoreConversations] = useState(false);

    const [inputValue, setInputValue] = useState('');
    const [conversationId, setConversationId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [lastSentMessage, setLastSentMessage] = useState('');
    const [pendingResponses, setPendingResponses] = useState<PendingResponses | null>(null);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initial load of conversations
    useEffect(() => {
        loadConversations();
    }, []);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'inherit';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
        }
    }, [inputValue]);

    const loadConversations = async (loadMore = false) => {
        try {
            setIsLoadingConversations(true);
            const skip = loadMore ? conversations.length : 0;
            const list = await aiApi.getConversations(skip, PAGE_SIZE);
            setConversations(prev => loadMore ? [...prev, ...list] : list);
            setHasMoreConversations(list.length === PAGE_SIZE);
        } catch (err) {
            console.error('Failed to load conversations', err);
        } finally {
            setIsLoadingConversations(false);
        }
    };

    const handleLoadMore = () => loadConversations(true);

    const handleSelectConversation = async (id: number) => {
        if (id === conversationId) return;

        try {
            setIsLoading(true);
            const conv = await aiApi.getConversation(id);
            setConversationId(conv.id);
            if (conv.messages) {
                const uiMessages: Message[] = conv.messages.map(m => ({
                    id: m.id.toString(),
                    text: m.content,
                    sender: m.role as 'user' | 'ai',
                    timestamp: new Date(m.created_at)
                }));
                setMessages(uiMessages);
            }
        } catch (err) {
            console.error('Failed to load conversation', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleNewChat = () => {
        setConversationId(null);
        setMessages([]);
        setInputValue('');
        setPendingResponses(null);
    };

    const handleDeleteConversation = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('Осы чатты жою керек пе?')) {
            try {
                await aiApi.deleteConversation(id);
                setConversations(prev => prev.filter(c => c.id !== id));
                if (conversationId === id) {
                    handleNewChat();
                }
            } catch (err) {
                console.error('Failed to delete conversation', err);
            }
        }
    };

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMsgText = inputValue;
        setLastSentMessage(userMsgText);

        setInputValue('');

        if (textareaRef.current) textareaRef.current.style.height = '24px';

        const userMessageId = `user-${Date.now()}`;
        const userMessage: Message = {
            id: userMessageId,
            text: userMsgText,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const response = await aiApi.chatMulti({
                message: userMsgText,
            });

            setPendingResponses({
                responses: response.responses,
                userMessageId
            });
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage: Message = {
                id: `error-${Date.now()}`,
                text: 'Кешіріңіз, қате орын алды. Қайта көріңіз.',
                sender: 'ai',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectResponse = async (response: MultiModelResponse) => {
        if (!response.text || isSaving) return;

        // Optimistic UI update
        const aiMessage: Message = {
            id: `ai-${Date.now()}`,
            text: response.text,
            sender: 'ai',
            timestamp: new Date(),
            model: response.model,
            provider: response.provider
        };

        setMessages(prev => [...prev, aiMessage]);
        setPendingResponses(null);
        setIsSaving(true);

        try {
            const result = await aiApi.sendMessage({
                conversation_id: conversationId ?? undefined,
                message: lastSentMessage,
                save_to_history: true,
                model: response.model,
            });

            setConversationId(result.conversation_id);

            // Update AI message with server content
            setMessages(prev =>
                prev.map(m =>
                    m.id === aiMessage.id
                        ? { ...m, text: result.assistant_message.content }
                        : m
                )
            );

            loadConversations();
        } catch (err) {
            console.error('Failed to save response:', err);
            toast.error('Жауапты сақтау кезінде қате орын алды');
        } finally {
            setIsSaving(false);
        }
    };

    const handleRetry = async () => {
        if (!lastSentMessage || isLoading) return;

        // Remove error messages from the list
        setMessages(prev => prev.filter(m => !m.id.startsWith('error-')));
        setPendingResponses(null);
        setIsLoading(true);

        try {
            const response = await aiApi.chatMulti({
                message: lastSentMessage,
            });

            setPendingResponses({
                responses: response.responses,
                userMessageId: `user-retry-${Date.now()}`
            });
        } catch (error) {
            console.error('Retry failed:', error);
            const errorMessage: Message = {
                id: `error-${Date.now()}`,
                text: 'Кешіріңіз, қате орын алды. Қайта көріңіз.',
                sender: 'ai',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className={s.container}>
            <header className={s.chatHeader}>
                <ChatHistory
                    conversations={conversations}
                    currentId={conversationId}
                    onSelect={handleSelectConversation}
                    onNewChat={handleNewChat}
                    onDelete={handleDeleteConversation}
                    isLoading={isLoadingConversations}
                    hasMore={hasMoreConversations}
                    onLoadMore={handleLoadMore}
                />
            </header>

            <div className={s.messagesContainer}>
                {messages.length === 0 ? (
                    <div className={s.emptyState}>
                        <Sparkles size={48} />
                        <p>UstazOn AI-мен сұхбатты бастаңыз</p>
                    </div>
                ) : (
                    messages.map(m => (
                        <div key={m.id} className={`${s.message} ${s[m.sender]}`}>
                            <div className={`${s.avatar} ${m.sender === 'user' ? s.userAvatar : s.aiAvatar}`}>
                                {m.sender === 'user' ? <User size={20} /> : <Bot size={20} />}
                            </div>
                            <div className={s.bubble}>
                                <ReactMarkdown>{m.text}</ReactMarkdown>
                                {m.id.startsWith('error-') && (
                                    <button className={s.retryBtn} onClick={handleRetry}>
                                        <RefreshCw size={14} /> Қайта жіберу
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}

                {isLoading && (
                    <div className={`${s.message} ${s.ai}`}>
                        <div className={`${s.avatar} ${s.aiAvatar}`}>
                            <Bot size={20} />
                        </div>
                        <div className={s.bubble}>
                            <div className={s.typingIndicator}>
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                )}

                {pendingResponses && (
                    <div className={s.multiResponseContainer}>
                        <p className={s.multiResponseTitle}>Жауапты таңдаңыз:</p>
                        <div className={s.responseCards}>
                            {pendingResponses.responses.map((resp, idx) => (
                                <div
                                    key={idx}
                                    className={`${s.responseCard} ${!resp.text ? s.responseCardError : ''}`}
                                    onClick={() => resp.text && handleSelectResponse(resp)}
                                >
                                    <div className={s.responseCardHeader}>
                                        <span className={s.providerBadge}>{resp.provider}</span>
                                        <span className={s.modelName}>{resp.model}</span>
                                    </div>
                                    <div className={s.responseCardBody}>
                                        {resp.text ? (
                                            <ReactMarkdown>{resp.text.slice(0, 300) + (resp.text.length > 300 ? '...' : '')}</ReactMarkdown>
                                        ) : (
                                            <p className={s.errorText}>Қате: {resp.error?.slice(0, 100)}...</p>
                                        )}
                                    </div>
                                    {resp.text && (
                                        <button className={s.selectBtn}>
                                            <Check size={16} /> Таңдау
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        {pendingResponses.responses.every(r => !r.text) && (
                            <button className={s.retryAllBtn} onClick={handleRetry}>
                                <RefreshCw size={18} /> Қайта жіберу
                            </button>
                        )}
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            <footer className={s.footer}>
                <div className={s.inputWrapper}>
                    <textarea
                        ref={textareaRef}
                        className={s.textarea}
                        placeholder="AI-ға хабарлама жазыңыз..."
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isLoading}
                        rows={1}
                    />
                    <button
                        className={s.sendBtn}
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || isLoading}
                    >
                        {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                    </button>
                </div>
            </footer>
        </div>
    );
};

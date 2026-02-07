import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Loader2, Bot, User, Sparkles, X, FileText, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import s from './AIChat.module.scss';
import { aiApi } from '@/shared/api/ai';
import type { ConversationListItem, MultiModelResponse } from '@/shared/api/ai';
import { ChatHistory } from '../ChatHistory/ChatHistory';

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

    const [inputValue, setInputValue] = useState('');
    const [conversationId, setConversationId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
    const [pendingResponses, setPendingResponses] = useState<PendingResponses | null>(null);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
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

    const loadConversations = async () => {
        try {
            setIsLoadingConversations(true);
            const list = await aiApi.getConversations();
            setConversations(list);
        } catch (err) {
            console.error('Failed to load conversations', err);
        } finally {
            setIsLoadingConversations(false);
        }
    };

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
        setAttachedFiles([]);
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

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            setAttachedFiles(prev => [...prev, ...newFiles]);
        }
    };

    const removeFile = (index: number) => {
        setAttachedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSendMessage = async () => {
        if ((!inputValue.trim() && attachedFiles.length === 0) || isLoading) return;

        const userMsgText = inputValue;

        setInputValue('');
        setAttachedFiles([]);

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

    const handleSelectResponse = (response: MultiModelResponse) => {
        if (!response.text) return;

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
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            <footer className={s.footer}>
                {attachedFiles.length > 0 && (
                    <div className={s.filesPreview}>
                        {attachedFiles.map((file, i) => (
                            <div key={i} className={s.fileBadge}>
                                <FileText size={14} />
                                <span className={s.fileName}>{file.name}</span>
                                <button onClick={() => removeFile(i)} className={s.removeFileBtn}>
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className={s.inputWrapper}>
                    <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileSelect}
                        multiple
                    />
                    <button
                        className={s.attachBtn}
                        title="Файл тіркеу"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Paperclip size={20} />
                    </button>
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
                        disabled={(!inputValue.trim() && attachedFiles.length === 0) || isLoading}
                    >
                        {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                    </button>
                </div>
            </footer>
        </div>
    );
};

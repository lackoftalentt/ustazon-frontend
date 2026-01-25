import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Loader2, Bot, User, Sparkles, X, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import s from './AIChat.module.scss';
import { aiApi } from '@/shared/api/ai';
import type { ConversationListItem } from '@/shared/api/ai';
import { ChatSidebar } from '../ChatSidebar/ChatSidebar';

interface Message {
    id: string;
    text: string;
    sender: 'ai' | 'user';
    timestamp: Date;
    images?: string[];
}

export const AIChat = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [conversations, setConversations] = useState<ConversationListItem[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isLoadingConversations, setIsLoadingConversations] = useState(true);

    const [inputValue, setInputValue] = useState('');
    const [conversationId, setConversationId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentAIModel, setCurrentAIModel] = useState('gemini-2.5-flash');
    const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initial load of conversations
    useEffect(() => {
        loadConversations();
    }, []);

    // Scroll to bottom removed as per user request
    /*
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    */

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
                // Map backend messages to UI messages
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
    };

    const handleDeleteConversation = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('Вы уверены, что хотите удалить этот чат?')) {
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
        const currentFiles = [...attachedFiles];

        setInputValue('');
        setAttachedFiles([]);

        // Reset height
        if (textareaRef.current) textareaRef.current.style.height = '24px';

        const userMessage: Message = {
            id: `user-${Date.now()}`,
            text: userMsgText + (currentFiles.length > 0 ? `\n[Вложения: ${currentFiles.map(f => f.name).join(', ')}]` : ''),
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const response = await aiApi.sendMessage({
                conversation_id: conversationId ?? undefined,
                message: userMsgText || (currentFiles.length > 0 ? "Проанализируй эти файлы" : ""),
                save_to_history: true,
                model: currentAIModel,
                files: currentFiles
            });

            if (!conversationId) {
                setConversationId(response.conversation_id);
                loadConversations(); // Refresh list to show new chat
            } else {
                // Update title/preview in list if needed (optional optimization)
            }

            const aiMessage: Message = {
                id: response.assistant_message.id.toString(),
                text: response.assistant_message.content,
                sender: 'ai',
                timestamp: new Date(response.assistant_message.created_at)
            };

            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage: Message = {
                id: `error-${Date.now()}`,
                text: 'Извините, произошла ошибка. Попробуйте еще раз.',
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
            <ChatSidebar
                conversations={conversations}
                currentId={conversationId}
                onSelect={handleSelectConversation}
                onNewChat={handleNewChat}
                onDelete={handleDeleteConversation}
                isOpen={isSidebarOpen}
                onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                isLoading={isLoadingConversations}
            />

            <div className={s.mainContent}>
                <div className={s.messagesContainer}>
                    {messages.length === 0 ? (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.6 }}>
                            <Sparkles size={48} color="#cbd5e1" />
                            <p style={{ marginTop: '1rem', color: '#64748b' }}>Начните общение с UstazOn AI</p>
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
                    <div ref={messagesEndRef} />
                </div>

                <footer className={s.footer}>
                    <div className={s.modelSelectContainer}>
                        <Sparkles size={14} className={s.modelIcon} />
                        <select
                            className={s.modelSelect}
                            value={currentAIModel}
                            onChange={(e) => setCurrentAIModel(e.target.value)}
                        >
                            <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                            <option value="gemini-2.0-flash-exp">Gemini 2.0 Flash Exp</option>
                            <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
                            <option value="gpt-4o">GPT-4o</option>
                            <option value="gpt-4o-mini">GPT-4o Mini</option>
                        </select>
                    </div>

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
                            title="Прикрепить файл"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Paperclip size={20} />
                        </button>
                        <textarea
                            ref={textareaRef}
                            className={s.textarea}
                            placeholder="Сообщение для AI..."
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
        </div>
    );
};

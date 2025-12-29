import { useState, useRef, useEffect } from 'react';
import { useAIChat } from '@/entities/ai/model/useAI';
import { ChatMessage } from '@/shared/api/ai';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import s from './AIChat.module.scss';

export const AIChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { mutateAsync: sendMessage, isPending } = useAIChat();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim() || isPending) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputValue,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    try {
      const response = await sendMessage({
        message: inputValue,
        history: messages,
        system_instruction:
          'Ты - полезный ассистент для учителей в Казахстане. Помогаешь с подготовкой уроков, объяснением материала и методическими вопросами. Отвечай на русском или казахском языке, в зависимости от языка вопроса.',
      });

      const aiMessage: ChatMessage = {
        role: 'model',
        content: response.message,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: ChatMessage = {
        role: 'model',
        content: 'Қате! Сұрауды өңдеу мүмкін болмады. Қайта көріңіз.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className={s.chatContainer}>
      <div className={s.chatHeader}>
        <h2>AI Чат Көмекшісі</h2>
        {messages.length > 0 && (
          <Button variant="secondary" onClick={clearChat} size="small">
            Тазалау
          </Button>
        )}
      </div>

      <div className={s.messagesContainer}>
        {messages.length === 0 ? (
          <div className={s.emptyState}>
            <div className={s.emptyIcon}>💬</div>
            <h3>Сәлеметсіз бе!</h3>
            <p>
              Мен сіздің AI көмекшіңізбін. Сабақ дайындау, материалдарды
              түсіндіру немесе әдістемелік сұрақтар бойынша көмектесе аламын.
            </p>
            <div className={s.suggestions}>
              <button
                className={s.suggestion}
                onClick={() =>
                  setInputValue('Математика пәнінен 7 сыныпқа сабақ жоспары жаса')
                }
              >
                Сабақ жоспары жасау
              </button>
              <button
                className={s.suggestion}
                onClick={() =>
                  setInputValue('Физикадағы Ньютон заңдарын қалай түсіндіруге болады?')
                }
              >
                Тақырыпты түсіндіру
              </button>
              <button
                className={s.suggestion}
                onClick={() =>
                  setInputValue('Оқушылардың қызығушылығын арттыру әдістері')
                }
              >
                Әдістемелік кеңес
              </button>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`${s.message} ${
                  msg.role === 'user' ? s.userMessage : s.aiMessage
                }`}
              >
                <div className={s.messageContent}>
                  <div className={s.messageRole}>
                    {msg.role === 'user' ? '👤 Сіз' : '🤖 AI'}
                  </div>
                  <div className={s.messageText}>{msg.content}</div>
                </div>
              </div>
            ))}
            {isPending && (
              <div className={`${s.message} ${s.aiMessage}`}>
                <div className={s.messageContent}>
                  <div className={s.messageRole}>🤖 AI</div>
                  <div className={s.messageText}>
                    <div className={s.typing}>
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <form onSubmit={handleSubmit} className={s.inputForm}>
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Сұрағыңызды жазыңыз..."
          disabled={isPending}
          className={s.chatInput}
        />
        <Button type="submit" disabled={!inputValue.trim() || isPending}>
          {isPending ? 'Жіберілуде...' : 'Жіберу'}
        </Button>
      </form>
    </div>
  );
};

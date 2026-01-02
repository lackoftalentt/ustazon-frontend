import { useState, useEffect } from 'react';
import { aiApi } from '@/shared/api/ai';
import s from './PresentationModal.module.scss';

interface AIModel {
    name: string;
    description: string;
    cost: string;
    quality: string;
}

interface PresentationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onGenerate: (subject: string, grade: string, topic: string, slidesCount: number, model: string) => void;
}

export const PresentationModal = ({ isOpen, onClose, onGenerate }: PresentationModalProps) => {
    const [subject, setSubject] = useState('');
    const [grade, setGrade] = useState('');
    const [topic, setTopic] = useState('');
    const [slidesCount, setSlidesCount] = useState(12);
    const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash');
    const [availableModels, setAvailableModels] = useState<Record<string, AIModel>>({});

    useEffect(() => {
        const loadModels = async () => {
            try {
                const response = await aiApi.getAvailableModels();
                setAvailableModels(response.models);
            } catch (error) {
                console.error('Failed to load models:', error);
            }
        };
        loadModels();
    }, []);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (subject.trim() && grade.trim() && topic.trim()) {
            onGenerate(subject, grade, topic, slidesCount, selectedModel);
            // Reset form
            setSubject('');
            setGrade('');
            setTopic('');
            setSlidesCount(12);
            setSelectedModel('gemini-2.5-flash');
            onClose();
        }
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className={s.modalBackdrop} onClick={handleBackdropClick}>
            <div className={s.modal}>
                <div className={s.header}>
                    <h2 className={s.title}>📊 Создать презентацию</h2>
                    <button
                        type="button"
                        className={s.closeBtn}
                        onClick={onClose}
                        aria-label="Закрыть">
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={s.form}>
                    <div className={s.field}>
                        <label htmlFor="subject" className={s.label}>
                            Предмет *
                        </label>
                        <input
                            id="subject"
                            type="text"
                            className={s.input}
                            placeholder="Например: Математика, История, Биология"
                            value={subject}
                            onChange={e => setSubject(e.target.value)}
                            required
                        />
                    </div>

                    <div className={s.field}>
                        <label htmlFor="grade" className={s.label}>
                            Класс *
                        </label>
                        <input
                            id="grade"
                            type="text"
                            className={s.input}
                            placeholder="Например: 7 класс, 10 класс"
                            value={grade}
                            onChange={e => setGrade(e.target.value)}
                            required
                        />
                    </div>

                    <div className={s.field}>
                        <label htmlFor="topic" className={s.label}>
                            Тема урока *
                        </label>
                        <input
                            id="topic"
                            type="text"
                            className={s.input}
                            placeholder="Например: Площадь треугольника"
                            value={topic}
                            onChange={e => setTopic(e.target.value)}
                            required
                        />
                    </div>

                    <div className={s.field}>
                        <label htmlFor="slidesCount" className={s.label}>
                            Количество слайдов
                        </label>
                        <input
                            id="slidesCount"
                            type="number"
                            className={s.input}
                            min="5"
                            max="30"
                            value={slidesCount}
                            onChange={e => setSlidesCount(Number(e.target.value))}
                        />
                        <div className={s.hint}>Рекомендуется 10-15 слайдов</div>
                    </div>

                    <div className={s.field}>
                        <label htmlFor="model" className={s.label}>
                            AI Модель
                        </label>
                        <select
                            id="model"
                            className={s.select}
                            value={selectedModel}
                            onChange={e => setSelectedModel(e.target.value)}
                        >
                            {Object.entries(availableModels).map(([modelId, modelInfo]) => (
                                <option key={modelId} value={modelId}>
                                    {modelInfo.name} - {modelInfo.description}
                                </option>
                            ))}
                        </select>
                        <div className={s.hint}>
                            {availableModels[selectedModel] && (
                                <>
                                    Качество: {availableModels[selectedModel].quality} |
                                    Стоимость: {availableModels[selectedModel].cost}
                                </>
                            )}
                        </div>
                    </div>

                    <div className={s.actions}>
                        <button
                            type="button"
                            className={s.cancelBtn}
                            onClick={onClose}>
                            Отмена
                        </button>
                        <button
                            type="submit"
                            className={s.submitBtn}
                            disabled={!subject.trim() || !grade.trim() || !topic.trim()}>
                            Создать презентацию
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

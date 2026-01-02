import { useState, useEffect } from 'react';
import { aiApi, type PromptTemplate, type PromptCategory } from '@/shared/api/ai';
import s from './QuickCommands.module.scss';

interface QuickCommandsProps {
    onSelectPrompt: (prompt: string) => void;
    onOpenPresentationModal?: () => void;
}

export const QuickCommands = ({ onSelectPrompt, onOpenPresentationModal }: QuickCommandsProps) => {
    const [prompts, setPrompts] = useState<PromptTemplate[]>([]);
    const [categories, setCategories] = useState<PromptCategory[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setIsLoading(true);
                const [promptsData, categoriesData] = await Promise.all([
                    aiApi.getPrompts(),
                    aiApi.getCategories()
                ]);

                // Flatten prompts from category structure
                const allPrompts: PromptTemplate[] = [];
                Object.values(promptsData).forEach((category: any) => {
                    if (category.prompts && Array.isArray(category.prompts)) {
                        allPrompts.push(...category.prompts);
                    }
                });

                setPrompts(allPrompts);
                setCategories(categoriesData.categories);
            } catch (err) {
                console.error('Error loading prompts:', err);
                setError('Ошибка загрузки шаблонов');
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    const filteredPrompts = prompts.filter(
        prompt => selectedCategory === 'all' || prompt.category === selectedCategory
    );

    if (isLoading) {
        return (
            <div className={s.quickCommands}>
                <div className={s.loading}>Загрузка шаблонов...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={s.quickCommands}>
                <div className={s.error}>{error}</div>
            </div>
        );
    }

    return (
        <div className={s.quickCommands}>
            <div className={s.header}>
                <h3 className={s.title}>Быстрые команды</h3>
                <p className={s.subtitle}>Выберите готовый шаблон для работы</p>
            </div>

            <div className={s.categories}>
                <button
                    className={`${s.categoryBtn} ${selectedCategory === 'all' ? s.active : ''}`}
                    onClick={() => setSelectedCategory('all')}
                >
                    Все
                </button>
                {categories.map(category => (
                    <button
                        key={category.key}
                        className={`${s.categoryBtn} ${selectedCategory === category.key ? s.active : ''}`}
                        onClick={() => setSelectedCategory(category.key)}
                    >
                        {category.name}
                    </button>
                ))}
            </div>

            <div className={s.promptsGrid}>
                {onOpenPresentationModal && (
                    <button
                        className={`${s.promptCard} ${s.presentationCard}`}
                        onClick={onOpenPresentationModal}
                    >
                        <div className={s.promptName}>📊 Создать презентацию</div>
                        <div className={s.promptPreview}>
                            Сгенерировать презентацию по вашему предмету и теме
                        </div>
                    </button>
                )}
                {filteredPrompts.map(prompt => (
                    <button
                        key={prompt.key}
                        className={s.promptCard}
                        onClick={() => onSelectPrompt(prompt.prompt)}
                    >
                        <div className={s.promptName}>{prompt.name_ru}</div>
                        <div className={s.promptPreview}>
                            {prompt.prompt.substring(0, 100)}
                            {prompt.prompt.length > 100 ? '...' : ''}
                        </div>
                    </button>
                ))}
            </div>

            {filteredPrompts.length === 0 && (
                <div className={s.empty}>
                    Нет доступных шаблонов в этой категории
                </div>
            )}
        </div>
    );
};

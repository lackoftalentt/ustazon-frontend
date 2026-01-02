import type { ReactNode } from 'react';
import s from './AIGeneratorLayout.module.scss';
import { Sparkles } from 'lucide-react';

interface AIGeneratorLayoutProps {
    title: string;
    description: string;
    icon?: ReactNode;
    form: ReactNode;
    preview?: ReactNode;
    isGenerating?: boolean;
}

export const AIGeneratorLayout = ({
    title,
    description,
    icon,
    form,
    preview,
    isGenerating
}: AIGeneratorLayoutProps) => {
    return (
        <div className={s.container}>
            <div className={s.grid}>
                <div className={s.formSection}>
                    <header className={s.header}>
                        <h1 className={s.title}>
                            {icon}
                            {title}
                        </h1>
                        <p className={s.description}>{description}</p>
                    </header>
                    {form}
                </div>

                <div className={`${s.previewSection} ${preview ? s.hasContent : ''}`}>
                    {preview ? (
                        preview
                    ) : (
                        <div className={s.emptyState}>
                            {isGenerating ? (
                                <>
                                    <div className={s.emptyIcon}>
                                        <Sparkles className="animate-spin" size={64} />
                                    </div>
                                    <h3 className={s.emptyTitle}>AI генерирует контент...</h3>
                                    <p>Это может занять от 10 до 30 секунд. Пожалуйста, подождите.</p>
                                </>
                            ) : (
                                <>
                                    <div className={s.emptyIcon}>✨</div>
                                    <h3 className={s.emptyTitle}>Создайте свой первый материал</h3>
                                    <p>Заполните форму слева, чтобы сгенерировать уникальный образовательный контент с помощью ИИ.</p>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

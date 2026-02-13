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
    usageBanner?: ReactNode;
}

export const AIGeneratorLayout = ({
    title,
    description,
    icon,
    form,
    preview,
    isGenerating,
    usageBanner
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
                    {usageBanner}
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
                                    <h3 className={s.emptyTitle}>AI мазмұнды жасауда...</h3>
                                    <p>Бұл 10-30 секундқа созылуы мүмкін. Күте тұрыңыз.</p>
                                </>
                            ) : (
                                <>
                                    <div className={s.emptyIcon}>✨</div>
                                    <h3 className={s.emptyTitle}>Бірінші материалды жасаңыз</h3>
                                    <p>AI көмегімен бірегей білім беру мазмұнын жасау үшін сол жақтағы пішінді толтырыңыз.</p>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

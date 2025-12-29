import s from './AdvantageItem.module.scss';

interface AdvantageItemProps {
    title: string;
    subtitle: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    index?: number;
}

export const AdvantageItem: React.FC<AdvantageItemProps> = ({
    title,
    subtitle,
    icon: Icon,
    index = 0
}) => {
    return (
        <div
            className={s.advantageItem}
            style={{ animationDelay: `${index * 0.1}s` }}>
            <div className={s.iconWrapper}>
                <Icon />
            </div>
            <div className={s.textBlock}>
                <h3 className={s.advantageTitle}>{title}</h3>
                <p className={s.advantageText}>{subtitle}</p>
            </div>
        </div>
    );
};

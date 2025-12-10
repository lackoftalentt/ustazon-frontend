import s from './OrientationItem.module.scss';

interface OrientationItemProps {
    title: string;
    description: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

export const OrientationItem = ({
    title,
    description,
    icon: Icon
}: OrientationItemProps) => {
    return (
        <div className={s.orientationItem}>
            <div className={s.header}>
                <div className={s.iconWrapper}>
                    <div className={s.iconBg}></div>
                    <Icon />
                </div>
                <h3 className={s.title}>{title}</h3>
            </div>
            <p className={s.description}>{description}</p>
        </div>
    );
};

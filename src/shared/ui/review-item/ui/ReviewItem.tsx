import s from './ReviewItem.module.scss';

interface ReviewItemProps {
    name: string;
    avatar: string;
    text: string;
    date: string;
    index?: number;
}

export const ReviewItem: React.FC<ReviewItemProps> = ({
    name,
    avatar,
    text,
    date,
    index = 0
}) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div
            className={s.reviewItem}
            style={{ animationDelay: `${index * 0.15}s` }}>
            <div className={s.header}>
                <img
                    src={avatar}
                    alt={name}
                    className={s.avatar}
                />
                <div className={s.userInfo}>
                    <h4 className={s.name}>{name}</h4>
                </div>
            </div>

            <p className={s.reviewText}>{text}</p>

            <div className={s.footer}>
                <span className={s.date}>{formatDate(date)}</span>
            </div>

            <div className={s.quoteIcon}>"</div>
        </div>
    );
};

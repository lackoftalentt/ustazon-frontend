import { Container } from '@/shared/ui/Container';
import s from './ReviewSection.module.scss';
import { SectionTitle } from '@/shared/ui/SectionTitle';
import { ReviewItem } from '@/shared/ui/ReviewItem';
import avatar from '@/shared/assets/images/profile-image.jpg';

const REVIEWS_DATA = [
    {
        id: 1,
        name: 'Алия Нурмуханова',
        avatar: avatar,
        text: 'UstazOn полностью изменил мой подход к преподаванию. Встроенный ИИ помогает создавать интерактивные материалы за минуты, а не часы. Огромная библиотека ресурсов экономит массу времени!',
        date: '2025-11-15'
    },
    {
        id: 2,
        name: 'Ерлан Сейдахметов',
        avatar: avatar,
        text: 'Платформа невероятно удобная! Особенно впечатлили готовые презентации и видеоуроки. Теперь могу больше времени уделять индивидуальной работе с учениками.',
        date: '2025-11-20'
    },
    {
        id: 3,
        name: 'Динара Касымова',
        avatar: avatar,
        text: 'Отличная платформа для профессионального развития! Курсы помогли освоить новые методики преподавания. Единственное пожелание — добавить больше материалов по английскому языку.',
        date: '2025-12-01'
    }
];

export const ReviewSection = () => {
    return (
        <section className={s.reviewSection}>
            <Container>
                <SectionTitle
                    className={s.title}
                    title="Отзывы пользователей"
                />
                <div className={s.reviewsGrid}>
                    {REVIEWS_DATA.map((review, index) => (
                        <ReviewItem
                            key={review.id}
                            {...review}
                            index={index}
                        />
                    ))}
                </div>
            </Container>
        </section>
    );
};

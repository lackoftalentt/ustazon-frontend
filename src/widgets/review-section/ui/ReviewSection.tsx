import { REVIEWS_DATA } from '@/shared/config/reviews'
import { Container } from '@/shared/ui/container'
import { ReviewItem } from '@/shared/ui/review-item'
import { SectionTitle } from '@/shared/ui/section-title'
import { useTranslation } from 'react-i18next'
import s from './ReviewSection.module.scss'

export const ReviewSection = () => {
	const { t } = useTranslation()

	return (
		<section className={s.reviewSection}>
			<Container>
				<SectionTitle
					className={s.title}
					title={t('reviews.sectionTitle')}
				/>
				<div className={s.reviewsGrid}>
					{REVIEWS_DATA.map((review, index) => (
						<ReviewItem
							key={review.id}
							name={t(review.nameKey)}
							avatar={review.avatar}
							text={t(review.textKey)}
							date={review.date}
							index={index}
						/>
					))}
				</div>
			</Container>
		</section>
	)
}

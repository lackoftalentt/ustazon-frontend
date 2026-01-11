import { REVIEWS_DATA } from '@/shared/config/reviews'
import { Container } from '@/shared/ui/container'
import { ReviewItem } from '@/shared/ui/review-item'
import { SectionTitle } from '@/shared/ui/section-title'
import s from './ReviewSection.module.scss'

export const ReviewSection = () => {
	return (
		<section className={s.reviewSection}>
			<Container>
				<SectionTitle
					className={s.title}
					title="Пайдаланушылардың пікірлері"
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
	)
}

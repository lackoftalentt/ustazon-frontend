import { ORIENTATIONS_DATA } from '@/shared/config/orientations'
import { Container } from '@/shared/ui/container'
import { OrientationItem } from '@/shared/ui/orientation-item'
import { SectionTitle } from '@/shared/ui/section-title'
import { VideoPlaceholder } from '@/shared/ui/video-placeholder'
import { useTranslation } from 'react-i18next'
import s from './OrientationSection.module.scss'

// Демо видео для каждого направления
const VIDEO_URLS = [
	'https://www.youtube.com/watch?v=EngW7tLk6R8',
	'https://www.youtube.com/watch?v=K4TOrB7at0Y',
	'https://www.youtube.com/watch?v=wDchsz8nmbo'
]

export const OrientationSection = () => {
	const { t } = useTranslation()

	return (
		<section className={s.orientationSection}>
			<Container>
				<SectionTitle
					className={s.title}
					title={t('orientations.sectionTitle')}
				/>
				<div className={s.block}>
					{ORIENTATIONS_DATA.map((or, index) => (
						<div
							key={or.id}
							className={s.blockItem}
							style={{ animationDelay: `${index * 0.2}s` }}
						>
							<OrientationItem
								title={t(or.titleKey)}
								description={t(or.descriptionKey)}
								icon={or.icon}
							/>
							<div className={s.videoWrapper}>
								<VideoPlaceholder
									className={s.videoPlaceholder}
									videoUrl={VIDEO_URLS[index] || VIDEO_URLS[0]}
								/>
							</div>
						</div>
					))}
				</div>
			</Container>
		</section>
	)
}

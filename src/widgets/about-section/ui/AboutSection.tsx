import { Container } from '@/shared/ui/container'
import { VideoPlaceholder } from '@/shared/ui/video-placeholder'
import { useTranslation } from 'react-i18next'
import s from './AboutSection.module.scss'

export const AboutSection = () => {
	const { t } = useTranslation()

	return (
		<section className={s.aboutSection}>
			<Container className={s.container}>
				<div className={s.content}>
					<div className={s.textBlock}>
						<h2 className={s.title}>
							{t('about.title')}
						</h2>
						<p className={s.subTitle}>
							{t('about.subtitle')}
						</p>
					</div>
				</div>
				<div className={s.mediaWrapper}>
					<VideoPlaceholder
						className={s.videoPlaceholder}
						videoUrl="https://www.youtube.com/watch?v=EngW7tLk6R8"
					/>
				</div>
			</Container>
		</section>
	)
}

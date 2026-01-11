import { Container } from '@/shared/ui/container'
import { VideoPlaceholder } from '@/shared/ui/video-placeholder'
import s from './AboutSection.module.scss'

export const AboutSection = () => {
	return (
		<section className={s.aboutSection}>
			<Container className={s.container}>
				<div className={s.content}>
					<div className={s.textBlock}>
						<h2 className={s.title}>
							UstazOn — мұғалімдердің жұмысына қажетті 2 миллионнан астам
							материалды бір жерге біріктіретін ИИ орнатылған қуатты кәсіби
							платформа
						</h2>
						<p className={s.subTitle}>
							Біздің мақсатымыз - мұғалімдер үшін басқа біреулер үшін пайдалы
							болу
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

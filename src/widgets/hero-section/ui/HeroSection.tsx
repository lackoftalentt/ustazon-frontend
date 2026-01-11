import hero from '@/shared/assets/images/home-illustration.png'
import { Container } from '@/shared/ui/container/ui/Container'
import s from './HeroSection.module.scss'

export const HeroSection = () => {
	return (
		<section className={s.heroSection}>
			<Container className={s.container}>
				<div className={s.content}>
					<h1 className={s.title}>
						Мұғалімдерге арналған онлайн курстар{' '}
						<span className={s.highlight}>платформасы</span>
					</h1>
				</div>
				<div className={s.illustration}>
					<div className={s.imageWrapper}>
						<img
							src={hero}
							alt="Преподаватель"
							className={s.heroImage}
						/>
						<div className={s.decorCircle}></div>
						<div className={s.decorCircle2}></div>
					</div>
				</div>
			</Container>
		</section>
	)
}

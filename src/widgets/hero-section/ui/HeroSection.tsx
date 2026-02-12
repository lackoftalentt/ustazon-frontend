import hero from '@/shared/assets/images/home-illustration.png'
import { Container } from '@/shared/ui/container/ui/Container'
import { useTranslation } from 'react-i18next'
import s from './HeroSection.module.scss'

export const HeroSection = () => {
	const { t } = useTranslation()

	return (
		<section className={s.heroSection}>
			<Container className={s.container}>
				<div className={s.content}>
					<h1 className={s.title}>
						{t('hero.title')}{' '}
						<span className={s.highlight}>{t('hero.highlight')}</span>
					</h1>
				</div>
				<div className={s.illustration}>
					<div className={s.imageWrapper}>
						<img
							src={hero}
							alt={t('hero.imageAlt')}
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

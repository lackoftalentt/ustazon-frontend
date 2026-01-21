import Logo from '@/shared/assets/images/logo.png'
import { Instagram, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import s from './Footer.module.scss'

export const Footer = () => {
	const year = new Date().getFullYear()

	const navLinks = [
		{ to: '/subjects', label: 'Пәндер' },
		{ to: '/tests', label: 'Тесттер' },
		{ to: '/lesson-plans/bastau', label: 'Сабақ жоспарлары' },
		{ to: '/profile', label: 'Профиль' }
	]

	return (
		<footer className={s.footer}>
			<div className={s.container}>
				<div className={s.top}>
					<div className={s.brand}>
						<img
							src={Logo}
							alt="UstazOn"
							className={s.logo}
						/>
						<span className={s.name}>UstazOn</span>
					</div>

					<nav className={s.nav}>
						{navLinks.map(link => (
							<Link
								key={link.to}
								to={link.to}
								className={s.navLink}
							>
								{link.label}
							</Link>
						))}
					</nav>

					<div className={s.socials}>
						<a
							href="https://instagram.com/ustazon"
							target="_blank"
							rel="noreferrer"
							className={s.socialButton}
						>
							<Instagram size={20} />
						</a>
						<a
							href="https://wa.me/7700XXXXXXX"
							target="_blank"
							rel="noreferrer"
							className={s.socialButton}
						>
							<MessageCircle size={20} />
						</a>
					</div>
				</div>

				<div className={s.bottom}>
					<span className={s.copyright}>
						© {year} UstazOn. Барлық құқықтар сақталған.
					</span>
					<span className={s.tagline}>Платформа мұғалімдер үшін жасалған</span>
				</div>
			</div>
		</footer>
	)
}

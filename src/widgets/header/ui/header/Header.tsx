import logo from '@/shared/assets/images/logo.png'
// import Typography from '@/shared/assets/icons/typography.svg?react';
import { useAuthStore } from '@/entities/user'
import defaultAvatar from '@/shared/assets/images/profile-image.jpg'
import { Button } from '@/shared/ui/button'
import { Container } from '@/shared/ui/container'
import { Link, useNavigate } from 'react-router-dom'
import s from './Header.module.scss'

export const Header = () => {
	const navigate = useNavigate()
	const { user, isAuthenticated } = useAuthStore()
	const isAuth = isAuthenticated()

	return (
		<header className={s.header}>
			<Container className={s.container}>
				<div className={s.leftSide}>
					<img
						className={s.logo}
						src={logo}
						alt="UstazOn logo"
						onClick={() => navigate('/')}
					/>

					<nav className={s.nav}>
						<Link
							to="/subjects"
							className={s.navLink}
						>
							<span className={s.navLinkText}>Пәндер каталогы</span>
						</Link>
						<Link
							to="/ai-chat"
							className={s.navLink}
						>
							<span className={s.navLinkText}>ИИ чат</span>
						</Link>
					</nav>
				</div>
				<div className={s.rightSide}>
					{/* <button className={s.langSwitcher}>
                        <Typography className={s.langIcon} />
                        <span>Русский</span>
                    </button> */}

					{isAuth ? (
						<div className={s.userSection}>
							<span className={s.userName}>{user?.name}</span>
							<button
								className={s.avatarButton}
								onClick={() => navigate('/profile')}
							>
								<img
									src={defaultAvatar}
									alt="avatar"
									className={s.avatar}
								/>
							</button>
						</div>
					) : (
						<Button
							onClick={() => navigate('/login')}
							variant="outline"
							className={s.loginBtn}
						>
							Войти
						</Button>
					)}
				</div>
			</Container>
		</header>
	)
}

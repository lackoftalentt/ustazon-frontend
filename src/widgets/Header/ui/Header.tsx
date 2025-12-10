import logo from '@/shared/assets/images/logo.png';
import Typography from '@/shared/assets/icons/typography.svg?react';
import s from './Header.module.scss';
import { Button } from '@/shared/ui/Button';
import { Link, useNavigate } from 'react-router';
import { Container } from '@/shared/ui/Container';

export const Header = () => {
    const navigate = useNavigate();

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
                            to="/courses"
                            className={s.navLink}>
                            <span className={s.navLinkText}>
                                Каталог курсов
                            </span>
                        </Link>
                        <Link
                            to="/ai-chat"
                            className={s.navLink}>
                            <span className={s.navLinkText}>ИИ чат</span>
                        </Link>
                    </nav>
                </div>
                <div className={s.rightSide}>
                    <button className={s.langSwitcher}>
                        <Typography
                            onClick={() => navigate('/')}
                            className={s.langIcon}
                        />
                        <span>Русский</span>
                    </button>
                    <Button
                        onClick={() => navigate('/login')}
                        variant="outline"
                        className={s.loginBtn}>
                        Войти
                    </Button>
                </div>
            </Container>
        </header>
    );
};

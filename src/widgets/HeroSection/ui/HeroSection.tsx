import { Container } from '@/shared/ui/Container/ui/Container';
import s from './HeroSection.module.scss';
import hero from '@/shared/assets/images/home-illustration.png';

export const HeroSection = () => {
    return (
        <section className={s.heroSection}>
            <Container className={s.container}>
                <div className={s.content}>
                    <h1 className={s.title}>
                        Платформа онлайн-курсов для{' '}
                        <span className={s.highlight}>учителей</span>
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
    );
};

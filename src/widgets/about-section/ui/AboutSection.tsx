import { Container } from '@/shared/ui/Container';
import { VideoPlaceholder } from '@/shared/ui/VideoPlaceholder';
import s from './AboutSection.module.scss';
import { Button } from '@/shared/ui/Button';

export const AboutSection = () => {
    return (
        <section className={s.aboutSection}>
            <Container className={s.container}>
                <div className={s.content}>
                    <div className={s.textBlock}>
                        <h2 className={s.title}>
                            UstazOn — мощнейшая профессиональная платформа со
                            встроенным ИИ, объединяющая в одном месте более 2
                            миллионов материалов необходимых для работы учителей
                        </h2>
                        <p className={s.subTitle}>
                            Наша цель — быть такими же полезными для учителей,
                            как и для кого-то другого
                        </p>
                    </div>
                    <div className={s.buttons}>
                        <Button
                            variant="dark"
                            className={s.primaryBtn}>
                            Перейти на главную страницу
                        </Button>
                        <Button
                            variant="outline"
                            className={s.secondaryBtn}>
                            Дополнительная информация
                        </Button>
                    </div>
                </div>
                <div className={s.mediaWrapper}>
                    <VideoPlaceholder className={s.videoPlaceholder} />
                </div>
            </Container>
        </section>
    );
};

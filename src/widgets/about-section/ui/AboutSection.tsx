import { Container } from '@/shared/ui/container';
import { VideoPlaceholder } from '@/shared/ui/video-placeholder';
import s from './AboutSection.module.scss';

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
                </div>
                <div className={s.mediaWrapper}>
                    <VideoPlaceholder
                        className={s.videoPlaceholder}
                        videoUrl="https://www.youtube.com/watch?v=EngW7tLk6R8"
                    />
                </div>
            </Container>
        </section>
    );
};

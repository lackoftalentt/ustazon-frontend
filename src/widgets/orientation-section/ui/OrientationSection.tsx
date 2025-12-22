import { SectionTitle } from '@/shared/ui/SectionTitle';
import s from './OrientationSection.module.scss';
import { Container } from '@/shared/ui/Container';
import { OrientationItem } from '@/shared/ui/OrientationItem';
import { VideoPlaceholder } from '@/shared/ui/VideoPlaceholder';
import { ORIENTATIONS_DATA } from '@/shared/config/orientations';

export const OrientationSection = () => {
    return (
        <section className={s.orientationSection}>
            <Container>
                <SectionTitle
                    className={s.title}
                    title="3 Основных направления платформы UstazOn"
                />
                <div className={s.block}>
                    {ORIENTATIONS_DATA.map((or, index) => (
                        <div
                            key={or.id}
                            className={s.blockItem}
                            style={{ animationDelay: `${index * 0.2}s` }}>
                            <OrientationItem
                                title={or.title}
                                description={or.description}
                                icon={or.icon}
                            />
                            <div className={s.videoWrapper}>
                                <VideoPlaceholder
                                    className={s.videoPlaceholder}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    );
};

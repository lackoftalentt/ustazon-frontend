import { Container } from '@/shared/ui/Container';
import s from './AdvantagesSection.module.scss';
import { SectionTitle } from '@/shared/ui/SectionTitle';
import { ADVANTAGES_DATA } from '@/shared/config/advantages';
import { AdvantageItem } from '@/shared/ui/AdvantageItem';

export const AdvantagesSection = () => {
    return (
        <section className={s.advantagesSection}>
            <Container>
                <SectionTitle
                    className={s.title}
                    title="Преимущества платформы UstazOn"
                />
                <div className={s.advantagesBlock}>
                    {ADVANTAGES_DATA.map((adv, index) => (
                        <AdvantageItem
                            title={adv.title}
                            key={adv.id}
                            icon={adv.icon}
                            subtitle={adv.subtitle}
                            index={index}
                        />
                    ))}
                </div>
            </Container>
        </section>
    );
};

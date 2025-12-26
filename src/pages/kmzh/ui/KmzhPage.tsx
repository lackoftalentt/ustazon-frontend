import { Container } from '@/shared/ui/Container';
import s from './Kmzhpage.module.scss';
import { SectionTitle } from '@/shared/ui/SectionTitle';
import { Dropdown } from '@/shared/ui/Dropdown';
import { useState } from 'react';
import { StatCounter } from '@/shared/ui/StatCounter';
import { PlanCard } from '@/shared/ui/PlanCard/ui/PlanCard';

export const KmzhPage = () => {
    const topics = ['Тема 1', 'Тема 2', 'Тема 3'];
    const classes = [
        '5 Класс',
        '6 Класс',
        '7 Класс',
        '8 Класс',
        '9 Класс',
        '10 Класс',
        '11 Класс'
    ];

    const [topic, setTopic] = useState<string>();
    const [schoolClass, setSchoolClass] = useState<string>();

    const plans = Array.from({ length: 9 }).map((_, i) => ({
        id: i,
        title: '5 Класс',
        kmzhCount: 'N',
        lessonsCount: 4
    }));

    return (
        <main className={s.kmzhPage}>
            <Container className={s.container}>
                <header className={s.header}>
                    <SectionTitle title="Математика" />
                    <p className={s.subtitle}>Учебные планы</p>

                    <div className={s.filters}>
                        <Dropdown
                            items={topics}
                            value={topic}
                            placeholder="Темы"
                            onChange={setTopic}
                        />
                        <Dropdown
                            items={classes}
                            value={schoolClass}
                            placeholder="Класс"
                            onChange={setSchoolClass}
                        />
                    </div>
                </header>

                <section className={s.stats}>
                    <StatCounter
                        value={0}
                        label="Общий КМЖ"
                    />
                    <StatCounter
                        value={0}
                        label="Классы"
                    />
                    <StatCounter
                        value={0}
                        label="Материалов"
                    />
                </section>

                <section className={s.section}>
                    <SectionTitle title="КМЖ по классам" />

                    <div className={s.cards}>
                        {plans.map(p => (
                            <PlanCard
                                key={p.id}
                                title={p.title}
                                kmzhCount={p.kmzhCount}
                                lessonsCount={p.lessonsCount}
                                onDetails={() => console.log('details', p.id)}
                            />
                        ))}
                    </div>
                </section>
            </Container>
        </main>
    );
};

export default KmzhPage;

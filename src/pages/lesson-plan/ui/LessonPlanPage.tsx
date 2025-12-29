import s from './LessonPlanPage.module.scss';

import { useParams, Navigate } from 'react-router-dom';
import { QuarterTabs } from '@/widgets/quarter-tabs';
import { LessonPlanTable } from '@/widgets/lesson-plan-table';
import { Container } from '@/shared/ui/container';
import { SectionTitle } from '@/shared/ui/section-title';

const quarters = ['q1', 'q2', 'q3', 'q4'] as const;
type QuarterId = (typeof quarters)[number];

export const LessonPlanQuarterPage = () => {
    const { grade, quarter } = useParams<{ grade: string; quarter: string }>();

    if (!grade || !quarter || !quarters.includes(quarter as QuarterId)) {
        return (
            <Navigate
                to="/lesson-plan/5/q1"
                replace
            />
        );
    }

    return (
        <div>
            <Container className={s.container}>
                <SectionTitle title={`Математика - ${grade}-сынып`} />
                <p className={s.subtitle}>Қысқа мерзімді жоспарлар (ҚМЖ)</p>
                <QuarterTabs />
                <LessonPlanTable
                    grade={grade}
                    quarter={quarter as QuarterId}
                />
            </Container>
        </div>
    );
};

export default LessonPlanQuarterPage;

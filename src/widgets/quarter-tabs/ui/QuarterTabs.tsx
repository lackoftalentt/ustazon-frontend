import { NavLink, useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import s from './QuarterTabs.module.scss';

const items = [
    { id: 'q1', label: '1 тоқсан' },
    { id: 'q2', label: '2 тоқсан' },
    { id: 'q3', label: '3 тоқсан' },
    { id: 'q4', label: '4 тоқсан' }
] as const;

export const QuarterTabs = () => {
    const { grade, quarter } = useParams<{ grade: string; quarter: string }>();
    const g = grade ?? '5';

    const [activeIndex, setActiveIndex] = useState(0);
    const [direction, setDirection] = useState<'left' | 'right'>('right');
    const prevIndexRef = useRef(0);

    useEffect(() => {
        const idx = items.findIndex(item => item.id === quarter);
        if (idx >= 0) {
            prevIndexRef.current = activeIndex;
            setActiveIndex(idx);
            setDirection(idx > prevIndexRef.current ? 'right' : 'left');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [quarter]);

    const getActiveStyle = () => {
        const tabWidth = 100;
        const gap = 4;
        const padding = 4;
        const left = padding + activeIndex * (tabWidth + gap);

        return { left: `${left}px`, width: `${tabWidth}px` };
    };

    return (
        <div className={s.root}>
            <div
                className={s.backgroundSlider}
                style={getActiveStyle()}
            />

            {items.map(x => (
                <NavLink
                    key={x.id}
                    to={`/lesson-plan/${g}/${x.id}`}
                    className={({ isActive }) => {
                        const base = s.tab;
                        const active = isActive ? s.active : '';
                        const dir = isActive
                            ? direction === 'left'
                                ? s.slideLeft
                                : s.slideRight
                            : '';
                        return `${base} ${active} ${dir}`;
                    }}>
                    {x.label}
                </NavLink>
            ))}
        </div>
    );
};

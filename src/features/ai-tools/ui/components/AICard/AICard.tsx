import type { ReactNode } from 'react';
import s from './AICard.module.scss';

interface AICardProps {
    children: ReactNode;
    className?: string;
    hoverable?: boolean;
}

export const AICard = ({ children, className = '', hoverable = false }: AICardProps) => {
    return (
        <div className={`${s.card} ${hoverable ? s.hoverable : ''} ${className}`}>
            {children}
        </div>
    );
};

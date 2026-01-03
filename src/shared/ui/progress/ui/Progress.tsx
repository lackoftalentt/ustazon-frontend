import type { FC } from 'react';
import s from './Progress.module.scss';

interface ProgressProps {
    value: number;
    max?: number;
    showLabel?: boolean;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'success' | 'warning' | 'danger';
    animated?: boolean;
    className?: string;
}

export const Progress: FC<ProgressProps> = ({
    value,
    max = 100,
    showLabel = false,
    size = 'md',
    variant = 'default',
    animated = true,
    className = ''
}) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
        <div
            className={`${s.progressWrapper} ${s[size]} ${className}`}
            role="progressbar"
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={max}>
            <div className={s.progressTrack}>
                <div
                    className={`${s.progressBar} ${s[variant]} ${animated ? s.animated : ''}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
            {showLabel && (
                <span className={s.progressLabel}>{Math.round(percentage)}%</span>
            )}
        </div>
    );
};

export default Progress;

import { useState, useEffect, useRef } from 'react';
import { RefreshCw } from 'lucide-react';
import { Progress } from '@/shared/ui/progress';
import s from './FullScreenLoader.module.scss';

interface FullScreenLoaderProps {
    message: string;
    tips?: string[];
    icon?: React.ReactNode;
}

export const FullScreenLoader = ({ message, tips = [], icon }: FullScreenLoaderProps) => {
    const [progress, setProgress] = useState(0);
    const [tipIndex, setTipIndex] = useState(0);
    const [showTips, setShowTips] = useState(false);
    const startRef = useRef(Date.now());

    // Simulated progress
    useEffect(() => {
        const interval = setInterval(() => {
            const elapsed = (Date.now() - startRef.current) / 1000;
            let value: number;

            if (elapsed < 5) {
                value = (elapsed / 5) * 30; // 0→30% in 5s
            } else if (elapsed < 15) {
                value = 30 + ((elapsed - 5) / 10) * 30; // 30→60% in 10s
            } else if (elapsed < 40) {
                value = 60 + ((elapsed - 15) / 25) * 25; // 60→85% in 25s
            } else {
                value = 85;
            }

            setProgress(Math.min(Math.round(value), 85));
        }, 300);

        return () => clearInterval(interval);
    }, []);

    // Show tips after 7 seconds
    useEffect(() => {
        if (tips.length === 0) return;

        const showTimer = setTimeout(() => setShowTips(true), 7000);
        return () => clearTimeout(showTimer);
    }, [tips.length]);

    // Rotate tips every 5 seconds
    useEffect(() => {
        if (!showTips || tips.length <= 1) return;

        const rotateTimer = setInterval(() => {
            setTipIndex(prev => (prev + 1) % tips.length);
        }, 5000);

        return () => clearInterval(rotateTimer);
    }, [showTips, tips.length]);

    return (
        <div className={s.overlay}>
            <div className={s.icon}>
                {icon || <RefreshCw size={48} color="#2f8450" />}
            </div>
            <p className={s.message}>{message}</p>
            <p className={s.sub}>Біраз уақыт күтіңіз</p>

            <div className={s.progressWrap}>
                <Progress value={progress} showLabel size="sm" />
            </div>

            {showTips && tips.length > 0 && (
                <div className={s.tip} key={tipIndex}>
                    <span className={s.tipLabel}>Кеңес:</span>
                    {tips[tipIndex]}
                </div>
            )}
        </div>
    );
};

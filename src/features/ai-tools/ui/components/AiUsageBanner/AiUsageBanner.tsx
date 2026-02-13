import { useTranslation } from 'react-i18next';
import { Zap, AlertTriangle, XCircle } from 'lucide-react';
import type { AiUsageResponse } from '@/shared/api/ai';
import s from './AiUsageBanner.module.scss';

interface AiUsageBannerProps {
    usage: AiUsageResponse | null;
}

export const AiUsageBanner = ({ usage }: AiUsageBannerProps) => {
    const { t } = useTranslation();

    if (!usage || usage.is_subscriber) return null;

    const { remaining, limit } = usage;

    let variant: string;
    let Icon: typeof Zap;

    if (remaining <= 0) {
        variant = s.red;
        Icon = XCircle;
    } else if (remaining === 1) {
        variant = s.orange;
        Icon = AlertTriangle;
    } else {
        variant = s.green;
        Icon = Zap;
    }

    return (
        <div className={`${s.banner} ${variant}`}>
            <div className={s.icon}>
                <Icon size={18} />
            </div>
            <div className={s.content}>
                {remaining <= 0 ? (
                    <>
                        <p className={s.text}>{t('ai.generatorLimitExceeded')}</p>
                        <p className={s.subtext}>{t('ai.limitDescription')}</p>
                    </>
                ) : (
                    <>
                        <p
                            className={s.text}
                            dangerouslySetInnerHTML={{
                                __html: t('ai.freeGenerationsRemaining', { remaining, limit }),
                            }}
                        />
                        <p className={s.subtext}>{t('ai.freeGenerationsPerMonth', { limit })}</p>
                    </>
                )}
            </div>
            {remaining <= 0 && (
                <a
                    className={s.link}
                    href="https://wa.me/77476752302?text=%D0%96%D0%B0%D0%B7%D1%8B%D0%BB%D1%8B%D0%BC%20%D0%B0%D0%BB%D0%B3%D1%8B%D0%BC%20%D0%BA%D0%B5%D0%BB%D0%B5%D0%B4%D1%96"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {t('ai.getSubscription')}
                </a>
            )}
        </div>
    );
};

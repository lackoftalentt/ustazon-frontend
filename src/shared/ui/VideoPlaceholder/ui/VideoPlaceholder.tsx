import clsx from 'clsx';
import s from './VideoPlaceholder.module.scss';
import play from '@/shared/assets/icons/play.svg';

interface VideoPlaceholderProps {
    className?: string;
}

export const VideoPlaceholder = ({ className }: VideoPlaceholderProps) => {
    return (
        <div className={clsx(s.container, className)}>
            {' '}
            <div className={s.videoPlaceholder}>
                <img
                    src={play}
                    alt=""
                />
            </div>
        </div>
    );
};

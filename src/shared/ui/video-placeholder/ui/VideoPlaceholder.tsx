import { useState } from 'react';
import ReactPlayer from 'react-player';
import clsx from 'clsx';
import s from './VideoPlaceholder.module.scss';
import play from '@/shared/assets/icons/play.svg';

interface VideoPlaceholderProps {
    className?: string;
    videoUrl: string;
    thumbnailUrl?: string;
}

export const VideoPlaceholder = ({
    className,
    videoUrl,
    thumbnailUrl
}: VideoPlaceholderProps) => {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <div className={clsx(s.container, className)}>
            <div className={s.videoPlaceholder}>
                <ReactPlayer
                    src={videoUrl}
                    playing={isPlaying}
                    controls={true}
                    width="100%"
                    height="100%"
                    light={thumbnailUrl || true}
                    className={s.reactPlayer}
                    playIcon={
                        <div className={s.playIconWrapper}>
                            <img
                                src={play}
                                alt="Play"
                                className={s.playIcon}
                            />
                        </div>
                    }
                    onClickPreview={() => setIsPlaying(true)}
                />
            </div>
        </div>
    );
};

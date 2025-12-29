import { useState } from 'react';
import ReactPlayer from 'react-player';
import s from './SubjectDetailPlayer.module.scss';

export const SubjectDetailPlayer = () => {
    const [playing, setPlaying] = useState(false);

    return (
        <div className={s.player}>
            <div className={s.video}>
                <div className={s.playerWrapper}>
                    <ReactPlayer
                        src="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                        playing={playing}
                        volume={0.8}
                        width="100%"
                        height="100%"
                        controls={true}
                    />
                </div>

                {!playing && (
                    <button
                        className={s.playBtn}
                        onClick={() => setPlaying(!playing)}>
                        <span className={s.playIcon} />
                    </button>
                )}
            </div>
        </div>
    );
};

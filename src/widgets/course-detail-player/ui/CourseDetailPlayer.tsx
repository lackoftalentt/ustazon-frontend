import s from './CourseDetailPlayer.module.scss';

export const CourseDetailPlayer = () => {
    return (
        <div className={s.player}>
            <div className={s.video}>
                <button className={s.playBtn}>
                    <span className={s.playIcon} />
                </button>

                <div className={s.controls}>
                    <button
                        className={s.iconBtn}
                        aria-label="Prev"
                    />
                    <button
                        className={s.iconBtn}
                        aria-label="Volume"
                    />
                    <button
                        className={s.iconBtn}
                        aria-label="Fullscreen"
                    />
                </div>
            </div>
        </div>
    );
};

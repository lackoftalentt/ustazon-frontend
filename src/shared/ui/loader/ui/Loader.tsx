import s from './Loader.module.scss';
export const Loader = () => {
    return (
        <div className={s.loadingState}>
            <div className={s.spinnerContainer}>
                <div className={s.spinner}></div>
                <div className={s.spinnerRing}></div>
            </div>
            <p className={s.loadingText}>Материалдар жүктелуде...</p>
            <p className={s.loadingSubtext}>Біраз уақыт күтіңіз</p>
        </div>
    );
};

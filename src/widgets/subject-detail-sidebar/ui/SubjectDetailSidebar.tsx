import { useNavigate } from 'react-router-dom';
import s from './SubjectDetailSidebar.module.scss';

export const SubjectDetailSidebar = () => {
    const navigate = useNavigate();
    return (
        <aside className={s.root}>
            <h2 className={s.heading}>Важная информация</h2>

            <div className={s.cards}>
                <button className={s.card}>
                    <div className={s.cardMeta}>
                        <span className={s.cardLabel}>Задания</span>
                        <span className={s.cardSub}>Кол-во тестов: 3</span>
                    </div>
                    <span className={s.cardAction}>Перейти</span>
                </button>

                <div className={s.card}>
                    <div className={s.cardMeta}>
                        <span className={s.cardLabel}>Раздел</span>
                        <span className={s.cardSub}>Название раздела</span>
                    </div>
                </div>

                <div className={s.card}>
                    <div className={s.cardMeta}>
                        <span className={s.cardLabel}>Учебный материал</span>
                        <span className={s.cardSub}>Школьный (или другой)</span>
                    </div>
                </div>
            </div>

            <div className={s.divider} />

            <div className={s.stats}>
                <div className={s.stat}>
                    <div className={s.statValue}>12</div>
                    <div className={s.statLabel}>Уроков</div>
                </div>
                <div className={s.stat}>
                    <div className={s.statValue}>4ч</div>
                    <div className={s.statLabel}>Длительность</div>
                </div>
            </div>

            <button
                className={s.backBtn}
                onClick={() => navigate(-1)}>
                <span className={s.backIcon} />
                Вернуться к курсам
            </button>
        </aside>
    );
};

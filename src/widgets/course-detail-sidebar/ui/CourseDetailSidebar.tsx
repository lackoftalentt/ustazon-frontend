import s from './CourseDetailSidebar.module.scss';

export const CourseDetailSidebar = () => {
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

            <button className={s.backBtn}>Вернуться к курсам</button>
        </aside>
    );
};

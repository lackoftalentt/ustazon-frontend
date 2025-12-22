import s from './CourseDetailComments.module.scss';

export const CourseDetailComments = () => {
    return (
        <section className={s.root}>
            <label className={s.label}>
                Комментарии
                <input
                    className={s.input}
                    placeholder="Введите текст"
                />
            </label>

            <div className={s.comment}>
                <div className={s.avatar}>И</div>
                <div>
                    <div className={s.name}>Имя</div>
                    <div className={s.text}>Комментарий</div>
                </div>
            </div>
        </section>
    );
};

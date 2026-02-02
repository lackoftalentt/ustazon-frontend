import type { ReactNode } from 'react';
import type { LessonDocument } from '@/shared/api/lessonApi';
import s from './LessonPageLayout.module.scss';

interface Props {
    layout: LessonDocument['layout'];
    meta: LessonDocument['meta'];
    children: ReactNode;
}

export const LessonPageLayout = ({ layout, meta, children }: Props) => {
    const fontClass = layout.font === 'sans' ? s.fontSans : s.fontSerif;

    return (
        <div className={s.pageWrapper}>
            <article className={`${s.page} ${fontClass}`}>
                {(layout.show_name_field || layout.show_date_field) && (
                    <div className={s.headerFields}>
                        {layout.show_name_field && (
                            <div className={s.field}>
                                <span className={s.fieldLabel}>Аты-жөні:</span>
                                <span className={s.fieldLine} />
                            </div>
                        )}
                        {layout.show_date_field && (
                            <div className={s.field}>
                                <span className={s.fieldLabel}>Күні:</span>
                                <span className={s.fieldLine} />
                            </div>
                        )}
                    </div>
                )}

                <div className={s.metaBar}>
                    <span>{meta.subject}</span>
                    <span>{meta.grade}</span>
                </div>

                {children}
            </article>
        </div>
    );
};

import { useState, useEffect } from 'react';
import { useCommentsStore } from '@/entities/comment';
import { formatTimeAgo } from '@/shared/lib/formatTimeAgo';
import s from './SubjectDetailComments.module.scss';

interface SubjectDetailCommentsProps {
    lessonId?: string;
}

export const SubjectDetailComments = ({
    lessonId = '1'
}: SubjectDetailCommentsProps) => {
    const [inputValue, setInputValue] = useState('');
    const { comments, isLoading, fetchComments, addComment } =
        useCommentsStore();

    useEffect(() => {
        fetchComments(lessonId);
    }, [lessonId, fetchComments]);

    const handleSubmit = async () => {
        if (!inputValue.trim()) return;

        await addComment({
            text: inputValue.trim(),
            lessonId
        });

        setInputValue('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const getCommentCountText = (count: number): string => {
        if (count % 10 === 1 && count % 100 !== 11)
            return `${count} комментарий`;
        if (
            [2, 3, 4].includes(count % 10) &&
            ![12, 13, 14].includes(count % 100)
        )
            return `${count} комментария`;
        return `${count} комментариев`;
    };

    return (
        <section className={s.root}>
            <div className={s.header}>
                <h3 className={s.title}>Комментарии</h3>
                <span className={s.count}>
                    {getCommentCountText(comments.length)}
                </span>
            </div>

            <div className={s.inputWrapper}>
                <label className={s.label}>Оставить комментарий</label>
                <div className={s.inputGroup}>
                    <input
                        className={s.input}
                        placeholder="Напишите ваш комментарий..."
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isLoading}
                    />
                    <button
                        className={s.sendBtn}
                        onClick={handleSubmit}
                        disabled={isLoading || !inputValue.trim()}>
                        {isLoading ? 'Отправка...' : 'Отправить'}
                    </button>
                </div>
            </div>

            <div className={s.commentsList}>
                {comments.map(comment => (
                    <div
                        key={comment.id}
                        className={s.comment}>
                        <div className={s.avatar}>{comment.authorInitial}</div>
                        <div className={s.commentContent}>
                            <div className={s.commentHeader}>
                                <span className={s.name}>
                                    {comment.authorName}
                                </span>
                                <span className={s.date}>
                                    {formatTimeAgo(new Date(comment.createdAt))}
                                </span>
                            </div>
                            <p className={s.text}>{comment.text}</p>
                        </div>
                    </div>
                ))}

                {comments.length === 0 && !isLoading && (
                    <div className={s.emptyState}>
                        Пока нет комментариев. Будьте первым!
                    </div>
                )}
            </div>
        </section>
    );
};

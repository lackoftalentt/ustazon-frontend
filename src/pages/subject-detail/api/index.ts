// Реэкспорт API для страницы subject-detail
// Используйте эти хуки в компонентах страницы

export {
    useLessonQuery,
    useLessonProgressQuery,
    useUpdateProgressMutation,
    useCompleteLessonMutation
} from '@/entities/lesson';

export {
    useCommentsQuery,
    useCreateCommentMutation,
    useDeleteCommentMutation
} from '@/entities/comment/model';

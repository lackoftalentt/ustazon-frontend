export interface Comment {
    id: string;
    authorName: string;
    authorInitial: string;
    text: string;
    createdAt: Date;
    lessonId: string;
}

export interface CreateCommentDto {
    text: string;
    lessonId: string;
}

export interface Comment {
    id: string;
    bookId: string;
    chapterId?: string;
    userId: string;
    text: string;
    createdAt: number;
}
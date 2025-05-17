export interface Chapter{
    id: string;
    bookId: string;
    title: string;
    content: string;
    images?: string[];
    order: number;
    createdAt: number;
    updatedAt: number;
}
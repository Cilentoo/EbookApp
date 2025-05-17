export interface Book {
    id: string;
    title: string;
    coverImage?: string;
    descriptionId: string;
    authorId: string;
    createdAt: number;
    updatedAt: number;
    chapterIds: string[];
    metadata?:{
        rating?: number;
        readCount?: number;
        lastRead?: number;
    };
}

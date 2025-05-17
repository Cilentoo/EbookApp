import { Book } from "./Book";
import { Chapter } from "./Chapter";

export interface BookExport {
    book: Book;
    chapters: Chapter[];
    coverImage?: string;
    chapterImages? : {[chapterId: string]: string[]};
}
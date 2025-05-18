import { Book } from '../models/Book';
import { Chapter } from '../models/Chapter';
import { Comment } from '../models/Comment';
import * as storage from '../storage/asyncStorage';
import { generateId } from '../utils/fileUtils';

export const getAllBooks = async (): Promise<Book[]> => {
    return await storage.getBooks();
};

export const getBookById = async (id: string): Promise<Book | null> => {
    let books = await storage.getBooks();
    return books.find((book) => book.id === id) || null;
};

export const createBook = async (bookData: Omit<Book, 'id' | 'createdAt' | 'updatedAt' | 'chapterIds'>): Promise<Book> => {
    const books = await storage.getBooks();

    const newBook : Book = {
        ...bookData,
        id: generateId(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        chapterIds: []
    };

    await storage.saveBooks([...books, newBook]);
    return newBook;
};

export const updateBook = async (id: string, bookData: Partial<Book>): Promise<Book | null> => {
    const books = await storage.getBooks();
    const bookIndex = books.findIndex((book) => book.id === id);

    if(bookIndex === -1){
        throw new Error('Book not found');
    }

    const updatedBook = {
        ...books[bookIndex],
        ...bookData,
        updatedAt: Date.now(),
    };

    books[bookIndex] = updatedBook;
    await storage.saveBooks(books);
    return updatedBook;
}

export const deleteBook = async (id: string): Promise<void> => {
  const books = await storage.getBooks();
  const chapters = await storage.getChapters();
  const comments = await storage.getComments();
  
  const filteredBooks = books.filter(book => book.id !== id);
  const filteredChapters = chapters.filter(chapter => chapter.bookId !== id);
  
  
  await storage.saveBooks(filteredBooks);
  await storage.saveChapters(filteredChapters);
};

export const getChaptersByBookId = async (bookId: string): Promise<Chapter[]> => {
    const chapters = await storage.getChapters();
    return chapters
        .filter(chapter => chapter.bookId === bookId)
        .sort((a, b) => a.order - b.order);
};

export const getChapterById = async (id: string): Promise<Chapter | null> => {
    const chapters = await storage.getChapters();
    return chapters.find((chapter) => chapter.id === id) || null;
};

export const createChapter = async (chapterData: Omit<Chapter, 'id' | 'createdAt' | 'updatedAt'>): Promise<Chapter> => {
    const chapters = await storage.getChapters();
    const books = await storage.getBooks();

    const newChapter : Chapter = {
        ...chapterData,
        id: generateId(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
    };
    await storage.saveChapters([...chapters, newChapter]);

    const bookIndex = books.findIndex((book) => book.id === chapterData.bookId);
    if (bookIndex !== -1){
        const updatedBook = {
            ...books[bookIndex],
            chapterIds: [...books[bookIndex].chapterIds, newChapter.id],
            updatedAt: Date.now(),
        };
        books[bookIndex] = updatedBook;
        await storage.saveBooks(books);
    }

    return newChapter;
};

export const updateChapter = async (id : string, chapterData: Partial<Chapter>): Promise<Chapter | null> => {
    const chapters = await storage.getChapters();
    const chapterIndex = chapters.findIndex((chapter) => chapter.id === id);

    if(chapterIndex === -1){
        throw new Error('Chapter not found');
    }

    const updatedChapter = {
        ...chapters[chapterIndex],
        ...chapterData,
        updatedAt: Date.now(),
    };

    chapters[chapterIndex] = updatedChapter;
    await storage.saveChapters(chapters);
    return updatedChapter;
};

export const deleteChapter = async (id: string): Promise<void> => {
    const chapters = await storage.getChapters();
    const books = await storage.getBooks();

    const chapterToDelete = chapters.find(chapter => chapter.id === id);
    if(!chapterToDelete) return;

    const filteredChapters = chapters.filter(chapter => chapter.id !== id);
    await storage.saveChapters(filteredChapters);

    const bookIndex = books.findIndex(book => book.id === chapterToDelete.bookId);
    if (bookIndex !== -1){
        const updatedBook = {
            ...books[bookIndex],
            chapterIds: books[bookIndex].chapterIds.filter(chapterId => chapterId !== id),
            updatedAt: Date.now(),
        };
        books[bookIndex] = updatedBook;
        await storage.saveBooks(books);
    }
};
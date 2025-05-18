import { Book } from '../models/Book';
import { Chapter } from '../models/Chapter';
import { Comment } from '../models/Comment';
import * as storage from '../storage/asyncStorage';

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
        id: (books.length + 1).toString(),
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
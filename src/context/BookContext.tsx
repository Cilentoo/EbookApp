import React, { createContext, useState, useContext, useEffect } from 'react';
import { Book } from '../models/Book';
import { Chapter } from '../models/Chapter';
import { Comment } from '../models/Comment';
import * as bookService from '../services/bookService';
import * as storage from '../storage/asyncStorage';
import { Alert } from 'react-native';

interface BookContextData {
  books: Book[];
  selectedBook: Book | null;
  chapters: Chapter[];
  selectedChapter: Chapter | null;
  comments: Comment[];
  loading: boolean;
  
  // Book actions
  loadBooks: () => Promise<void>;
  selectBook: (bookId: string) => Promise<void>;
  createBook: (bookData: Partial<Book>) => Promise<Book>;
  updateBook: (bookId: string, bookData: Partial<Book>) => Promise<Book | null>;
  deleteBook: (bookId: string) => Promise<void>;
  
  // Chapter actions
  loadChapters: (bookId: string) => Promise<void>;
  selectChapter: (chapterId: string) => Promise<void>;
  createChapter: (chapterData: Partial<Chapter>) => Promise<Chapter>;
  updateChapter: (chapterId: string, chapterData: Partial<Chapter>) => Promise<Chapter | null>;
  deleteChapter: (chapterId: string) => Promise<void>;
  
  // Comment actions
  loadComments: (bookId: string, chapterId: string) => Promise<void>;
  addComment: (text: string, bookId: string, chapterId: string) => Promise<void>;
}

const BookContext = createContext<BookContextData>({} as BookContextData);

export const BookProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      const booksData = await bookService.getAllBooks();
      setBooks(booksData);
    } catch (error) {
      console.error('Error loading books:', error);
      Alert.alert('Erro', 'Não foi possível carregar os livros.');
    } finally {
      setLoading(false);
    }
  };

  const selectBook = async (bookId: string) => {
    try {
      setLoading(true);
      const book = await bookService.getBookById(bookId);
      
      if (book) {
        setSelectedBook(book);
        await loadChapters(bookId);
      } else {
        throw new Error('Livro não encontrado');
      }
    } catch (error) {
      console.error('Error selecting book:', error);
      Alert.alert('Erro', 'Não foi possível carregar o livro selecionado.');
    } finally {
      setLoading(false);
    }
  };

  const createBook = async (bookData: Partial<Book>): Promise<Book> => {
    try {
      setLoading(true);
      const newBook = await bookService.createBook(bookData as Omit<Book, 'id' | 'createdAt' | 'updatedAt' | 'chapterIds'>);
      setBooks(prevBooks => [...prevBooks, newBook]);
      return newBook;
    } catch (error) {
      console.error('Error creating book:', error);
      Alert.alert('Erro', 'Não foi possível criar o livro.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateBook = async (bookId: string, bookData: Partial<Book>): Promise<Book | null> => {
    try {
      setLoading(true);
      const updatedBook = await bookService.updateBook(bookId, bookData);
      
      if (updatedBook) {
        setBooks(prevBooks =>
          prevBooks.map(book => book.id === bookId ? updatedBook : book)
        );
        
        if (selectedBook?.id === bookId) {
          setSelectedBook(updatedBook);
        }
      }
      
      return updatedBook;
    } catch (error) {
      console.error('Error updating book:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o livro.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteBook = async (bookId: string): Promise<void> => {
    try {
      setLoading(true);
      await bookService.deleteBook(bookId);
      
      setBooks(prevBooks => prevBooks.filter(book => book.id !== bookId));
      
      if (selectedBook?.id === bookId) {
        setSelectedBook(null);
        setChapters([]);
        setSelectedChapter(null);
      }
    } catch (error) {
      console.error('Error deleting book:', error);
      Alert.alert('Erro', 'Não foi possível excluir o livro.');
      throw error;
    } finally {
    setLoading(false);
    }
  };

const loadChapters = async (bookId: string): Promise<void> => {
    try {
        const chaptersData = await bookService.getChaptersByBookId(bookId);
        setChapters(chaptersData);
        
        // Clear selected chapter if it doesn't belong to this book
        if (selectedChapter && selectedChapter.bookId !== bookId) {
            setSelectedChapter(null);
        }
    } catch (error) {
        console.error('Error loading chapters:', error);
        Alert.alert('Erro', 'Não foi possível carregar os capítulos do livro.');
        throw error;
    }
};


  const selectChapter = async (chapterId: string): Promise<void> => {
    try {
      const chapter = await bookService.getChapterById(chapterId);
      
      if (chapter) {
        setSelectedChapter(chapter);
      } else {
        throw new Error('Capítulo não encontrado');
      }
    } catch (error) {
      console.error('Error selecting chapter:', error);
      Alert.alert('Erro', 'Não foi possível carregar o capítulo selecionado.');
      throw error;
    }
  };

  const createChapter = async (chapterData: Partial<Chapter>): Promise<Chapter> => {
    try {
      if (!chapterData.bookId) {
        throw new Error('BookId é obrigatório para criar um capítulo');
      }
      
      if (!chapterData.title) {
        throw new Error('Título é obrigatório para criar um capítulo');
      }
      
      if (!chapterData.content) {
        throw new Error('Conteúdo é obrigatório para criar um capítulo');
      }
      
      // Calculate order if not provided
      if (!chapterData.order) {
        const bookChapters = await bookService.getChaptersByBookId(chapterData.bookId);
        chapterData.order = bookChapters.length + 1;
      }
      
      const newChapter = await bookService.createChapter(chapterData as Omit<Chapter, 'id' | 'createdAt' | 'updatedAt'>);
      
      setChapters(prevChapters => [...prevChapters, newChapter]);
      
      return newChapter;
    } catch (error) {
      console.error('Error creating chapter:', error);
      Alert.alert('Erro', 'Não foi possível criar o capítulo.');
      throw error;
    }
  };

  const updateChapter = async (chapterId: string, chapterData: Partial<Chapter>): Promise<Chapter | null> => {
    try {
      const updatedChapter = await bookService.updateChapter(chapterId, chapterData);
      
      if (updatedChapter) {
        setChapters(prevChapters => 
          prevChapters.map(chapter => chapter.id === chapterId ? updatedChapter : chapter)
        );
        
        if (selectedChapter?.id === chapterId) {
          setSelectedChapter(updatedChapter);
        }
      }
      
      return updatedChapter;
    } catch (error) {
      console.error('Error updating chapter:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o capítulo.');
      throw error;
    }
  };

  const deleteChapter = async (chapterId: string): Promise<void> => {
    try {
      await bookService.deleteChapter(chapterId);
      
      setChapters(prevChapters => prevChapters.filter(chapter => chapter.id !== chapterId));
      
      if (selectedChapter?.id === chapterId) {
        setSelectedChapter(null);
      }
    } catch (error) {
      console.error('Error deleting chapter:', error);
      Alert.alert('Erro', 'Não foi possível excluir o capítulo.');
      throw error;
    }
  };

  // Load comments for a specific book and chapter
  const loadComments = async (bookId: string, chapterId: string): Promise<void> => {
    try {
      const commentsData = await bookService.getCommentsByBookAndChapter(bookId, chapterId);
      if (Array.isArray(commentsData)) {
        setComments(commentsData);
      } else {
        setComments([]);
      }
    } catch (error) {
      console.error('Error loading comments:', error);
      Alert.alert('Erro', 'Não foi possível carregar os comentários.');
      throw error;
    }
  };

  const addComment = async (text: string, bookId: string, chapterId: string): Promise<void> => {
    try {
      await bookService.addComment({ text, bookId, chapterId });
      await loadComments(bookId, chapterId);
    } catch (error) {
      console.error('Error adding comment:', error);
      Alert.alert('Erro', 'Não foi possível adicionar o comentário.');
      throw error;
    }
  };

  return (
    <BookContext.Provider value={{
      books,
      selectedBook,
      chapters,
      selectedChapter,
      comments,
      loading,
      loadBooks,
      selectBook,
      createBook,
      updateBook,
      deleteBook,
      loadChapters,
      selectChapter,
      createChapter,
      updateChapter,
      deleteChapter,
      loadComments,
      addComment
    }}>
      {children}
    </BookContext.Provider>
  );
};

export function useBooks(): BookContextData {
  const context = useContext(BookContext);

  if (!context) {
    throw new Error('useBooks deve ser usado dentro de um BookProvider');
  }

  return context;
}
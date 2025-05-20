import { Book } from "../models/Book";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Chapter } from "../models/Chapter";

const BOOK_STORAGE_KEY = '@LoveBooks:books';
const CHAPTERS_STORAGE_KEY = '@LoveBooks:chapters';
const COMMENTS_STORAGE_KEY = '@LoveBooks:comments';

export const saveBooks = async (books: Book[]) => {
    try {
        await AsyncStorage.setItem(BOOK_STORAGE_KEY, JSON.stringify(books));
    }catch (error) {
        console.error('Error saving books:', error);
        throw error;
    }
};

export const getBooks = async (): Promise<Book[]> => {
    try{
        const books = await AsyncStorage.getItem(BOOK_STORAGE_KEY);
        return books ? JSON.parse(books) : [];
    }catch (error) {
        console.error('Error retrieving books:', error);
        return [];
    }
};

export const saveChapters = async (chapters: Chapter[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(CHAPTERS_STORAGE_KEY, JSON.stringify(chapters));
  } catch (error) {
    console.error('Erro ao salvar capítulos:', error);
    throw error;
  }
};

export const getChapters = async (): Promise<Chapter[]> => {
    try{
        const chapters = await AsyncStorage.getItem(CHAPTERS_STORAGE_KEY);
        return chapters ? JSON.parse(chapters) : [];
    }catch (error) {
        console.error('Error retrieving chapters:', error);
        return [];
    }
};

export const saveComments = async (comments: Comment[]): Promise<void> => {
  await AsyncStorage.setItem('comments', JSON.stringify(comments));
};

export const getComments = async (): Promise<Comment[]> => {
    const data = await AsyncStorage.getItem('comments');
    return data ? JSON.parse(data) : [];
};

export const saveImage = async (key: string, imageUri: string): Promise<void>=> {
    try{
        await AsyncStorage.setItem(`$@LoveBooks:image:${key}`, imageUri);
    }catch (error) {
        console.error('Error saving image:', error);
        throw error;
    }
};

export const getImage = async (key: string): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(`@LoveBooks:image:${key}`);
  } catch (error) {
    console.error('Erro ao obter imagem:', error);
    return null;
  }
};
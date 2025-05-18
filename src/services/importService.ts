import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import { generateId } from '../utils/fileUtils';
import * as storage from '../storage/asyncStorage';
import { BookExport } from '../models/BookExport';

const base64ToFile = async (base64: string, fileName: string): Promise<string> => {
  try {
    const fileUri = `${FileSystem.documentDirectory}${fileName}`;
    
    await FileSystem.writeAsStringAsync(
      fileUri,
      base64,
      { encoding: FileSystem.EncodingType.Base64 }
    );
    
    return fileUri;
  } catch (error) {
    console.error('Erro ao converter base64 para arquivo:', error);
    throw error;
  }
};

export const selectImportFile = async (): Promise<BookExport> => {
    try {
        const result = await DocumentPicker.getDocumentAsync({
            type: ['application/json', '*/*'],
            copyToCacheDirectory: true,
        });

        if(result.canceled){
            throw new Error('Importação cancelada');
        }

        const fileContent = await FileSystem.readAsStringAsync(result.assets[0].uri)
        const importData : BookExport = JSON.parse(fileContent);

        if(!importData.book || !importData.chapters){
            throw new Error('Arquivo inválido');
        }

        return importData;
    }catch (error) {
        console.error('Erro ao importar arquivo:', error);
        throw error;
    }
};

export const importBook = async (importData: BookExport): Promise<string> => {
    try{
        const existingBooks = await storage.getBooks();
        const existingChapters = await storage.getChapters();

        const newBookId = generateId();
        const idMap: {[oldId: string]: string} = {};

        const newBook = {
            ...importData.book,
            id: newBookId, 
            chapterIds : [] as string[],
            authorId : importData.book.authorId,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };

        if(importData.coverImage){
            const coverImageFileName = `cover_${newBookId}_${Date.now()}.jpg`;
            const coverImageUri = await base64ToFile(importData.coverImage, coverImageFileName);
            newBook.coverImage = coverImageUri;
        }
           const newChapters = await Promise.all(importData.chapters.map(async (chapter) => {
      const newChapterId = generateId();
      idMap[chapter.id] = newChapterId;
      
      // Adicionar ID do capítulo ao livro
      newBook.chapterIds.push(newChapterId);
      
      // Processar imagens do capítulo, se existirem
      let newImages: string[] | undefined;
      
      if (importData.chapterImages && importData.chapterImages[chapter.id]) {
        const chapterImagesBase64 = importData.chapterImages[chapter.id];
        newImages = [];
        
        for (let i = 0; i < chapterImagesBase64.length; i++) {
          const imageFileName = `chapter_${newChapterId}_image_${i}_${Date.now()}.jpg`;
          const imageUri = await base64ToFile(chapterImagesBase64[i], imageFileName);
          newImages.push(imageUri);
        }
      }
      
      // Criar novo capítulo com ID único
        return {
            ...chapter,
            id: newChapterId,
            bookId: newBookId,
            images: newImages || chapter.images,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };
    }));
    
    
        await storage.saveBooks([...existingBooks, newBook]);
        await storage.saveChapters([...existingChapters, ...newChapters]);
    
        return newBookId;
    } catch (error) {
        console.error('Erro ao importar livro:', error);
        throw error;
    }
};

import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Book } from '../models/Book';
import { Chapter } from '../models/Chapter';
import { BookExport } from '../models/BookExport';
import * as bookService from '../services/bookService';

// Convert image file to base64
const fileToBase64 = async (fileUri: string): Promise<string | null> => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    
    if (!fileInfo.exists) {
      console.log(`File does not exist: ${fileUri}`);
      return null;
    }
    
    const base64 = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64
    });
    
    return base64;
  } catch (error) {
    console.error('Error converting file to base64:', error);
    return null;
  }
};

export const exportBook = async (bookId: string): Promise<void> => {
  try {
    // Get book data
    const book = await bookService.getBookById(bookId);
    
    if (!book) {
      throw new Error('Livro não encontrado');
    }
    
    // Get all chapters for the book
    const chapters = await bookService.getChaptersByBookId(bookId);
    
    // Prepare export data
    const exportData: BookExport = {
      book,
      chapters,
    };
    
    // Convert book cover to base64 if it exists
    if (book.coverImage) {
      try {
        const coverBase64 = await fileToBase64(book.coverImage);
        
        if (coverBase64) {
          exportData.coverImage = coverBase64;
        }
      } catch (error) {
        console.error('Error processing book cover:', error);
      }
    }
    
    // Process chapter images if any
    const chapterImages: { [chapterId: string]: string[] } = {};
    
    for (const chapter of chapters) {
      if (chapter.images && chapter.images.length > 0) {
        const processedImages: string[] = [];
        
        for (const imageUri of chapter.images) {
          try {
            const imageBase64 = await fileToBase64(imageUri);
            
            if (imageBase64) {
              processedImages.push(imageBase64);
            }
          } catch (error) {
            console.error(`Error processing chapter image: ${imageUri}`, error);
          }
        }
        
        if (processedImages.length > 0) {
          chapterImages[chapter.id] = processedImages;
        }
      }
    }
    
    if (Object.keys(chapterImages).length > 0) {
      exportData.chapterImages = chapterImages;
    }
    
    // Create temporary file
    const fileName = `${book.title.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.json`;
    const fileUri = `${FileSystem.cacheDirectory}${fileName}`;
    
    // Write data to file
    await FileSystem.writeAsStringAsync(
      fileUri,
      JSON.stringify(exportData, null, 2)
    );
    
    // Check if sharing is available
    const isSharingAvailable = await Sharing.isAvailableAsync();
    
    if (!isSharingAvailable) {
      throw new Error('Compartilhamento não disponível neste dispositivo');
    }
    
    // Share the file
    await Sharing.shareAsync(fileUri, {
      mimeType: 'application/json',
      dialogTitle: `Compartilhar livro: ${book.title}`,
      UTI: 'public.json'
    });
  } catch (error) {
    console.error('Error exporting book:', error);
    throw error;
  }
};
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';

const APP_STORAGE_DIR = FileSystem.documentDirectory || '';

export const clearStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
    const files = await FileSystem.readDirectoryAsync(APP_STORAGE_DIR);
    
    for (const file of files) {
      await FileSystem.deleteAsync(`${APP_STORAGE_DIR}${file}`);
    }
  } catch (error) {
    console.error('Error clearing storage:', error);
    throw error;
  }
};

export const getStorageSize = async (): Promise<number> => {
  try {
    let totalSize = 0;
    const files = await FileSystem.readDirectoryAsync(APP_STORAGE_DIR);
    
    for (const file of files) {
      const fileInfo = await FileSystem.getInfoAsync(`${APP_STORAGE_DIR}${file}`);
      if (fileInfo.exists && fileInfo.size) {
        totalSize += fileInfo.size;
      }
    }
    
    return totalSize;
  } catch (error) {
    console.error('Error getting storage size:', error);
    return 0;
  }
};

export const cleanupUnusedFiles = async (usedFiles: string[]): Promise<void> => {
  try {
    const files = await FileSystem.readDirectoryAsync(APP_STORAGE_DIR);
    
    for (const file of files) {
      const filePath = `${APP_STORAGE_DIR}${file}`;
      if (!usedFiles.includes(filePath)) {
        await FileSystem.deleteAsync(filePath);
      }
    }
  } catch (error) {
    console.error('Error cleaning up unused files:', error);
    throw error;
  }
};

export const backupData = async (): Promise<string> => {
  try {
    const backupDir = `${APP_STORAGE_DIR}backups/`;
    await FileSystem.makeDirectoryAsync(backupDir, { intermediates: true });
    
    const timestamp = new Date().toISOString().replace(/[:]/g, '-');
    const backupFile = `${backupDir}backup_${timestamp}.json`;
    
    const allData = {
      books: await AsyncStorage.getItem('@LoveBooks:books'),
      chapters: await AsyncStorage.getItem('@LoveBooks:chapters'),
      comments: await AsyncStorage.getItem('@LoveBooks:comments')
    };
    
    await FileSystem.writeAsStringAsync(backupFile, JSON.stringify(allData));
    return backupFile;
  } catch (error) {
    console.error('Error creating backup:', error);
    throw error;
  }
};

export const restoreBackup = async (backupFile: string): Promise<void> => {
  try {
    const backupContent = await FileSystem.readAsStringAsync(backupFile);
    const data = JSON.parse(backupContent);
    
    await Promise.all([
      AsyncStorage.setItem('@LoveBooks:books', data.books || '[]'),
      AsyncStorage.setItem('@LoveBooks:chapters', data.chapters || '[]'),
      AsyncStorage.setItem('@LoveBooks:comments', data.comments || '[]')
    ]);
  } catch (error) {
    console.error('Error restoring backup:', error);
    throw error;
  }
};

export const getStorageStats = async () => {
  try {
    const storageSize = await getStorageSize();
    const files = await FileSystem.readDirectoryAsync(APP_STORAGE_DIR);
    
    return {
      totalSize: storageSize,
      fileCount: files.length,
      backupCount: (await FileSystem.readDirectoryAsync(`${APP_STORAGE_DIR}backups/`)).length,
      lastBackup: await getLastBackupDate()
    };
  } catch (error) {
    console.error('Error getting storage stats:', error);
    throw error;
  }
};

const getLastBackupDate = async (): Promise<Date | null> => {
  try {
    const backupDir = `${APP_STORAGE_DIR}backups/`;
    const backups = await FileSystem.readDirectoryAsync(backupDir);
    
    if (backups.length === 0) return null;
    
    const lastBackup = backups.sort().pop();
    const stats = await FileSystem.getInfoAsync(`${backupDir}${lastBackup}`);
    
    if (stats.exists && typeof (stats as any).modificationTime === 'number') {
      return new Date((stats as any).modificationTime * 1000);
    }
    return null;
  } catch {
    return null;
  }
};

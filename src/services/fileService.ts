import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Alert } from 'react-native';
import { generateId } from '../utils/fileUtils';

// Get file size in readable format
export const getFileSize = (size: number): string => {
  if (size < 1024) {
    return `${size} B`;
  } else if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)} KB`;
  } else if (size < 1024 * 1024 * 1024) {
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  } else {
    return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  }
};

// Create directory if it doesn't exist
export const ensureDirectoryExists = async (directory: string): Promise<void> => {
  try {
    const dirInfo = await FileSystem.getInfoAsync(directory);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
    }
  } catch (error) {
    console.error('Error ensuring directory exists:', error);
    throw error;
  }
};

// Save text content to a file
export const saveTextToFile = async (content: string, fileName: string): Promise<string> => {
  try {
    const directory = `${FileSystem.documentDirectory}texts/`;
    await ensureDirectoryExists(directory);
    
    const filePath = `${directory}${fileName}.txt`;
    await FileSystem.writeAsStringAsync(filePath, content);
    
    return filePath;
  } catch (error) {
    console.error('Error saving text to file:', error);
    throw error;
  }
};

// Read text content from file
export const readTextFromFile = async (filePath: string): Promise<string> => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(filePath);
    if (!fileInfo.exists) {
      throw new Error(`File does not exist: ${filePath}`);
    }
    
    const content = await FileSystem.readAsStringAsync(filePath);
    return content;
  } catch (error) {
    console.error('Error reading text from file:', error);
    throw error;
  }
};

// Pick a document (text file)
export const pickDocument = async (): Promise<{ uri: string; content: string } | null> => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'text/plain',
      copyToCacheDirectory: true,
    });
    
    if (result.canceled) {
      return null;
    }
    
    const fileUri = result.assets[0].uri;
    const content = await readTextFromFile(fileUri);
    
    return {
      uri: fileUri,
      content,
    };
  } catch (error) {
    console.error('Error picking document:', error);
    Alert.alert('Erro', 'Não foi possível selecionar o documento.');
    return null;
  }
};

// Pick a single image from gallery
export const pickImageFromGallery = async (): Promise<string | null> => {
  try {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (!permissionResult.granted) {
      Alert.alert('Permissão Negada', 'Precisamos de permissão para acessar sua galeria.');
      return null;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    
    if (result.canceled) {
      return null;
    }
    
    return result.assets[0].uri;
  } catch (error) {
    console.error('Error picking image from gallery:', error);
    Alert.alert('Erro', 'Não foi possível selecionar a imagem.');
    return null;
  }
};

// Take a photo with the camera
export const takePhoto = async (): Promise<string | null> => {
  try {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (!permissionResult.granted) {
      Alert.alert('Permissão Negada', 'Precisamos de permissão para acessar sua câmera.');
      return null;
    }
    
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    
    if (result.canceled) {
      return null;
    }
    
    return result.assets[0].uri;
  } catch (error) {
    console.error('Error taking photo:', error);
    Alert.alert('Erro', 'Não foi possível tirar a foto.');
    return null;
  }
};

// Save image to app's permanent storage
export const saveImageToStorage = async (imageUri: string): Promise<string> => {
  try {
    const fileName = `image_${generateId()}_${Date.now()}.jpg`;
    const directory = `${FileSystem.documentDirectory}images/`;
    
    await ensureDirectoryExists(directory);
    const destination = `${directory}${fileName}`;
    
    await FileSystem.copyAsync({
      from: imageUri,
      to: destination,
    });
    
    return destination;
  } catch (error) {
    console.error('Error saving image to storage:', error);
    throw error;
  }
};

// Delete a file
export const deleteFile = async (fileUri: string): Promise<void> => {
  try {
    if (!fileUri) return;
    
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (fileInfo.exists) {
      await FileSystem.deleteAsync(fileUri);
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

// Check if file exists
export const fileExists = async (fileUri: string): Promise<boolean> => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    return fileInfo.exists;
  } catch (error) {
    console.error('Error checking if file exists:', error);
    return false;
  }
};
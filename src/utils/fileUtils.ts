import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

export const requestMediaLibraryPermission = async (): Promise<boolean> => {
  const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
  return status === 'granted';
};

export const requestCameraPermission = async (): Promise<boolean> => {
  const {status} = await ImagePicker.requestCameraPermissionsAsync();
  return status === 'granted';
};

export const pickImage = async (): Promise<string | null> => {
  try {
    const hasPermission = await requestMediaLibraryPermission();
    if (!hasPermission) {
      console.error('Permission to access media library was denied');
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (result.canceled) {
      console.log('Image picker was canceled');
      return null;
    }
   return result.assets[0].uri;
  }catch (error) {
    console.error('Error picking image:', error);
    return null;
  }
};

export const takePhoto = async (): Promise<string | null> => {
  try {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      throw new Error('Permissão para acessar a câmera não concedida');
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
    console.error('Erro ao tirar foto:', error);
    return null;
  }
};

// Copia uma imagem para o diretório do aplicativo (permanente)
export const copyImageToAppDirectory = async (uri: string): Promise<string> => {
  try {
    const fileName = `image_${generateId()}_${Date.now()}.jpg`;
    const destinationUri = `${FileSystem.documentDirectory}${fileName}`;
    
    await FileSystem.copyAsync({
      from: uri,
      to: destinationUri
    });
    
    return destinationUri;
  } catch (error) {
    console.error('Erro ao copiar imagem:', error);
    throw error;
  }
};

export const deleteFile = async (uri: string): Promise<void> => {
  try {
    if (!uri.startsWith('file://')) {
      return; // Não é uma URI de arquivo local
    }
    
    const fileInfo = await FileSystem.getInfoAsync(uri);
    if (fileInfo.exists) {
      await FileSystem.deleteAsync(uri);
    }
  } catch (error) {
    console.error('Erro ao excluir arquivo:', error);
  }
};
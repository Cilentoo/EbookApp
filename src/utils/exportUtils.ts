import * as FileSystem from 'expo-file-system';

export const convertImageToBase64 = async (uri: string): Promise<string | null> => {
  try {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64;
  } catch (error) {
    console.error('Error converting image to base64:', error);
    return null;
  }
};

export const generateExportFileName = (title: string): string => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const sanitizedTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  return `${sanitizedTitle}_${timestamp}.json`;
};

export const sanitizeExportData = (data: any): any => {
  return JSON.parse(JSON.stringify(data));
};

export const validateExportData = (data: any): boolean => {
  return (
    data &&
    data.book &&
    data.chapters &&
    Array.isArray(data.chapters) &&
    typeof data.book === 'object'
  );
};

export const cleanupExportData = (data: any): any => {
  const clean = { ...data };

  // Remove campos temporários ou sensíveis
  if (clean.book) {
    delete clean.book.tempData;
    delete clean.book.sensitiveInfo;
  }

  if (clean.chapters) {
    clean.chapters = clean.chapters.map((chapter: any) => {
      const cleanChapter = { ...chapter };
      delete cleanChapter.tempData;
      return cleanChapter;
    });
  }

  return clean;
};

export const generateExportMetadata = () => {
  return {
    version: '1.0',
    exportDate: new Date().toISOString(),
    platform: 'love-books',
  };
};

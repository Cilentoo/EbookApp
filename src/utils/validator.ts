export const validateUsername = (username: string): boolean => {
  return username.length >= 3;
};

export const validateBook = (title: string, description: string): boolean => {
  return title.trim().length > 0 && description.trim().length > 0;
};

export const validateChapter = (title: string, content: string): boolean => {
  return title.trim().length > 0 && content.trim().length > 0;
};

export const validateComment = (text: string): boolean => {
  return text.trim().length > 0 && text.trim().length <= 500;
};

export const validateBookData = (book: any): boolean => {
  return (
    book &&
    typeof book.title === 'string' &&
    book.title.trim().length >= 1 &&
    book.title.trim().length <= 100 &&
    (!book.description || book.description.length <= 500)
  );
};

export const validateChapterData = (chapter: any): boolean => {
  return (
    chapter &&
    typeof chapter.title === 'string' &&
    chapter.title.trim().length >= 1 &&
    chapter.title.trim().length <= 100 &&
    typeof chapter.content === 'string' &&
    chapter.content.trim().length >= 1 &&
    (!chapter.images || Array.isArray(chapter.images))
  );
};

export const validateImageFormat = (uri: string): boolean => {
  const validExtensions = ['.jpg', '.jpeg', '.png'];
  const ext = uri.toLowerCase().split('.').pop();
  return validExtensions.includes(`.${ext}`);
};

export const validateFileSize = (size: number): boolean => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  return size <= maxSize;
};

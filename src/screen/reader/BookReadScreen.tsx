import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useBooks } from '../../context/BookContext';
import Header from '../../components/Header';
import BookCover from '../../components/BookCover';
import ChapterList from '../../components/ChapterList';
import RatingSystem from '../../components/RatingSystem';
import { deleteBook } from '../../services/bookService';

const BookReadScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { bookId } = route.params as { bookId: string };
  const { selectedBook, chapters, selectBook, loadChapters } = useBooks();

  useEffect(() => {
    loadChapters(bookId);
  }, [bookId]);

  useEffect(() => {
    selectBook(bookId);
  }, [bookId]);

  const handleChapterSelect = (chapter) => {
    navigation.navigate('ChapterRead', { 
      bookId: bookId,
      chapterId: chapter.id 
    });
  };

   const handleDelete = async () => {
      Alert.alert(
        'Confirmar exclusão',
        'Tem certeza que deseja excluir este livro?',
        [
          { text: 'Cancelar' },
          {
            text: 'Excluir',
            style: 'destructive',
            onPress: async () => {
              try {
                await deleteBook(bookId);
                navigation.goBack();
              } catch (error) {
                Alert.alert('Erro', 'Não foi possível excluir o livro.');
              }
            },
          },
        ]
      );
    };

  return (
    <View style={styles.container}>
      <Header
        title={selectedBook?.title || ''}
        showBackButton
        onBack={() => navigation.goBack()}
        rightIcon="trash"
        rightAction={handleDelete}
      />
      
        <BookCover coverUri={selectedBook?.coverImage} />
        
        {selectedBook?.metadata?.rating && (
          <RatingSystem 
            initialValue={selectedBook.metadata.rating}
            readonly
          />
        )}
        
        <ChapterList
          chapters={chapters}
          onSelectChapter={handleChapterSelect}
        />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 15,
  },
});

export default BookReadScreen;

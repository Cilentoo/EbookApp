import React, { useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useBooks } from '../../context/BookContext';
import Header from '../../components/Header';
import BookEditor from '../../components/BookEditor';
import { Book } from '../../models/Book';

const BookEditScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { bookId } = route.params as { bookId: string };
  const { selectedBook, selectBook, updateBook, deleteBook } = useBooks();

  useEffect(() => {
    selectBook(bookId);
  }, [bookId]);

  const handleSave = async (bookData: Partial<Book>) => {
    try {
      await updateBook(bookId, bookData);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o livro.');
    }
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
        title="Editar Livro"
        showBackButton
        onBack={() => navigation.goBack()}
        rightIcon="trash"
        rightAction={handleDelete}
      />
      
      {selectedBook && (
        <BookEditor
          book={selectedBook}
          onSave={handleSave}
          onCancel={() => navigation.goBack()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default BookEditScreen;

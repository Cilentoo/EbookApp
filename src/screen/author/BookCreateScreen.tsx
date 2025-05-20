import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useBooks } from '../../context/BookContext';
import Header from '../../components/Header';
import BookEditor from '../../components/BookEditor';
import { Book } from '../../models/Book';

const BookCreateScreen: React.FC = () => {
  const navigation = useNavigation();
  const { createBook } = useBooks();

  const handleSave = async (bookData: Partial<Book>) => {
    try {
      const newBook = await createBook(bookData);
      navigation.navigate('ChapterCreate', { bookId: newBook.id });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível criar o livro.');
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Novo Livro"
        showBackButton
        onBack={() => navigation.goBack()}
      />
      
      <BookEditor
        onSave={handleSave}
        onCancel={() => navigation.goBack()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default BookCreateScreen;

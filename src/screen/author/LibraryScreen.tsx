import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useBooks } from '../../context/BookContext';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header';
import BookCard from '../../components/BookCard';
import { Book } from '../../models/Book';

const LibraryScreen: React.FC = () => {
  const navigation = useNavigation();
  const { books, loadBooks } = useBooks();
  const { user } = useAuth();

  useEffect(() => {
    loadBooks();
  }, []);

  const myBooks = books.filter(book => book.authorId === user?.id);

  const handleBookSelect = (book: Book) => {
    navigation.navigate('BookEdit', { bookId: book.id });
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Meus Livros"
        rightIcon="add-circle"
        rightAction={() => navigation.navigate('BookCreate')}
      />
      
      <FlatList
        data={myBooks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BookCard book={item} onPress={handleBookSelect} />
        )}
        numColumns={2}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  list: {
    padding: 15,
  },
});

export default LibraryScreen;

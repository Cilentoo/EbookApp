import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useBooks } from '../../context/BookContext';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header';
import BookCard from '../../components/BookCard';
import { Book } from '../../models/Book';
import { UserRole } from '../../models/User';
import { RefreshControl } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

const LibraryScreen: React.FC = () => {
  const navigation = useNavigation();
  const { books, loadBooks } = useBooks();
  const { user } = useAuth();

  const isAuthor = user?.role === UserRole.AUTHOR;

  useEffect(() => {
    loadBooks();
  }, []);

  const filteredBooks = isAuthor
    ? books.filter((b) => b.authorId === user.id)
    : books;

  const handlePress = (book: Book) => {
    if (isAuthor) {
      navigation.navigate('BookEdit', { bookId: book.id });
    } else {
      navigation.navigate('BookRead', { bookId: book.id });
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title={isAuthor ? 'Meus Livros' : 'Biblioteca'}
        rightIcon={isAuthor ? 'add-circle' : 'cloud-download'}
        rightAction={() =>
          isAuthor
            ? navigation.navigate('BookCreate')
            : navigation.navigate('BookImport')
        }
      />

      <Button 
        title= "Conta"
        onPress={() => navigation.navigate('Profile')}
      />

    <FlatList
        data={filteredBooks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
        <BookCard book={item} onPress={() => handlePress(item)} />
        )}
        numColumns={2}
        contentContainerStyle={styles.list}
        refreshControl={
        <RefreshControl refreshing={false} onRefresh={loadBooks} />
        }
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
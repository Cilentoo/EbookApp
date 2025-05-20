import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useBooks } from '../../context/BookContext';
import { useRoute, useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';

const ChapterListScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { bookId } = route.params as { bookId: string };
  const { chapters, loadChapters, selectedBook } = useBooks();

  useEffect(() => {
    loadChapters(bookId);
  }, [bookId]);

  const handleSelect = (chapterId: string) => {
    navigation.navigate('ChapterEdit', { bookId, chapterId });
  };

  return (
    <View style={styles.container}>
      <Header
        title="Capítulos"
        showBackButton
        onBack={() => navigation.goBack()}
        rightIcon="add-circle"
        rightAction={() => navigation.navigate('ChapterCreate', { bookId })}
      />

      <FlatList
        data={chapters}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => handleSelect(item.id)}
          >
            <Text style={styles.title}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  item: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChapterListScreen;

import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useBooks } from '../../context/BookContext';
import Header from '../../components/Header';
import CommentBox from '../../components/CommentBox';

const ChapterReadScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { bookId, chapterId } = route.params as { bookId: string; chapterId: string };
  const { selectedChapter, comments, selectChapter, loadComments, addComment } = useBooks();

  useEffect(() => {
    selectChapter(chapterId);
    loadComments(bookId, chapterId);
  }, [chapterId]);

  return (
    <View style={styles.container}>
      <Header
        title={selectedChapter?.title || ''}
        showBackButton
        onBack={() => navigation.goBack()}
      />
      
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.chapterContent}>
          {selectedChapter?.content}
        </Text>
        
        <CommentBox
          comments={comments}
          bookId={bookId}
          chapterId={chapterId}
          onAddComment={addComment}
        />
      </ScrollView>
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
  chapterContent: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
});

export default ChapterReadScreen;

import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useBooks } from '../../context/BookContext';
import Header from '../../components/Header';
import CommentBox from '../../components/CommentBox';

const CommentScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { bookId, chapterId } = route.params as { bookId: string; chapterId: string };
  const { comments, loadComments, addComment } = useBooks();

  useEffect(() => {
    loadComments(bookId, chapterId);
  }, [bookId, chapterId]);

  return (
    <View style={styles.container}>
      <Header
        title="Comentários"
        showBackButton
        onBack={() => navigation.goBack()}
      />
      
      <CommentBox
        comments={comments}
        bookId={bookId}
        chapterId={chapterId}
        onAddComment={addComment}
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

export default CommentScreen;

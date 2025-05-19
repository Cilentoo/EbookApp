import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity,
  FlatList,
  Alert
} from 'react-native';
import { Comment } from '../models/Comment';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

interface CommentBoxProps {
  comments: Comment[];
  bookId: string;
  chapterId: string;
  onAddComment: (text: string, bookId: string, chapterId: string) => Promise<void>;
}

const CommentBox: React.FC<CommentBoxProps> = ({
  comments,
  bookId,
  chapterId,
  onAddComment,
}) => {
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmitComment = async () => {
    if (!commentText.trim()) {
      return;
    }

    if (!user) {
      Alert.alert('Erro', 'Você precisa estar logado para comentar.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onAddComment(commentText.trim(), bookId, chapterId);
      setCommentText('');
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
      Alert.alert('Erro', 'Não foi possível adicionar o comentário.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCommentItem = ({ item }: { item: Comment }) => {
    // Formatar data
    const commentDate = new Date(item.createdAt);
    const formattedDate = `${commentDate.toLocaleDateString()} às ${commentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    return (
      <View style={styles.commentItem}>
        <Text style={styles.commentText}>{item.text}</Text>
        <Text style={styles.commentDate}>{formattedDate}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Comentários</Text>
        <Text style={styles.count}>{comments.length}</Text>
      </View>

      {comments.length > 0 ? (
        <FlatList
          data={comments}
          keyExtractor={(item) => item.id}
          renderItem={renderCommentItem}
          style={styles.commentsList}
          contentContainerStyle={styles.commentsContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Ainda não há comentários.</Text>
          <Text style={styles.emptySubtext}>Seja o primeiro a comentar!</Text>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Escreva um comentário..."
          value={commentText}
          onChangeText={setCommentText}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            (!commentText.trim() || isSubmitting) && styles.sendButtonDisabled
          ]}
          onPress={handleSubmitComment}
          disabled={!commentText.trim() || isSubmitting}
        >
          <Ionicons
            name="send"
            size={20}
            color={(!commentText.trim() || isSubmitting) ? '#ccc' : '#fff'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    marginVertical: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  count: {
    marginLeft: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    fontSize: 12,
    color: '#666',
  },
  commentsList: {
    flex: 1,
  },
  commentsContent: {
    paddingBottom: 10,
  },
  commentItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#4CAF50',
  },
  commentText: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  commentDate: {
    fontSize: 12,
    color: '#999',
    alignSelf: 'flex-end',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#999',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  emptySubtext: {
    color: '#999',
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    marginTop: 10,
    padding: 5,
    borderWidth: 1,
    borderColor: '#eee',
  },
  input: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 8,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#4CAF50',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#f0f0f0',
  },
});

export default CommentBox;
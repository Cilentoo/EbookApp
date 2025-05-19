import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Book } from '../models/Book';
import { useAuth } from '../context/AuthContext';

interface BookCardProps {
  book: Book;
  onPress: (book: Book) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onPress }) => {
  const { isAuthor } = useAuth();
  
  const placeholderImage = require('../../assets/book-placeholder.png');
  
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(book)}
      activeOpacity={0.7}
    >
      <View style={styles.card}>
        <Image
          source={book.coverImage ? { uri: book.coverImage } : placeholderImage}
          style={styles.cover}
          resizeMode="cover"
        />
        <View style={styles.infoContainer}>
          <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
            {book.title}
          </Text>
          
          {book.metadata?.rating && (
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>
                ★ {book.metadata.rating.toFixed(1)}
              </Text>
            </View>
          )}
          
          {isAuthor() && (
            <Text style={styles.editLabel}>
              Toque para editar
            </Text>
          )}
          
          {!isAuthor() && (
            <Text style={styles.editLabel}>
              Toque para ler
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '48%',
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cover: {
    width: '100%',
    height: 180,
    backgroundColor: '#f0f0f0'
  },
  infoContainer: {
    padding: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    color: '#FF9529',
    fontWeight: 'bold',
  },
  editLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  }
});

export default BookCard;
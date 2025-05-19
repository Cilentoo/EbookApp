import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BookCoverProps {
  coverUri?: string;
  onSelectImage?: () => void;
  editable?: boolean;
}

const BookCover: React.FC<BookCoverProps> = ({ 
  coverUri, 
  onSelectImage,
  editable = false
}) => {
  const placeholderImage = require('../../assets/book-placeholder.png');
  
  return (
    <View style={styles.container}>
      <Image
        source={coverUri ? { uri: coverUri } : placeholderImage}
        style={styles.cover}
        resizeMode="cover"
      />
      
      {editable && (
        <TouchableOpacity 
          style={styles.editButton}
          onPress={onSelectImage}
        >
          <View style={styles.editButtonInner}>
            <Ionicons name="camera" size={20} color="#fff" />
            <Text style={styles.editText}>Alterar capa</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 250,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 15,
    position: 'relative',
  },
  cover: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 12,
  },
  editButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: 'bold',
  }
});

export default BookCover;
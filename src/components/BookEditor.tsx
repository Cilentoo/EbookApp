import React, { useState, useEffect } from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  TouchableOpacity,
  Text,
  Alert
} from 'react-native';
import BookCover from './BookCover';
import { Book } from '../models/Book';
import { pickImage, copyImageToAppDirectory } from '../utils/fileUtils';
import { useAuth } from '../context/AuthContext';

interface BookEditorProps {
  book?: Book;
  onSave: (bookData: Partial<Book>) => void;
  onCancel: () => void;
}

const BookEditor: React.FC<BookEditorProps> = ({ 
  book, 
  onSave,
  onCancel 
}) => {
  const { user } = useAuth();
  const [title, setTitle] = useState(book?.title || '');
  const [description, setDescription] = useState(book?.descriptionId || '');
  const [coverImage, setCoverImage] = useState<string | undefined>(book?.coverImage);
  const [tempCoverImage, setTempCoverImage] = useState<string | undefined>(undefined);

  const isEditing = !!book;

  const handleSelectCover = async () => {
    try {
      const imageUri = await pickImage();
      if (imageUri) {
        setTempCoverImage(imageUri);
      }
    } catch (error) {
      console.error('Erro ao selecionar capa:', error);
      Alert.alert('Erro', 'Não foi possível selecionar a imagem.');
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Erro', 'Por favor, informe o título do livro.');
      return;
    }

    try {
      // Processar imagem de capa, se foi selecionada uma nova
      let finalCoverImage = coverImage;
      if (tempCoverImage) {
        finalCoverImage = await copyImageToAppDirectory(tempCoverImage);
      }

      const bookData: Partial<Book> = {
        title: title.trim(),
        descriptionId: description.trim(),
        coverImage: finalCoverImage,
      };

      // Se estamos criando um novo livro, adicionar o ID do autor
      if (!isEditing) {
        bookData.authorId = user?.id || '';
      }

      onSave(bookData);
    } catch (error) {
      console.error('Erro ao salvar livro:', error);
      Alert.alert('Erro', 'Não foi possível salvar o livro.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <BookCover 
          coverUri={tempCoverImage || coverImage} 
          onSelectImage={handleSelectCover}
          editable={true}
        />
        
        <TextInput
          style={styles.titleInput}
          placeholder="Título do livro"
          value={title}
          onChangeText={setTitle}
          maxLength={100}
        />
        
        <TextInput
          style={styles.descriptionInput}
          placeholder="Descrição (opcional)"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          maxLength={500}
        />
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={onCancel}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, styles.saveButton]}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>
              {isEditing ? 'Atualizar Livro' : 'Criar Livro'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
  },
  titleInput: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  descriptionInput: {
    minHeight: 100,
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#f2f2f2',
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    marginLeft: 10,
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default BookEditor;
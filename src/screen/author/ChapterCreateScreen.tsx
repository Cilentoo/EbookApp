import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  TextInput, 
  ScrollView, 
  TouchableOpacity, 
  Text,
  Alert 
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useBooks } from '../../context/BookContext';
import Header from '../../components/Header';
import { pickImage } from '../../utils/fileUtils';

const ChapterCreateScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { bookId } = route.params as { bookId: string };
  const { createChapter } = useBooks();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const handleAddImage = async () => {
    const imageUri = await pickImage();
    if (imageUri) {
      setImages([...images, imageUri]);
    }
  };

  const handleSave = async () => {
    try {
      if (!title.trim() || !content.trim()) {
        Alert.alert('Erro', 'Preencha título e conteúdo');
        return;
      }

      await createChapter({
        bookId,
        title: title.trim(),
        content: content.trim(),
        images,
        order: 0
      });
      
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível criar o capítulo');
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Novo Capítulo"
        showBackButton
        onBack={() => navigation.goBack()}
      />
      
      <ScrollView style={styles.content}>
        <TextInput
          style={styles.titleInput}
          placeholder="Título do capítulo"
          value={title}
          onChangeText={setTitle}
        />
        
        <TextInput
          style={styles.contentInput}
          placeholder="Conteúdo do capítulo"
          value={content}
          onChangeText={setContent}
          multiline
        />
        
        <TouchableOpacity style={styles.imageButton} onPress={handleAddImage}>
          <Text style={styles.imageButtonText}>Adicionar Imagem</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Salvar Capítulo</Text>
        </TouchableOpacity>
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
  titleInput: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
  },
  contentInput: {
    minHeight: 200,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
    textAlignVertical: 'top',
  },
  imageButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  imageButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default ChapterCreateScreen;

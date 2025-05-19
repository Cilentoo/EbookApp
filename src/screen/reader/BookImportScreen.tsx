import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';
import * as importService from '../../services/importService';

const BookImportScreen: React.FC = () => {
  const [isImporting, setIsImporting] = useState(false);
  const navigation = useNavigation();

  const handleImport = async () => {
    try {
      setIsImporting(true);
      const importData = await importService.selectImportFile();
      const newBookId = await importService.importBook(importData);
      
      Alert.alert(
        'Sucesso',
        'Livro importado com sucesso!',
        [
          {
            text: 'Ler agora',
            onPress: () => navigation.navigate('BookRead', { bookId: newBookId })
          },
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível importar o livro.');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Importar Livro"
        showBackButton
        onBack={() => navigation.goBack()}
      />
      
      <View style={styles.content}>
        <TouchableOpacity 
          style={styles.importButton}
          onPress={handleImport}
          disabled={isImporting}
        >
          <Text style={styles.importButtonText}>
            {isImporting ? 'Importando...' : 'Selecionar arquivo'}
          </Text>
        </TouchableOpacity>
        
        <Text style={styles.helpText}>
          Selecione um arquivo .json exportado do Love Books
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  importButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 20,
  },
  importButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  helpText: {
    color: '#666',
    textAlign: 'center',
  },
});

export default BookImportScreen;

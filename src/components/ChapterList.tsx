import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity 
} from 'react-native';
import { Chapter } from '../models/Chapter';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

interface ChapterListProps {
  chapters: Chapter[];
  currentChapterId?: string;
  onSelectChapter: (chapter: Chapter) => void;
  onAddChapter?: () => void;
  onEditChapter?: (chapter: Chapter) => void;
}

const ChapterList: React.FC<ChapterListProps> = ({
  chapters,
  currentChapterId,
  onSelectChapter,
  onAddChapter,
  onEditChapter,
}) => {
  const { isAuthor } = useAuth();
  
  const renderChapterItem = ({ item }: { item: Chapter }) => {
    const isActive = item.id === currentChapterId;
    
    return (
      <TouchableOpacity
        style={[
          styles.chapterItem,
          isActive && styles.activeChapterItem
        ]}
        onPress={() => onSelectChapter(item)}
      >
        <Text 
          style={[
            styles.chapterTitle,
            isActive && styles.activeChapterTitle
          ]}
          numberOfLines={2}
        >
          {item.title}
        </Text>
        
        {isAuthor() && onEditChapter && (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => onEditChapter(item)}
          >
            <Ionicons name="pencil" size={16} color="#666" />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Capítulos</Text>
        
        {isAuthor() && onAddChapter && (
          <TouchableOpacity 
            style={styles.addButton}
            onPress={onAddChapter}
          >
            <Ionicons name="add-circle" size={24} color="#4CAF50" />
            <Text style={styles.addButtonText}>Novo</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {chapters.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {isAuthor() 
              ? 'Adicione seu primeiro capítulo!'
              : 'Este livro ainda não tem capítulos.'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={chapters}
          keyExtractor={(item) => item.id}
          renderItem={renderChapterItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      )}
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
    justifyContent: 'space-between',
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
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#4CAF50',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  listContent: {
    paddingBottom: 10,
  },
  chapterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 6,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: 'transparent',
  },
  activeChapterItem: {
    borderLeftColor: '#4CAF50',
    backgroundColor: '#f0f9f0',
  },
  chapterTitle: {
    flex: 1,
    fontSize: 15,
  },
  activeChapterTitle: {
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  editButton: {
    padding: 5,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#999',
    fontStyle: 'italic',
  },
});

export default ChapterList;
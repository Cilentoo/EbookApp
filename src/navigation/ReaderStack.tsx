import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LibraryScreen from '../screen/reader/LibraryScreen';
import BookReadScreen from '../screen/reader/BookReadScreen';
import ChapterReadScreen from '../screen/reader/ChapterReadScreen';
import CommentScreen from '../screen/reader/CommentScreen';
import BookImportScreen from '../screen/reader/BookImportScreen';

export type ReaderStackParamList = {
  Library: undefined;
  BookRead: { bookId: string };
  ChapterRead: { bookId: string; chapterId: string };
  Comment: { bookId: string; chapterId: string };
  BookImport: undefined;
};

const Stack = createNativeStackNavigator<ReaderStackParamList>();

const ReaderStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right'
      }}
    >
      <Stack.Screen name="Library" component={LibraryScreen} />
      <Stack.Screen name="BookRead" component={BookReadScreen} />
      <Stack.Screen name="ChapterRead" component={ChapterReadScreen} />
      <Stack.Screen name="Comment" component={CommentScreen} />
      <Stack.Screen name="BookImport" component={BookImportScreen} />
    </Stack.Navigator>
  );
};

export default ReaderStack;

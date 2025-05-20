import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LibraryScreen from '../screen/shared/LibraryScreen';
import BookReadScreen from '../screen/reader/BookReadScreen';
import ChapterReadScreen from '../screen/reader/ChapterReadScreen';
import CommentScreen from '../screen/reader/CommentScreen';
import BookImportScreen from '../screen/reader/BookImportScreen';
import ProfileScreen from '../screen/auth/ProfileScreen';

export type ReaderStackParamList = {
  Library: undefined;
  BookRead: { bookId: string };
  ChapterRead: { bookId: string; chapterId: string };
  Comment: { bookId: string; chapterId: string };
  BookImport: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<ReaderStackParamList>();

const ReaderStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Library" component={LibraryScreen} />
      <Stack.Screen name="BookRead" component={BookReadScreen} />
      <Stack.Screen name="ChapterRead" component={ChapterReadScreen} />
      <Stack.Screen name="Comment" component={CommentScreen} />
      <Stack.Screen name="BookImport" component={BookImportScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

export default ReaderStack;
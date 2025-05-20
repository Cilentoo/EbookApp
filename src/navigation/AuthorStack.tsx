import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LibraryScreen from '../screen/shared/LibraryScreen';
import BookCreateScreen from '../screen/author/BookCreateScreen';
import BookEditScreen from '../screen/author/BookEditScreen';
import ChapterCreateScreen from '../screen/author/ChapterCreateScreen';
import ChapterEditScreen from '../screen/author/ChapterEditScreen';
import ProfileScreen from '../screen/auth/ProfileScreen';
import ChapterListScreen from '../screen/author/ChapterListScreen';

export type AuthorStackParamList = {
  Library: undefined;
  BookCreate: undefined;
  BookEdit: { bookId: string };
  ChapterCreate: { bookId: string };
  ChapterEdit: { bookId: string; chapterId: string };
  Profile: undefined;
  ChapterList: { bookId: string };
};

const Stack = createNativeStackNavigator<AuthorStackParamList>();

const AuthorStack: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right'
      }}
    >
      <Stack.Screen name="Library" component={LibraryScreen} />
      <Stack.Screen name="BookCreate" component={BookCreateScreen} />
      <Stack.Screen name="BookEdit" component={BookEditScreen} />
      <Stack.Screen name="ChapterCreate" component={ChapterCreateScreen} />
      <Stack.Screen name="ChapterEdit" component={ChapterEditScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="ChapterList" component={ChapterListScreen} />
    </Stack.Navigator>
  );
};

export default AuthorStack;

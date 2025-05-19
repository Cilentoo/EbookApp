import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { BookProvider } from './src/context/BookContext';
import AppNavigation from './src/navigation';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <BookProvider>
          <AppNavigation />
        </BookProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import AuthStack from './AuthStack';
import AuthorStack from './AuthorStack';
import ReaderStack from './ReaderStack';
import { LoadingScreen } from '../screen/utils/LoadingScreen';
import { UserRole } from '../models/User';

export type RootStackParamList = {
  Auth: undefined;
  Author: undefined;
  Reader: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigation: React.FC = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <Stack.Screen name="Auth" component={AuthStack} />
        ) : user.role === UserRole.AUTHOR ? (
          <Stack.Screen name="Author" component={AuthorStack} />
        ) : (
          <Stack.Screen name="Reader" component={ReaderStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
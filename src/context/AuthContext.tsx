import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, PREDEFINED_USERS, UserRole } from '../models/User';

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn: (username: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthor: () => boolean;
  isReader: () => boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStoredUser() {
      try {
        const storedUser = await AsyncStorage.getItem('@LoveBooks:user');
        
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
      } finally {
        setLoading(false);
      }
    }

    loadStoredUser();
  }, []);

  const signIn = async (username: string) => {
    try {
      const foundUser = PREDEFINED_USERS.find(u => u.username === username);
      
      if (!foundUser) {
        throw new Error('Usuário não encontrado');
      }

      await AsyncStorage.setItem('@LoveBooks:user', JSON.stringify(foundUser));
      setUser(foundUser);
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('@LoveBooks:user');
      setUser(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    }
  };

  const isAuthor = () => user?.role === UserRole.AUTHOR;
  const isReader = () => user?.role === UserRole.READER;

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signIn, 
      signOut,
      isAuthor,
      isReader
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
}
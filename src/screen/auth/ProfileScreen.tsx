import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigation = useNavigation();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Header 
        title="Perfil" 
        showBackButton 
        onBack={() => navigation.goBack()} 
      />

      <View style={styles.content}>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Nome de exibição</Text>
          <Text style={styles.value}>{user?.displaysName}</Text>

          <Text style={styles.label}>Nome de usuário</Text>
          <Text style={styles.value}>{user?.username}</Text>

          <Text style={styles.label}>Tipo de conta</Text>
          <Text style={styles.value}>
            {user?.role === 'AUTHOR' ? 'Autor' : 'Leitor'}
          </Text>
        </View>

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sair da conta</Text>
        </TouchableOpacity>
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
  },
  infoContainer: {
    marginBottom: 40,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  signOutButton: {
    backgroundColor: '#f44336',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  signOutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;

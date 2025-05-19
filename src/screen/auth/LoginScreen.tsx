import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import { useAuth } from '../../context/AuthContext';

const LoginScreen: React.FC = () => {
  const [username, setUsername] = useState('');
  const { signIn } = useAuth();

  const handleLogin = async () => {
    try {
      if (!username.trim()) {
        Alert.alert('Erro', 'Por favor, informe seu nome de usuário');
        return;
      }
      
      await signIn(username.trim());
    } catch (error) {
      Alert.alert('Erro', 'Usuário não encontrado');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Love Books</Text>
      <Text style={styles.subtitle}>Compartilhe sua paixão por histórias</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Nome de usuário"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#4CAF50',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 40,
  },
  form: {
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;

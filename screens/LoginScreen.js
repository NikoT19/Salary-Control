import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function LoginScreen({ navigation }) {
  const [password, setPassword] = useState('');
  const [storedPassword, setStoredPassword] = useState(null);

  useEffect(() => {
    const loadPassword = async () => {
      try {
        const savedPassword = await AsyncStorage.getItem('password');
        setStoredPassword(savedPassword);
      } catch (error) {
        console.error("Ошибка при загрузке пароля:", error);
      }
    };

    loadPassword();
  }, []);

  // Обработчик логина
  const handleLogin = async () => {
    if (password === storedPassword) {
      navigation.replace('Categories'); // Переход к экрану категорий
    } else {
      Alert.alert('Неверный пароль', 'Пожалуйста, введите правильный пароль.');
    }
  };

  // Обработчик регистрации (устанавливает новый пароль)
  const handleRegister = async () => {
    if (password.length < 6) {
      Alert.alert('Пароль слишком короткий', 'Пароль должен содержать хотя бы 6 символов.');
      return;
    }

    try {
      await AsyncStorage.setItem('password', password);
      Alert.alert('Пароль установлен', 'Теперь используйте этот пароль для входа.');
    } catch (error) {
      console.error("Ошибка при сохранении пароля:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Введите пароль</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        placeholder="Введите пароль"
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Войти" onPress={handleLogin} />
      <Button title="Зарегистрировать пароль" onPress={handleRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});

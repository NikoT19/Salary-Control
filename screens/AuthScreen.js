import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AuthScreen({ navigation }) {
  const [isLogin, setIsLogin] = useState(true); // Состояние для переключения между входом и регистрацией
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  // Обработчик отправки формы
  const handleSubmit = async () => {
    if (isLogin) {
      // Если вход, проверяем данные в AsyncStorage
      const userData = await AsyncStorage.getItem('user');
      const user = userData ? JSON.parse(userData) : null;

      if (user && user.name === name && user.password === password) {
        navigation.replace('Home'); // Перенаправляем на главную страницу
      } else {
        Alert.alert('Ошибка', 'Неверное имя или пароль');
      }
    } else {
      // Если регистрация, сохраняем данные в AsyncStorage
      const user = { name, password };
      await AsyncStorage.setItem('user', JSON.stringify(user));
      navigation.replace('Home'); // Перенаправляем на главную страницу
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Введите имя"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Введите пароль"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title={isLogin ? 'Войти' : 'Зарегистрироваться'} onPress={handleSubmit} />

      <Text onPress={() => setIsLogin(!isLogin)} style={styles.toggleText}>
        {isLogin ? 'Нет аккаунта? Зарегистрируйтесь' : 'Уже есть аккаунт? Войдите'}
      </Text>
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
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  toggleText: {
    marginTop: 10,
    color: 'blue',
  },
});

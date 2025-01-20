import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import CategoriesScreen from './screens/CategoriesScreen';
import StatisticsScreen from './screens/StatisticsScreen';

const Stack = createStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Проверяем, сохранен ли пароль
  useEffect(() => {
    const checkPassword = async () => {
      try {
        const savedPassword = await AsyncStorage.getItem('password');
        if (savedPassword) {
          setIsLoggedIn(true); // Если пароль сохранен, показываем основной экран
        } else {
          setIsLoggedIn(false); // Иначе показываем экран логина
        }
      } catch (error) {
        console.error("Ошибка при проверке пароля:", error);
      }
    };

    checkPassword();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isLoggedIn ? "Categories" : "Login"}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Categories" component={CategoriesScreen} />
        <Stack.Screen name="Statistics" component={StatisticsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

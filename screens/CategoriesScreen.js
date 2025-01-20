import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CategoriesScreen({ navigation }) {
  const [salary, setSalary] = useState('');
  const [expense, setExpense] = useState({
    food: 0,
    transport: 0,
    entertainment: 0,
    daily: 0,
  });

  // Загружаем сохраненные данные при монтировании компонента
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedSalary = await AsyncStorage.getItem('salary');
        const savedExpense = await AsyncStorage.getItem('expense');
        
        if (savedSalary) setSalary(savedSalary);
        if (savedExpense) setExpense(JSON.parse(savedExpense));
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      }
    };

    loadData();
  }, []);

  // Обработчик изменения расходов
  const handleExpenseChange = (category, value) => {
    setExpense((prev) => {
      const newExpense = { ...prev, [category]: parseFloat(value) || 0 };
      return newExpense;
    });
  };

  // Сохранение данных в AsyncStorage
  const saveData = async () => {
    try {
      await AsyncStorage.setItem('salary', salary);
      await AsyncStorage.setItem('expense', JSON.stringify(expense));
      Alert.alert('Данные сохранены!');
    } catch (error) {
      console.error("Ошибка при сохранении данных:", error);
    }
  };

  // Общие расходы и остаток бюджета
  const totalExpense = Object.values(expense).reduce((acc, curr) => acc + curr, 0);
  const remainingBudget = parseFloat(salary) - totalExpense;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Категории расходов</Text>

      <Text>Зарплата:</Text>
      <TextInput
        style={styles.input}
        placeholder="Введите сумму зарплаты"
        keyboardType="numeric"
        value={salary}
        onChangeText={setSalary}
      />

      <Text>Расходы:</Text>
      <TextInput
        style={styles.input}
        placeholder="Еда"
        keyboardType="numeric"
        value={expense.food.toString()}
        onChangeText={(text) => handleExpenseChange('food', text)}
      /><Text>Транспорт:</Text>
      <TextInput
        style={styles.input}
        placeholder="Транспорт"
        keyboardType="numeric"
        value={expense.transport.toString()}
        onChangeText={(text) => handleExpenseChange('transport', text)}
      /><Text>Развлечения:</Text>
      <TextInput
        style={styles.input}
        placeholder="Развлечения"
        keyboardType="numeric"
        value={expense.entertainment.toString()}
        onChangeText={(text) => handleExpenseChange('entertainment', text)}
      /><Text>Повседневные:</Text>
      <TextInput
        style={styles.input}
        placeholder="Повседневные расходы"
        keyboardType="numeric"
        value={expense.daily.toString()}
        onChangeText={(text) => handleExpenseChange('daily', text)}
      />

      <Text style={styles.total}>Общие расходы: {totalExpense} ₽</Text>
      <Text style={styles.remaining}>Остаток бюджета: {remainingBudget} ₽</Text>

      <Button title="Сохранить" onPress={saveData} />
      <Button
        title="Перейти к статистике"
        onPress={() => navigation.navigate('Statistics')}
      />
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
  total: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
  remaining: {
    marginTop: 10,
    fontSize: 18,
    color: 'green',
  },
});

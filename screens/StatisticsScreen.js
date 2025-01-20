import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, StyleSheet, ScrollView, Alert } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function StatisticsScreen({ navigation }) { // Получаем доступ к навигации
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
      saveData(newExpense); // Сохраняем данные после каждого изменения
      return newExpense;
    });
  };

  // Сохранение данных в AsyncStorage
  const saveData = async (newExpense) => {
    try {
      await AsyncStorage.setItem('salary', salary);
      await AsyncStorage.setItem('expense', JSON.stringify(newExpense));
    } catch (error) {
      console.error("Ошибка при сохранении данных:", error);
    }
  };

  // Общие расходы и остаток бюджета
  const totalExpense = Object.values(expense).reduce((acc, curr) => acc + curr, 0);
  const remainingBudget = parseFloat(salary) - totalExpense;

  // Данные для кругового графика
  const data = [
    { name: 'Еда', population: expense.food, color: 'red', legendFontColor: '#000', legendFontSize: 15 },
    { name: 'Транспорт', population: expense.transport, color: 'blue', legendFontColor: '#000', legendFontSize: 15 },
    { name: 'Развлечения', population: expense.entertainment, color: 'green', legendFontColor: '#000', legendFontSize: 15 },
    { name: 'Повседневные расходы', population: expense.daily, color: 'yellow', legendFontColor: '#000', legendFontSize: 15 },
  ];

  // Легенда расходов
  const renderLegend = () => {
    return (
      <View style={styles.legendContainer}>
        {data.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendColorBox, { backgroundColor: item.color }]} />
            <Text style={styles.legendText}>{item.name}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Категории расходов</Text>

      <Text>Зарплата:</Text>
      <TextInput
        style={styles.input}
        placeholder="Введите сумму зарплаты"
        keyboardType="numeric"
        value={salary}
        onChangeText={setSalary}
        onBlur={() => saveData(expense)} // Сохраняем зарплату при потере фокуса
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

      <PieChart
        data={data}
        width={300}
        height={200}
        chartConfig={{
          backgroundColor: '#e26a00',
          backgroundGradientFrom: '#fb8c00',
          backgroundGradientTo: '#ffa726',
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
      />

      {renderLegend()}

      {/* Навигация на главный экран */}
      <Button
        title="Перейти к категориям расходов"
        onPress={() => navigation.navigate('Categories')}
      />
    </ScrollView>
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
  legendContainer: {
    marginTop: 20,
    padding: 10,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  legendColorBox: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  legendText: {
    fontSize: 16,
  },
});

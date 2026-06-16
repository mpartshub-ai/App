import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://10.0.2.2:4000/api';

export default function PaymentScreen() {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('card');
  const [targetType, setTargetType] = useState('ride');
  const [targetId, setTargetId] = useState('');
  const [receipt, setReceipt] = useState(null);

  async function handlePayment() {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await fetch(`${API_URL}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ amount: Number(amount), method, targetType, targetId })
      });
      const data = await response.json();
      if (!response.ok) {
        Alert.alert('Payment failed', data.error || 'Unable to process payment');
        return;
      }
      setReceipt(data);
      Alert.alert('Payment complete', `Paid ${data.amount}`);
    } catch (err) {
      Alert.alert('Network error', err.message);
    }
  }

  return (
    <View style={styles.container}>
      <TextInput placeholder="Amount" value={amount} onChangeText={setAmount} keyboardType="numeric" style={styles.input} />
      <TextInput placeholder="Payment method (card/wallet)" value={method} onChangeText={setMethod} style={styles.input} />
      <TextInput placeholder="Target type (ride/parcel)" value={targetType} onChangeText={setTargetType} style={styles.input} />
      <TextInput placeholder="Target ID (optional)" value={targetId} onChangeText={setTargetId} style={styles.input} />
      <Button title="Submit Payment" onPress={handlePayment} />
      {receipt ? (
        <View style={styles.receipt}>
          <Text style={styles.receiptTitle}>Receipt</Text>
          <Text>ID: {receipt.paymentId}</Text>
          <Text>Amount: {receipt.amount}</Text>
          <Text>Status: {receipt.status}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 12 },
  receipt: { marginTop: 20, padding: 16, backgroundColor: '#f0f9ff', borderRadius: 12 },
  receiptTitle: { fontWeight: 'bold', marginBottom: 8 }
});

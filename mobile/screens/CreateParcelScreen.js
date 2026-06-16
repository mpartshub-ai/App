import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://10.0.2.2:4000/api';

export default function CreateParcelScreen() {
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [size, setSize] = useState('');
  const [createdParcel, setCreatedParcel] = useState(null);

  async function createParcel() {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await fetch(`${API_URL}/parcels`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ recipientName, recipientPhone, pickupLocation, dropoffLocation, weightKg: Number(weightKg), size })
      });
      const data = await response.json();
      if (!response.ok) {
        Alert.alert('Create failed', data.error || 'Unable to create parcel');
        return;
      }
      setCreatedParcel(data);
      Alert.alert('Parcel created', `Barcode: ${data.barcode}`);
    } catch (err) {
      Alert.alert('Network error', err.message);
    }
  }

  return (
    <View style={styles.container}>
      <TextInput placeholder="Recipient Name" value={recipientName} onChangeText={setRecipientName} style={styles.input} />
      <TextInput placeholder="Recipient Phone" value={recipientPhone} onChangeText={setRecipientPhone} style={styles.input} keyboardType="phone-pad" />
      <TextInput placeholder="Pickup (lat,lng)" value={pickupLocation} onChangeText={setPickupLocation} style={styles.input} />
      <TextInput placeholder="Dropoff (lat,lng)" value={dropoffLocation} onChangeText={setDropoffLocation} style={styles.input} />
      <TextInput placeholder="Weight (kg)" value={weightKg} onChangeText={setWeightKg} style={styles.input} keyboardType="numeric" />
      <TextInput placeholder="Size description" value={size} onChangeText={setSize} style={styles.input} />
      <Button title="Create Parcel" onPress={createParcel} />
      {createdParcel ? (
        <View style={styles.result}>
          <Text style={styles.resultTitle}>Parcel Created</Text>
          <Text>Barcode: {createdParcel.barcode}</Text>
          <Text>Status: {createdParcel.status}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 12 },
  result: { marginTop: 20, padding: 14, backgroundColor: '#f8f8f8', borderRadius: 10 },
  resultTitle: { fontWeight: 'bold', marginBottom: 8 }
});

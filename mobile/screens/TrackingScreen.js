import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://10.0.2.2:4000/api';

export default function TrackingScreen() {
  const [tripId, setTripId] = useState('');
  const [entries, setEntries] = useState([]);

  async function fetchTracking() {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await fetch(`${API_URL}/tracking/trip/${tripId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) {
        Alert.alert('Track failed', data.error || 'Unable to fetch tracking');
        return;
      }
      setEntries(data.entries);
    } catch (err) {
      Alert.alert('Network error', err.message);
    }
  }

  return (
    <View style={styles.container}>
      <TextInput placeholder="Trip ID" value={tripId} onChangeText={setTripId} style={styles.input} />
      <Button title="Track Trip" onPress={fetchTracking} />
      <FlatList
        style={styles.list}
        data={entries}
        keyExtractor={(item, index) => String(index)}
        renderItem={({ item }) => (
          <View style={styles.entry}>
            <Text>{item.latitude}, {item.longitude}</Text>
            <Text>{item.recordedAt}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 12 },
  list: { marginTop: 16 },
  entry: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' }
});

import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://10.0.2.2:4000/api';

export default function SearchTripsScreen() {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [results, setResults] = useState([]);

  async function searchTrips() {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await fetch(`${API_URL}/passengers/search?pickup=${encodeURIComponent(pickup)}&dropoff=${encodeURIComponent(dropoff)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (!response.ok) {
        Alert.alert('Search failed', data.error || 'Unable to search trips');
        return;
      }
      setResults(data.matches);
    } catch (err) {
      Alert.alert('Network error', err.message);
    }
  }

  return (
    <View style={styles.container}>
      <TextInput placeholder="Pickup (lat,lng)" value={pickup} onChangeText={setPickup} style={styles.input} />
      <TextInput placeholder="Dropoff (lat,lng)" value={dropoff} onChangeText={setDropoff} style={styles.input} />
      <Button title="Search" onPress={searchTrips} />
      <FlatList
        style={styles.list}
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.tripCard}>
            <Text style={styles.tripTitle}>{item.origin} → {item.destination}</Text>
            <Text>Departure: {item.departureTime}</Text>
            <Text>Seats: {item.seatsAvailable}</Text>
            <Text>Match score: {item.matchScore}</Text>
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
  tripCard: { borderWidth: 1, borderColor: '#eee', borderRadius: 10, padding: 14, marginBottom: 12, backgroundColor: '#fff' },
  tripTitle: { fontWeight: 'bold', marginBottom: 6 }
});

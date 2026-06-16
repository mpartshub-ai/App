import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';

export default function SearchTripsScreen({ navigation }) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadTrips = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/drivers');
      if (response.ok) {
        const data = await response.json();
        setTrips(data || []);
      }
    } catch (error) {
      Alert.alert('Error', 'Could not load trips. Backend may not be running.');
    }
    setLoading(false);
  };

  React.useEffect(() => {
    loadTrips();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Available Trips</Text>
      
      {trips.length === 0 ? (
        <Text style={styles.emptyText}>No trips available</Text>
      ) : (
        trips.map((trip, index) => (
          <View key={index} style={styles.tripCard}>
            <Text style={styles.tripTitle}>Trip {index + 1}</Text>
            <Text style={styles.tripInfo}>Driver ID: {trip.id}</Text>
          </View>
        ))
      )}

      <TouchableOpacity 
        style={styles.button}
        onPress={loadTrips}
      >
        <Text style={styles.buttonText}>{loading ? 'Loading...' : 'Refresh Trips'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  },
  tripCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tripTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  tripInfo: {
    fontSize: 14,
    color: '#666',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 15,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

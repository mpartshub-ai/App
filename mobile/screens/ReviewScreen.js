import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://10.0.2.2:4000/api';

export default function ReviewScreen() {
  const [driverId, setDriverId] = useState('');
  const [tripId, setTripId] = useState('');
  const [rating, setRating] = useState('5');
  const [comment, setComment] = useState('');

  async function submitReview() {
    const token = await AsyncStorage.getItem('token');
    try {
      const response = await fetch(`${API_URL}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ driverId, tripId, rating: Number(rating), comment })
      });
      const data = await response.json();
      if (!response.ok) {
        Alert.alert('Review failed', data.error || 'Unable to submit review');
        return;
      }
      Alert.alert('Review submitted', `Rating: ${data.rating}`);
      setDriverId('');
      setTripId('');
      setRating('5');
      setComment('');
    } catch (err) {
      Alert.alert('Network error', err.message);
    }
  }

  return (
    <View style={styles.container}>
      <TextInput placeholder="Driver ID" value={driverId} onChangeText={setDriverId} style={styles.input} />
      <TextInput placeholder="Trip ID (optional)" value={tripId} onChangeText={setTripId} style={styles.input} />
      <TextInput placeholder="Rating 1-5" value={rating} onChangeText={setRating} keyboardType="numeric" style={styles.input} />
      <TextInput placeholder="Comment" value={comment} onChangeText={setComment} style={styles.input} multiline />
      <Button title="Submit Review" onPress={submitReview} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 12 }
});

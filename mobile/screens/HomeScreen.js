import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to RouteShare</Text>
      <Button title="Search Trips" onPress={() => navigation.navigate('SearchTrips')} />
      <View style={styles.spacer} />
      <Button title="Create Parcel" onPress={() => navigation.navigate('CreateParcel')} />
      <View style={styles.spacer} />
      <Button title="Scan Parcel" onPress={() => navigation.navigate('ScanParcel')} />
      <View style={styles.spacer} />
      <Button title="Track Trip" onPress={() => navigation.navigate('Tracking')} />
      <View style={styles.spacer} />
      <Button title="Make Payment" onPress={() => navigation.navigate('Payment')} />
      <View style={styles.spacer} />
      <Button title="Leave Review" onPress={() => navigation.navigate('Review')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 24, marginBottom: 24, textAlign: 'center', fontWeight: 'bold' },
  spacer: { height: 12 }
});

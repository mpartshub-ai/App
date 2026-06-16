import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import SearchTripsScreen from './screens/SearchTripsScreen';
import CreateParcelScreen from './screens/CreateParcelScreen';
import ScanParcelScreen from './screens/ScanParcelScreen';
import TrackingScreen from './screens/TrackingScreen';
import PaymentScreen from './screens/PaymentScreen';
import ReviewScreen from './screens/ReviewScreen';

const Stack = createNativeStackNavigator();

export default function Navigation() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="SearchTrips" component={SearchTripsScreen} options={{ title: 'Search Trips' }} />
      <Stack.Screen name="CreateParcel" component={CreateParcelScreen} options={{ title: 'Create Parcel' }} />
      <Stack.Screen name="ScanParcel" component={ScanParcelScreen} options={{ title: 'Scan Parcel' }} />
      <Stack.Screen name="Tracking" component={TrackingScreen} options={{ title: 'Track Trip' }} />
      <Stack.Screen name="Payment" component={PaymentScreen} options={{ title: 'Payment' }} />
      <Stack.Screen name="Review" component={ReviewScreen} options={{ title: 'Review Driver' }} />
    </Stack.Navigator>
  );
}

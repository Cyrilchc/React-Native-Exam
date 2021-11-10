import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignIn from './Pages/SignIn';
import SignUp from './Pages/SignUp';
import Main from './Pages/Main';
import Cart from './Pages/Cart';
import Details from './Pages/Details';
import EditProfile from './Pages/EditProfile';
import History from './Pages/History';
import Orders from './Pages/Orders';

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
        <Stack.Screen name="Main" component={Main} options={{ headerShown: false }} />
        <Stack.Screen
          name="Cart"
          component={Cart}
          options={{ headerTitle: "Panier" }}
        />
        <Stack.Screen
          name="Details"
          component={Details}
          options={{ headerTitle: "Détails" }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfile}
          options={{ headerTitle: "Votre profil" }}
        />
        <Stack.Screen
          name="History"
          component={History}
          options={{ headerTitle: "Hist. des commandes" }}
        />
        <Stack.Screen
          name="Orders"
          component={Orders}
          options={{ headerTitle: "Commandes" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
});

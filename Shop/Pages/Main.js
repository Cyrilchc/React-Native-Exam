import React, { useEffect, useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Products from './Products';
import Profile from './Profile';
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';
import Cart from './Cart';
import { auth, db } from '../firebase';
const Main = ({ navigation }) => {
    const Tab = createBottomTabNavigator();
    const [cartList, setCartList] = useState({});

    useEffect(() => {
    }, [])

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                title: () => {
                    let title
                    switch (route.name) {
                        case 'Products':
                            title = "Produits"
                            break;
                        case 'Profile':
                            title = "Profil"
                            break;
                        case 'Cart':
                            title = "Panier"
                            break;
                    }

                    return <Text>{title}</Text>
                },
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    switch (route.name) {
                        case 'Products':
                            iconName = focused ? 'shopping' : 'shopping-outline';
                            break;
                        case 'Profile':
                            iconName = focused ? 'account-circle' : 'account-circle-outline';
                            break;
                        case 'Cart':
                            iconName = focused ? 'cart' : 'cart-outline';
                            break;
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen
                name="Products"
                component={Products}
                options={{
                    headerTitle: "Produits",
                    headerRight: () => (
                        <Ionicons
                            name="cart"
                            size={30}
                            style={{ marginRight: 10 }}
                            onPress={() => navigation.navigate("Cart")}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="Profile"
                component={Profile}
                options={{
                    headerTitle: "Profil"
                }}
            />
            <Tab.Screen
                name="Cart"
                component={Cart}
                options={{
                    headerTitle: "Panier"
                }}
            />
        </Tab.Navigator>
    )
}

const styles = StyleSheet.create({
});

export default Main;
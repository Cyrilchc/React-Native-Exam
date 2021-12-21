import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { db, auth } from '../firebase';
import { useSafeState } from '../Utils/useSafeState';

const Orders = () => {
    const [orders, setOrders] = useSafeState([]);
    useEffect(() => {
        let allOrders = []
        db.collection('orders').where("user", "==", auth.currentUser.email).onSnapshot(orders => {
            if (orders) {
                orders.forEach(order => {
                    let retrievedOrder = { id: order.id, ...order.data() }
                    if (!retrievedOrder.isDelivered)
                        allOrders.push(retrievedOrder);
                });

                setOrders(allOrders)
            }
        })
    }, [])

    return (
        <ScrollView>
            {
                orders.length > 0 ?
                    <View>
                        {
                            orders.map((order, key) => {
                                let total = 0;
                                order.products.forEach(product => {
                                    total += product.price
                                });
                                return (
                                    <View style={styles.card} key={key}>
                                        <Text style={styles.orderNumber}>Commande du {order.date}</Text>
                                        <Text style={styles.orderText}>Commande n° : {order.id}</Text>
                                        <Text style={styles.orderText}>Nombre de produits : {order.products.length}</Text>
                                        <Text style={styles.orderText}>Total : {total} €</Text>
                                    </View>
                                )
                            })
                        }
                    </View>
                    :
                    <Text style={styles.emptyText}>Aucune commande en cours</Text>
            }
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    card: {
        borderWidth: 2,
        borderColor: "lightgrey",
        padding: 5,
        margin: 5,
        borderRadius: 10,
        shadowColor: "#000000",
        shadowOpacity: 0.2,
        shadowRadius: 5,
        shadowOffset: {
            height: 2,
            width: 2
        },
        backgroundColor: "white"
    },
    orderNumber: {
        fontSize: 15,
        fontWeight: "bold",
        margin: 10,
    },
    orderText: {
        margin: 10
    },
    emptyText: {
        textAlign: "center",
        margin: 10,
    },
});

export default Orders;
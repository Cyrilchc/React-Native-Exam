import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { db, auth } from '../firebase';
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Toast } from 'react-native-toast-message/lib/src/Toast';

const Cart = ({ navigation }) => {
    const [isLoading, setLoading] = useState(false);
    const [cart, setCart] = useState({});
    useEffect(() => {
        db.collection("cart").where("user", '==', auth.currentUser.email).onSnapshot(carts => {
            if (carts) {
                carts.forEach(cart => {
                    setCart({ id: cart.id, ...cart.data() })
                });
            }
        })
    }, [])

    /**
     * Retire le produit du panier
     */
    const removeFromCart = (selectedProduct) => {
        let temp = cart.products
        let newProducts = temp.filter(e => e !== selectedProduct)
        setLoading(true)
        db.collection('cart').doc(cart.id).update({
            products: newProducts
        }).then(() => {
            Toast.show({
                type: 'success',
                text1: "Le produit a été retiré",
            })
        }).catch(err => {
            Toast.show({
                type: 'error',
                text1: "Une erreur est survenue",
                text2: err.toString()
            })
        }).finally(() => {
            setLoading(false)
        })
    }

    /**
     * Créé la commande
     */
    const order = () => {
        setLoading(true)
        // Ajoute la commande
        db.collection('orders').add({
            user: auth.currentUser.email,
            isDelivered: false,
            products: cart.products,
            date: getCurrentDateTime()
        }).then(() => {
            Toast.show({
                type: 'success',
                text1: "Commande passée avec succès",
            })

            // Vide la panier
            setCart([])

            // Supprime le panier
            db.collection('cart').doc(cart.id).delete()
                .then(() => {
                    navigation.navigate("Products")
                }).catch(err => {
                    Toast.show({
                        type: 'error',
                        text1: "Une erreur est survenue",
                        text2: err.toString()
                    })
                })
        }).catch(err => {
            Toast.show({
                type: 'error',
                text1: "Une erreur est survenue",
                text2: err.toString()
            })
        }).finally(() => {
            setLoading(false)
        })
    }

    /**
     * Obtient la date et l'heure en chaine
     */
    const getCurrentDateTime = () => {
        let d = new Date();
        let dd = String(d.getDate()).padStart(2, '0');
        let mm = String(d.getMonth() + 1).padStart(2, '0');
        let yyyy = d.getFullYear();
        let hour = d.getHours();
        let minutes = d.getMinutes();
        d = `${dd}/${mm}/${yyyy} - ${hour}h${minutes}`;
        return d;
    }

    return (
        <ScrollView style={styles.container}>
            {
                cart.products ?
                    cart.products.length > 0 ?
                        cart.products.map((product, key) => (
                            <View style={styles.card} key={key}>
                                <View style={styles.masterCardContent}>
                                    <Image
                                        style={styles.productImage}
                                        source={{
                                            uri: product.image
                                        }}
                                    />
                                </View>
                                <View style={styles.productDescription}>
                                    <View style={styles.productDescriptionAlign}>
                                        <Text>{product.name}</Text>
                                        <Text>{product.price}€</Text>
                                    </View>
                                </View>
                                <View style={styles.deleteLayout}>
                                    <TouchableOpacity style={styles.deleteButton} onPress={() => { removeFromCart(product) }}>
                                        <Ionicons
                                            name="delete-outline"
                                            size={50}
                                            color="black"
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))
                        :
                        <Text style={styles.emptyText}>Votre panier est vide</Text>
                    :
                    <Text style={styles.emptyText}>Votre panier est vide</Text>
            }
            {isLoading ? <ActivityIndicator size="large" color="#0000ff" /> : null}
            {
                cart.products ?
                    cart.products.length > 0 ?
                        <TouchableOpacity onPress={() => { order() }} style={styles.button}>
                            <Ionicons
                                name="cart-arrow-down"
                                size={20}
                                style={styles.orderIcon}
                                color="white"
                            />
                            <Text style={styles.buttonText}>Commander</Text>
                        </TouchableOpacity>
                        :
                        null
                    :
                    null
            }
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    masterCardContent: {
        flex: 1,
        alignSelf: "center"
    },
    productDescription: {
        flex: 2,
        alignSelf: "center",
        justifyContent: "center",
    },
    productDescriptionAlign: {
        alignSelf: "center"
    },
    deleteLayout: {
        flex: 1,
        justifyContent: "center"
    },
    deleteButton: {
        alignSelf: "flex-end"
    },
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
        backgroundColor: "white",
        flexDirection: "row",
        flex: 1,
    },
    productImage: {
        width: 75,
        height: 75,
        margin: 10,
        alignSelf: "flex-start",
    },
    button: {
        margin: 10,
        padding: 10,
        width: 175,
        height: 50,
        right: 0,
        backgroundColor: "#2196F3",
        color: "white",
        borderRadius: 5,
        justifyContent: "center",
        alignSelf: "flex-end",
        flexDirection: "row",
    },
    orderIcon: {
        alignSelf: "center",
        marginRight: 10
    },
    buttonText: {
        color: "white",
        alignSelf: "center"
    },
    emptyText: {
        textAlign: "center",
        margin: 10,
    },
});

export default Cart;
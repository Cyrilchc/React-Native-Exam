import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';
import { auth, db } from '../firebase';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { useSafeState } from '../Utils/useSafeState';
const Details = ({ route, navigation }) => {
    const product = route.params
    const [isLoading, setLoading] = useSafeState(false);
    useEffect(() => {
    }, [])

    const addToCart = async () => {
        // Obtient le panier
        const userCartRaw = await db.collection("cart").where("user", '==', auth.currentUser.email).get();
        let singleCart;
        // Récupère les data, id du panier + son contenu
        userCartRaw.forEach(cart => {
            singleCart = { id: cart.id, ...cart.data() }
        });

        if (singleCart) {
            // Le panier existe déjà
            // Ajout du produit dans le tableau produits du panier
            singleCart.products.push({
                name: product.name,
                description: product.description,
                price: Number(product.price),
                image: product.image
            })


            // Met à jour en base de données
            setLoading(true)
            db.collection('cart').doc(singleCart.id)
                .update({
                    products: singleCart.products
                }).then(() => {
                    Toast.show({
                        type: 'success',
                        text1: "Produit ajouté à votre panier",
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
        else {
            // Le panier n'existe pas
            // Créé le panier de l'utilisateur
            let newProduct = []
            newProduct.push({
                name: product.name,
                description: product.description,
                price: Number(product.price),
                image: product.image
            })

            db.collection('cart').add({
                user: auth.currentUser.email,
                products: newProduct
            }).then(() => {
                Toast.show({
                    type: 'success',
                    text1: "Produit ajouté à votre panier",
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
    }

    return (
        <ScrollView style={styles.container}>
            <Image
                style={styles.productImage}
                source={{
                    uri: product.image
                }}
            />
            <View style={styles.card}>
                <Text style={styles.cardText}>{product.name}</Text>
                <Text style={styles.cardText}>{product.description}</Text>
                <Text style={styles.priceText}>{product.price}€</Text>
                {isLoading ? <ActivityIndicator size="large" color="#0000ff" /> : null}
                <TouchableOpacity onPress={() => { addToCart() }} style={styles.button}>
                    <Ionicons
                        name="cart-arrow-down"
                        size={20}
                        style={styles.cartIcon}
                        color="white"
                    />
                    <Text style={styles.buttonText}>Ajouter au panier</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    productImage: {
        width: 150,
        height: 150,
        margin: 10,
        alignSelf: "center"
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
        backgroundColor: "white"
    },
    cardText: {
        margin: 10,
    },
    priceText: {
        margin: 10,
        fontSize: 20,
        fontWeight: "bold",
        alignSelf: "flex-end"
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
    cartIcon: {
        alignSelf: "center",
        marginRight: 10
    },
    buttonText: {
        color: "white",
        alignSelf: "center"
    },
});

export default Details;
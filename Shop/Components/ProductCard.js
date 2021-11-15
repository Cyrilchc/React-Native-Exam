import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
const ProductCard = ({ product, navigation }) => {

    useEffect(() => {
    }, [])

    const goToDetails = () => {
        navigation.navigate("Details", product)
    }

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={() => { goToDetails() }}>
            <Image
                style={styles.productImage}
                source={{
                    uri: product.image
                }}
            />
            <Text style={styles.cardText}>{product.name}</Text>
            <Text style={styles.priceText}>{product.price}€</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    card: {
        borderWidth: 2,
        borderColor: "lightgrey",
        padding: 5,
        margin: 5,
        borderRadius: 10,
        width: 175,
        height: 200,
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
    priceText:{
        margin:10,
        fontSize:20,
        fontWeight:"bold"
    },
    productImage: {
        width: 75,
        height: 75,
        margin: 10,
        alignSelf: "center"
    },
});

export default ProductCard;
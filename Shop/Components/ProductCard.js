import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
const ProductCard = ({ product }) => {

    useEffect(() => {
    }, [])

    return (
        <TouchableOpacity style={styles.card}>
            <Image
                style={styles.productImage}
                source={{
                    uri: product.image
                }}
            />
            <Text style={styles.cardText}>{product.name}</Text>
            <Text style={styles.cardText}>Prix : {product.price}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    card: {
        borderWidth: 2,
        padding: 5,
        margin: 5,
        borderRadius: 10,
        width: 175,
        height: 200,
        shadowColor: "#000000",
        shadowOpacity: 0.8,
        shadowRadius: 5,
        shadowOffset: {
          height: 2,
          width: 2
        }
    },
    cardText:{
        margin:10,
    },
    productImage: {
        width: 75,
        height: 75,
        margin: 10,
        alignSelf:"center"
    },
});

export default ProductCard;
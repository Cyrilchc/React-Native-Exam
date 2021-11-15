import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import ProductCard from '../Components/ProductCard';
import { db } from '../firebase';
import { auth } from '../firebase';
const Products = ({navigation}) => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        db.collection("products").onSnapshot(products => {
            if (products) {
                const allProducts = []
                products.forEach(product => {
                    allProducts.push({ id: product.id, ...product.data() });
                });
                setProducts(allProducts);
            }
        })
    }, [])

    return (
        <ScrollView style={styles.container}>
            <View style={styles.flexRow}>
                {
                    products.map((product, key) => (
                        <ProductCard key={key} product={product} navigation={navigation} />
                    ))
                }
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    flexRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent:"center",
    }
});

export default Products;
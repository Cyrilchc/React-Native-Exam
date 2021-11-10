import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import ProductCard from '../Components/ProductCard';
import { db } from '../firebase';
const Products = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        db.collection("products").onSnapshot(products => {
            console.log(products);
            if (products) {
                const allProducts = []
                products.forEach(product => {
                    allProducts.push(product.data())
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
                        <ProductCard key={key} product={product} />
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
    }
});

export default Products;
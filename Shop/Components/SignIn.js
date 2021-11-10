import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { auth } from '../firebase';

const SignIn = ({ navigation }) => {
    const [accountName, setAccountName] = useState("");
    const [password, setPassword] = useState("");
    const [authInfo, setAuthInfo] = useState("");
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                // L'utilisateur est connecté, on le dirige vers la page des produits
                navigation.replace("Main");
            }
        })
    }, [])

    /**
     * Fonction pour authentifier l'utilisateur
     */
    const authenticate = () => {
        setAuthInfo("");
        setLoading(true)
        auth.signInWithEmailAndPassword(accountName, password)
            .then(() => {
                navigation.replace("Main");
            }).catch(err => {
                if (err.code == "auth/internal-error") {
                    let parseError = JSON.parse(err.message)
                    console.log(parseError);
                    setAuthInfo(`Connexion impossible : ${parseError.error.message}`)
                } else {
                    setAuthInfo(`Connexion impossible : ${err.message}`)
                }
            }).finally(() => {
                setLoading(false)
            })
    }

    /**
     * Dirige vers la page d'inscription
     */
    const goToSignUp = () => {
        navigation.navigate("SignUp");
    }

    return (
        <View style={styles.general}>
            <View style={styles.containerImage}>
                <Image
                    style={styles.logo}
                    source={{
                        uri: 'https://cdn.iconscout.com/icon/free/png-256/react-1543566-1306069.png'
                    }}
                />
                <Text style={styles.appName}>Shopping app</Text>
                <Text style={styles.mainTitle}>Connexion</Text>
            </View>
            <View style={styles.containerForm}>
                <TextInput style={styles.input} placeholder="j.doe@domain.com" keyboardType="email-address" onChangeText={setAccountName} value={accountName} />
                <TextInput style={styles.input} secureTextEntry={true} placeholder="Votre mot de passe" onChangeText={setPassword} value={password} />
                {isLoading ? <ActivityIndicator size="large" color="#0000ff" /> : null}
                <TouchableOpacity onPress={() => { authenticate() }} style={styles.button}>
                    <Text style={styles.buttonText}>Se connecter</Text>
                </TouchableOpacity>
                <Text style={styles.errorMessage}>{authInfo}</Text>
                <Text style={styles.link} onPress={() => { goToSignUp() }}>Pas encore inscrit ? Créez un compte !</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    general: {
        backgroundColor: '#fff',
        justifyContent: 'center',
        flex: 1
    },
    containerImage: {
        alignItems: 'center',
    },
    appName:{
        fontSize:25,
        fontWeight: "bold",
        margin:10
    },
    mainTitle: {
        fontSize: 20,
        fontWeight: "bold"
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5
    },
    button: {
        marginTop: 20,
        marginRight: 50,
        marginLeft: 50,
        height: 30,
        backgroundColor: "#2196F3",
        color: "white",
        borderRadius: 5,
        justifyContent: "center"
    },
    buttonText: {
        color: "white",
        alignSelf: "center"
    },
    link: {
        color: "#2196F3",
        alignSelf: "center"
    },
    containerForm: {
        marginTop: 50,
        marginLeft: 20,
        marginRight: 20,
    },
    logo: {
        width: 100,
        height: 100,
    },
    errorMessage: {
        color: "red",
        alignSelf: "center",
        textAlign: "center",
        margin: 10
    },
});

export default SignIn;
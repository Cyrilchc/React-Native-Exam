import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { auth } from '../firebase';
import { Toast } from 'react-native-toast-message/lib/src/Toast';

const SignUp = ({ navigation }) => {
    const [accountName, setAccountName] = useState("");
    const [password, setPassword] = useState("");
    const [signUpInfo, setSignUpInfo] = useState("");
    const [isLoading, setLoading] = useState(false);

    /**
     * Fonction pour inscrire l'utilisateur
     */
    const signUp = () => {
        setLoading(true)
        setSignUpInfo("")
        auth.createUserWithEmailAndPassword(accountName, password)
            .then((user) => {
                if (user) {
                    Toast.show({
                        type: 'success',
                        text1: 'Votre compte a été créé avec succès',
                    })
                }
            }).catch(err => {
                if (err.code == "auth/internal-error") {
                    let parseError = JSON.parse(err.message)
                    console.log(parseError);
                    setSignUpInfo(`Inscription impossible : ${parseError.error.message}`)
                } else {
                    setSignUpInfo(`Inscription impossible : ${err.message}`)
                }
            }).finally(() => {
                setLoading(false)
            })
    }

    /**
     * Dirige vers la page de connexion
     */
    const goToSignIn = () => {
        navigation.navigate("SignIn");
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
                <Text style={styles.mainTitle}>S'inscrire</Text>
            </View>
            <View style={styles.containerForm}>
                <TextInput style={styles.input} placeholder="j.doe@domain.com" keyboardType="email-address" onChangeText={setAccountName} value={accountName} />
                <TextInput style={styles.input} secureTextEntry={true} placeholder="Un mot de passe compliqué" onChangeText={setPassword} value={password} />
                {isLoading ? <ActivityIndicator size="large" color="#0000ff" /> : null}
                <TouchableOpacity onPress={() => { signUp() }} style={styles.button}>
                    <Text style={styles.buttonText}>S'inscrire</Text>
                </TouchableOpacity>
                <Text style={styles.errorMessage}>{signUpInfo}</Text>
                <Text style={styles.link} onPress={() => { goToSignIn() }}>Vous avez déjà un compte ? Connectez vous !</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    // Centre tous les éléments
    general: {
        backgroundColor: '#fff',
        justifyContent: 'center',
        flex: 1
    },
    containerImage: {
        alignItems: 'center',
    },
    appName: {
        fontSize: 25,
        fontWeight: "bold",
        margin: 10
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

export default SignUp;
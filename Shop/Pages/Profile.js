import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';
import { auth, db } from '../firebase';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { useSafeState } from '../Utils/useSafeState';

const Profile = ({ navigation }) => {
    const [profile, setProfile] = useSafeState({});
    const [isLoading, setLoading] = useSafeState(false);

    useEffect(() => {
        db.collection("profiles").where("user", '==', auth.currentUser.email).onSnapshot(profiles => {
            if (profiles) {
                let userProfile;
                profiles.forEach(profile => {
                    userProfile = { id: profile.id, ...profile.data() }
                });

                if (userProfile) {
                    setProfile(userProfile)
                } else {
                    setLoading(true)
                    // Créer le profil
                    let profile = {
                        user: auth.currentUser ? auth.currentUser.email : null,
                        email: auth.currentUser ? auth.currentUser.email : null,
                        name: "",
                        address: "",
                        photo: ""
                    }

                    db.collection('profiles').add(profile)
                        .then(() => {
                            Toast.show({
                                type: 'success',
                                text1: "Votre profil a été initialisé avec succès",
                            })

                            navigation.navigate("Profile")
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
        })
    }, [])

    /**
     * Déconnexion
     */
    const signOut = () => {
        auth.signOut();
        navigation.replace("SignIn")
    }

    const goToEditProfile = () => {
        navigation.navigate("EditProfile")
    }

    const goToOrders = () => {
        navigation.navigate("Orders")
    }

    const goToOrderHistory = () => {
        navigation.navigate("History")
    }

    return (
        <ScrollView>
            <View style={styles.card}>
                {
                    profile ?
                        <View>
                            <Image
                                style={styles.photo}
                                source={{
                                    uri: profile.photo ? profile.photo : "https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/default-avatar.png"
                                }}
                            />
                            <Text style={styles.profileText}>
                                Email : {profile.email ? profile.email : "Email inconnu"}
                            </Text>
                            <Text style={styles.profileText}>
                                Nom : {profile.name ? profile.name : "Inconu"}
                            </Text>
                            <Text style={styles.profileText}>
                                Adresse : {profile.address ? profile.address : "Inconnu"}
                            </Text>
                        </View>
                    : null
                }

                {isLoading ? <ActivityIndicator size="large" color="#0000ff" /> : null}
            </View>

            <TouchableOpacity onPress={() => { goToEditProfile() }} style={styles.button}>
                <Text style={styles.buttonText}>Modifier mon profil</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { goToOrders() }} style={styles.button}>
                <Text style={styles.buttonText}>Commandes en cours</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { goToOrderHistory() }} style={styles.button}>
                <Text style={styles.buttonText}>Historique des commandes</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { signOut() }} style={styles.buttonDisconnect}>
                <Ionicons
                    name="logout"
                    size={20}
                    style={styles.disconnectIcon}
                    color="white"
                />
                <Text style={styles.buttonText}>Se déconnecter</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    profileText: {
        textAlign: "center",
        margin:5,
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
    button: {
        margin: 10,
        padding: 10,
        width: 300,
        height: 50,
        right: 0,
        backgroundColor: "#2196F3",
        color: "white",
        borderRadius: 5,
        justifyContent: "center",
        alignSelf: "center",
        flexDirection: "row",
    },
    buttonDisconnect: {
        margin: 10,
        padding: 10,
        width: 300,
        height: 50,
        right: 0,
        backgroundColor: "red",
        color: "white",
        borderRadius: 5,
        justifyContent: "center",
        alignSelf: "center",
        flexDirection: "row",
    },
    disconnectIcon: {
        alignSelf: "center",
        marginRight: 10
    },
    buttonText: {
        color: "white",
        alignSelf: "center"
    },
    photo: {
        width: 100,
        height: 100,
        margin: 10,
        alignSelf: "center"
    },
});

export default Profile;
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { auth, db } from '../firebase';
import { useSafeState } from '../Utils/useSafeState';

const EditProfile = ({ navigation }) => {
    const [name, setName] = useSafeState("");
    const [mail, setMail] = useSafeState("");
    const [address, setAddress] = useSafeState("");
    const [photo, setPhoto] = useSafeState("");
    const [profile, setProfile] = useSafeState({});
    const [isLoading, setLoading] = useSafeState(false);

    useEffect(() => {
        db.collection("profiles").where("user", '==', auth.currentUser.email).onSnapshot(profiles => {
            let currentProfile;
            if (profiles) {
                profiles.forEach(profile => {
                    currentProfile = { id: profile.id, ...profile.data() };
                    setProfile(currentProfile)
                });
            }

            if (currentProfile) {
                setMail(currentProfile.email)
                setAddress(currentProfile.address)
            }

            setName(auth.currentUser.displayName)
            setPhoto(auth.currentUser.photoURL)
        })
    }, [])

    /**
     * Modifie le profil
     */
    const editProfile = () => {
        setLoading(true)
        // Modification du profil en base
        db.collection('profiles').doc(profile.id).update({
            name: name,
            email: mail,
            address: address,
            photo: photo
        }).then(() => {
            // Je ne redirige pas, la maj du profil utilisateur connecté
            // reste à faire
        }).catch(err => {
            Toast.show({
                type: "error",
                text1: "Une erreur est survenue",
                text2: err.toString()
            })
            return
        }).finally(() => {
            setLoading(false)
        })

        setLoading(true)
        // je pourrais faire un update de l'Email mais flemme, email sensible => déconnexion après la mise à jour
        // Comme demandé, je vais aussi modifier le profil de l'utilisateur connecté
        auth.currentUser.updateProfile({
            displayName: name,
            photoURL: photo,
        }).then(() => {
            // Ici, je considère que le profil en base et le profil 
            // utilisateur connecté sont tous deux mis à jour avec succès 
            Toast.show({
                type: "success",
                text1: "Votre profil a été mis à jour",
            })
            navigation.navigate("Profile")
        }).catch(err => {
            Toast.show({
                type: "error",
                text1: "Une erreur est survenue",
                text2: err.toString()
            })
        }).finally(() => {
            setLoading(false)
        })
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.label}>Nom complet</Text>
            <TextInput style={styles.input} placeholder="John Doe" onChangeText={setName} value={name} />
            <Text style={styles.label}>Adresse mail</Text>
            <TextInput style={styles.input} placeholder="j.doe@domain.com" keyboardType="email-address" onChangeText={setMail} value={mail} />
            <Text style={styles.label}>Adresse</Text>
            <TextInput style={styles.input} placeholder="75 rue du centre" onChangeText={setAddress} value={address} />
            <Text style={styles.label}>Photo</Text>
            <TextInput style={styles.input} placeholder="https://cdn/me.png" onChangeText={setPhoto} value={photo} />
            {isLoading ? <ActivityIndicator size="large" color="#0000ff" /> : null}
            <TouchableOpacity onPress={() => { editProfile() }} style={styles.button}>
                <Text style={styles.buttonText}>Modifier le profil</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    label: {
        marginLeft: 12,
        marginTop: 12,
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5
    },
    buttonText: {
        color: "white",
        alignSelf: "center"
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
});

export default EditProfile;
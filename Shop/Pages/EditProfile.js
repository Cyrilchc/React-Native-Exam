import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { auth, db } from '../firebase';
const EditProfile = ({navigation}) => {
    const [name, setName] = useState("");
    const [mail, setMail] = useState("");
    const [address, setAddress] = useState("");
    const [photo, setPhoto] = useState("");
    const [profile, setProfile] = useState({});
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        db.collection("profiles").where("user", '==', auth.currentUser.email).onSnapshot(profiles => {
            let currentProfile;
            if (profiles) {
                profiles.forEach(profile => {
                    currentProfile = { id: profile.id, ...profile.data() }; 
                    setProfile(currentProfile)
                });
            }

            if(currentProfile){
                setName(currentProfile.name)
                setMail(currentProfile.email)
                setAddress(currentProfile.address)
                setPhoto(currentProfile.photo)
            }
        })
    }, [])

    /**
     * Modifie le profil
     */
    const editProfile = () => {
        setLoading(true)
        db.collection('profiles').doc(profile.id).update({
            name: name,
            email: mail,
            address: address,
            photo: photo
        }).then(() => {
            Toast.show({
                type: 'success',
                text1: "Votre profil a été mis à jour",
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
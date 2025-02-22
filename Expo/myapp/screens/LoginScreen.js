import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import * as Google from "expo-auth-session/providers/google";
import { makeRedirectUri } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { Ionicons } from "@expo/vector-icons"; 

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    webClientId: "16500471511-9ivse3lv6rrqs7941di5u3ppl0hvhk3p.apps.googleusercontent.com",
    androidClientId: "16500471511-9ivse3lv6rrqs7941di5u3ppl0hvhk3p.apps.googleusercontent.com",
    iosClientId: "16500471511-9ivse3lv6rrqs7941di5u3ppl0hvhk3p.apps.googleusercontent.com",
    redirectUri: makeRedirectUri({
      useProxy: true,
    }),
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(() => {
          setModalVisible(true);
        })
        .catch((error) => {
          alert("❌ Google Login Error: " + error.message);
        });
    }
  }, [response]);

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        setModalVisible(true);
      })
      .catch((error) => {
        alert("❌ อีเมลหรือรหัสผ่านไม่ถูกต้อง: " + error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔒 LOGIN</Text>

      <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#2c3e50" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#2c3e50" value={password} onChangeText={setPassword} secureTextEntry />

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.buttonText}>LOGIN</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.googleButton} onPress={() => promptAsync()}>
        <Text style={styles.buttonText}>Login with Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate("Register")}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Ionicons name="checkmark-circle" size={80} color="#2ecc71" />
            <Text style={styles.modalTitle}>LOGIN SUCCESSFUL</Text>
            <Text style={styles.modalText}>You have successfully signed into your account.</Text>
            <TouchableOpacity style={styles.modalButton} onPress={() => { setModalVisible(false); navigation.navigate("Home"); }}>
              <Text style={styles.modalButtonText}>CLOSE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#1b2b4c", padding: 20 },
  title: { fontSize: 30, fontWeight: "bold", color: "#ffffff", marginBottom: 30 },
  input: { width: "85%", padding: 15, marginBottom: 15, borderRadius: 8, backgroundColor: "#e9f1fe", color: "#2c3e50", fontSize: 16 },
  loginButton: { width: "85%", padding: 15, borderRadius: 8, backgroundColor: "#2980b9", alignItems: "center", marginTop: 10 },
  googleButton: { width: "85%", padding: 15, borderRadius: 8, backgroundColor: "#e74c3c", alignItems: "center", marginTop: 10 },
  registerButton: { width: "85%", padding: 15, borderRadius: 8, backgroundColor: "#27ae60", alignItems: "center", marginTop: 10 },
  buttonText: { color: "#ffffff", fontSize: 18, fontWeight: "bold" },

  modalBackground: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" },
  modalContainer: { width: "85%", padding: 30, borderRadius: 12, backgroundColor: "#1b2b4c", alignItems: "center", shadowColor: "#000", shadowOpacity: 0.3, shadowRadius: 5 },
  modalTitle: { fontSize: 22, fontWeight: "bold", color: "#ffffff", marginTop: 10, textTransform: "uppercase" },
  modalText: { fontSize: 16, color: "#ffffff", textAlign: "center", marginVertical: 10, lineHeight: 22 },
  modalButton: { width: "100%", padding: 15, borderRadius: 8, backgroundColor: "#0a1f44", alignItems: "center", marginTop: 15 },
  modalButtonText: { color: "#ffffff", fontSize: 16, fontWeight: "bold" },
});

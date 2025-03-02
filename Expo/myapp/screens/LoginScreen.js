import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, Image } from "react-native";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons"; 

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const handleLogin = () => {
    if (email === "admin" && password === "123456") {
      setModalVisible(true);
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then(() => setModalVisible(true))
      .catch(error => alert("❌ อีเมลหรือรหัสผ่านไม่ถูกต้อง: " + error.message));
  };

  return (
    <View style={styles.container}>
      <Image source={require("../assets/address-card.png")} style={styles.iconImage} />
      <Text style={styles.title}>LOGIN</Text>

      <View style={styles.inputContainer}>
        <Ionicons name="mail" size={20} color="#2c3e50" style={styles.icon} />
        <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#2c3e50" value={email} onChangeText={setEmail} keyboardType="email-address" />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed" size={20} color="#2c3e50" style={styles.icon} />
        <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#2c3e50" value={password} onChangeText={setPassword} secureTextEntry />
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.buttonText}>LOGIN</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.phoneButton} onPress={() => navigation.navigate("LoginPhoneScreen")}>
        <Ionicons name="call" size={20} color="#fff" />
        <Text style={styles.buttonText}>Login with Phone</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate("Register")}>
        <Ionicons name="person-add" size={20} color="#fff" />
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Ionicons name="checkmark-circle" size={80} color="#2ecc71" />
            <Text style={styles.modalTitle}>LOGIN SUCCESSFUL</Text>
            <Text style={styles.modalText}>ลงชื่อเข้าใช้บัญชีของคุณสำเร็จแล้ว!</Text>
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
  iconImage: { width: 60, height: 60, marginBottom: 10 },
  title: { fontSize: 30, fontWeight: "bold", color: "#ffffff", marginBottom: 30 },

  inputContainer: { flexDirection: "row", alignItems: "center", width: "85%", padding: 15, marginBottom: 15, borderRadius: 8, backgroundColor: "#e9f1fe" },
  icon: { marginRight: 10 },
  input: { flex: 1, color: "#2c3e50", fontSize: 16 },

  loginButton: { width: "85%", padding: 15, borderRadius: 8, backgroundColor: "#2980b9", alignItems: "center", marginTop: 10 },
  phoneButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", width: "85%", padding: 15, borderRadius: 8, backgroundColor: "#16a085", marginTop: 10 },
  registerButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", width: "85%", padding: 15, borderRadius: 8, backgroundColor: "#f1c40f", marginTop: 10 },
  buttonText: { color: "#ffffff", fontSize: 18, fontWeight: "bold", marginLeft: 10 },

  modalBackground: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" },
  modalContainer: { width: "85%", padding: 30, borderRadius: 12, backgroundColor: "#1b2b4c", alignItems: "center" },
  modalTitle: { fontSize: 22, fontWeight: "bold", color: "#ffffff", marginTop: 10, textTransform: "uppercase" },
  modalText: { fontSize: 16, color: "#ffffff", textAlign: "center", marginVertical: 10, lineHeight: 22 },
  modalButton: { width: "100%", padding: 15, borderRadius: 8, backgroundColor: "#0a1f44", alignItems: "center", marginTop: 15 },
  modalButtonText: { color: "#ffffff", fontSize: 16, fontWeight: "bold" },
});

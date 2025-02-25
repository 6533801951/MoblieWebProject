import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, Image } from "react-native";
import { auth, db } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      alert("⚠️ โปรดกรอกข้อมูลให้ครบถ้วน");
      return;
    }

    if (password !== confirmPassword) {
      alert("❌ รหัสผ่านไม่ตรงกัน");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email,
        createdAt: new Date(),
      });

      setModalVisible(true);
    } catch (error) {
      alert("❌ ข้อผิดพลาด: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* ใช้รูปแทนไอคอน 📝 */}
      <Image source={require("../assets/edit.png")} style={styles.iconImage} />
      <Text style={styles.title}>REGISTER</Text>

      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <TextInput style={styles.input} placeholder="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />

      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.buttonText}>REGISTER</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")} style={styles.backToLogin}>
        <Text style={styles.backToLoginText}>Back to Login</Text>
      </TouchableOpacity>

      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Ionicons name="checkmark-circle" size={60} color="#2ecc71" />
            <Text style={styles.modalTitle}>REGISTER SUCCESSFUL</Text>
            <Text style={styles.modalText}>คุณได้สร้างบัญชีสำเร็จแล้ว!</Text>
            <TouchableOpacity style={styles.modalButton} onPress={() => { setModalVisible(false); navigation.navigate("Login"); }}>
              <Text style={styles.modalButtonText}>Back to Login</Text>
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

  input: { width: "85%", padding: 15, marginBottom: 15, borderRadius: 8, backgroundColor: "#e9f1fe", color: "#2c3e50", fontSize: 16 },
  registerButton: { width: "85%", padding: 15, borderRadius: 8, backgroundColor: "#2980b9", alignItems: "center", marginTop: 10 },
  backToLogin: { marginTop: 15 },
  backToLoginText: { color: "#ffffff", fontSize: 16, textDecorationLine: "underline" },
  buttonText: { color: "#ffffff", fontSize: 18, fontWeight: "bold" },

  modalBackground: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" },
  modalContainer: { width: "80%", padding: 25, borderRadius: 10, backgroundColor: "#1b2b4c", alignItems: "center" },
  modalTitle: { fontSize: 20, fontWeight: "bold", color: "#ffffff", marginTop: 10 },
  modalText: { fontSize: 16, color: "#ffffff", textAlign: "center", marginVertical: 10 },
  modalButton: { width: "100%", padding: 12, borderRadius: 8, backgroundColor: "#0a1f44", alignItems: "center", marginTop: 15 },
  modalButtonText: { color: "#ffffff", fontSize: 16, fontWeight: "bold" },
});

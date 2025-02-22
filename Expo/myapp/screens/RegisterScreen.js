import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { auth, db } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("⚠️ ข้อผิดพลาด", "กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("❌ รหัสผ่านไม่ตรงกัน", "กรุณากรอกรหัสผ่านให้ตรงกัน");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // บันทึกข้อมูล Email ไปที่ Firestore
      await setDoc(doc(db, "users", user.uid), {
        email,
        createdAt: new Date(),
      });

      Alert.alert("✅ ลงทะเบียนสำเร็จ!", "คุณสามารถเข้าสู่ระบบได้แล้ว");
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("❌ ข้อผิดพลาด", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📝 Register</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerText}>REGISTER</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")} style={styles.backToLogin}>
        <Text style={styles.backToLoginText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#2c3e50", padding: 20 },
  title: { fontSize: 30, fontWeight: "bold", color: "#ebedef", marginBottom: 30 },
  input: { width: "85%", padding: 12, marginBottom: 15, borderRadius: 8, backgroundColor: "#ebedef", color: "#2c3e50", fontSize: 16 },
  registerButton: { width: "85%", padding: 15, borderRadius: 8, backgroundColor: "#3498db", alignItems: "center", marginTop: 10 },
  registerText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  backToLogin: { marginTop: 15 },
  backToLoginText: { color: "#ffffff", fontSize: 16, textDecorationLine: "underline" },
});

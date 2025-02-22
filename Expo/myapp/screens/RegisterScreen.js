import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    if (!username || !password || !confirmPassword) {
      Alert.alert("⚠️ ข้อผิดพลาด", "กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("❌ รหัสผ่านไม่ตรงกัน", "กรุณากรอกรหัสผ่านให้ตรงกัน");
      return;
    }

    try {
      await AsyncStorage.setItem("registeredUser", JSON.stringify({ username, password }));
      Alert.alert("✅ ลงทะเบียนสำเร็จ!", "คุณสามารถเข้าสู่ระบบได้แล้ว");
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📝 Register</Text>

      <TextInput
        style={[styles.input, styles.defaultFont]}
        placeholder="Username"
        placeholderTextColor="#95a5a6"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={[styles.input, styles.defaultFont]}
        placeholder="Password"
        placeholderTextColor="#95a5a6"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        style={[styles.input, styles.defaultFont]}
        placeholder="Confirm Password"
        placeholderTextColor="#95a5a6"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
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
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2c3e50",
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#ebedef",
    marginBottom: 30,
    fontFamily: "MahpaDemo",
  },
  input: {
    width: "85%",
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: "#ebedef",
    color: "#2c3e50",
    fontSize: 16,
  },
  defaultFont: {
    fontFamily: "System",
  },
  registerButton: {
    width: "85%",
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#3498db",
    alignItems: "center",
    marginTop: 10,
  },
  registerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "MahpaDemo",
  },
  backToLogin: {
    marginTop: 15,
  },
  backToLoginText: {
    color: "#ffffff",
    fontSize: 16,
    textDecorationLine: "underline",
    fontFamily: "System",
  },
});

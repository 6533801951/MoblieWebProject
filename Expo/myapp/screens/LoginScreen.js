import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [storedUser, setStoredUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const userData = await AsyncStorage.getItem("registeredUser");
      if (userData) {
        setStoredUser(JSON.parse(userData));
      }
    };
    loadUser();
  }, []);

  const handleLogin = () => {
    if (!storedUser) {
      Alert.alert("❌ ไม่มีข้อมูลผู้ใช้", "กรุณาสมัครสมาชิกก่อน");
      return;
    }

    if (username === storedUser.username && password === storedUser.password) {
      Alert.alert("เข้าสู่ระบบสำเร็จ 🎉", "ยินดีต้อนรับ " + storedUser.username);
      navigation.navigate("Home");
    } else {
      Alert.alert("❌ ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔐 Login</Text>

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

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginText}>LOGIN</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register")} style={styles.registerButton}>
        <Text style={styles.registerText}>Register</Text>
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
  loginButton: {
    width: "85%",
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#1abc9c",
    alignItems: "center",
    marginTop: 10,
  },
  loginText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "MahpaDemo",
  },
  registerButton: {
    marginTop: 5,
    alignSelf: "flex-end",
    marginRight: "7.5%",
  },
  registerText: {
    color: "#ffffff",
    fontSize: 16,
    textDecorationLine: "underline",
    fontFamily: "System",
  },
});

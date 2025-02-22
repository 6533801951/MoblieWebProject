import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import * as Font from "expo-font";
import AppLoading from "expo-app-loading";

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const loadFonts = async () => {
    await Font.loadAsync({
      "MahpaDemo": require("../assets/fonts/MahpaDemo.ttf"),
    });
    setFontsLoaded(true);
  };

  if (!fontsLoaded) {
    return <AppLoading startAsync={loadFonts} onFinish={() => setFontsLoaded(true)} onError={console.warn} />;
  }

  const handleLogin = () => {
    if (username === "admin" && password === "1234") {
      setIsLoggingIn(true);
      Alert.alert("เข้าสู่ระบบสำเร็จ 🎉", "ยินดีต้อนรับ Admin!");

      setTimeout(() => {
        setIsLoggingIn(false);
        navigation.navigate("Home");
      }, 2000);
    } else {
      Alert.alert("เกิดข้อผิดพลาด ❌", "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
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
        editable={!isLoggingIn}
      />

      <TextInput
        style={[styles.input, styles.defaultFont]}
        placeholder="Password"
        placeholderTextColor="#95a5a6"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        editable={!isLoggingIn}
      />

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={isLoggingIn}>
        <Text style={styles.loginText}>{isLoggingIn ? "กำลังเข้าสู่ระบบ..." : "LOGIN"}</Text>
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
    alignSelf: "flex-end",
    marginTop: 5,
    marginRight: "7.5%",
  },
  registerText: {
    color: "#ffffff",
    fontSize: 16,
    textDecorationLine: "underline",
    fontFamily: "System",
  },
});

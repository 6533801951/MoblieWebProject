import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import * as Font from "expo-font";
import AppLoading from "expo-app-loading";

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fontsLoaded, setFontsLoaded] = useState(false);

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
      Alert.alert("เข้าสู่ระบบสำเร็จ 🎉", "ยินดีต้อนรับ Admin!");
      navigation.navigate("Home");
    } else {
      Alert.alert("เกิดข้อผิดพลาด ❌", "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔐 Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#95a5a6"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#95a5a6"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginText}>LOGIN</Text>
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
    fontFamily: "MahpaDemo",
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
});

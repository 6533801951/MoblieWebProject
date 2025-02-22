import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: "16500471511-9ivse3lv6rrqs7941di5u3ppl0hvhk3p.apps.googleusercontent.com",
    androidClientId: "16500471511-9ivse3lv6rrqs7941di5u3ppl0hvhk3p.apps.googleusercontent.com",
    iosClientId: "16500471511-9ivse3lv6rrqs7941di5u3ppl0hvhk3p.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(() => {
          Alert.alert("✅ เข้าสู่ระบบด้วย Google สำเร็จ!");
          navigation.navigate("Home");
        })
        .catch((error) => {
          Alert.alert("❌ Google Login Error", error.message);
        });
    }
  }, [response]);

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        Alert.alert("✅ เข้าสู่ระบบสำเร็จ!");
        navigation.navigate("Home");
      })
      .catch((error) => {
        Alert.alert("❌ ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง", error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔐 Login</Text>

      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginText}>LOGIN</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate("Register")}>
        <Text style={styles.registerText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.googleButton} onPress={() => promptAsync()}>
        <Text style={styles.googleText}>Login with Google</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#2c3e50", padding: 20 },
  title: { fontSize: 30, fontWeight: "bold", color: "#ebedef", marginBottom: 30 },
  input: { width: "85%", padding: 12, marginBottom: 15, borderRadius: 8, backgroundColor: "#ebedef", color: "#2c3e50", fontSize: 16 },
  loginButton: { width: "85%", padding: 15, borderRadius: 8, backgroundColor: "#1abc9c", alignItems: "center", marginTop: 10 },
  loginText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  googleButton: { width: "85%", padding: 15, borderRadius: 8, backgroundColor: "#468cfe", alignItems: "center", marginTop: 10, },
  googleText: { color: "#ffffff", fontSize: 18, fontWeight: "bold" },
  registerButton: { width: "85%", padding: 15, borderRadius: 8, backgroundColor: "#E74C3C", alignItems: "center", marginTop: 10 },
  registerText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});

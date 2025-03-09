import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ImageBackground } from "react-native";
import { auth } from "./firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Icon from 'react-native-vector-icons/FontAwesome';

export default function Register({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // เพิ่มช่องกรอก Password Again

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Password mismatch", "Passwords do not match.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("Registration Successful", "You can now log in.");
      navigation.replace("Login");
    } catch (error) {
      Alert.alert("Registration Failed", error.message);
    }
  };

  return (
    <ImageBackground source={require('./assets/bg.png')} style={styles.container}>
      <Text style={styles.title}>Register</Text>

      {/* Email input with key icon */}
      <View style={styles.inputContainer}>
        <Icon name="envelope" size={20} color="#fff" style={styles.icon} />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
      </View>

      {/* Password input with lock icon and eye toggle */}
      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="#fff" style={styles.icon} />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
      </View>

      {/* Confirm Password input */}
      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="#fff" style={styles.icon} />
        <TextInput
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          style={styles.input}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonLogin} onPress={() => navigation.navigate("Login")}>
        <Text style={styles.buttonText}>BACK</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    resizeMode: 'cover', // ให้ภาพพื้นหลังเต็มจอ
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 40,
    color: "#fff", // ใช้สีขาวเพื่อให้ตรงกับสีพื้นหลัง
  },
  inputContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#fff",  // ปรับขอบให้เป็นสีขาว
    backgroundColor: "rgba(255, 255, 255, 0.7)", // พื้นหลังโปร่งแสง
    padding: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    width: "80%",
    fontSize: 16,
    color: "#333", // ปรับสีตัวอักษรเป็นสีเข้ม
  },
  button: {
    width: "100%",
    padding: 15,
    backgroundColor: "#9a4dc3", // ปุ่ม Register สีม่วง
    borderRadius: 8,
    marginBottom: 15,
    alignItems: "center",
  },
  buttonLogin: {
    width: "100%",
    padding: 15,
    backgroundColor: "#7a3eb2", // ปุ่ม Go to Login สีม่วงเข้ม
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

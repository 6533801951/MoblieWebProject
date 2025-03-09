import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ImageBackground } from "react-native";
import { auth } from "./firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import Icon from 'react-native-vector-icons/FontAwesome';

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.replace("Home");
    } catch (error) {
      Alert.alert("Login Failed", error.message);
    }
  };

  return (
    <ImageBackground source={require('./assets/bg.png')} style={styles.container}>
      <Text style={styles.title}>Login</Text>

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
          secureTextEntry={!showPassword}
          style={styles.input}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
          <Icon name={showPassword ? "eye-slash" : "eye"} size={20} color="#000" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonRegister} onPress={() => navigation.navigate("Register")}>
        <Text style={styles.buttonText}>Register</Text>
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
    resizeMode: 'cover',
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 40,
    color: "#fff",
  },
  inputContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#fff",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    padding: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    width: "80%",
    fontSize: 16,
    color: "#333",
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    top: 18,
  },
  button: {
    width: "100%",
    padding: 15,
    backgroundColor: "#9a4dc3",
    borderRadius: 8,
    marginBottom: 15,
    alignItems: "center",
  },
  buttonRegister: {
    width: "100%",
    padding: 15,
    backgroundColor: "#7a3eb2",
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

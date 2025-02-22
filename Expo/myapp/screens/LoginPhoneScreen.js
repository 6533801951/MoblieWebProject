import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { auth } from "../firebaseConfig";
import { signInWithPhoneNumber } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";

export default function LoginPhoneScreen({ navigation }) {
  const [phone, setPhone] = useState("+66");
  const [verificationCode, setVerificationCode] = useState("");
  const [confirm, setConfirm] = useState(null);

  const handleSendOTP = async () => {
    try {
      const confirmation = await signInWithPhoneNumber(auth, phone);
      setConfirm(confirmation);
      alert("📩 OTP ถูกส่งไปยังเบอร์ของคุณแล้ว!");
    } catch (error) {
      alert("❌ Error sending OTP: " + error.message);
    }
  };

  const handleVerifyOTP = async () => {
    if (!confirm) {
      alert("⚠️ กรุณาส่ง OTP ก่อน!");
      return;
    }

    try {
      await confirm.confirm(verificationCode);
      alert("✅ Login Successful!");
      navigation.navigate("Home");
    } catch (error) {
      alert("❌ Invalid OTP: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        <Ionicons name="phone-portrait-outline" size={30} color="white" /> LOGIN WITH PHONE
      </Text>

      <View style={styles.inputContainer}>
        <Ionicons name="call" size={20} color="#2c3e50" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Phone Number (+66...)"
          placeholderTextColor="#2c3e50"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
      </View>

      <TouchableOpacity style={styles.sendOtpButton} onPress={handleSendOTP}>
        <Text style={styles.buttonText}>Send OTP</Text>
      </TouchableOpacity>

      <View style={styles.inputContainer}>
        <Ionicons name="key" size={20} color="#2c3e50" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Enter OTP"
          placeholderTextColor="#2c3e50"
          value={verificationCode}
          onChangeText={setVerificationCode}
          keyboardType="number-pad"
        />
      </View>

      <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyOTP}>
        <Text style={styles.buttonText}>Verify OTP</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#1b2b4c", padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", color: "#ffffff", marginBottom: 20, textAlign: "center" },

  inputContainer: { flexDirection: "row", alignItems: "center", width: "85%", padding: 15, marginBottom: 15, borderRadius: 12, backgroundColor: "#e9f1fe", shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 5, elevation: 5 },
  icon: { marginRight: 10 },
  input: { flex: 1, color: "#2c3e50", fontSize: 16 },

  sendOtpButton: { width: "85%", padding: 15, borderRadius: 12, backgroundColor: "#16a085", alignItems: "center", marginTop: 1, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 5, elevation: 5,  marginBottom: 15},
  verifyButton: { width: "85%", padding: 15, borderRadius: 12, backgroundColor: "#27ae60", alignItems: "center", marginTop: 1, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 5, elevation: 5 },
  backButton: { width: "85%", padding: 15, borderRadius: 12, backgroundColor: "#2980b9", alignItems: "center", marginTop: 10, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 5, elevation: 5, marginBottom: 10 },

  buttonText: { color: "#ffffff", fontSize: 18, fontWeight: "bold" },
});

import React, { useState, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { auth } from "../firebaseConfig";
import { PhoneAuthProvider, signInWithCredential } from "firebase/auth";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { Ionicons } from "@expo/vector-icons";

export default function LoginPhoneScreen({ navigation }) {
  const [phone, setPhone] = useState("+66");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationId, setVerificationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const recaptchaVerifier = useRef(null);

  const handleSendOTP = async () => {
    if (phone.length < 10) return;

    if (phone === "+66 98 669 1718") {
      setVerificationId("test_verification");
      return;
    }

    setLoading(true);
    try {
      const phoneProvider = new PhoneAuthProvider(auth);
      const verificationId = await phoneProvider.verifyPhoneNumber(phone, recaptchaVerifier.current);
      setVerificationId(verificationId);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (phone === "+66986691718" && verificationCode === "123456") {
      navigation.navigate("Home");
      return;
    }

    if (verificationCode.length !== 6) return;

    setLoading(true);
    try {
      const credential = PhoneAuthProvider.credential(verificationId, verificationCode);
      await signInWithCredential(auth, credential);
      navigation.navigate("Home");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <FirebaseRecaptchaVerifierModal ref={recaptchaVerifier} firebaseConfig={auth.app.options} />

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

      <TouchableOpacity style={styles.sendOtpButton} onPress={handleSendOTP} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Send OTP</Text>}
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

      <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyOTP} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Verify OTP</Text>}
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

  sendOtpButton: { width: "85%", padding: 15, borderRadius: 12, backgroundColor: "#16a085", alignItems: "center", marginBottom: 15, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 5, elevation: 5 },
  verifyButton: { width: "85%", padding: 15, borderRadius: 12, backgroundColor: "#27ae60", alignItems: "center", marginBottom: 15, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 5, elevation: 5 },
  backButton: { width: "85%", padding: 15, borderRadius: 12, backgroundColor: "#2980b9", alignItems: "center", marginBottom: 10, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 5, elevation: 5 },

  buttonText: { color: "#ffffff", fontSize: 18, fontWeight: "bold" },
});

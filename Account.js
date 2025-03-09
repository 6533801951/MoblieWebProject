import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ImageBackground, ActivityIndicator } from "react-native";
import { auth, db } from "./firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";

export default function Account() {
  const [name, setName] = useState("");
  const [stdid, setStdId] = useState("");
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const user = auth.currentUser;

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setName(userData.name || "");
        setStdId(userData.stdid || "");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false); // เมื่อโหลดข้อมูลเสร็จ
    }
  };

  const handleUpdateProfile = async () => {
    if (!name.trim() || !stdid.trim()) {
      Alert.alert("Error", "กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    try {
      await setDoc(doc(db, "users", user.uid), { name, stdid }, { merge: true });
      Alert.alert("สำเร็จ", "ข้อมูลถูกบันทึกเรียบร้อย!");
      navigation.goBack();
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "ไม่สามารถบันทึกข้อมูลได้");
    }
  };

  return (
    <ImageBackground source={require("./assets/bg.png")} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>แก้ไขโปรไฟล์</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : (
        <View style={styles.formContainer}>
          <Text style={styles.label}>ชื่อ-นามสกุล</Text>
          <TextInput
            placeholder="กรอกชื่อ-นามสกุล"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />

          <Text style={styles.label}>รหัสนักศึกษา</Text>
          <TextInput
            placeholder="กรอกรหัสนักศึกษา"
            value={stdid}
            onChangeText={setStdId}
            style={styles.input}
          />

          {/* ปุ่มบันทึกข้อมูล */}
          <TouchableOpacity style={styles.saveButton} onPress={handleUpdateProfile}>
            <Text style={styles.buttonText}>บันทึกข้อมูล</Text>
          </TouchableOpacity>
        </View>
      )}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    resizeMode: "cover",
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  formContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 20,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    alignSelf: "flex-start",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    marginBottom: 15,
    fontSize: 16,
  },
  saveButton: {
    width: "100%",
    padding: 15,
    backgroundColor: "#9a4dc3",
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import { auth, db } from "../firebaseConfig";
import { getDoc, setDoc, doc } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";

export default function AccountScreen({ navigation }) {
  const user = auth.currentUser;
  const [loading, setLoading] = useState(true);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [studentID, setStudentID] = useState("");
  const [faculty, setFaculty] = useState("");
  const [major, setMajor] = useState("");
  const [gender, setGender] = useState("");
  const [phone, setPhone] = useState("");
  const [birthdate, setBirthdate] = useState("");

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setFirstName(data.firstName || "");
        setLastName(data.lastName || "");
        setStudentID(data.studentID || "");
        setFaculty(data.faculty || "");
        setMajor(data.major || "");
        setGender(data.gender || "");
        setPhone(data.phone || "");
        setBirthdate(data.birthdate || "");
      }
    } catch (error) {
      console.error("Error fetching user data: ", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ บันทึกข้อมูลลง Firestore
  const saveUserData = async () => {
    if (!firstName || !lastName || !studentID || !faculty || !major || !gender) {
      Alert.alert("⚠️ กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน");
      return;
    }

    try {
      await setDoc(doc(db, "users", user.uid), {
        firstName,
        lastName,
        studentID,
        faculty,
        major,
        gender,
        phone,
        birthdate,
      });

      Alert.alert("✅ บันทึกข้อมูลสำเร็จ!");
    } catch (error) {
      console.error("Error saving user data: ", error);
      Alert.alert("❌ บันทึกข้อมูลไม่สำเร็จ!");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>👤 ข้อมูลส่วนตัว</Text>

      <TextInput style={styles.input} placeholder="ชื่อจริง *" value={firstName} onChangeText={setFirstName} />
      <TextInput style={styles.input} placeholder="นามสกุล *" value={lastName} onChangeText={setLastName} />
      <TextInput style={styles.input} placeholder="รหัสนักศึกษา *" value={studentID} onChangeText={setStudentID} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="คณะ *" value={faculty} onChangeText={setFaculty} />
      <TextInput style={styles.input} placeholder="สาขา *" value={major} onChangeText={setMajor} />
      <TextInput style={styles.input} placeholder="เพศ (ชาย/หญิง) *" value={gender} onChangeText={setGender} />

      <TextInput style={styles.input} placeholder="เบอร์โทรศัพท์ (ไม่บังคับ)" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder="วันเกิด (DD/MM/YYYY) (ไม่บังคับ)" value={birthdate} onChangeText={setBirthdate} />

      <TouchableOpacity style={styles.saveButton} onPress={saveUserData}>
        <Text style={styles.buttonText}>บันทึกข้อมูล</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back-circle-outline" size={24} color="white" />
        <Text style={styles.buttonText}>กลับ</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#1b2b4c", padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", color: "#ffffff", marginBottom: 20 },

  input: {
    width: "85%",
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: "#e9f1fe",
    fontSize: 16,
    color: "#2c3e50",
  },

  saveButton: {
    width: "85%",
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#27ae60",
    alignItems: "center",
    marginTop: 10,
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "85%",
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#2980b9",
    marginTop: 10,
  },

  buttonText: { color: "#ffffff", fontSize: 18, fontWeight: "bold" },
});

import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, Alert } from "react-native";
import { auth, db } from "./firebaseConfig";
import { collection, doc, setDoc, getDoc, getDocs, deleteDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";

export default function HomeScreen() {
  const [userData, setUserData] = useState(null);
  const [cid, setCid] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [studentId, setStudentId] = useState("");
  const [fullName, setFullName] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);
  const navigation = useNavigation();
  const user = auth.currentUser;
  const route = useRoute();
  const [subjectCode, setSubjectCode] = useState("");

  useEffect(() => {
    if (user) {
      checkUserData();
      fetchSubjects();
    }
  }, [user]);

  useEffect(() => {
    if (route.params?.subjectCode) {
      setSubjectCode(route.params.subjectCode);
    }
  }, [route.params?.subjectCode]);

  const checkUserData = async () => {
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      } else {
        setIsNewUser(true);
      }
    } catch (error) {
      console.error("Error checking user data:", error);
    }
  };

  const handleRegister = async () => {
    if (!studentId.trim() || !fullName.trim()) {
      Alert.alert("Error", "กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    try {
      await setDoc(doc(db, "users", user.uid), {
        stdid: studentId,
        name: fullName,
      });

      setUserData({ stdid: studentId, name: fullName });
      setIsNewUser(false);
    } catch (error) {
      console.error("Error registering user:", error);
      Alert.alert("Error", "ไม่สามารถลงทะเบียนได้");
    }
  };

  const fetchSubjects = async () => {
    try {
      const subjectsRef = collection(db, `users/${user.uid}/classroom`);
      const snapshot = await getDocs(subjectsRef);
      const subjectList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSubjects(subjectList);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const handleAddSubject = async () => {
    if (!cid.trim()) {
      Alert.alert("Error", "กรุณากรอกรหัสวิชา");
      return;
    }

    try {
      const subjectDoc = await getDoc(doc(db, `classroom/${cid}`));
      if (!subjectDoc.exists()) {
        Alert.alert("Error", "ไม่พบวิชานี้ในระบบ");
        return;
      }

      const subjectData = subjectDoc.data();
      const subjectName = subjectData?.info?.name || "Unknown";

      await setDoc(doc(db, `classroom/${cid}/students`, user.uid), {
        stdid: userData?.stdid || "Unknown",
        name: userData?.name || "Unknown",
      }, { merge: true });

      await setDoc(doc(db, `users/${user.uid}/classroom`, cid), {
        status: 2,
        name: subjectName,
      }, { merge: true });

      Alert.alert("สำเร็จ", `เพิ่มวิชา ${subjectName} เรียบร้อย`);
      setCid("");
      fetchSubjects();
    } catch (error) {
      console.error("Error adding subject:", error);
      Alert.alert("Error", "ไม่สามารถเพิ่มวิชาได้");
    }
  };

  const handleRemoveSubject = async (cid) => {
    try {
      await deleteDoc(doc(db, `users/${user.uid}/classroom`, cid));
      await deleteDoc(doc(db, `classroom/${cid}/students`, user.uid));

      Alert.alert("สำเร็จ", "ลบวิชาเรียบร้อย");
      fetchSubjects();
    } catch (error) {
      console.error("Error removing subject:", error);
      Alert.alert("Error", "ไม่สามารถลบวิชาได้");
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      Alert.alert("Logout", "ออกจากระบบเรียบร้อย");
      navigation.replace("Login");
    } catch (error) {
      console.error("Error logging out:", error);
      Alert.alert("Error", "ไม่สามารถออกจากระบบได้");
    }
  };

  if (isNewUser) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
        <Text style={{ fontSize: 20, marginBottom: 10 }}>กรอกข้อมูลลงทะเบียน</Text>
        <Text>อีเมล: {user.email}</Text>
        <TextInput
          placeholder="รหัสนักศึกษา"
          value={studentId}
          onChangeText={setStudentId}
          style={{ borderWidth: 1, padding: 8, marginBottom: 10, width: "80%" }}
        />
        <TextInput
          placeholder="ชื่อ-นามสกุล"
          value={fullName}
          onChangeText={setFullName}
          style={{ borderWidth: 1, padding: 8, marginBottom: 10, width: "80%" }}
        />
        <Button title="ลงทะเบียน" onPress={handleRegister} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {userData && (
        <View style={{ marginBottom: 20 }}>
          <Text>ชื่อ: {userData.name}</Text>
          <Text>รหัสนักศึกษา: {userData.stdid}</Text>
          <Button title="แก้ไขโปรไฟล์" onPress={() => navigation.navigate("Account")} />
        </View>
      )}

      <TextInput
        placeholder="กรอกรหัสวิชา"
        value={cid}
        onChangeText={setCid}
        style={{ borderWidth: 1, padding: 8, marginBottom: 10 }}
      />
      <Button title="เพิ่มวิชา" onPress={handleAddSubject} />
      <Button title="Scan QR Code" onPress={() => navigation.navigate("Qrcode")} />

      <Text style={{ marginTop: 20, fontWeight: "bold" }}>รายชื่อวิชาที่เรียน</Text>
      <FlatList
        data={subjects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 10, borderBottomWidth: 1 }}>
            <TouchableOpacity onPress={() => navigation.navigate("Subject", { cid: item.id, name: item.name })}>
              <Text>{item.name || item.id}</Text>
            </TouchableOpacity>
            <Button title="ลบ" color="red" onPress={() => handleRemoveSubject(item.id)} />
          </View>
        )}
      />

      <View style={{ marginTop: 20 }}>
        <Button title="ออกจากระบบ" color="red" onPress={handleLogout} />
      </View>
    </View>
  );
}

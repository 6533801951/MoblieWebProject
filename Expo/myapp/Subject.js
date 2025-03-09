import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { db, auth } from "./firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

export default function Subject({ route }) {
  const { cid, name } = route.params;
  const [cno, setCno] = useState("");
  const [code, setCode] = useState("");
  const [remark, setRemark] = useState("");
  const [status, setStatus] = useState(1);
  const [userData, setUserData] = useState({ stdid: "", name: "" });
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const user = auth.currentUser;
  const navigation = useNavigation();

  const fetchUserData = async () => {
    try {
      const userDoc = await getDoc(
        doc(db, `classroom/${cid}/students`, user.uid)
      );
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const handleCheckIn = async () => {
    if (!cno.trim() || !code.trim()) {
      Alert.alert(
        "Error",
        "กรุณากรอกรหัสเข้าเรียน (cno) และรหัสการเข้าเรียน (code)"
      );
      return;
    }

    try {
      const checkinRef = doc(
        db,
        `classroom/${cid}/checkin/${cno}/students`,
        user.uid
      );

      const subjectDoc = await getDoc(
        doc(db, `classroom/${cid}/checkin/${cno}`)
      );
      const subjectData = subjectDoc.data();
      const validCode = subjectData?.code;

      if (code !== validCode) {
        Alert.alert("Error", "รหัสไม่ถูกต้อง");
        return;
      }

      const currentDate = new Date();

      await setDoc(checkinRef, {
        cno: cno,
        stdid: userData?.stdid || "Unknown",
        name: userData?.name || "Unknown",
        remark: "มาเรียน",
        status: status,
        date: currentDate,
      });

      setIsCheckedIn(true);
      Alert.alert("สำเร็จ", "บันทึกการเช็คชื่อ มาเรียน เรียบร้อย");
    } catch (error) {
      console.error("Error checking in:", error);
      Alert.alert("Error", "ไม่สามารถบันทึกการเช็คชื่อได้");
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <Text style={{ fontSize: 20, marginBottom: 10 }}>
        Welcome to {name}
      </Text>

      {!isCheckedIn && (
        <View style={{ marginTop: 20 }}>
          <Button title="เช็คชื่อ" onPress={() => setIsCheckedIn(true)} />
        </View>
      )}

      {isCheckedIn && (
        <View style={{ marginTop: 20 }}>
          <Text>กรอกรหัสเพื่อเข้าเรียน:</Text>
          <TextInput
            placeholder="รหัสเข้าเรียน"
            value={code}
            onChangeText={setCode}
            style={{
              borderWidth: 1,
              padding: 8,
              marginBottom: 10,
              width: "80%",
            }}
          />
          <Text>กรอกหมายเลขการเข้าเรียน (cno):</Text>
          <TextInput
            placeholder="กรอกหมายเลข cno"
            value={cno}
            onChangeText={setCno}
            style={{
              borderWidth: 1,
              padding: 8,
              marginBottom: 10,
              width: "80%",
            }}
          />
        </View>
      )}

      {cno && code && (
        <View style={{ marginTop: 20 }}>
          <Button title="ยืนยันการเช็คชื่อ" onPress={handleCheckIn} />
        </View>
      )}

      <Button
        title="ถามตอบ Quiz"
        onPress={() => navigation.navigate("Quiz", { cid: cid, cno: cno })}
      />
      <View style={{ marginTop: 10 }}>
                    <Button title="Back" onPress={() => navigation.goBack()} />
                  </View>
    </View>
  );
}

import React, { useState, useEffect, useRef } from "react";
import { View, Text, Button, Image, StyleSheet, TouchableOpacity, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera, CameraView } from "expo-camera";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "./firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function QrcodeScreen() {
  const navigation = useNavigation();
  const cameraRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [scannedData, setScannedData] = useState("");
  const [capturedImage, setCapturedImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isScanning, setIsScanning] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  // 📌 ฟังก์ชันกดถ่ายรูป
  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setCapturedImage(photo.uri);
    }
  };

  // 📌 ฟังก์ชันเลือกรูปภาพจากแกลเลอรี
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  // 📌 ฟังก์ชันใช้ Barcode Scanner เพื่อสแกน QR Code จริง
  const handleBarcodeScanned = ({ data }) => {
    if (!isScanning) return;
    setIsScanning(false);
    setScannedData(data);
  };

  // 📌 ฟังก์ชันเพิ่มนักศึกษาใน Firebase และกลับไป Home
  const addStudentToClassroom = async () => {
    if (!scannedData) {
      Alert.alert("Error", "ไม่พบรหัสวิชา");
      return;
    }

    try {
      // ✅ ดึงข้อมูลวิชา
      const subjectDoc = await getDoc(doc(db, `classroom/${scannedData}`));
      if (!subjectDoc.exists()) {
        Alert.alert("Error", "ไม่พบวิชานี้ในระบบ");
        return;
      }
      const subjectData = subjectDoc.data();
      const subjectName = subjectData?.info?.name || "Unknown";

      // ✅ ดึงข้อมูลนักศึกษาจาก Firestore
      const userDoc = await getDoc(doc(db, `users/${user.uid}`));
      if (!userDoc.exists()) {
        Alert.alert("Error", "ไม่พบนักศึกษาในระบบ");
        return;
      }
      const userData = userDoc.data();
      const stdid = userData.stdid || user.uid;  // ใช้ stdid ถ้ามี, ถ้าไม่มีให้ใช้ uid
      const name = userData.name || "Unknown";   // ใช้ name ถ้ามี, ถ้าไม่มีให้ใส่ "Unknown"

      // ✅ บันทึกข้อมูลนักศึกษาไปยัง `classroom/{scannedData}/students/{uid}`
      await setDoc(
        doc(db, `classroom/${scannedData}/students`, user.uid),
        {
          stdid: stdid,
          name: name
        },
        { merge: true }
      );

      Alert.alert("สำเร็จ", `เพิ่มนักศึกษา ${name} (${stdid}) ไปยังวิชา ${subjectName} เรียบร้อย`);
      navigation.navigate("Home"); // ✅ กลับหน้า Home อัตโนมัติ
    } catch (error) {
      console.error("Error adding student:", error);
      Alert.alert("Error", "ไม่สามารถเพิ่มนักศึกษาได้");
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.centeredView}>
        <Text>กำลังขออนุญาตเข้าถึงกล้อง...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.centeredView}>
        <Text>การเข้าถึงกล้องถูกปฏิเสธ</Text>
        <Button
          title="ขออนุญาตอีกครั้ง"
          onPress={async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === "granted");
          }}
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {scannedData ? (
        <View style={styles.centeredView}>
          <Text style={styles.resultText}>QR Code ที่อ่านได้:</Text>
          <Text style={styles.qrData}>CID: {scannedData}</Text>
          <Button title="➕ เพิ่มนักศึกษา" onPress={addStudentToClassroom} />
          <Button title="สแกนใหม่" onPress={() => {
            setScannedData("");
            setCapturedImage(null);
            setSelectedImage(null);
            setIsScanning(true);
          }} />
        </View>
      ) : (
        <>
          {capturedImage || selectedImage ? (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <Image source={{ uri: capturedImage || selectedImage }} style={styles.imagePreview} />
              <Button title="✅ ยืนยันเพื่อสแกน QR Code" onPress={() => setScannedData("กำลังเพิ่มการสแกนจากภาพ")} />
            </View>
          ) : (
            <CameraView
              style={{ flex: 1 }}
              facing="back"
              onBarcodeScanned={handleBarcodeScanned}
            />
          )}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
              <Text style={styles.buttonText}>ถ่ายรูป</Text>
            </TouchableOpacity>
            <Button title="📁 เลือก QR Code จากแกลเลอรี" onPress={pickImage} />
            <View style={{ marginTop: 10 }}>
              <Button title="Back" onPress={() => navigation.goBack()} />
            </View>
          </View>
        </>
      )}
    </View>
  );
}

// 📌 สไตล์ของคอมโพเนนต์
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  resultText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  qrData: {
    fontSize: 16,
    color: "blue",
    marginBottom: 20,
  },
  imagePreview: {
    width: 300,
    height: 300,
    resizeMode: "contain",
    marginBottom: 20,
  },
  buttonContainer: {
    padding: 20,
    alignItems: "center",
  },
  captureButton: {
    backgroundColor: "#ff5733",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

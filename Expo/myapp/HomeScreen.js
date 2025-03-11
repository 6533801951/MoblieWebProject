import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert, StyleSheet, ImageBackground } from "react-native";
import { auth, db } from "./firebaseConfig";
import { collection, doc, setDoc, getDoc, getDocs, deleteDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { useRoute } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/FontAwesome';

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
    if (route.params?.subjectName) {
        fetchSubjects();
    }
  }, [route.params?.subjectName]);

  useEffect(() => {
    if (route.params?.subjectCode) {
      setSubjectCode(route.params.subjectCode);
    }
  }, [route.params?.subjectCode]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", fetchSubjects);
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (route.params?.refresh) {
        fetchSubjects();
    }
  }, [route.params?.refresh]);


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
        const classCollection = collection(db, "classroom");
        const classSnapshot = await getDocs(classCollection);
        let enrolledSubjects = [];

        for (const classDoc of classSnapshot.docs) {
            const classId = classDoc.id;
            const studentRef = doc(db, `classroom/${classId}/students/${user.uid}`);
            const studentSnap = await getDoc(studentRef);

            if (studentSnap.exists()) {
                const classData = classDoc.data();
                enrolledSubjects.push({ id: classId, name: classData?.info?.name || classId });
            }
        }

        setSubjects(enrolledSubjects);
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

      setSubjects([...subjects, { id: cid, name: subjectName }]);

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
      <ImageBackground source={require('./assets/bg.png')} style={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>กรอกข้อมูลลงทะเบียน</Text>
          <Text style={styles.emailText}>อีเมล: {user.email}</Text>
          <TextInput
            placeholder="รหัสนักศึกษา"
            value={studentId}
            onChangeText={setStudentId}
            style={styles.input}
          />
          <TextInput
            placeholder="ชื่อ-นามสกุล"
            value={fullName}
            onChangeText={setFullName}
            style={styles.input}
          />
          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>ลงทะเบียน</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground source={require('./assets/bg.png')} style={styles.container}>
      <View style={styles.formContainer}>
        {userData && (
          <View style={styles.userInfo}>
            <Text style={styles.userText}>ชื่อ: {userData.name}</Text>
            <Text style={styles.userText}>รหัสนักศึกษา: {userData.stdid}</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Account")}>
              <Text style={styles.link}>แก้ไขโปรไฟล์</Text>
            </TouchableOpacity>
          </View>
        )}

        <TextInput
          placeholder="กรอกรหัสวิชา"
          value={cid}
          onChangeText={setCid}
          style={styles.input}
        />
        <TouchableOpacity style={styles.button} onPress={handleAddSubject}>
          <Text style={styles.buttonText}>เพิ่มวิชา</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Qrcode")}>
          <Text style={styles.buttonText}>Scan QR Code</Text>
        </TouchableOpacity>

        <Text style={styles.subjectsTitle}>รายชื่อวิชาที่เรียน</Text>
        <FlatList
          data={subjects}
          keyExtractor={(item) => item.id}
          extraData={subjects}
          renderItem={({ item }) => (
            <View style={styles.subjectItem}>
              <TouchableOpacity onPress={() => navigation.navigate("Subject", { cid: item.id, name: item.name })}>
                <Text>{item.name || item.id}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleRemoveSubject(item.id)}>
                <Icon name="trash" size={20} color="red" />
              </TouchableOpacity>
            </View>
          )}
        />

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.buttonText}>ออกจากระบบ</Text>
        </TouchableOpacity>
      </View>
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
  formContainer: {
    width: "100%",
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    width: "80%",
  },
  button: {
    backgroundColor: "#7a3eb2",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  userInfo: {
    marginBottom: 20,
  },
  userText: {
    fontSize: 16,
    marginBottom: 5,
  },
  link: {
    color: "#007bff",
    textDecorationLine: "underline",
  },
  subjectsTitle: {
    marginTop: 20,
    fontWeight: "bold",
  },
  subjectItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  logoutButton: {
    backgroundColor: "red",
    padding: 10,
    marginTop: 20,
    borderRadius: 8,
    alignItems: "center",
  },
});

import React, { useState, useEffect } from "react";
import { 
    View, Text, TextInput, Alert, StyleSheet, 
    ImageBackground, TouchableOpacity 
} from "react-native";
import { db } from "./firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigation, useRoute } from "@react-navigation/native";
import { auth } from "./firebaseConfig"; // ✅ เพิ่ม auth เพื่อนำ uid ของผู้ใช้ปัจจุบันมาใช้

export default function Quiz() {
    const navigation = useNavigation();
    const route = useRoute();
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [questionShow, setQuestionShow] = useState(false);
    const [studentId, setStudentId] = useState("Unknown"); // ✅ ค่าเริ่มต้นเป็น Unknown
    const cid = route.params?.cid || null;
    const user = auth.currentUser;

    useEffect(() => {
        if (!cid) {
            Alert.alert("Error", "ไม่พบรหัสวิชา");
            navigation.goBack();
            return;
        }

        // ✅ ดึงค่า studentId จาก /users/{uid}/stdid
        const fetchStudentId = async () => {
            if (!user) return;

            try {
                const userRef = doc(db, `users/${user.uid}`);
                const userSnap = await getDoc(userRef);

                if (userSnap.exists()) {
                    const data = userSnap.data();
                    setStudentId(data.stdid || "Unknown");
                } else {
                    setStudentId("Unknown");
                }
            } catch (error) {
                console.error("Error fetching student ID:", error);
                setStudentId("Unknown");
            }
        };

        // ✅ ดึงคำถามจาก /classroom/{cid}/checkin/1/question/1
        const fetchQuestion = async () => {
            try {
                const questionRef = doc(db, `classroom/${cid}/checkin/1/question/1`);
                const questionSnap = await getDoc(questionRef);

                if (questionSnap.exists()) {
                    const data = questionSnap.data();
                    setQuestion(data.question_text || "ไม่มีคำถาม");
                    setQuestionShow(data.question_show === true);
                } else {
                    Alert.alert("Error", `ปัจจุบันยังไม่มีคำถามของวิชา ${cid}`);
                }
            } catch (error) {
                console.error("Error fetching question:", error);
                Alert.alert("Error", "ไม่สามารถโหลดคำถามได้");
            }
        };

        fetchStudentId(); // ✅ โหลด studentId ก่อน
        fetchQuestion();  // ✅ โหลดคำถามหลังจากนั้น
    }, [cid, user]); // ✅ โหลดใหม่เมื่อ `cid` หรือ `user` เปลี่ยนแปลง

    const handleSubmitAnswer = async () => {
        if (!answer.trim()) {
            Alert.alert("Error", "กรุณากรอกคำตอบก่อนส่ง");
            return;
        }

        try {
            const answerRef = doc(db, `classroom/${cid}/checkin/1/answers/1/students/${studentId}`);
            await setDoc(answerRef, {
                text: answer,
                time: new Date().toISOString(),
            });

            Alert.alert("สำเร็จ", "ส่งคำตอบเรียบร้อย!");
            setAnswer("");
        } catch (error) {
            console.error("Error submitting answer:", error);
            Alert.alert("Error", "ไม่สามารถส่งคำตอบได้");
        }
    };

    return (
        <ImageBackground source={require('./assets/bg.png')} style={styles.container}>
            <View style={styles.formContainer}>
                {questionShow ? ( 
                    <>
                        <Text style={styles.title}>Quiz : {question}</Text>

                        <TextInput
                            placeholder="พิมพ์คำตอบของคุณ..."
                            value={answer}
                            onChangeText={setAnswer}
                            style={styles.input}
                        />

                        <TouchableOpacity style={styles.button} onPress={handleSubmitAnswer}>
                            <Text style={styles.buttonText}>Submit</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <Text style={styles.closedText}>❌ คำถามถูกปิด ❌</Text> 
                )}

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
                        <Text style={styles.buttonText}>Back</Text>
                    </TouchableOpacity>
                </View>
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
        marginBottom: 20,
        width: "80%",
        borderRadius: 8,
        textAlign: "center",
    },
    button: {
        backgroundColor: "#7a3eb2",
        padding: 15,
        width: "80%",
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 10,
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    buttonContainer: {
        marginTop: 10,
        width: "100%",
        alignItems: "center",
    },
    closedText: {
        fontSize: 20,
        fontWeight: "bold",
        color: "red",
        textAlign: "center",
    },
});

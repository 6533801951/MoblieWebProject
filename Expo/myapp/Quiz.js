import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { db } from "./firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

export default function Quiz() {
  const navigation = useNavigation();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const studentId = "653380195-1";

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const questionRef = doc(db, "classroom/C02/checkin/1");
        const questionSnap = await getDoc(questionRef);

        if (questionSnap.exists()) {
          setQuestion(questionSnap.data().question_text || "ไม่มีคำถาม");
        } else {
          Alert.alert("Error", "ไม่พบคำถามของวิชา C02");
        }
      } catch (error) {
        console.error("Error fetching question:", error);
        Alert.alert("Error", "ไม่สามารถโหลดคำถามได้");
      }
    };

    fetchQuestion();
  }, []);

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) {
      Alert.alert("Error", "กรุณากรอกคำตอบก่อนส่ง");
      return;
    }

    try {
      const answerRef = doc(db, `classroom/C02/checkin/1/answers/1/students/${studentId}`);
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
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 }}>
        คำถามจาก C02: {question}
      </Text>

      <TextInput
        placeholder="พิมพ์คำตอบของคุณ..."
        value={answer}
        onChangeText={setAnswer}
        style={{
          borderWidth: 1,
          padding: 10,
          width: "80%",
          marginBottom: 10,
          textAlign: "center",
        }}
      />

      <Button title="Submit" onPress={handleSubmitAnswer} />

      <View style={{ marginTop: 20 }}>
        <Button title="Back" onPress={() => navigation.goBack()} />
      </View>
    </View>
  );
}

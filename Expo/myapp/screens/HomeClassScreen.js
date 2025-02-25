import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function HomeClassScreen({ route, navigation }) {
  const { subjectName } = route.params || { subjectName: "Class" }; // รับค่าชื่อวิชาหรือใช้ค่าเริ่มต้น

  return (
    <View style={styles.container}>
      <StatusBar hidden={false} />
      <Text style={styles.headerTitle}>Welcome to {subjectName}</Text>

      <View style={styles.gridContainer}>
        <TouchableOpacity style={styles.card}>
          <Ionicons name="checkmark-circle-outline" size={40} color="#ffffff" />
          <Text style={styles.cardTitle}>Check-in</Text>
          <Text style={styles.cardSubtitle}>เช็คชื่อนักศึกษา</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Score")}>
          <Ionicons name="bar-chart-outline" size={40} color="#ffffff" />
          <Text style={styles.cardTitle}>Score</Text>
          <Text style={styles.cardSubtitle}>เช็คคะแนนของรายวิชา</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Ionicons name="stats-chart-outline" size={40} color="#ffffff" />
          <Text style={styles.cardTitle}>Attendance Summary</Text>
          <Text style={styles.cardSubtitle}>รายงานการเข้าเรียน</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Ionicons name="chatbox-ellipses-outline" size={40} color="#ffffff" />
          <Text style={styles.cardTitle}>Q&A Forum</Text>
          <Text style={styles.cardSubtitle}>ถาม/ตอบ ในห้องเรียน</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Ionicons name="podium-outline" size={40} color="#ffffff" />
          <Text style={styles.cardTitle}>Live Poll</Text>
          <Text style={styles.cardSubtitle}>สำรวจความคิดเห็นของนักศึกษา</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Home")}>
          <Ionicons name="arrow-back-circle-outline" size={40} color="#ffffff" />
          <Text style={styles.cardTitle}>Back</Text>
          <Text style={styles.cardSubtitle}>กลับไปหน้า Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1b2b4c", paddingHorizontal: 18 },

  headerTitle: { 
    fontSize: 30, 
    fontWeight: "bold", 
    color: "#ffffff", 
    position: "absolute", 
    top: 15, 
    alignSelf: "center",
  },

  gridContainer: { 
    flexDirection: "row", 
    flexWrap: "wrap", 
    justifyContent: "space-between", 
    width: "100%", 
    alignItems: "stretch",
    marginTop: "20%",
  },

  card: {
    width: "48%",
    aspectRatio: 1,
    backgroundColor: "#2c3e50",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#ffffff", marginTop: 10 },
  cardSubtitle: { fontSize: 14, color: "#dcdde1", marginTop: 5, textAlign: "center" },
});

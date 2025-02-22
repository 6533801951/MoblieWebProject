import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen({ navigation }) {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = now.getHours() % 12 || 12;
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const seconds = now.getSeconds().toString().padStart(2, "0");
      const ampm = now.getHours() >= 12 ? "PM" : "AM";
      setCurrentTime(`${hours}:${minutes}:${seconds} ${ampm}`);
    };

    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />

      <Text style={styles.headerTitle}>Welcome</Text>

      <View style={styles.gridContainer}>
        <TouchableOpacity style={styles.card}>
          <Ionicons name="checkmark-circle-outline" size={40} color="#ffffff" />
          <Text style={styles.cardTitle}>Check-in</Text>
          <Text style={styles.cardSubtitle}>เช็คชื่อนักศึกษา</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Ionicons name="time-outline" size={40} color="#ffffff" />
          <Text style={styles.cardTitle}>Current Time</Text>
          <Text style={styles.cardSubtitle}>{currentTime}</Text>
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

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("Account")}>
          <Ionicons name="person-circle-outline" size={40} color="#ffffff" />
          <Text style={styles.cardTitle}>Account</Text>
          <Text style={styles.cardSubtitle}>จัดการข้อมูลส่วนตัว</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate("Login")}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
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
    top: 40, 
    alignSelf: "center",
  },

  logoutButton: { 
    position: "absolute", 
    bottom: 40, 
    alignSelf: "center", 
    backgroundColor: "#c0392b",
    paddingHorizontal: 20, 
    paddingVertical: 10, 
    borderRadius: 10, 
  },
  logoutText: { 
    fontSize: 18, 
    color: "#ffffff", 
    fontWeight: "bold", 
    textAlign: "center", 
  },

  gridContainer: { 
    flexDirection: "row", 
    flexWrap: "wrap", 
    justifyContent: "space-between", 
    width: "100%", 
    alignItems: "stretch",
    marginTop: "30%",
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

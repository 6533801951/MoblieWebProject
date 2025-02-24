import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar hidden={false} />
      <Text style={styles.headerTitle}>Welcome</Text>

      <View style={styles.gridContainer}>
      <TouchableOpacity style={styles.card}>
          <Ionicons name="person-circle-outline" size={40} color="#ffffff" />
          <Text style={styles.cardTitle}>ข้อมูลส่วนตัว</Text>
          <Text style={styles.cardSubtitle}>จัดการข้อมูลส่วนตัว</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Ionicons name="add-circle-outline" size={40} color="#ffffff" />
          <Text style={styles.cardTitle}>เพิ่มรายวิชา</Text>
          <Text style={styles.cardSubtitle}>เพิ่มรายวิชาที่คุณสนใจ</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Ionicons name="book-outline" size={40} color="#ffffff" />
          <Text style={styles.cardTitle}>รายวิชาที่เรียน</Text>
          <Text style={styles.cardSubtitle}>แสดงรายวิชาที่คุณลงทะเบียน</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("HomeClassScreen", { course: "C1" })}>
          <Ionicons name="school-outline" size={40} color="#ffffff" />
          <Text style={styles.cardTitle}>C1</Text>
          <Text style={styles.cardSubtitle}>รายละเอียดรายวิชา C1</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("HomeClassScreen", { course: "C2" })}>
          <Ionicons name="school-outline" size={40} color="#ffffff" />
          <Text style={styles.cardTitle}>C2</Text>
          <Text style={styles.cardSubtitle}>รายละเอียดรายวิชา C2</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("HomeClassScreen", { course: "C3" })}>
          <Ionicons name="school-outline" size={40} color="#ffffff" />
          <Text style={styles.cardTitle}>C3</Text>
          <Text style={styles.cardSubtitle}>รายละเอียดรายวิชา C3</Text>
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
    top: 15,
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

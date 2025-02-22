import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Welcome</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate("Login")}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.gridContainer}>
        <TouchableOpacity style={styles.card}>
          <Ionicons name="calendar-outline" size={40} color="#ffffff" />
          <Text style={styles.cardTitle}>Calendar</Text>
          <Text style={styles.cardSubtitle}>March, Wednesday</Text>
          <Text style={styles.cardInfo}>3 Events</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Ionicons name="cart-outline" size={40} color="#ffffff" />
          <Text style={styles.cardTitle}>Groceries</Text>
          <Text style={styles.cardSubtitle}>Broccoli, Apple</Text>
          <Text style={styles.cardInfo}>4 items</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Ionicons name="location-outline" size={40} color="#ffffff" />
          <Text style={styles.cardTitle}>Location</Text>
          <Text style={styles.cardSubtitle}>Lucy Mao going to Office</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Ionicons name="notifications-outline" size={40} color="#ffffff" />
          <Text style={styles.cardTitle}>Activity</Text>
          <Text style={styles.cardSubtitle}>Rose favorited your Post</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Ionicons name="checkmark-done-outline" size={40} color="#ffffff" />
          <Text style={styles.cardTitle}>To do</Text>
          <Text style={styles.cardSubtitle}>Homework, Design</Text>
          <Text style={styles.cardInfo}>4 items</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card}>
          <Ionicons name="settings-outline" size={40} color="#ffffff" />
          <Text style={styles.cardTitle}>Settings</Text>
          <Text style={styles.cardSubtitle}>Manage your account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1b2b4c", paddingHorizontal: 18 },

  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 30 },
  headerTitle: { fontSize: 28, fontWeight: "bold", color: "#ffffff", alignSelf: "flex-start", paddingTop: 1, marginLeft: 5, top: 20 },

  logoutButton: { 
    position: "absolute", 
    right: 10, 
    paddingHorizontal: 12, 
    paddingVertical: 5, 
    borderRadius: 8, 
    backgroundColor: "rgba(255,255,255,0.2)",
    top: 25, 
  },
  logoutText: { 
    fontSize: 16, 
    color: "#ffffff", 
    textDecorationLine: "none", 
    textAlign: "center" 
  },

  gridContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", width: "100%", alignItems: "center" },

  card: {
    width: "48%",
    backgroundColor: "#2c3e50",
    paddingVertical: 25,
    paddingHorizontal: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  cardTitle: { fontSize: 18, fontWeight: "bold", color: "#ffffff", marginTop: 10 },
  cardSubtitle: { fontSize: 14, color: "#dcdde1", marginTop: 5, textAlign: "center" },
  cardInfo: { fontSize: 12, color: "#a4b0be", marginTop: 5 },
});

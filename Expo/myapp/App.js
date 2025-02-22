import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "C:\Users\mamm0\Documents\Storage\Work\MoblieWebProject\Expo\myapp\screens\LoginScreen.js";
import RegisterScreen from "C:\Users\mamm0\Documents\Storage\Work\MoblieWebProject\Expo\myapp\screens\RegisterScreen.js";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: "เข้าสู่ระบบ" }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: "สมัครสมาชิก" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

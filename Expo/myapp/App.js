import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./Login";
import Register from "./Register";
import HomeScreen from "./HomeScreen";
import Subject from "./Subject";
import Quiz from "./Quiz";
import Account from "./Account";
import Qrcode from "./Qrcode";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Subject" component={Subject} />
        <Stack.Screen name="Quiz" component={Quiz} />
        <Stack.Screen name="Account" component={Account} />
        <Stack.Screen name="Qrcode" component={Qrcode} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
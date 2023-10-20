import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import AddGiftScreen from "./src/screens/AddGiftScreen";
import CalendarScreen from "./src/screens/CalendarScreen";
import { SafeAreaView } from 'react-native';
import LoginComponent from './src/screens/Login'; 

const Stack = createStackNavigator();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default function App() {
  return (
    
    <SafeAreaView style={styles.container}>
      <LoginComponent />
    </SafeAreaView>
  );
}

import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import Home from "./Home";
import CalendarScreen from "./src/screens/CalendarScreen";
import BudgetScreen from "./src/screens/BudgetScreen";
import AddGift from "./src/screens/AddGift";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./src/config/firebase";
import Login from "./src/screens/Login";
import SignUp from "./src/screens/SignUp";
const Tab = createMaterialBottomTabNavigator();

export default function App() {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    setLoading(true);
    const usersQuery = collection(db, "users");
    onSnapshot(usersQuery, (snapshot) => {
      let usersList = [];
      snapshot.docs.map((doc) => usersList.push({ ...doc.data(), id: doc.id }));
      setPeople(usersList);
      setLoading(false);
    });
  }, []);

  const handleSuccessfulLogin = (user) => {
    setUsername(user);
    setIsLoggedIn(true);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 50,
    },
  });

  return (
    <NavigationContainer>
      {!isLoggedIn ? (
        <View style={styles.container}>
          <Login onSuccessfulLogin={handleSuccessfulLogin} />
          <SignUp onSuccessfulSignUp={handleSuccessfulLogin} />
        </View>
      ) : (
        <>
          <Tab.Navigator
            labeled={false}
            barStyle={{ backgroundColor: "black" }}
            activeColor="white"
          >
            <Tab.Screen
              name="Home"
              initialParams={{ username: username }}
              component={Home}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name="home" color={color} size={26} />
                ),
              }}
            />
            <Tab.Screen
              name="Calendar"
              component={CalendarScreen}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons
                    name="calendar"
                    color={color}
                    size={26}
                  />
                ),
              }}
            />
            <Tab.Screen
              name="Budget"
              component={BudgetScreen}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons
                    name="account-cash"
                    color={color}
                    size={26}
                  />
                ),
              }}
            />
            <Tab.Screen
              name="AddGift"
              component={AddGift}
              options={{
                tabBarIcon: ({ color, size }) => (
                  <MaterialCommunityIcons name="gift" color={color} size={26} />
                ),
              }}
            />
          </Tab.Navigator>
        </>
      )}
    </NavigationContainer>
  );
}

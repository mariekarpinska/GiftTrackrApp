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
import { styles } from "./src/styles";
import { useTheme } from "react-native-paper";
const Tab = createMaterialBottomTabNavigator();

export default function App() {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
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

  const onSwitchToSignUp = () => {
    setShowLogin(false);
  };

  const onSwitchToLogin = () => {
    setShowLogin(true);
  };

  const theme = useTheme();
  theme.colors.secondaryContainer = "transperent";

  return (
    <NavigationContainer>
      {!isLoggedIn ? (
        <View style={{ flex: 1, justifyContent: "center" }}>
          {showLogin ? (
            <Login
              onSuccessfulLogin={handleSuccessfulLogin}
              onSwitchToSignUp={onSwitchToSignUp}
            />
          ) : (
            <SignUp
              onSuccessfulSignUp={handleSuccessfulLogin}
              onSwitchToLogin={onSwitchToLogin}
            />
          )}
        </View>
      ) : (
        <>
          <Tab.Navigator
            labeled={false}
            barStyle={{ backgroundColor: styles.darkerAccent }}
            activeColor={styles.almostWhiteText}
            tabBarOptions={{
              activeTintColor: "transparent",
              inactiveTintColor: styles.grayedOutColor,
            }}
          >
            <Tab.Screen
              name="Home"
              initialParams={{ username: username }}
              component={Home}
              options={{
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons
                    name="home"
                    color={styles.almostWhiteText}
                    size={26}
                    style={{
                      color:
                        color === styles.almostWhiteText
                          ? styles.almostWhiteText
                          : styles.grayedOutColor,
                    }}
                  />
                ),
              }}
            />
            <Tab.Screen
              name="Calendar"
              component={CalendarScreen}
              initialParams={{ username: username }}
              options={{
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons
                    name="calendar"
                    color={styles.almostWhiteText}
                    size={26}
                    style={{
                      color:
                        color === styles.almostWhiteText
                          ? styles.almostWhiteText
                          : styles.grayedOutColor,
                    }}
                  />
                ),
              }}
            />
            <Tab.Screen
              name="Budget"
              component={BudgetScreen}
              initialParams={{ username: username }} 
              options={{
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons
                    name="account-cash"
                    color={styles.almostWhiteText}
                    size={26}
                    style={{
                      color:
                        color === styles.almostWhiteText
                          ? styles.almostWhiteText
                          : styles.grayedOutColor,
                    }}
                  />
                ),
              }}
            />
            <Tab.Screen
              name="AddGift"
              initialParams={{ username: username }}
              component={AddGift}
              options={{
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons
                    name="gift"
                    color={styles.almostWhiteText}
                    size={26}
                    style={{
                      color:
                        color === styles.almostWhiteText
                          ? styles.almostWhiteText
                          : styles.grayedOutColor,
                    }}
                  />
                ),
              }}
            />
          </Tab.Navigator>
        </>
      )}
    </NavigationContainer>
  );
}

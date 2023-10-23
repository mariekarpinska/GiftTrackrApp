import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Button, Image } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";
//used google oauth tutorial from: https://www.youtube.com/watch?v=BDeKTPQzvR4&t=754s&ab_channel=CodewithBeto
WebBrowser.maybeCompleteAuthSession();


export default function App() {
  const [token, setToken] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [userNewPage, setUserNewPage] = useState(false);
    
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: "644941275071-jgnhc7dvt2j16qm69kea8p7ett3j2oo8.apps.googleusercontent.com",
    webClientId: "644941275071-6q3m5m8s41o12c5fmfupp1svqfg6t21k.apps.googleusercontent.com",
  });

  const navigate = async () => {
    setUserNewPage(!userNewPage);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("@user");    
    setUserInfo(null);
    await WebBrowser.openBrowserAsync('https://accounts.google.com/logout');
  };


  useEffect(() => {
    handleEffect();
  }, [response, token]);

  async function handleEffect() {
    const user = await getLocalUser();
    if (!user) {
      if (response?.type === "success") {
        getUserInfo(response.authentication.accessToken);
      }
    } else {
      setUserInfo(user);
    }
  }

  const getLocalUser = async () => {
    const data = await AsyncStorage.getItem("@user");
    if (!data) return null;
    return JSON.parse(data);
  };

  const getUserInfo = async (token) => {
    if (!token) return;
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: 
          { Authorization: `Bearer ${token}` },
        }
      );
      const user = await response.json();
      await AsyncStorage.setItem("@user", JSON.stringify(user));
      setUserInfo(user);
    } catch (error) {
    }
  };

  return (
    <View style={styles.container}>
      {!userInfo ? (
        <Button
          title="Sign in with Google"
          disabled={!request}
          onPress={() => {
            promptAsync();
          }}
        />
      ) : (
        ! userNewPage ?
        (
          <View style={styles.card}>
            {userInfo?.picture && (
              <Image source={{ uri: userInfo?.picture }} style={styles.image} />
            )}
            <Text style={styles.text}>Email: {userInfo.email}</Text>
            <Text style={styles.text}>Name: {userInfo.name}</Text>
            <Button
              title="Go to new page"
              disabled={false}
              onPress={() => {
                navigate();
              }}
            />
            <Button
              title="logout"
              disabled={false}
              onPress={() => {
                logout();
              }}
            />
          </View>
        ) :
        (
          <div>
            Welcome to the HW2 app,  
            <Text>
              {userInfo.name}
            </Text>
            <Button
              title="Go back"
              disabled={false}
              onPress={() => {
                navigate();
              }}
            />
          </div>
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
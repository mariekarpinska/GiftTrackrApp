import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, TextInput } from "react-native";
import { Calendar } from "react-native-calendars";
import moment from "moment";
import { styles } from "../styles";
import { collection, query, where, doc, getDoc, getDocs } from "@firebase/firestore";
import { db } from "../config/firebase";
import { useFocusEffect } from "@react-navigation/native";


const CalendarScreen = (props) => {
  const { username } = props.route.params;
  const [markedDates, setMarkedDates] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      fetchDates();
    }, [props.route.params.username])
  );

  const fetchDates = async () => {
    try {
      const usersRef = collection(db, "users");
      const userQuery = query(usersRef, where("username", "==", username));
      const userQuerySnapshot = await getDocs(userQuery);
  
      if (!userQuerySnapshot.empty) {
        const markedDatesData = {};
  
        for (const userDoc of userQuerySnapshot.docs) {
          const userData = userDoc.data();
          const userGiftIDs = userData.gifts || [];
  
          for (const giftID of userGiftIDs) {
            const giftRef = doc(db, "gifts", giftID);
            const giftDoc = await getDoc(giftRef);
  
            if (giftDoc.exists()) {
              const date = moment(giftDoc.data().date).format("YYYY-MM-DD");
              markedDatesData[date] = {
                selected: true,
                marked: true,
                dotColor: "#C6E9F7",
              };
              
            }
          }
        }
  
        setMarkedDates(markedDatesData);
        console.log("Dates fetched successfully");
      } else {
        console.log("No gifts found");
      }
    } catch (error) {
      console.error("Error fetching dates: ", error);
    }
  };
  

  const handleDayPress = (day) => {
    const date = day.dateString;
    setSelectedDate(date);
  
    // Convert the selected date to timestamp format
    const selectedTimestamp = new Date(date).getTime();
    //const selectedTimestamp = moment(selectedDate).valueOf(); // Get the Unix timestamp

  
    // Log the selected date and markedDates format to the console
    console.log("Selected Date:", date);
    console.log("Marked Dates Format:", Object.keys(markedDates)[0]);
  
    // Now you can compare the converted timestamp with the marked dates
    if (markedDates[selectedTimestamp]) {
      console.log("Date matched in markedDates!");
    } else {
      console.log("Date not found in markedDates");
    }
  };

  const screenHeight = Dimensions.get("window").height;
  const marginTopAmnt = screenHeight * 0.09;

  return (
    <View
      style={{
        ...styles.grayContainer,
        marginTop: marginTopAmnt,
      }}
    >
      <Text style={styles.pageHeader}>Calendar</Text>
      <View style={{ paddingVertical: 0, width: "100%" }}>
        <Calendar
          style={{
            borderColor: "#C6E9F7",
            backgroundColor: "#C6E9F7",
          }}
          markedDates={markedDates}
          onDayPress={handleDayPress}
          enableSwipeMonths={true}
        />
      </View>
      {selectedDate && (
        <View style={unique_styles.agendaContainer}>
          <Text style={unique_styles.dateText}>
            {moment(selectedDate).format("MMMM D, YYYY")}
          </Text>
        </View>
      )}
    </View>
  );
};

const unique_styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  pageHeader: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  calendarContainer: {
    paddingVertical: 20,
  },
  agendaContainer: {
    padding: 16,
  },
  dateText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
});

export default CalendarScreen;

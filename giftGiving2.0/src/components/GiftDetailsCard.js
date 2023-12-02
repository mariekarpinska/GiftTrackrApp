import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Card } from "react-native-elements";
import { styles } from "../styles";
import { deleteDoc, collection, query, where } from "firebase/firestore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getFirestore, doc } from "firebase/firestore";

const GiftDetailsCard = ({
  recipient,
  date,
  occasion,
  budget,
  likes,
  dislikes,
  decidedGift,
  id,
  updateGifts,
  username,
}) => {
  const formatDate = (unixTimestamp) => {
    const dateObject = new Date(unixTimestamp);
    return dateObject.toDateString();
  };

  const formattedDate = formatDate(date);

  const handleDelete = async (id) => {
    Alert.alert("Delete Gift", "Are you sure you want to delete this gift?", [
      {
        text: "No",
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: async () => {
          const db = getFirestore();
          const giftRef = doc(db, "gifts", id);

          try {
            // Remove the giftID from the user's gifts list
            const usersRef = collection(db, "users");
            const userQuery = query(
              usersRef,
              where("username", "==", username)
            );
            const userQuerySnapshot = await getDocs(userQuery);

            if (!userQuerySnapshot.empty) {
              const userDoc = userQuerySnapshot.docs[0];
              const userId = userDoc.id;

              // Update the user document to remove the giftID from the gifts array
              await updateDoc(doc(db, "users", userId), {
                gifts: arrayRemove(id),
              });

              // Delete the gift document
              await deleteDoc(giftRef);

              // Update the gifts in the parent component
              updateGifts();
            }
          } catch (error) {
            console.log("Error deleting gift: ", error);
          }
        },
      },
    ]);
  };

  return (
    <Card containerStyle={styles.cardContainer}>
      <View style={styles.cardHeader}>
        <Text style={styles.subtitle}>{recipient}</Text>
        <Text style={styles.date}>{formattedDate}</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.text}>{occasion}</Text>
      </View>
      <View style={styles.cardContent}>
        <View style={styles.box}>
          <View>
            <Text style={styles.decidedGiftText}>Planning to Give:</Text>
            <Text style={styles.text}>{decidedGift}</Text>
          </View>
          <View style={styles.budgetBox}>
            <Text style={styles.budgetText}>Budget:</Text>
            <Text style={styles.text}>{budget}</Text>
          </View>
        </View>
      </View>
      <View style={styles.cardContent}>
        <View style={styles.twoColumnContainer}>
          <View style={styles.column}>
            <Text style={styles.columnTitle}>Likes</Text>
            <Text style={styles.text}>{likes}</Text>
          </View>
          <View style={styles.column}>
            <Text style={styles.columnTitle}>Dislikes</Text>
            <Text style={styles.text}>{dislikes}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => handleDelete(id)}
        style={styles.deleteButton}
      >
        <MaterialCommunityIcons name="delete" size={24} color="gray" />
      </TouchableOpacity>
    </Card>
  );
};

export { GiftDetailsCard };

import { View, Text, StyleSheet, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useContacts } from "@/contexts/ContactsContext";
import { firebase } from "@react-native-firebase/firestore";
import { FlatList, TouchableOpacity } from "react-native";
import { useAuth } from "@/contexts/AuthContext";

export default function MessageScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user } = useAuth();
  const { chatId } = params;

  console.log("recieverId", chatId);

  const { contacts } = useContacts();

  const recieverNumber = chatId.split("-")[2];

  const contact =
    contacts.find((contact) => contact?.phoneNumbers === recieverNumber) ??
    recieverNumber;

  console.log("contact", contact);

  const [messages, setMessages] = useState([]);

  const [messageU1, setMessageU1] = useState("");
  const [messageU2, setMessageU2] = useState("");

  const chatIdArray = chatId.split("-");
  const flipedChatId =
    chatIdArray[2] + "-" + chatIdArray[1] + "-" + chatIdArray[0];

  console.log("chatId", chatId);
  console.log("flipedChatId", flipedChatId);

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection(`chats/${chatId}/messages`)
      .onSnapshot((snapshot) => {
        const newData = [];
        snapshot.forEach((doc) => {
          newData.push({ ...doc.data(), id: doc.id });
        });
        setMessageU1(newData);
      });

    return () => unsubscribe();
  }, [chatId, flipedChatId]);

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection(`chats/${flipedChatId}/messages`)
      .onSnapshot((snapshot) => {
        const newData = [];
        snapshot.forEach((doc) => {
          newData.push({ ...doc.data(), id: doc.id });
        });
        setMessageU2(newData);
      });

    return () => unsubscribe();
  }, [chatId, flipedChatId]);

  console.log("mess", messageU1, messageU2);

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (messageU1 || messageU2) {
      setMessages([...messageU1, ...messageU2]);
    }
  }, [messageU1, messageU2]);

  const sortedMessages = messages.sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: contact.name ?? "Name",
        }}
      />
      <FlatList
        style={{ width: "100%" }} //
        inverted
        data={sortedMessages}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            key={index}
            style={{
              margin: 10,
              borderRadius: 10,
              width: "95%",
              display: "flex",
              flexDirection: "column",
              alignItems:
                item.sender ===
                user.phoneNumber.replace("+91", "").replace(" ", "")
                  ? "flex-end"
                  : "flex-start",
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                maxWidth: "80%",
                backgroundColor: "#f3b61f",
                padding: 10,
                borderRadius: 10,
                color: "black",
              }}
            >
              {item?.message}
            </Text>
            <Text style={{ fontSize: 16 }}>{item?.phoneNumbers}</Text>
          </TouchableOpacity>
          // </Link>
        )}
        keyExtractor={(item) => item.title}
      />
      <View
        style={{
          backgroundColor: "#f3b61f",
          padding: 10,
          margin: 10,
          borderRadius: 10,
          width: "95%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TextInput
          value={message}
          onChangeText={(text) => {
            setMessage(text);
          }}
          placeholder="Type a message"
          style={{ width: "80%" }}
        />
        <TouchableOpacity
          onPress={async () => {
            const messageDoc = {
              sender: user.phoneNumber.replace("+91", "").replace(" ", ""),
              message,
              createdAt: new Date().toISOString(),
            };
            try {
              await firebase
                .firestore()
                .collection(`chats/${chatId}/messages`)
                .add(messageDoc);

              const ref = firebase.firestore().doc(`chats/${chatId}`);

              ref.set(
                {
                  lastMessage: message,
                  lastMessageTime: new Date().toISOString(),
                  u1: user.phoneNumber.replace("+91", "").replace(" ", ""),
                  u2: recieverNumber,
                },
                { merge: true }
              );

              setMessage("");
            } catch (error) {
              console.log("error", error);
            }
          }}
        >
          <Text>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

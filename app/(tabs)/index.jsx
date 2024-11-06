import { useAuth } from "@/contexts/AuthContext";
import { useContacts } from "@/contexts/ContactsContext";
import { firebase } from "@react-native-firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { FlatList, TouchableOpacity } from "react-native";
import ActionSheet from "react-native-actions-sheet";
import { Link } from "expo-router";
import { MenuProvider } from "react-native-popup-menu";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import Entypo from "@expo/vector-icons/Entypo";

export default function Tab() {
  const [searchText, setSearchText] = useState("");
  const { contacts } = useContacts();
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({});

  const filteredContacts = contacts.filter((contact) => {
    return (
      contact?.name.toLowerCase().includes(searchText.toLowerCase()) ||
      contact?.phoneNumbers.includes(searchText)
    );
  });

  const actionSheetRef = useRef(null);

  const [u1Chats, setU1Chats] = useState([]);
  const [u2Chats, setU2Chats] = useState([]);

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection(`chats`)
      .where(
        "u1",
        "==",
        user.phoneNumber?.replace("+91", "").replace(" ", "") ?? "1"
      )
      .onSnapshot((snapshot) => {
        const newData = [];
        snapshot.forEach((doc) => {
          newData.push({ ...doc.data(), id: doc.id });
        });
        setU1Chats(newData);
      });

    return () => unsubscribe();
  }, [user.phoneNumber, user]);

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection(`chats`)
      .where(
        "u2",
        "==",
        user.phoneNumber?.replace("+91", "").replace(" ", "") ?? "1"
      )
      .onSnapshot((snapshot) => {
        const newData = [];
        snapshot.forEach((doc) => {
          newData.push({ ...doc.data(), id: doc.id });
        });
        setU2Chats(newData);
      });

    return () => unsubscribe();
  }, [user.phoneNumber, user]);

  function filterChats(chats, userPhoneNumber) {
    const filteredChats = [];
    const uniquePhoneNumbers = new Set();

    chats.forEach((chat) => {
      if (chat.u1 === userPhoneNumber || chat.u2 === userPhoneNumber) {
        if (
          !uniquePhoneNumbers.has(chat.u1) &&
          !uniquePhoneNumbers.has(chat.u2)
        ) {
          filteredChats.push(chat);
          uniquePhoneNumbers.add(chat.u1);
          uniquePhoneNumbers.add(chat.u2);
        }
      }
    });

    return filteredChats;
  }

  const filtChats = [...u1Chats, ...u2Chats].filter((chat) => {
    return chat?.u1?.includes(searchText) || chat?.u2?.includes(searchText);
  });

  const filteredChats = filterChats(
    filtChats,
    user.phoneNumber?.replace("+91", "").replace(" ", "") ?? "1"
  );

  console.log(contacts);

  const [idMenu, setIdMenu] = useState("");
  const [options, setOptions] = useState([]);

  const handleOnPress = (id) => {
    setIdMenu(id);
    setOptions([
      {
        onPress: () => {
          console.log("Delete");
        },
        text: "Delete",
      },
    ]);
  };

  return (
    <MenuProvider>
      <View style={styles.container}>
        <View style={styles.container}>
          <TextInput
            value={searchText}
            placeholder="Search"
            style={styles.input}
            onChangeText={(text) => setSearchText(text)}
            // onSubmitEditing={props.onSubmit}
          />
        </View>

        <FlatList
          data={filteredChats.sort(function (x, y) {
            return new Date(y.createdAt) - new Date(x.createdAt);
          })}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              key={index}
              style={{
                backgroundColor: "#f3b61f",
                padding: 18,
                margin: 10,
                borderRadius: 10,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <TouchableOpacity
                style={{
                  flex: 1,
                }}
                onPress={() => {
                  actionSheetRef.current?.show();
                  setModalData({
                    phoneNumbers:
                      item.u1 ===
                      user.phoneNumber.replace("+91", "").replace(" ", "")
                        ? item.u2
                        : item.u1,
                  });
                }}
              >
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                  {item.u1 ===
                  user.phoneNumber.replace("+91", "").replace(" ", "")
                    ? contacts.find(
                        (contact) => contact?.phoneNumbers === item.u2
                      )?.name ?? item.u2
                    : contacts.find(
                        (contact) => contact?.phoneNumbers === item.u1
                      )?.name ?? item.u1}
                </Text>
                <Text style={{ fontSize: 16 }}>
                  {item.u1 ===
                  user.phoneNumber.replace("+91", "").replace(" ", "")
                    ? item.u2
                    : item.u1}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  top: 10,
                  position: "absolute",
                  right: 10,
                }}
              >
                <Menu onClose={() => setIdMenu("")}>
                  <MenuTrigger
                    onPress={() => handleOnPress(1)}
                    customStyles={{
                      triggerWrapper: {
                        top: 25,
                        alignItems: "center",
                        justifyContent: "center",
                        flex: 1,
                      },
                      triggerTouchable: {
                        underlayColor: "white",
                      },
                    }}
                  >
                    <Entypo
                      name="dots-three-horizontal"
                      size={24}
                      color="black"
                    />
                  </MenuTrigger>

                  <MenuOptions
                    customStyles={{
                      optionsWrapper: {
                        position: "absolute",
                        bottom: -50,
                        left: 50,
                        height: 45,
                        backgroundColor: "white",
                        borderRadius: 8,
                        padding: 8,
                        width: 150,
                        shadowOffset: { width: 0, height: 3 },
                        shadowOpacity: 0.2,
                        shadowRadius: 4,
                        elevation: 5,
                      },
                    }}
                  >
                    <>
                      <MenuOption
                        // onSelect={option.onPress}
                        text="Add to Group"
                      />
                      

                      
                    </>
                  </MenuOptions>
                </Menu>
              </TouchableOpacity>
            </TouchableOpacity>
            // </Link>
          )}
          keyExtractor={(item, index) => index.toString()}
        />

        {/* Modal  */}
        <ActionSheet ref={actionSheetRef}>
          <Link
            style={{
              backgroundColor: "#f3b61f",
              margin: 10,
              borderRadius: 10,
            }}
            href={`/chat/${user?.phoneNumber
              ?.replace("+91", "")
              ?.replace(" ", "")}-p-${modalData?.phoneNumbers
              ?.replace("+91", "")
              ?.replace(" ", "")}`}
          >
            <TouchableOpacity
              onPress={() => {
                actionSheetRef.current?.show();
              }}
              style={{
                backgroundColor: "#f3b61f",
                padding: 10,
                margin: 10,
                borderRadius: 10,
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>Personel</Text>
              <Text style={{ fontSize: 16 }}>{modalData?.phoneNumbers}</Text>
            </TouchableOpacity>
          </Link>
          <Link
            style={{
              backgroundColor: "#f3b61f",
              margin: 10,
              borderRadius: 10,
            }}
            href={`/chat/${user?.phoneNumber
              ?.replace("+91", "")
              ?.replace(" ", "")}-b-${modalData?.phoneNumbers
              ?.replace("+91", "")
              ?.replace(" ", "")}`}
          >
            <TouchableOpacity
              onPress={() => {
                actionSheetRef.current?.show();
              }}
              style={{
                backgroundColor: "#f3b61f",
                padding: 10,
                margin: 10,
                borderRadius: 10,
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                Bussiness
              </Text>
              <Text style={{ fontSize: 16 }}>{modalData?.phoneNumbers}</Text>
            </TouchableOpacity>
          </Link>
        </ActionSheet>
      </View>
    </MenuProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // justifyContent: 'flex-start',
    // alignItems: 'center',
    margin: 8,
  },
  input: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 10,
    borderColor: "#f3b61f",
    borderWidth: 2,
  },
});

import { useAuth } from "@/contexts/AuthContext";
import { useContacts } from "@/contexts/ContactsContext";
import { firebase } from "@react-native-firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { FlatList, TouchableOpacity } from "react-native";
import ActionSheet from "react-native-actions-sheet";
import { Link } from "expo-router";
import { MenuProvider } from "react-native-popup-menu";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import Entypo from "@expo/vector-icons/Entypo";
import { Image } from "react-native";

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
  const actionSheetRef2 = useRef(null);

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

  const [groups, setGroups] = useState([]);

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("groups")
      .where("owner", "==", user?.uid)
      .onSnapshot((querySnapshot) => {
        const groups = [];
        querySnapshot.forEach((doc) => {
          groups.push({ ...doc.data(), id: doc.id });
        });
        setGroups(groups);
      });

    return unsubscribe;
  }, []);

  const [chatIdToGroup, setChatIdToGroup] = useState("");

  return (
    <View style={styles.container}>
      <View
        style={{
          backgroundColor: "#fff",
          marginLeft: 10,
          marginRight: 10,
          borderRadius: 10,
        }}
      >
        <View
          style={{
            position: "absolute",
            left: 10,
            top: 10,
            zIndex: 1,
            backgroundColor: "#F4F6F8",
            padding: 7,
            borderRadius: 10,
          }}
        >
          <AntDesign name="search1" size={16} color="black" />
        </View>
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
              backgroundColor: "#fff",
              padding: 18,
              margin: 10,
              marginBottom: 0,
              borderRadius: 20,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: 10,
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
              {/* image container  */}

              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 15,
                  // backgroundColor: "#f3b61f",
                  borderColor: "#F4F6F8",
                  borderWidth: 0.5,
                  // display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "hidden",
                }}
              >
                <Image
                  style={{
                    width: 50,
                    height: 50,
                    objectFit: "cover",
                  }}
                  source={require("../../assets/male.jpeg")}
                />
              </View>

              <View>
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
              </View>
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
                      top: 22,
                      alignItems: "center",
                      justifyContent: "center",
                      flex: 1,
                    },
                    triggerTouchable: {
                      underlayColor: "white",
                    },
                  }}
                >
                  <Entypo name="dots-three-vertical" size={24} color="black" />
                </MenuTrigger>

                <MenuOptions
                  customStyles={{
                    optionsWrapper: {
                      position: "absolute",
                      bottom: -100,
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
                      onSelect={() => {
                        actionSheetRef2.current?.show();
                        setChatIdToGroup(item.id);
                      }}
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
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>Bussiness</Text>
            <Text style={{ fontSize: 16 }}>{modalData?.phoneNumbers}</Text>
          </TouchableOpacity>
        </Link>
      </ActionSheet>

      {/* Modal  */}
      <ActionSheet ref={actionSheetRef2}>
        <Text style={{ fontSize: 20, fontWeight: "bold", margin: 10 }}>
          Select Group
        </Text>

        <FlatList
          data={groups}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => {
                firebase
                  .firestore()
                  .collection("groups")
                  .doc(item.id)
                  .update({
                    chats:
                      firebase.firestore.FieldValue.arrayUnion(chatIdToGroup),
                  })
                  .then(() => {
                    console.log("Chat added to group");
                    actionSheetRef2.current?.hide();
                    alert("Chat added to group");
                  })
                  .catch((error) => {
                    console.error("Error adding chat to group: ", error);
                  });
              }}
              style={{
                backgroundColor: "#f3b61f",
                padding: 10,
                margin: 10,
                borderRadius: 10,
              }}
            >
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                {item.name}
              </Text>
              <Text style={{ fontSize: 16 }}>{item.description}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </ActionSheet>
    </View>
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
    borderColor: "#fff",
    borderWidth: 2,
    marginLeft: 40,
  },
});

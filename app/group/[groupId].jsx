import { useAuth } from "@/contexts/AuthContext";
import { useContacts } from "@/contexts/ContactsContext";
import { firebase } from "@react-native-firebase/firestore";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import ActionSheet from "react-native-actions-sheet";

import { MenuProvider } from "react-native-popup-menu";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import Entypo from "@expo/vector-icons/Entypo";
import AntDesign from "@expo/vector-icons/AntDesign";

const db = firebase.firestore();

export default function GroupChats() {
  const [searchText, setSearchText] = useState("");
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({});

  const { groupId } = useLocalSearchParams();

  const [chats, setChats] = useState([]);

  const [group, setGroup] = useState({});
  const { contacts } = useContacts();

  console.log("group", chats);

  useEffect(() => {
    // fetch group from /groups/:groupId firestore

    const unsubscribe = db.doc(`groups/${groupId}`).onSnapshot((doc) => {
      setGroup({
        id: doc.id,
        ...doc.data(),
      });
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    // fetch chats from /chats firestore where group.chats contains chatId

    let tempChats = [];

    if (group?.chats) {
      group?.chats.forEach((chatId) => {
        db.doc(`chats/${chatId}`).onSnapshot((doc) => {
          tempChats.push({
            id: doc.id,
            ...doc.data(),
          });
          setChats(tempChats);
        });
      });
    }
  }, [group, group?.chats]);

  const actionSheetRef = useRef(null);

  const actionSheetRef2 = useRef(null);

  const [chatIdToGroup, setChatIdToGroup] = useState("");

  const handleOnPress = (id) => {
    setIdMenu(id);
  };

  const [idMenu, setIdMenu] = useState("");

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Group Chats",
        }}
      />
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
        data={chats.sort(function (x, y) {
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
                        db.doc(`groups/${groupId}`)
                          .update({
                            chats: firebase.firestore.FieldValue.arrayRemove(
                              item.id
                            ),
                          })
                          .then(() => {
                            setChats(
                              chats.filter((chat) => chat.id !== item.id)
                            );
                          });
                      }}
                      text="Remove Chat"
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

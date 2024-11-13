import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
} from "react-native";
import React, { useRef } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import ActionSheet from "react-native-actions-sheet";
import { firebase } from "@react-native-firebase/firestore";
import { MenuProvider } from "react-native-popup-menu";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { Entypo } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";


const actions = [
  {
    text: "Accessibility",
    icon: require("../../assets/images/react-logo.png"),
    name: "bt_accessibility",
    position: 1,
  },
];

const db = firebase.firestore();

export default function Groups() {
  const actionSheetRef = useRef(null);

  const [groupName, setGroupName] = React.useState("");
  const [groupDescription, setGroupDescription] = React.useState("");

  const { user } = useAuth();

  const createGroup = async () => {
    if (!groupName || !groupDescription) {
      return;
    }

    // create a new group
    const docRef = await db
      .collection("groups")
      .add({
        name: groupName,
        description: groupDescription,
        chats: [],
        owner: user.uid,
      })
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
        setGroupDescription("");
        setGroupName("");
        actionSheetRef.current?.hide();
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
    // add the group to the user's groups
  };

  const [groups, setGroups] = React.useState([]);

  React.useEffect(() => {
    const unsubscribe = db
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

  const [searchText, setSearchText] = React.useState("");

  const filteredGroups = groups.filter((group) => {
    return (
      group.name.toLowerCase().includes(searchText.toLowerCase()) ||
      group.description.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  const [idMenu, setIdMenu] = React.useState("");

  const handleOnPress = (id) => {
    setIdMenu(id);
  };

  const router = useRouter();

  return (
    // <MenuProvider>
    <>
      <TouchableOpacity
        onPress={() => {
          actionSheetRef.current?.show();
        }}
        style={styles.floatingActionButtonContainer}
      >
        <AntDesign name="plus" size={24} color="black" />
      </TouchableOpacity>
      <View style={styles.main}>
        {/* create new group button  */}

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
          data={filteredGroups.sort(function (x, y) {
            return x.name - y.name;
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
              <Link
                style={{
                  flex: 1,
                }}
                href={`/group/${item?.id}`}
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
                      {item.name}
                    </Text>
                    <Text style={{ fontSize: 16 }}>{item.description}</Text>
                  </View>
                </TouchableOpacity>
              </Link>
              {/* <TouchableOpacity
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
                </TouchableOpacity> */}
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
        />

        {/* Modal  */}
        <ActionSheet ref={actionSheetRef}>
          {/* form to create a new group  */}
          {/* form title and inputs  */}
          <View style={styles.form}>
            <Text style={styles.label}>Group Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Group Name"
              onChangeText={(text) => setGroupName(text)}
            />
            <Text style={styles.label}>Group Description</Text>
            <TextInput
              style={styles.input}
              placeholder="Group Description"
              onChangeText={(text) => setGroupDescription(text)}
            />
            {/* submit button  */}
            <TouchableOpacity style={styles.btn} onPress={createGroup}>
              <Text>Create Group</Text>
            </TouchableOpacity>
          </View>
        </ActionSheet>
      </View>
    </>
    // </MenuProvider>
  );
}

const styles = StyleSheet.create({
  main: {
    margin: 10,
  },
  container: {
    flex: 1,
    // backgroundColor: "#fff",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  input: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 10,
    borderColor: "#fff",
    borderWidth: 2,
    marginLeft: 40,
  },
  floatingActionButtonContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#f3b61f",
    width: 50,
    height: 50,
    borderRadius: 25,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  form: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    width: "100%",
  },
  label: {
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 10,
  },
  btn: {
    backgroundColor: "#f3b61f",
    padding: 10,
    borderRadius: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
});

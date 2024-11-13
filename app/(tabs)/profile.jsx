import { useAuth } from "@/contexts/AuthContext";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import auth from "@react-native-firebase/auth";
import { AntDesign } from "@expo/vector-icons";
import { firebase } from "@react-native-firebase/firestore";
import { firebase as Sfirebase } from "@react-native-firebase/storage";
import ImgToBase64 from 'react-native-image-base64';

const storage = Sfirebase.storage();

export default function Tab() {
  const { user, setUser } = useAuth();

  const [image, setImage] = useState(require("../../assets/logo.png"));

  const [profile, setProfile] = useState({});

  const nameInputRef = useRef();

  useEffect(() => {
    const getProfiles = async () => {
      const profiles =
        (await AsyncStorage.getItem(`${user?.phoneNumber}`)) ?? {};
      setProfile(profiles);
    };

    getProfiles();
  }, []);

  console.log("profils", profile);

  const uploadImage = async (imageUri) => {
    console.log("imageUri", imageUri);
    
    try {
      
      // const base = await ImgToBase64.getBase64String(imageUri);

      // const ref = storage.ref(`profile/${user.uid}`);
      // await ref.put(base);

      // const url = await ref.getDownloadURL();
      // console.log("url", url);

      // await auth().currentUser.updateProfile({
      //   photoURL: url,
      // });
      // setImage(url);
      // setUser(auth().currentUser);

      // save to local storage
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    // console.log(result);

    if (!result.canceled) {
      try {
        console.log("asdfghjk", result.assets[0].uri);

        uploadImage(result.assets[0].uri);

        await auth().currentUser.updateProfile({
          photoURL: result.assets[0].uri,
        });
        setImage(result.assets[0].uri);
        setUser(auth().currentUser);

        // save to local storage
      } catch (error) {
        console.log(error);
      }
    }
  };

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.displayName);

  console.log("user", user);

  return (
    <>
      <Image
        source={require("../../assets/profileCover.jpeg")}
        style={{
          width: "100%",
          height: 150,
          resizeMode: "cover",
          borderColor: "#f3b61f",
          borderWidth: 2,
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />
      <TouchableOpacity
        onPress={() => {
          setIsEditing(!isEditing);
          nameInputRef?.current?.focus();
        }}
        style={{
          position: "absolute",
          top: 30,
          right: 20,
          zIndex: 1,
          backgroundColor: "rgba(255, 255, 255, 0.4)",
          padding: 1,
          borderRadius: 20,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            padding: 10,
            borderRadius: 10,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {isEditing ? (
            <AntDesign
              name="check"
              size={24}
              color="white"
              style={
                {
                  // opacity: 0.5,
                }
              }
            />
          ) : (
            <AntDesign
              name="edit"
              size={24}
              color="white"
              style={
                {
                  // opacity: 0.5,
                }
              }
            />
          )}
        </View>
      </TouchableOpacity>
      <View style={styles.container}>
        {/* Banner Image  */}

        <View>
          {/* profile photo  */}
          <View style={styles.imageContainer}>
            {/* profile edit button  */}

            <View
              style={{
                position: "absolute",
                top: 10,
                zIndex: 1,
                backgroundColor: "rgba(255, 255, 255, 0.4)",
                padding: 7,
                borderRadius: 20,
                height: 100,
                width: 100,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                onPress={pickImage}
                style={{
                  padding: 10,
                  borderRadius: 10,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <AntDesign
                  name="edit"
                  size={24}
                  color="white"
                  style={
                    {
                      // opacity: 0.5,
                    }
                  }
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity>
              {profile ? (
                <Image
                  source={{ uri: user?.photoURL }}
                  style={styles.profileImage}
                />
              ) : (
                <Image
                  source={require("../../assets/logo.png")}
                  style={styles.profileImage}
                />
              )}
            </TouchableOpacity>
            {/* hidden file input  */}
          </View>
          <View style={styles.nameContainer}>
            {!isEditing ? (
              <Text style={styles.name}>{name}</Text>
            ) : (
              <TextInput
                autoFocus
                ref={nameInputRef}
                value={name}
                placeholder="Name"
                style={styles.input}
                onChangeText={(text) => setName(text)}
                onSubmitEditing={() => {
                  if (name) {
                    auth().currentUser.updateProfile({
                      displayName: name,
                    });
                    setIsEditing(false);
                    setUser(auth().currentUser);
                  }
                }}
              />
            )}
          </View>
          {/* mobile number container  */}
          <View style={styles.mobileContainer}>
            <Text style={styles.mobile}>
              {user.phoneNumber ? user.phoneNumber : "Mobile number"}
            </Text>
          </View>
        </View>
        {/* // log out below */}
        <TouchableOpacity
          style={{
            backgroundColor: "#f3b61f",
            padding: 10,
            borderRadius: 10,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={async () => {
            try {
              await auth().signOut();
              setUser(null);
            } catch (error) {
              console.log(error);
            }
          }}
        >
          <Text>Log out</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 8,
    flex: 1,
    display: "flex",
    justifyContent: "space-between",
  },
  imageContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    top: 75,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 20,
    margin: 10,
    borderColor: "#F4F6F8",
    borderWidth: 0.5,
    objectFit: "cover",
  },
  nameContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    top: 75,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
  },
  mobileContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // borderColor: "#f3b61f",
    // borderWidth: 2,
    padding: 10,
    borderRadius: 10,
    top: 75,
  },
  mobile: {
    fontSize: 16,
  },
  input: {
    padding: 8,
    borderRadius: 10,
    borderColor: "#f3b61f",
    borderWidth: 0.5,
    width: "100%",
    textAlign: "center",
    backgroundColor: "white",
  },
});

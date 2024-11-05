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
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import auth from "@react-native-firebase/auth";

export default function Tab() {
  const { user, setUser } = useAuth();

  const [image, setImage] = useState(require("../../assets/logo.png"));

  const [profile, setProfile] = useState({});

  useEffect(() => {
    const getProfiles = async () => {
      const profiles =
        (await AsyncStorage.getItem(`${user?.phoneNumber}`)) ?? {};
      setProfile(profiles);
    };

    getProfiles();
  }, []);

  console.log("profils", profile);

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
    <View style={styles.container}>
      {/* profile photo  */}
      <View style={styles.imageContainer}>
        <TouchableOpacity onPress={pickImage}>
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
        <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
          <EvilIcons name="pencil" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* mobile number container  */}
      <View style={styles.mobileContainer}>
        <Text style={styles.mobile}>
          {user.phoneNumber ? user.phoneNumber : "Mobile number"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 8,
  },
  imageContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    margin: 10,
    borderColor: "#f3b61f",
    borderWidth: 2,
    objectFit: "cover",
  },
  nameContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
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
  },
  mobile: {
    fontSize: 16,
  },
  input: {
    padding: 8,
    borderRadius: 10,
    borderColor: "#f3b61f",
    borderWidth: 2,
  },
});

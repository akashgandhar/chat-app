import { useAuth } from "@/contexts/AuthContext";
import { View, Text, StyleSheet, Image } from "react-native";

export default function Tab() {

    const {user} = useAuth()
    
  return (
    <View style={styles.container}>
      {/* profile photo  */}
      <View style={styles.imageContainer}>
        <Image
          source={require("../../assets/logo.png")}
          style={styles.profileImage}
        />
        {/* hidden file input  */}
        

      </View>

      <View style={styles.nameContainer}>
        <Text style={styles.name}>
            {user.displayName ? user.displayName : "User"}
        </Text>
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
});

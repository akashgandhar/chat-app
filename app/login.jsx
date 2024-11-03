import {
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  View,
} from "react-native";
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Stack } from "expo-router";

export default function Login() {
  const {
    user,
    signInWithPhoneNumber,
    confirmCode,
    setCode,
    confirm,
    setConfirm,
    code,
    SignOut,
    phoneNumber,
    setPhoneNumber,
    handlePhoneChange,
    isLoading,
    error,
  } = useAuth();

  const imageSource = require("../assets/login-bg.png");

  if (!user) {
    return (
      <>
        <ImageBackground source={imageSource} style={styles.backgroundImage}>
          <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <View
              style={{
                display: "flex",
                width: "100%",
                justifyContent: "center",
              }}
            >
              <TextInput
                style={styles.input}
                value={phoneNumber}
                onChangeText={(text) => {
                  if (isLoading || confirm) return;
                  handlePhoneChange(text);
                }}
                placeholder="Phone number"
                keyboardType="phone-pad"
              />
              {confirm && (
                <View
                  style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "center",
                  }}
                >
                  <TouchableOpacity
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                    onPress={() => {
                      if (isLoading) return;
                      setPhoneNumber("");
                      setCode("");
                      setConfirm(null);
                    }}
                  >
                    <Text>Entered Wrong Number?</Text>
                    <Text
                      style={{
                        textDecorationLine: "underline",
                        color: "#45b6fe",
                      }}
                    >
                      Click Here
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            {confirm && (
              <>
                <TextInput
                  style={styles.input}
                  value={code}
                  onChangeText={setCode}
                  placeholder="OTP"
                  keyboardType="number-pad"
                />
              </>
            )}

            {error && <Text>{error.message || ""}</Text>}
            <TouchableOpacity
              style={styles.button}
              onPress={
                isLoading
                  ? () => {}
                  : confirm
                  ? () => {
                      if (isLoading) return;
                      confirmCode();
                    }
                  : () => {
                      if (isLoading) return;
                      signInWithPhoneNumber();
                    }
              }
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>
                {isLoading ? "Loading..." : confirm ? "Confirm" : "Send OTP"}
              </Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </>
    );
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    display: "flex",
    gap: 20,
  },
  title: {
    fontSize: 24,
    // marginBottom: 20,
    textDecorationStyle: "solid",
    fontWeight: "bold",
    color: "#45b6fe",
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#45b6fe",
    borderRadius: 5,
    width: "100%",
  },
  button: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#45b6fe",
    width: "100%",
    alignItems: "center",
  },
  backgroundImage: {
    flex: 1, // Cover the entire container
    resizeMode: "cover", // Stretch the image to cover the container
  },
});

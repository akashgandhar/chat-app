import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";

export default function MessageScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const { recieverId } = params;

  console.log("recieverId", recieverId);
  

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: params.name,
        }}
      />
      <Text
        onPress={() => {
          router.setParams({ name: "Updated" });
        }}
      >
        Update the title
      </Text>
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

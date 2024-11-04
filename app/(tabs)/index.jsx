import { useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";

export default function Tab() {
  const [searchText, setSearchText] = useState("");

  

  return (
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
    borderColor: "#f3b61f",
    borderWidth: 2,
  },
});

import { useContacts } from "@/contexts/ContactsContext";
import { Link } from "expo-router";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";

export default function Tab() {
  const [searchText, setSearchText] = useState("");
  const { contacts } = useContacts();
  
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({});

  const filteredContacts = contacts.filter((contact) => {
    return (
      contact.name.toLowerCase().includes(searchText.toLowerCase()) ||
      contact.phoneNumbers.includes(searchText)
    );
  });

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
      <FlatList
        data={filteredContacts}
        renderItem={({ item, index }) => (
          // card layout with touchble opacity
          // <Link
          //   style={{
          //     backgroundColor: "#f3b61f",
          //     margin: 10,
          //     borderRadius: 10,
          //   }}
          //   href={`/chat/${item.phoneNumbers}`}
          // >
            <TouchableOpacity onPress={() => {setModalOpen(true);setModalData(item)}}
              key={index}
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
              <Text style={{ fontSize: 16 }}>{item.phoneNumbers}</Text>
            </TouchableOpacity>
          // </Link>
        )}
        keyExtractor={(item) => item.title}
      />

      {/* Modal  */}
      {modalOpen && (
        <View style={styles.modalContent}>
          <Text style={{ color: "#fff" }}>{modalData.name}</Text>
          <Text style={{ color: "#fff" }}>{modalData.phoneNumbers}</Text>
        </View>
      )}


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

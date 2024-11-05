import { useAuth } from "@/contexts/AuthContext";
import { useContacts } from "@/contexts/ContactsContext";
import { Link } from "expo-router";
import { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import ActionSheet from "react-native-actions-sheet";

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
          <TouchableOpacity
            onPress={() => {
              actionSheetRef.current?.show();
              setModalData(item);
            }}
            key={index}
            style={{
              backgroundColor: "#f3b61f",
              padding: 10,
              margin: 10,
              borderRadius: 10,
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              {item?.name}
            </Text>
            <Text style={{ fontSize: 16 }}>{item?.phoneNumbers}</Text>
          </TouchableOpacity>
          // </Link>
        )}
        keyExtractor={(item) => item.title}
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
            <Text style={{ fontSize: 16 }}>{modalData.phoneNumbers}</Text>
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
            <Text style={{ fontSize: 16 }}>{modalData.phoneNumbers}</Text>
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
    borderColor: "#f3b61f",
    borderWidth: 2,
  },
});

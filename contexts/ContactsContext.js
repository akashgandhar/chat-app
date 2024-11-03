import React, { createContext, useContext, useEffect, useState } from "react";
import * as Contacts from "expo-contacts";

// Create the ContactsContext
const ContactsContext = createContext();

// Create the ContactsProvider component
export default ContactsProvider = ({ children }) => {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.Emails],
        });

        if (data.length > 0) {
          const contact = data[0];
          console.log(contact);
          setContacts(contact);
        }
      }
    })();
  }, []);

  return (
    <ContactsContext.Provider value={{ contacts }}>
      {children}
    </ContactsContext.Provider>
  );
};

// Create a custom hook to use the ContactsContext
export const useContacts = () => {
  return useContext(ContactsContext);
};

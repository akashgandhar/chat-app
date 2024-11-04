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
          fields: [Contacts.Fields.PhoneNumbers],
        });

        if (data.length > 0) {
          const contact = data.map((contact) => {
            if (contact.phoneNumbers) {
              return {
                name: contact.name,
                phoneNumbers: contact.phoneNumbers[0].number
                  ?.replace(" ", "")
                  .replace("+91", "")
                  .replace("-", "")
                  .replace("(", "")
                  .replace(")", ""),
              };
            }
          });
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

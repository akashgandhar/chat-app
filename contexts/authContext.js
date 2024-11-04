import React, { createContext, useContext, useEffect, useState } from "react";
import auth from "@react-native-firebase/auth";

// Create the AuthContext
const AuthContext = createContext();

// Create the AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState(null);

  const [confirm, setConfirm] = useState(null);

  // verification code (OTP - One-Time-Passcode)
  const [code, setCode] = useState("");

  const handlePhoneChange = (text) => {
    setPhoneNumber(text);
    setError(null);
    setCode("");
    setConfirm(null);
  };

  async function signInWithPhoneNumber() {
    console.log("signInWithPhoneNumber", phoneNumber);
    setIsLoading(true);

    const confirmation = await auth().signInWithPhoneNumber(
      `+91${phoneNumber}`
    );

    console.log("confirmation", confirmation);
    setIsLoading(false);
    setConfirm(confirmation);
  }

  async function confirmCode() {
    setIsLoading(true);
    try {
      await confirm.confirm(code);
    } catch (error) {
      console.log("Invalid code.");
      setError(error);
    }
    setIsLoading(false);
  }

  const logout = () => {
    setUser(null);
  };

  // Handle loginState
  function onAuthStateChanged(user) {
    if (user) {
      setUser(user);
      setIsLoading(false);
    }
  }

  const SignOut = () => {
    console.log("SignOut");

    auth()
      .signOut()
      .then(() => {
        setUser(null);
        setCode("");
        setConfirm(null);
        setPhoneNumber("");
      });
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        signInWithPhoneNumber,
        confirmCode,
        code,
        setCode,
        logout,
        phoneNumber,
        setPhoneNumber,
        handlePhoneChange,
        confirm,
        setConfirm,
        isLoading,
        error,
        SignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Create a custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

import { View, Text } from 'react-native'
import React from 'react'
import { useAuth } from '@/contexts/AuthContext';

export default function App() {

  const { user, login, logout } = useAuth();


  if(user) {
    return (
      <View>
        <Text>Welcome {user.name}</Text>
        <Button title="Logout" onPress={logout} />
      </View>
    )
  }



  return (
    <View>
      <Text>Home</Text>
    </View>
  )
}
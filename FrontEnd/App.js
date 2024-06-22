import { StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect } from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AppProvider, AppContext } from './AppContext';

const Stack = createNativeStackNavigator();


import ChatScreen from './ChatScreen'
import AuthScreen from './AuthScreen'
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
    return (
      <AppProvider>
        <Navigation />
      </AppProvider>
    );
  };

const Navigation = () => {
    const { loggedIn, setUser, user, setLoggedIn } = useContext(AppContext);
    useEffect(() => {
      return async () => {
        const user_ = JSON.parse(await AsyncStorage.getItem('user'))
        if(user_){
          setUser(user_)
          setLoggedIn(true)
        }
      }
    }, [0])
    
    
    return (
            <NavigationContainer>
                { !loggedIn ? <Stack.Navigator initialRouteName="AuthScreen">
                    <Stack.Screen name="AuthScreen" component={AuthScreen} options={{ headerShown: false }}/>
                </Stack.Navigator> : <Stack.Navigator initialRouteName="ChatScreen">
                    <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ headerShown: false }}/>
                </Stack.Navigator>}
            </NavigationContainer>
    );
}

export default App

const styles = StyleSheet.create({})
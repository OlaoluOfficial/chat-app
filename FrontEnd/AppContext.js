import React, { createContext, useState } from 'react';
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create a Context
export const AppContext = createContext();

// Create a Provider component
export const AppProvider = ({ children }) => {
  const [state, setState] = useState({
    user: null,
    theme: 'light',
    // Add more state variables as needed
  });
  const [loggedIn, setLoggedIn] = useState(false)
  const [user, setUser] = useState(null)

  const authenticate = async({email, name, phoneNumber}) => {
    const call = await axios.post('http://localhost:9999/auth/signup', {email, username:name, phoneNumber})
    console.log(call)
    if(call.status == 200){
      setLoggedIn(true)
      await AsyncStorage.setItem('user', JSON.stringify(call.data.user))
      setUser(call.data.user)
    }
    // setLoggedIn(true)
  }

  // const setUser = (user) => {
  //   setState((prevState) => ({ ...prevState, user }));
  // };

  const setTheme = (theme) => {
    setState((prevState) => ({ ...prevState, theme }));
  };

  return (
    <AppContext.Provider value={{ state, setUser, user, setTheme, loggedIn, authenticate, setLoggedIn }}>
      {children}
    </AppContext.Provider>
  );
};

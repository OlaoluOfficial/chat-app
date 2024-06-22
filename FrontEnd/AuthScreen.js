import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useContext, useState, useEffect } from 'react'
import { AppContext } from './AppContext';
import {chatLogo} from './assets'
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthScreen = () => {
    const { authenticate, setLoggedIn, setUser } = useContext(AppContext);
    const [name, setName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [email, setEmail] = useState('')
    const [user_id, setUserId] = useState(null)
    

    useEffect(() => {
      async function trigger(){
        const _user = JSON.parse(await AsyncStorage.getItem('user'))
        console.log(_user)
        if(_user){ 
          setLoggedIn(true)
          setUser(_user)
        }
      }
      trigger()
      
    }, [0])


  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#8BABD8'}}>
      <View style={{height: 549, width: 520, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', borderRadius: 8}}>
        <View style={{justifyContent: 'center', alignItems: 'center', marginVertical: 30}}>
            <Image source={chatLogo}/>
        </View>
        <TextInput style={{width: 400, height: 50, outlineStyle: 'none', borderWidth: .5, borderColor: '#6E80A4', borderRadius: 5, padding: 15, marginVertical: 50/3/2}} placeholder="Name" value={name} onChangeText={setName}/>
        <TextInput style={{width: 400, height: 50, outlineStyle: 'none', borderWidth: .5, borderColor: '#6E80A4', borderRadius: 5, padding: 15, marginVertical: 50/3/2}} placeholder="Email" value={email} onChangeText={setEmail}/>
        <TextInput style={{width: 400, height: 50, outlineStyle: 'none', borderWidth: .5, borderColor: '#6E80A4', borderRadius: 5, padding: 15, marginVertical: 50/3/2}} placeholder="Phone Number" value={phoneNumber} onChangeText={setPhoneNumber}/>
        <TouchableOpacity onPress={async ()=> await authenticate({name, phoneNumber, email})} style={{width: 400, height: 50, borderRadius: 5, backgroundColor: '#6E80A4', marginVertical: 50/3/2, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{color: '#FFF', fontSize: 16, fontWeight: '500'}}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default AuthScreen

const styles = StyleSheet.create({})
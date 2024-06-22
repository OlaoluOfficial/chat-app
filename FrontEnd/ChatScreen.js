import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View, Image, FlatList, TextInput, TouchableOpacity } from 'react-native';
import React, {useState, useEffect, useContext, useRef} from 'react'
import {chatLogo, avatar, sendIcon} from './assets'
import SearchBar from './components/SearchBar';
import Room from './components/Room';
import axios from 'axios';
import io from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserAvatar from 'react-native-user-avatar';
import { AppContext } from './AppContext';

const SERVER_URL = 'http://localhost:9999'

const ChatBubble = ({text, time, from, user}) => (
  <View style={{ backgroundColor: from === user._id ? '#DEE9FF' : '#FFF', alignSelf: from === user._id ? 'flex-end' : 'flex-start', padding: 10, margin: 10, minWidth: 80, alignItems: 'center', borderRadius: 5 }}>
    <Text>{text}</Text>
  </View>
)
export default function App() {
  const socket = useRef()
  const { authenticate, user, setLoggedIn, setUser } = useContext(AppContext);
  const [profile, setProfile] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState('')
  const [users, setUsers] = useState(null)
  let [receipient, setReceipient] = useState(null)
  useEffect(() => {
    socket.current = io(SERVER_URL);
    console.log('YHHHHH1', socket)
      console.log(user)
      socket.current.emit('user-online', user._id);
      socket.current.on('private-message', (msg) => {
        setMessages(messages => [...messages, msg]);
    });
  }, [])

  useEffect(() => {
    console.log('Help')
      const allUsers = axios.get('http://localhost:9999/users').then((res) => {
        setUsers(res.data)
      })
  }, [0])

  useEffect(() => {
    console.log('Help')
      // socket.current.l
      const allUsers = axios.get(`http://localhost:9999/users/${user._id}`).then((res) => {
        setUsers(res.data)
        setReceipient({user: res.data[0]})
        const call = axios.get(`http://localhost:9999/messages/${user._id}/${res.data[0]._id}`).then((res) => {
          console.log(res.data)
          setMessages(res.data)
        })
      })
  }, [0])

  const getReceipient = (item) => {
    console.log(item)
    let individual = {user: item}
    const call = axios.get(`http://localhost:9999/messages/${user._id}/${item._id}`).then((res) => {
      setReceipient(individual)
      console.log(res.data)
      setMessages(res.data)
    })
  }

  const sendMessage = () => {
    const payload = {
      from: user._id,
      to: receipient.user._id,
      text: message
    }
    socket.current.emit('private-message', payload);
    setMessage('')
  }

  const logOut = async () => {
    socket.current.emit('logout');
    await AsyncStorage.removeItem('user')
    setLoggedIn(false)
    setUser(false)
  }

  
  

  const renderItem = ({ item }) => <ChatBubble text={item.text} from={item.from} user={user}/>;

  return (
    <View style={styles.container}>
      <View style={{flex: .25, height: '100%', borderRightWidth: .5, borderColor: '#F5F5F5'}}>
        <View style={{flex: 1, flexDirection: 'column'}}>
          <View style={{flex: .1, backgroundColor: '#FFF', justifyContent: 'center', paddingHorizontal: 10}}>
            <Image source={chatLogo} style={{height: 42}}/>
          </View>
          <View style={{flex: .08, backgroundColor: '#FFF', padding: 5, justifyContent: 'center', alignItems: 'center'}}>
            <SearchBar/>
          </View>
          <View style={{flex: .82}}>
            <ScrollView style={{ height: '100%'}} contentContainerStyle={{}} showsVerticalScrollIndicator={false}>
            {users?.map((item) => (
              <TouchableOpacity onPress={()=> getReceipient(item) } key={item._id}>
                <Room name={ user._id === item._id ? 'Me' : item.username} recentMessage={item.recentMessage || ''} key={item._id} online={item.online} timeOfRecentMessage={item?.timestamp}/>
              </TouchableOpacity>
            ))}
            </ScrollView>
          </View>
        </View>
      </View>
      <View style={{flex: !profile ?.75:.5, height: '100%'}}>
          <View style={{flex: .1, backgroundColor: '#FFF', justifyContent: 'center', paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
            <View style={{ flexDirection: 'row',justifyContent: 'center', alignItems: 'center'}}>
              <TouchableOpacity style={{width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', margin: 10}} onPress={()=> setProfile(!profile)}>
                <UserAvatar size={40} name={receipient?.user?.username} bgColor="#6E80A4"/>
              </TouchableOpacity>
              <Text>{receipient?.user?.username}</Text>
            </View>
            <>
              <TouchableOpacity onPress={async() => await logOut()}>
                <Text>LogOut</Text>
              </TouchableOpacity>
            </>
          </View>
          <View style={{flex: .8, paddingHorizontal: 10, backgroundColor: '#F6F6F6'}}>
            <FlatList
            
              data={messages}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              style={{flex: 1}}
            />
          </View>
          <View style={{flex: .1, padding: 15, justifyContent: 'center'}}>
            <View style={{width: '100%', height: 50, backgroundColor: '#f5f5f5', borderRadius: 10, justifyContent: 'space-between', paddingHorizontal: 15, flexDirection:'row', alignItems: 'center' }}>
              <TextInput placeholder="Message" style={{outlineStyle: 'none', fontSize: 19, marginLeft: 5}} onChangeText={setMessage} value={message}/>
              <TouchableOpacity onPress={() => sendMessage()}>
                <Image source={sendIcon} />
              </TouchableOpacity>
            </View>
          </View>
      </View>
      {profile ? <View style={{flex: .25, borderLeftWidth: .5, borderColor: '#F5F5F5', height: '100%'}}>
        <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity style={{position: 'absolute', top: 0, left: 0, margin: 10}} onPress={()=> setProfile(false)}>
              <Text>X</Text>
            </TouchableOpacity>
          <View style={{flex: .4, padding: 10, justifyContent: 'center', alignItems: 'center'}}>
            <View style={{width: 132, height: 132, borderRadius: 132/2, backgroundColor: 'gray', justifyContent: 'center', alignItems: 'center'}}>
              <UserAvatar size={132} name={receipient?.user?.username} bgColor="#6E80A4"/>
            </View>
            <Text style={{fontWeight: '600', fontSize: 16, marginVertical: 5}}>{receipient?.user?.username}</Text>
            <Text style={{fontSize: 16, marginVertical: 5}}>{receipient?.user?.phoneNumber}</Text>
            <Text style={{fontSize: 16, marginVertical: 5}}>{receipient?.user?.email}</Text>
          </View>
          <View style={{borderWidth: .25, width: '80%', borderColor: '#f5f5f5'}}></View>
          <View style={{flex: .6}}></View>
        </View>
      </View>: <></>}
      <StatusBar style="auto" />
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import UserAvatar from 'react-native-user-avatar';
import moment from 'moment'

const Room = ({name, recentMessage, timeOfRecentMessage, countOfUnReadTexts, profile, online}) => {
  const formatDate = (timestamp) => {
    console.log(timestamp)
    const messageDate = moment(timestamp);
    if(!timestamp){
      return ''
    }
    if (messageDate.isSame(moment(), 'day')) {
        return messageDate.format('hh:mm a');
    } else {
        return messageDate.format('MMM DD, YYYY');
    }
};
  return (
    <View style={{width: '100%', height: 70, flex: 1, flexDirection: 'row', alignItems: 'center', paddingVertical: 0}}>
      <View style={{flex: 1, height: '100%', padding: 5, justifyContent: 'center', alignItems: 'center'}}>
        {online ? <View style={{position: 'absolute', width: 10, height: 10, borderRadius: 5, backgroundColor: 'green', zIndex: 1, top: '20%', right: '20%'}}></View>: <></>}
        <UserAvatar size={48} name={name} bgColor="#6E80A4"/>
      </View>
      <View style={{flex: 4, flexDirection: 'column', height: 70}}>
        <View style={{flex: 1,  justifyContent: 'flex-end', paddingHorizontal: 5}}><Text>{name}</Text></View>
        <View style={{flex: 1,  justifyContent: 'flex-start', paddingHorizontal: 5}}><Text>{recentMessage}</Text></View>
      </View>
      <View style={{flex: 1, height: '100%'}}>
        <View style={{flex: 1,  justifyContent: 'center', paddingHorizontal: 5}}><Text style={{fontSize: 10}}>{formatDate(timeOfRecentMessage)}</Text></View>
        {/* <View style={{flex: 1, alignItems: 'center', justifyContent: 'flex-start', paddingHorizontal: 5}}>
            <View style={{justifyContent: 'flex-end', flexDirection: 'row'}}>
                {
                    countOfUnReadTexts > 0 ?
                    <View style={{width: 20, height: 20, borderRadius: 10, display: 'flex',  backgroundColor: '#3758F9', justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{color: 'white', fontSize: 10}}>{countOfUnReadTexts}</Text></View>: <></>
                }
            </View>
        </View> */}
      </View>
    </View>
  )
}

export default Room

const styles = StyleSheet.create({})
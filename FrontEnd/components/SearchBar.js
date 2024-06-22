import { StyleSheet, Text, View, Image, TextInput } from 'react-native'
import React from 'react'
import { searchIcon } from '../assets'

const SearchBar = () => {
  return (
    <View style={{height: 40, backgroundColor: '#F5F5F5', width: '95%', borderRadius: 22, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15}}>
      <Image source={searchIcon} style={{width: 22, height: 22, marginRight: 5}}/>
      <TextInput placeholder='Search' style={{outlineStyle: 'none', fontSize: 19, marginLeft: 5}}/>
    </View>
  )
}

export default SearchBar

const styles = StyleSheet.create({})
import React, {useState, useEffect, useLayoutEffect } from 'react';
import { View,StyleSheet, StatusBar, TouchableOpacity, FlatList, Text} from 'react-native';
import { GREY, OFF_WHITE, PRIMARY_COLOR, WHITE} from '../common';
import { ListItem,LocationPin } from '../items';
import { MaterialIcons } from '@expo/vector-icons';
import { firebaseApp } from '../firebaseconfig';
import Dialog, { DialogFooter, DialogButton, DialogContent, DialogTitle, SlideAnimation } from 'react-native-popup-dialog';
import { Button } from 'react-native-paper';
import { SearchBar } from 'react-native-elements';
import GoogleMapReact from 'google-map-react';

export default function Contact({navigation}) {
  navigation.addListener('focus', () => {})
  useEffect(()=>{
  }) 
  const location = {
    address: '1600 Amphitheatre Parkway, Mountain View, california.',
    lat: 37.42216,
    lng: -122.08427,
  }
  return (
    <View style={styles.container}>
      <StatusBar barStyle='dark-content' translucent></StatusBar>
      <View style={styles.topdock}></View>
      <View>
      <GoogleMapReact
        bootstrapURLKeys={{ key: '' }}
        defaultCenter={location}
        defaultZoom={1}
      >
        <View>
        <LocationPin
          lat={location.lat}
          lng={location.lng}
          text={location.address}
        />
        </View>
      </GoogleMapReact>
      </View>
      </View>
  );
}

var styles = StyleSheet.create({
  container:{
    height:'100%',
    backgroundColor:WHITE
  },
  topdock:{
    height:120,
    backgroundColor:PRIMARY_COLOR,
    borderBottomRightRadius:70
  },
  list:{
    width:'90%',
    alignSelf:'center'
  },
  newBtn:{
    position:'absolute',
    width:70,
    height:70,
    right:20,
    bottom:20,
    borderRadius:100,
    backgroundColor:PRIMARY_COLOR,
    justifyContent:'center',
    alignItems:'center',
    elevation:5
  },
  dialog:{
    width:280,
    height:40,
    justifyContent:'center',
    alignItems:'center',
  },
})
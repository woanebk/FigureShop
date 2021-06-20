import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, StyleSheet, StatusBar, TouchableOpacity, FlatList, Text } from 'react-native';
import { ListItem, LocationPin } from '../items';
import { MaterialIcons } from '@expo/vector-icons';
import { firebaseApp } from '../firebaseconfig';
import Dialog, { DialogFooter, DialogButton, DialogContent, DialogTitle, SlideAnimation } from 'react-native-popup-dialog';
import { Button } from 'react-native-paper';
import { SearchBar } from 'react-native-elements';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';
import {Linking} from 'react-native'
import {  BLACK, DARK_PRIMARY_COLOR, GREY, OFF_WHITE, PRIMARY_COLOR, WHITE, LIGHT_PINK, GREY_BORDER, GUEST_UID, GOLD, GREEN } from '../common';

export default function Contact({ navigation }) {
  const[regions]=useState({
    latitude: 10.881379, longitude: 106.808778,});
  navigation.addListener('focus', () => { })
  var [region, setregion] = useState({
    latitude: 10.881379, longitude: 106.808778,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0920,
  })
  const [marker] = useState({
    latlng: {
      latitude: 10.881379,
      longitude: 106.808778,
    }, title: "Trụ sở công ty mô hình", description: "Địa chỉ:khu phố 6, phường Linh Trung,Thủ Đức,TPHCM"
  })
  useEffect(() => {
  })
  // const location = {
  //   address: '1600 Amphitheatre Parkway, Mountain View, california.',
  //   lat: 37.42216,
  //   lng: -122.08427,
  // }
  return (
    <View style={styles.container}>
      <StatusBar barStyle='dark-content' translucent></StatusBar>
      <View style={styles.topdock}></View>
      <View style={styles.list}>
        <View style={styles.list1}>
          <MapView
            style={styles.list}
            region={region}
            onRegionChangeComplete={region => { setregion(region) }}
            onLongPress={()=>{Linking.openURL(`geo:${regions.latitude},${regions.longitude}?center=${regions.latitude},${regions.longitude}&q=${regions.latitude},${regions.longitude}&z=16`)}}
          >
            <Marker
              coordinate={marker.latlng}
              title={marker.title}
              description={marker.description}
            />
          </MapView>
        </View>
        <TouchableOpacity style={[styles.commandBtn2, { alignSelf: 'center', marginTop:30 }]}
          onPress={() => { Linking.openURL("tel:0349156877") }
          }
        >
          <Text style={styles.commandTxt}>HOTLINE: 0349156877</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.commandBtn2, { alignSelf: 'center' }]}
          onPress={() => { Linking.openURL("mailto:18520096@gm.uit.edu.vn") }
          }
        >
          <Text style={styles.commandTxt}>EMAIL SUPPORT: 18520096@gm.uit.edi.vn</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.commandBtn3, { alignSelf: 'center' }]}
          onPress={() => { Linking.openURL("https://www.facebook.com/nam.vs.theworld") }
          }
        >
          <Text style={styles.commandTxt}>FACEBOOK SUPPORT</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

var styles = StyleSheet.create({
  hotlinetext: { alignItems: "center" },
  container: {

    height: '100%',
    backgroundColor: WHITE
  },
  topdock: {
    height: 120,
    backgroundColor: PRIMARY_COLOR,
    borderBottomRightRadius: 70
  },
  list1: {
    width: '90%',
    height: '40%',
    alignSelf: 'center',
    marginTop: 20
  },
  list: {
    marginTop: 0,
    width: '100%',
    height: '100%',
    alignSelf: 'center'
  },
  newBtn: {
    position: 'absolute',
    width: 70,
    height: 70,
    right: 20,
    bottom: 20,
    borderRadius: 100,
    backgroundColor: PRIMARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5
  },
  dialog: {
    width: 280,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commandBtn2:{
    borderRadius:5,
    backgroundColor:DARK_PRIMARY_COLOR,
    alignItems:'center',
    height:40,
    width:300,
    marginTop:10,
    marginBottom:10,
    justifyContent:'center',
    padding:10,
    elevation:5,
  },
  commandBtn3:{
    borderRadius:5,
    backgroundColor:'#4267B2',
    alignItems:'center',
    height:40,
    width:300,
    marginTop:10,
    marginBottom:10,
    justifyContent:'center',
    padding:10,
    elevation:5,
  },
  commandTxt:{
    fontWeight:'bold',
    color:WHITE
  }
})
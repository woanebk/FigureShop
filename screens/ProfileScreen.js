import react from 'react';
import React, { Component, Dimensions, useEffect  } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, StatusBar, TouchableOpacity } from 'react-native';
import { TouchableRipple, IconButton } from 'react-native-paper';
import { GREY, LIGHT_GREY, SECONDARY_COLOR } from '../common';
import {DashBoard, UserPFP, ProfileButton, InfoDisplayer} from '../items'
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react/cjs/react.development';

export default function ProfileScreen ({navigation}) {
  var [logined, setLogined] = useState(true);
  
  useEffect(()=>{
    // Header Navigate to Edit Profile:
    navigation.setOptions({
       title: '' ,
       headerRight:()=>(
        <IconButton icon="account-edit" onPress={() => navigation.navigate('EditProfile')}
        color = "#FF6347" size={25}/>
       )
      })
  });
  
  return (
    <ScrollView style={styles.container}>
      <StatusBar backgroundColor='transparent' barStyle='dark-content' translucent/>
      <View style={styles.topdock}>
        <View style={styles.pfpHolder}>
          <UserPFP image={require('../assets/banner/op_swiper_1.jpg')}></UserPFP>
        </View>
        <View style={styles.userinfo}>
          <Text style={styles.usernameTxt}> User Name</Text>

          <View style={{height:30}}>
            <InfoDisplayer ionIconName='call' text='0976712345' ></InfoDisplayer>
          </View>

          <View style={{height:30}}>
            <InfoDisplayer ionIconName='location' text='229, Trần Hưng Đạo' ></InfoDisplayer>
          </View>
        </View>
      </View>

      <View style={styles.dashboardHolder}>
        <DashBoard></DashBoard>
      </View>

      <View style={styles.btnsMenuWrapper}>
        <View style={styles.userBtn}>
          <TouchableRipple onPress={() => navigation.navigate('ListCategory')}>
            <ProfileButton iconName='robot' text='Quản Lý Loai Sản Phẩm' ></ProfileButton>
          </TouchableRipple>
        </View>

        <View style={styles.userBtn}>
          <TouchableRipple onPress={() => console.log('Menu ')}>
            <ProfileButton iconName='heart' text='Quản Lý Bán Hàng' ></ProfileButton>
          </TouchableRipple>
        </View>

        <View style={styles.userBtn}>
          <TouchableRipple onPress={() => console.log('Menu ')}>
            <ProfileButton iconName='clock' text='Quản Lý Đặt Hàng' ></ProfileButton>
          </TouchableRipple>
        </View>

        <View style={styles.userBtn}>
          <TouchableRipple onPress={() => console.log('Menu ')}>
            <ProfileButton iconName='human' text='Quản Lý Nhân Viên' ></ProfileButton>
          </TouchableRipple>
        </View>

        <View style={styles.userBtn}>
          <TouchableRipple onPress={() => console.log('Menu ')}>
            <ProfileButton iconName='chart-bar' text='Báo Cáo Doanh Thu' ></ProfileButton>
          </TouchableRipple>
        </View>

        <View style={styles.userBtn}>
          <TouchableRipple onPress={() => console.log('Menu ')}>
            <ProfileButton iconName='chart-bar' text='Báo Cáo Doanh Thu' ></ProfileButton>
          </TouchableRipple>
        </View>
        
      </View>
      
  </ScrollView>
  );
}


var styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#fff',
  },
  topdock:{
    height:400,
    backgroundColor:SECONDARY_COLOR,
  },
  pfpHolder:{
    alignSelf:'center',
    top:110,
  },
  usernameTxt:{
    alignSelf:'center',
    fontSize:27,
    fontWeight:'bold',
  },
  userinfo:{
    //backgroundColor:'#000',
    height:100,
    top:120,
    alignItems:'center'
  },
  dashboardHolder:{
    width:'80%',
    alignSelf:'center',
    top:-40,
  },
  btnsMenuWrapper:{
    alignItems:'center',
    backgroundColor:'#fff',
    flexGrow:1,
  },
  userBtn:{
    height:50,
    width:'80%',
    marginTop:5,
    borderBottomWidth:1,
    borderBottomColor:LIGHT_GREY
  },
})
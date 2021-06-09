import react from 'react';
import React, { Component, Dimensions, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, StatusBar, TouchableOpacity } from 'react-native';
import { TouchableRipple, IconButton } from 'react-native-paper';
import { GREY, LIGHT_GREY, SECONDARY_COLOR } from '../common';
import { DashBoard, UserPFP, ProfileButton, InfoDisplayer } from '../items'
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react/cjs/react.development';
import { firebaseApp } from '../firebaseconfig';
export default function ProfileScreen({ navigation }) {
  const [firstRun,setFirstRun]=useState(0); // Lần chạy đầu tiên useEffect sẽ gọi get Anime để đăng kí listenr dữ liệu (Những lần useEffect sau sẽ bỏ qua- tránh lỗi infinite loop)
  var [user, setuser] = useState(firebaseApp.auth().currentUser);
  navigation.addListener('focus', () => {getuserinfo()})
  useEffect( () => {
    if(firstRun == 0){
    getuserinfo()
    setFirstRun((firstRun)=>firstRun += 1
    ) 
  }
  if(firebaseApp.auth().currentUser.uid!="Pyino4SsfsPXgD8kNYyKBIO3pMd2")
  navigation.setOptions({
      title: '',
      headerRight: () => (
        <IconButton icon="account-edit" onPress={() => navigation.navigate('EditProfile')}
          color="#FF6347" size={25} />
      )
    })
  });
  const getuserinfo = async() => {
    firebaseApp.database().ref('User/'+ firebaseApp.auth().currentUser.uid).on('value', (snapshot) => {
      if (snapshot.exists()) {
        setuser(snapshot.val())
        firebaseApp.auth().currentUser.updateProfile(snapshot.val())
      }
    })
    console.log(user)
   await firebaseApp.database().ref('User/'+ firebaseApp.auth().currentUser.uid).update(user);
  }
  if (user.uid=="Pyino4SsfsPXgD8kNYyKBIO3pMd2")
  return (
    <ScrollView style={styles.container}>
      <StatusBar backgroundColor='transparent' barStyle='dark-content' translucent />
      <View style={styles.topdock}>
        <View style={styles.pfpHolder}>
          <UserPFP image={require('../assets/banner/op_swiper_1.jpg')}></UserPFP>
        </View>
        <View style={styles.userinfo}>
          <Text style={styles.usernameTxt}>
            {user.displayName}
          </Text>
        </View>
      </View>
      <View style={styles.btnsMenuWrapper}>       

        <View style={styles.userBtn}>
          <TouchableRipple onPress={() =>
            firebaseApp.auth().signOut()
          }
          >
            <ProfileButton iconName='logout' text='Đăng xuất' ></ProfileButton>
          </TouchableRipple>
        </View>
      </View>
    </ScrollView>
  );
  else  
  return (
    <ScrollView style={styles.container}>
      <StatusBar backgroundColor='transparent' barStyle='dark-content' translucent />
      <View style={styles.topdock}>
        {
          user.photoURL!=null?
         <View style={styles.pfpHolder}>
         <UserPFP image={{uri:user.photoURL}}></UserPFP>
        </View>:
        <View style={styles.pfpHolder}>
        <UserPFP image={require('../assets/banner/op_swiper_1.jpg')}></UserPFP>
      </View>
        }
        <View style={styles.userinfo}>
          <Text style={styles.usernameTxt}>
            {user.displayName}
          </Text>
          <View style={{ height: 30 }}>
            <InfoDisplayer ionIconName='call' text={user.phoneNumber} ></InfoDisplayer>
          </View>
          <View style={{ height: 30 }}>
            <InfoDisplayer ionIconName='location' text={user.location} ></InfoDisplayer>
          </View>
        </View>
      </View>
  
      <View style={styles.dashboardHolder}>
        <DashBoard></DashBoard>
      </View>
      <View style={styles.btnsMenuWrapper}>
        <View style={styles.userBtn}>
          <TouchableRipple onPress={() => navigation.navigate('ManageCategory')}>
            <ProfileButton iconName='robot' text='Quản Lý Loai Sản Phẩm - Anime' ></ProfileButton>
          </TouchableRipple>
        </View>
      
        <View style={styles.userBtn}>
          <TouchableRipple onPress={() => navigation.navigate('ManageFigures')}>
            <ProfileButton iconName='heart' text='Quản Lý Sản Phẩm' ></ProfileButton>
          </TouchableRipple>
        </View>
  
        <View style={styles.userBtn}>
          <TouchableRipple onPress={() => console.log('Menu ')}>
            <ProfileButton iconName='clock' text='Quản Lý Đặt Hàng' ></ProfileButton>
          </TouchableRipple>
        </View>
  
        <View style={styles.userBtn}>
          <TouchableRipple onPress={() => navigation.navigate('AllUser')}>
            <ProfileButton iconName='human' text='Quản Lý Nhân Viên' ></ProfileButton>
          </TouchableRipple>
        </View>
        <View style={styles.userBtn}>
          <TouchableRipple onPress={() => navigation.navigate('AllGuest')}>
            <ProfileButton iconName='human' text='Quản Lý Khách Hàng' ></ProfileButton>
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
  
        <View style={styles.userBtn}>
          <TouchableRipple onPress={() =>
            //console.log(firebaseApp.auth())
            //,
            firebaseApp.auth().signOut()
          }
          >
            <ProfileButton iconName='logout' text='Đăng xuất' ></ProfileButton>
          </TouchableRipple>
        </View>
      </View>
  
    </ScrollView>
  );
}


var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topdock: {
    height: 400,
    backgroundColor: SECONDARY_COLOR,
  },
  pfpHolder: {
    alignSelf: 'center',
    top: 110,
  },
  usernameTxt: {
    alignSelf: 'center',
    fontSize: 27,
    fontWeight: 'bold',
  },
  userinfo: {
    height: 100,
    top: 120,
    alignItems: 'center'
  },
  dashboardHolder: {
    width: '80%',
    alignSelf: 'center',
    top: -40,
  },
  btnsMenuWrapper: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  userBtn: {
    height: 50,
    width: '80%',
    marginTop: 5,
    borderBottomWidth: 1,
    borderBottomColor: LIGHT_GREY
  },
})
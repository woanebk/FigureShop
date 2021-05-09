import react from 'react';
import React, { Component, Dimensions  } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, StatusBar, TouchableOpacity, TextInput } from 'react-native';
import { TouchableRipple, IconButton } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { GREY, PRIMARY_COLOR, SECONDARY_COLOR, WHITE, LIGHT_GREY } from '../common';
import UserPFP from '../components/UserPFP';

export default function EditProfileScreen({navigation}) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle='dark-content' translucent></StatusBar>
      {/* =======Profile Picture Area */}
      <View style={styles.topdock}>
      </View>
      <TouchableOpacity style={styles.userpfp} onPress={()=>{console.log('image')}}>
          <View>
            <UserPFP image={require('../assets/banner/op_swiper_1.jpg')} ></UserPFP>
            <View style={styles.editpfpBtn}>
              <Ionicons style={{alignSelf:'center'}} name='pencil' color='#fff' size={15} />
            </View>
          </View>
        </TouchableOpacity>

      <View style={styles.infoWrapper}>
        <Text style={styles.usernameTxt}> UserName</Text>
        <View style={styles.userInfo}>
          <Ionicons style={{alignSelf:'center'}} name='person' size={18} color={GREY}/>
          <TextInput style={styles.textInput} placeholder='Họ Tên'/>
        </View>

        <View style={styles.userInfo}>
          <Ionicons style={{alignSelf:'center'}} name='call' size={18} color={GREY}/>
          <TextInput style={styles.textInput} placeholder='Số Điện thoại' keyboardType='number-pad'/>
        </View>

        <View style={styles.userInfo}>
          <Ionicons style={{alignSelf:'center'}} name='location' size={18} color={GREY}/>
          <TextInput style={styles.textInput} placeholder='Địa Chỉ'/>
        </View>

        <View style={styles.userInfo}>
          <Ionicons style={{alignSelf:'center'}} name='mail' size={18} color={GREY}/>
          <TextInput style={styles.textInput} placeholder='Email' keyboardType='email-address'/>
        </View>
        
        <TouchableOpacity style={styles.commandBtn}>
          <Text style={styles.commandTxt}>Xác Nhận</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

var styles = StyleSheet.create({
  container:{
    
  },
  topdock:{
    height:180,
    backgroundColor:PRIMARY_COLOR,
    borderBottomRightRadius:70
  },
  userpfp:{
    position:'absolute',
    backgroundColor:'#000',
    borderRadius:60,
    left:'50%',
    marginLeft:-60, //margin half the width of PFP Picker
    top:120,
  },
  usernameTxt:{
    fontSize:25,
    alignSelf:'center',
    fontWeight:'bold'
  },
  editpfpBtn:{
    position:'absolute',
    width:30,
    height:30,
    borderRadius:30,
    borderWidth:2,
    borderColor:'#fff',
    backgroundColor:'#000',
    right:0,
    top:5,
    justifyContent:'center'
  },
  infoWrapper:{
    marginTop:70,
    width:'90%',
    alignSelf:'center'
    //backgroundColor:SECONDARY_COLOR,
  },
  userInfo:{
    height:30,
    alignSelf:'center',
    flexDirection:'row',
    marginTop:10,
    marginBottom:10,
    borderBottomWidth:1,
    borderBottomColor:LIGHT_GREY
  },
  textInput:{
    flex:1,
    paddingLeft:10,
    color:GREY
  },
  commandBtn:{
    padding:15,
    borderRadius:10,
    backgroundColor:PRIMARY_COLOR,
    alignItems:'center',
    marginTop:10,
    height:50,
    justifyContent:'center'
  },
  commandTxt:{
    color:WHITE, 
    fontSize:25,
  }
})
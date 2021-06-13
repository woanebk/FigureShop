import React, { Fragment, useEffect } from 'react';
import { useContext, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, StatusBar, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { useState } from 'react/cjs/react.development';
import CartContext from '../CartContext';
import { BLACK, DARK_PRIMARY_COLOR, GREY, OFF_WHITE, PRIMARY_COLOR, WHITE, LIGHT_PINK, GREY_BORDER } from '../common';
import { ActionInput, CheckOutItem, CodeInput } from '../items';
import { Ionicons} from '@expo/vector-icons';

export default function SuccessOrderScreen({route, navigation}) {

  const {cart, setCart} = useContext(CartContext)
  const {ten_khach_hang}= route.params; 
  const {dia_chi}= route.params;
  const {thanh_tien}= route.params;
  const {so_dien_thoai}= route.params;
  

  useEffect(()=>{
  })

  const renderItems = () => {
    return cart.map((item, index) =>(
      <View key = {index}>
        <CheckOutItem name = {item.TenSanPham}
          itemImage={{uri:item.HinhAnh[0]}}
          soLuong = {item.SoLuongMua}
          giaBan = {item.GiaBan * (1 - item.GiamGia)}
        ></CheckOutItem>
      </View>
    ))
  }

  const goToHome = ()=>{
    setCart([])
    navigation.navigate('Home')
  }

  return (
      <ScrollView style={styles.container}>
          <StatusBar barStyle='light-content' translucent backgroundColor={'transparent'} ></StatusBar>
          <View style={styles.topdock}></View>
          <View style={styles.iconHolder}>
              <Ionicons style={styles.icon} name='checkmark' size={50} color={PRIMARY_COLOR}></Ionicons>
          </View>
          <Text style={styles.bigTxt}>Đặt Hàng Thành Công</Text>
          <Text numberOfLines={10} style={styles.txt}>Vui lòng chuẩn bị { thanh_tien} VND Khi Nhận Hàng</Text>
          <View style={styles.infoWrapper}>
            <Text style={styles.infoTitleTxt}>Thông Tin Khách Hàng</Text>
            <Text style={styles.infoTxt}>Họ Tên:{' ' + ten_khach_hang}</Text>
            <Text style={styles.infoTxt}>Số Điện Thoại:{' ' + so_dien_thoai}</Text>
            <Text numberOfLines={7} style={styles.infoTxt}>Địa Chỉ:{' ' + dia_chi}</Text>
          </View>

          <View style={{backgroundColor:PRIMARY_COLOR, flex:1}}>
            <View style={styles.itemsWrapper}>
              {renderItems()}
              <View style={styles.tag}>
                <View style={styles.tag1}>
                  <Ionicons name = 'card-outline' size={25} color={PRIMARY_COLOR}></Ionicons>
                </View>
                <View style={styles.tag2}>
                  <Text style={styles.tag2Txt}>Sản phẩm đã chọn</Text>
                </View>
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.commandBtn} onPress={goToHome}>
            <Text style={styles.commandTxt}> Quay Về Trang Chủ</Text>
          </TouchableOpacity>
      </ScrollView>
  )
}

var styles = StyleSheet.create({
  container:{
    height:'100%',
    backgroundColor:PRIMARY_COLOR
  },
  topdock:{
    height:110,
    backgroundColor:PRIMARY_COLOR,
    borderBottomRightRadius:70
  },
  iconHolder:{
    backgroundColor:WHITE,
    width:120,
    height:120,
    borderRadius:100,
    alignSelf:'center'
  },
  icon:{
      top:'50%',
      left:'50%',
      marginLeft:-25,
      marginTop:-25
  },
  bigTxt:{
      fontSize:30,
      width:'100%',
      fontWeight:'bold',
      color:WHITE,
      textAlign:'center',
      marginTop:10
  },
  txt:{
    color:WHITE,
    textAlign:'center',
    width:'100%',
    fontSize:15,
    marginTop:10
  },
  itemsWrapper:{
    backgroundColor:WHITE,
    width:'94%',
    marginTop:40,
    borderRadius:15,
    borderColor:GREY_BORDER,
    borderWidth:2,
    alignSelf:'center',
    paddingTop:40,

  },
  tag:{
    height:35,
    position:'absolute',
    backgroundColor:LIGHT_PINK,
    flexDirection:'row',
    alignItems:'center',
    top:-20,
    left:10,
    borderRadius:8,
    borderColor:PRIMARY_COLOR,
    borderWidth:1
  },
  tag1:{
    marginLeft:5
  },
  tag2:{
    marginLeft:5,
    paddingRight:5
  },
  tag2Txt:{
    color:DARK_PRIMARY_COLOR
  },  
  infoWrapper:{
    width:'90%',
    height:150,
    backgroundColor:WHITE,
    alignSelf:'center',
    borderRadius:10,
    marginTop:10
  },
  infoTitleTxt:{
    fontSize:15,
    fontWeight:'bold',
    marginLeft:10,
    borderBottomWidth:1,
    borderColor:GREY_BORDER,
    marginRight:10,
    marginTop:5
  },
  infoTxt:{
    fontSize:14,
    marginLeft:10,
    marginTop:5
  },
  commandBtn:{
    alignSelf:'center',
    backgroundColor:WHITE,
    width:200,
    height:50,
    alignItems:'center',
    justifyContent:'center',
    borderRadius:30,
    borderWidth:1,
    borderColor:BLACK,
    marginTop:20,
    marginBottom:30
  },
  commandTxt:{
    color:DARK_PRIMARY_COLOR,
    fontWeight:'bold',
    fontSize:15,
    width:'100%',
    textAlign:'center'
  },
})
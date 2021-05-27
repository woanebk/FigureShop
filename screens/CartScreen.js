import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image, StatusBar, TouchableOpacity } from 'react-native';
import { DARK_PRIMARY_COLOR, GREY, OFF_WHITE, PRIMARY_COLOR, WHITE } from '../common';
import { CartItem } from '../items';

export default function CartScreen({route, navigation}) {

  return (
      <View style={styles.container}>
        <StatusBar barStyle='light-content' translucent backgroundColor={'transparent'} ></StatusBar>
        <View style={styles.topdock}></View>
        <Text style={styles.topTxt}>My Bag</Text>
        <ScrollView style={styles.scroller}>
          <CartItem 
            itemImage = {require('../assets/banner/naruto_swiper_1.jpg')}
            itemName='Naruto Lục Đạo'
            itemDescription='Anime: Naruto'
            value={10}
            oldPrice={1200000}
            price={2000000}
            onDeletePress={()=>{}}/>
            <CartItem 
            itemImage = {require('../assets/banner/naruto_swiper_1.jpg')}
            itemName='Naruto Lục Đạo'
            itemDescription='Anime: Naruto'
            value={10}
            oldPrice={1200000}
            price={2000000}
            onDeletePress={()=>{}}/>
            <CartItem 
            itemImage = {require('../assets/banner/naruto_swiper_1.jpg')}
            itemName='Naruto Lục Đạo'
            itemDescription='Anime: Naruto'
            value={10}
            oldPrice={1200000}
            price={2000000}
            onDeletePress={()=>{}}/>
            <CartItem 
            itemImage = {require('../assets/banner/naruto_swiper_1.jpg')}
            itemName='Naruto Lục Đạo'
            itemDescription='Anime: Naruto'
            value={10}
            oldPrice={1200000}
            price={2000000}
            onDeletePress={()=>{}}/>
            <CartItem 
            itemImage = {require('../assets/banner/naruto_swiper_1.jpg')}
            itemName='Naruto Lục Đạo'
            itemDescription='Anime: Naruto'
            value={10}
            oldPrice={1200000}
            price={2000000}
            onDeletePress={()=>{}}/>
        </ScrollView>
        <View style={styles.total}>
          <Text style={styles.totalTxt}>Thành Tiền{'  '}</Text>
          <Text style={styles.totalpriceTxt}>120,000 VND{'  '}</Text>
        </View>
        <TouchableOpacity style={styles.commandBtn}>
          <Text style={styles.commandTxt}> Tiến Hành Đặt Hàng{'   '}</Text>
        </TouchableOpacity>
      </View>
  );
}

var styles = StyleSheet.create({
  container:{
    height:'100%',
    backgroundColor:OFF_WHITE
  },
  topdock:{
    height:120,
    backgroundColor:PRIMARY_COLOR,
    borderBottomRightRadius:70
  },
  topTxt:{
    fontWeight:'bold',
    fontSize:30,
    marginLeft:'5%'
  },
  scroller:{
    //backgroundColor:WHITE,
    marginTop:40
  },
  commandBtn:{
    borderRadius:50,
    backgroundColor:DARK_PRIMARY_COLOR,
    alignItems:'center',
    height:50,
    justifyContent:'center',
    margin:10,
    padding:10,
    elevation:5
  },
  commandTxt:{
    color:WHITE,
    fontSize:18,
    fontWeight:'bold',
  },
  total:{
    //backgroundColor:PRIMARY_COLOR,
    height:50,
    width:'90%',
    alignSelf:'center',
    alignItems:'center',
    flexDirection:'row',
    justifyContent:'space-between',
    borderTopWidth:1,
    borderColor:GREY,
    marginTop:10
  },
  totalTxt:{
    color:GREY,
    fontSize:15
  },
  totalpriceTxt:{
    fontSize:20,
    fontWeight:'bold',
    color:DARK_PRIMARY_COLOR
  },
})
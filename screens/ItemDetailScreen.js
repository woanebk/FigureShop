import react from 'react';
import React, { Component } from 'react';
import { useEffect } from 'react';
import { View, Text, Image, StyleSheet, StatusBar, ScrollView, Button } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { IconButton } from 'react-native-paper';
import Swiper from 'react-native-swiper/src';
import { useState } from 'react/cjs/react.development';
import {PRIMARY_COLOR, SECONDARY_COLOR, GREY} from '../common';
import {firebaseApp} from '../firebaseconfig'

export default function ItemDetailScreen ({route, navigation}){
  const {anime_ID}= route.params; 
  const {sanpham_ID}= route.params;

  const [sanPham,setSanPham] = useState({}) // initial object tranh loi
  const [tenAnime, setTenAnime] = useState('')
  const [hinhAnhs, setHinhAnhs] = useState([])

  useEffect (()=>{
    navigation.setOptions({
      headerRight:()=>( 
        <View style={{marginLeft:10}}>
          <IconButton icon="shopping" onPress = {()=>navigation.navigate('Cart')}
          color = {PRIMARY_COLOR} size={25}/>
        </View>
      ),
    })
    navigation.addListener('focus', () => {getSanPham() ; getTenAnime()} )
  })

  const getSanPham = async () => {
    firebaseApp.database().ref('Anime/' + anime_ID + '/SanPham/' + sanpham_ID).once('value', (snapshot)=>{
      if( snapshot.exists())
      {
        setSanPham(snapshot.val())
        setHinhAnhs(snapshot.val().HinhAnh)
      }
    })
  }

  const getTenAnime = async () => {
    firebaseApp.database().ref('Anime/' + anime_ID).once('value', (snapshot)=>{
      if( snapshot.exists())
      {
        setTenAnime(snapshot.val().TenAnime)
      }
    })
  }

  const renderSlides = () => {
    return hinhAnhs.map(element=>(
      <View >
          <Image style={styles.swiperImg}
              source ={{uri: element}}
              resizeMode='cover'
              key = {element}
            />
        </View>
    ))
    
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle='light-content' translucent/>
      <View style={styles.swiperWrapper}>
        <Swiper>
          {renderSlides()}
        </Swiper>
      </View>
    {/*=============== Info =====================*/}
      <View style={styles.itemInfoWrapper}>
        {/* ==============Ten San Pham */}
        <View style={styles.itemNameWrapper}>
          <View style={styles.itemName}>
            <Text style={{fontSize:25, fontWeight:'bold'}} numberOfLines={1}>{sanPham.TenSanPham}</Text>
            <Text style={{ fontSize:15, paddingHorizontal:3, color:GREY,}} >Manga/Anime: {' ' + tenAnime}</Text>
            <Text style={{ fontSize:15, paddingHorizontal:3, color:GREY,}} >Nhân vật: {' ' + sanPham.TenNhanVat}</Text>
          </View>
            <View style={styles.saleTag}>
              <Text style={styles.saleTagTxt}> {'-' + sanPham.GiamGia*100 +'%'}</Text>
            </View>
        </View>

        {/* ==============Gia San Pham */}
        <View style={styles.itemPriceWrapper}>
          <View style={{flex:1, justifyContent:'center' }}>
            <Text style={{fontSize:20, fontWeight:'bold', left:17}} > Giá Bán </Text>
          </View>
          <View style={styles.itemPrice}>
            <Text style={styles.itemSalePriceTxt}> {sanPham.GiaBan}</Text>
            <Text style={styles.itemPriceTxt}>{sanPham.GiaBan * (1 - sanPham.GiamGia) + ' VNĐ'}</Text>
          </View>
        </View>

        {/* ============== Thong so chi tiet San Pham */}
        <View style={styles.itemDetailWrapper}>
          <Text style={{fontSize:18, fontWeight:'bold'}}> Thông số kỹ thuật </Text>
          <View style={{flex:1, flexDirection:'row'}}>
          <View style={styles.itemDetail}>
            <Text style={styles.itemDetailTxt} >Chiều Cao: {sanPham.ChieuCao} cm </Text>
            <Text style={styles.itemDetailTxt} >Chiều Dài: {sanPham.ChieuDai} cm</Text>
            <Text style={styles.itemDetailTxt} >Chiều Rộng: {sanPham.ChieuRong} cm</Text>
          </View>
          <View style={styles.itemDetail}>
            <Text style={styles.itemDetailTxt} >Cân nặng: {sanPham.CanNang} kg</Text>
            <Text style={styles.itemDetailTxt} >Chất Liệu: {sanPham.ChatLieu} </Text>
          </View>
          </View>
        </View>

        {/* ============== Mo ta */}
        <View style={styles.itemDescriptionWrapper}>
        <Text style={{fontSize:18, fontWeight:'bold'}}> Mô tả </Text>
          <ScrollView style={{height:'100%'}}>
            <Text style={styles.itemDescriptionTxt} >{sanPham.MoTa}</Text>
          </ScrollView>
        </View>
      </View>
    {/*============== Buy Button =================*/}
      <View style={styles.buyWrapper}>
        <View style={styles.buyBtn} >
          <TouchableOpacity style={{color:PRIMARY_COLOR}} title='OK' onPress={()=>{}}>
            <Text style={styles.btnText}>THÊM VÀO GIỎ HÀNG</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    backgroundColor:'#fff',
    flex:1,
  },
  swiperWrapper:{
    flex:4,
    borderBottomLeftRadius:40,
    borderBottomRightRadius:40,
  },
  swiperImg:{
    width:'100%',
    height:'100%',
    borderBottomLeftRadius:40,
    borderBottomRightRadius:40,
  },
  itemInfoWrapper:{
    flex:5,
  },
  itemNameWrapper:{
    paddingHorizontal:20,
    marginTop:10,
    height:70,
    flexDirection:'row',
  },
  itemName:{
    flex:2,
  },
  saleTag:{
    position:'absolute',
    width:70,
    height:70,
    backgroundColor:'#ffc726',
    borderRadius:50,
    alignSelf:'center',
    top:-40,
    right:30,
    justifyContent:'center',
    elevation:3,
  },
  saleTagTxt: {
    fontSize:20,
    fontWeight:'bold',
    color:'#fff',
    //alignSelf:'center',
  },
  itemPriceWrapper:{
    height:60,
    flexDirection:'row',
    alignItems:'center',
  },
  itemPrice:{//the tag inside
    flex:1.5,
    flexDirection:'row',
    borderTopLeftRadius:50,
    borderBottomLeftRadius:50,
    backgroundColor:PRIMARY_COLOR,
    height:'70%',
    justifyContent:'center',
    alignItems:'center',
  },
  itemPriceTxt:{
    fontSize:18,
    color:'#fff',
    fontWeight:'bold',
    left:10,
    textAlign:'left',
    flex:1,
  },
  itemSalePriceTxt:{
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    fontWeight:'bold',
    color:'#000',
    fontSize:13,
    marginLeft:15
  },
  itemDetailWrapper:{
    paddingLeft:18,
    height:75
  },
  itemDetail:{ //View inside of Item Detail wrapper
    flex:1,
  },
  itemDetailTxt:{
    fontSize:14, 
    paddingHorizontal:5,
    color:GREY,
  },
  itemDescriptionWrapper:{
    paddingHorizontal:20,
    marginTop:20,
    flex:3,
  },
  itemDescriptionTxt:{
    fontSize:14, 
    paddingHorizontal:3,
    color:GREY,
    height:'100%'
  },
  buyWrapper:{
    backgroundColor:'#fff',
    flex:1,
    justifyContent:'center',
  },
  buyBtn:{
    height:'65%',
    backgroundColor:PRIMARY_COLOR,
    borderRadius:10,
    width:'90%',
    alignSelf:'center',
    justifyContent: 'center',
    elevation:5,
  },
  btnText:{
    fontSize:20,
    color:'#fff',
    fontFamily:'sans-serif',
    alignSelf:'center',
  },
});
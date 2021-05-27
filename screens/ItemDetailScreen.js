import react from 'react';
import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, StatusBar, ScrollView, Button } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Swiper from 'react-native-swiper/src';
import {PRIMARY_COLOR, SECONDARY_COLOR, GREY} from '../common';

export default function ItemDetailScreen ({navigation}){

  return (
    <View style={styles.container}>
      <StatusBar barStyle='light-content' translucent/>
      <View style={styles.swiperWrapper}>
        <Swiper>
          <View >
            <Image style={styles.swiperImg}
              source ={require('../assets/jimbei-1.jpg')}
              resizeMode='cover'
            />
          </View>

          <View >
            <Image style={styles.swiperImg}
            source ={require('../assets/jimbei-2.jpg')}
            resizeMode='cover'
            ></Image>
          </View>

          <View >
            <Image style={styles.swiperImg}
            source ={require('../assets/jimbei-3.jpg')}
            resizeMode='cover'
            ></Image>
          </View>
        </Swiper>
      </View>
    {/*=============== Info =====================*/}
      <View style={styles.itemInfoWrapper}>
        {/* ==============Ten San Pham */}
        <View style={styles.itemNameWrapper}>
          <View style={styles.itemName}>
            <Text style={{fontSize:25, fontWeight:'bold'}} numberOfLines={1}>Mô hình Jimbei</Text>
            <Text style={{ fontSize:15, paddingHorizontal:3, color:GREY,}} >Manga/Anime: One Piece</Text>
            <Text style={{ fontSize:15, paddingHorizontal:3, color:GREY,}} >Nhân vật: Jimbei</Text>
          </View>
          <View style={styles.saleTagWrapper}>
            <View style={styles.saleTag}>
              <Text style={styles.saleTagTxt}> -10%</Text>
            </View>
          </View>
        </View>

        {/* ==============Gia San Pham */}
        <View style={styles.itemPriceWrapper}>
          <View style={{flex:1, justifyContent:'center' }}>
            <Text style={{fontSize:20, fontWeight:'bold', left:17}} > Giá Bán </Text>
          </View>
          <View style={styles.itemPrice}>
            <Text style={styles.itemSalePriceTxt}> 1,000,000</Text>
            <Text style={styles.itemPriceTxt}>1,200,000 VNĐ</Text>
          </View>
        </View>

        {/* ============== Thong so chi tiet San Pham */}
        <View style={styles.itemDetailWrapper}>
          <Text style={{fontSize:18, fontWeight:'bold'}}> Thông số kỹ thuật </Text>
          <View style={{flex:1, flexDirection:'row'}}>
          <View style={styles.itemDetail}>
            <Text style={styles.itemDetailTxt} >Chiều cao: 26 cm</Text>
            <Text style={styles.itemDetailTxt} >Chiều dài: 17 cm</Text>
          </View>
          <View style={styles.itemDetail}>
            <Text style={styles.itemDetailTxt} >Cân nặng: 2.3 kg</Text>
            <Text style={styles.itemDetailTxt} >Chất liệu: Nhựa PVC </Text>
          </View>
          </View>
        </View>

        {/* ============== Mo ta */}
        <View style={styles.itemDescriptionWrapper}>
        <Text style={{fontSize:18, fontWeight:'bold'}}> Mô tả </Text>
          <ScrollView style={{height:'100%'}}>
            <Text style={styles.itemDescriptionTxt} >Ok pro ok ok ok ok asd asd asd asd as dasd w f s da sd asd a Ok pro ok ok ok ok asd asd asd asd as dasd w f s da sd asd aOk pro ok ok ok ok asd asd asd asd as dasd w f s da sd asd aOk pro ok ok ok ok asd asd asd asd as dasd w f s da sd asd aOk pro ok ok ok ok asd asd asd asd as dasd w f s da sd asd aOk pro ok ok ok ok asd asd asd asd as dasd w f s da sd asd a Ok pro ok ok ok ok asd asd asd asd as dasd w f s da sd asd a Ok pro ok ok ok ok asd asd asd asd as dasd w f s da sd asd aOk pro ok ok ok ok asd asd asd asd as dasd w f s da sd asd aOk pro ok ok ok ok asd asd asd asd as dasd w f s da sd asd aOk pro ok ok ok ok asd asd asd asd as dasd w f s da sd asd aOk pro ok ok ok ok asd asd asd asd as dasd w f s da sd asd a </Text>
          </ScrollView>
        </View>
      </View>
    {/*============== Buy Button =================*/}
      <View style={styles.buyWrapper}>
        <View style={styles.buyBtn} >
          <TouchableOpacity style={{color:PRIMARY_COLOR}} title='OK' onPress={()=>{console.log('Mua')}}>
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
  saleTagWrapper:{
    flex:1,
    justifyContent:'center',
  },
  saleTag:{
    position:'absolute',
    width:70,
    height:70,
    backgroundColor:'#ffc726',
    borderRadius:50,
    alignSelf:'center',
    top:-40,
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
    left:10
  },
  itemSalePriceTxt:{
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    fontWeight:'bold',
    color:'#000',
    fontSize:13
  },
  itemDetailWrapper:{
    paddingLeft:18,
    height:50
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
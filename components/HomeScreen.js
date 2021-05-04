import react from 'react';
import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, StatusBar, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-swiper/src';
import '../index'

import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Card } from '../index';

export default class HomeScreen extends react.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const {navigate} = this.props.navigation;
    return (
      <ScrollView style = {styles.container} >
        <StatusBar barStyle={'dark-content'} backgroundColor={'transparent'}></StatusBar>
        <View style={styles.slidercontainer}>
        <Swiper height={200} activeDotColor='#FF6347' autoplay={true} showsButtons={false}>
          <View style={styles.slide}>
            <Image style={styles.sliderimage}
            source ={require('../assets/banner/naruto_swiper_1.jpg')}
            resizeMode='cover'
            ></Image>
          </View>

          <View style={styles.slide}>
            <Image style={styles.sliderimage}
            source ={require('../assets/banner/op_swiper_1.jpg')}
            resizeMode='cover'
            ></Image>
          </View>

          <View style={styles.slide}>
            <Image style={styles.sliderimage}
            source ={require('../assets/banner/dbz_swiper_1.jpg')}
            resizeMode='cover'
            ></Image>
          </View>
        </Swiper>
        </View>
        {/* ============ categories ========== */}
        <View style={styles.categoryContainer}>
          <TouchableOpacity onPress = {()=>{}}>
            <View style={styles.categoryIcon}>
              <Ionicons name='sad' size={30} color='#FF6347'></Ionicons>
            </View>
            <Text style={styles.categoryText}> One Piece</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress = {()=>{}}>
            <View style={styles.categoryIcon}>
              <Ionicons name='happy' size={30} color='#FF6347'></Ionicons>
            </View>
            <Text style={styles.categoryText}> Naruto</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress = {()=>{}}>
            <View style={styles.categoryIcon}>
            <Ionicons name='scan' size={30} color='#FF6347'></Ionicons>
            </View>
            <Text style={styles.categoryText}> DragonBall</Text>
          </TouchableOpacity>

        </View>
        {/* ============ 2nd categories ========== */}
        <View style={styles.categoryContainer}>
          <TouchableOpacity onPress = {()=>{}}>
            <View style={styles.categoryIcon}>
              <Ionicons name='eye' size={30} color='#FF6347'></Ionicons>
            </View>
            <Text style={styles.categoryText}> Bleach</Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress = {()=>{}}>
            <View style={styles.categoryIcon}>
              <Ionicons name='navigate' size={30} color='#FF6347'></Ionicons>
            </View>
            <Text style={styles.categoryText}> Pokemon </Text>
          </TouchableOpacity>
          
          <TouchableOpacity onPress = {()=>{}}>
            <View style={styles.categoryIcon}>
              <MaterialIcons name='expand-more' size={30} color='#FF6347'></MaterialIcons>
            </View>
            <Text style={styles.categoryText}> More</Text>
          </TouchableOpacity>
        </View>

        {/* Best Seller Cards */}
        <View style={styles.cardContainer}>
          <Text style={{fontSize:17, fontWeight:'bold', textAlign:'center'}}> Best Seller</Text>
          <TouchableOpacity onPress={()=>navigate('ItemDetail')}>
            <Card title='Son Goku' description='day la mot san pham chat luong tu nuoc phap cuc ki tinh xao, co nguon goc tu Trung Quoc' itemPrice='120,000 VND' itemImage={require('../assets/banner/dbz_swiper_1.jpg')}></Card>
          </TouchableOpacity>
          
          <TouchableOpacity>
            <Card title='Son Goku' description='day la mot san pham chat luong tu nuoc phap cuc ki tinh xao' itemPrice='120,000 VND' itemImage={require('../assets/banner/op.png')}></Card>
          </TouchableOpacity>
          
          <TouchableOpacity>
            <Card title='Son Goku' description='day la mot san pham chat luong tu nuoc phap cuc ki tinh xao' itemPrice='120,000 VND' itemImage={require('../assets/banner/op_swiper_1.jpg')}></Card>
          </TouchableOpacity>

          <TouchableOpacity>
            <Card title='Son Goku' description='day la mot san pham chat luong tu nuoc phap cuc ki tinh xao' itemPrice='120,000 VND' itemImage={require('../assets/banner/naruto_swiper_1.jpg')}></Card>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
    );
  }
}

var styles = StyleSheet.create({
  wrapper: {
  },
  container:{
    flex:1,
    backgroundColor:'#fff'
  },
  slidercontainer:{
    height:180,
    width:'90%',
    marginTop:10,
    justifyContent:'center',
    alignSelf:'center',
    borderRadius:8,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius:8,
  },
  sliderimage:{
    height:'100%',
    width:'100%',
    alignSelf:'center',
    borderRadius:8,
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold'
  },
  categoryContainer:{
    flexDirection:'row',
    width:'90%',
    alignSelf:'center',
    justifyContent:'space-around',
    marginTop:15,
  },
  categoryIcon:{
    borderWidth:0,
    alignItems:'center',
    justifyContent:'center',
    alignSelf:'center',
    width:60,
    height:60,
    backgroundColor:'#f5c4bc',
    borderRadius:50,
  },
  categoryText:{
    fontSize:13,
    marginTop:5,
    alignSelf:'center',
    color: '#FF6347',
    fontFamily:'sans-serif'
  },
  cardContainer:{
    width:'90%',
    marginTop:12,
    alignSelf:'center',
    justifyContent:'center',
  },
})
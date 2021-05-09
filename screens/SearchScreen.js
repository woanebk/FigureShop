import react from 'react';
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AwesomeTextInput } from 'react-native-awesome-text-input';

import { Card } from '../index';

export default function SearchScreen ({navigation}){
  return (
    <View style={{backgroundColor:'#fff'}} >
      <View style={styles.searchbarWrapper}>
      <AwesomeTextInput label="Search for items"
      customStyles={{ 
      container: { 
        borderWidth: 1, 
        borderColor: 'green', 
        borderRadius: 5, 
      }, 
      title: { 
        backgroundColor: "white" ,
      },
    }}
    />
      </View>
      <View style={styles.searchItemWrapper}>
      <TouchableOpacity>
          <Card title='Son Goku' description='day la mot san pham chat luong tu nuoc phap cuc ki tinh xao' itemPrice='120,000 VND' itemImage={require('../assets/banner/naruto_swiper_1.jpg')}></Card>
        </TouchableOpacity>

        <TouchableOpacity>
          <Card title='Son Goku' description='Gia cong trung quoc cao cuc ki tinh xao' itemPrice='120,000 VND' itemImage={require('../assets/banner/naruto_swiper_1.jpg')}></Card>
        </TouchableOpacity>

        <TouchableOpacity>
          <Card title='Son Goku' description='day la mot san pham chat luong tu nuoc phap cuc ki tinh xao' itemPrice='120,000 VND' itemImage={require('../assets/banner/naruto_swiper_1.jpg')}></Card>
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  searchbarWrapper:{
    marginTop: 10,
    width:'90%',
    height:50,
    alignSelf:'center',
  },
  searchItemWrapper:{
    width:'90%',
    alignSelf:'center',
  },
});
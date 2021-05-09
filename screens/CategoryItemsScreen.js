import react from 'react';
import React, { Component, Dimensions  } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, StatusBar, TouchableOpacity } from 'react-native';
import { TouchableRipple, IconButton } from 'react-native-paper';
import { ImageHeaderScrollView, TriggeringView } from 'react-native-image-header-scroll-view';
import { useState } from 'react';
import { WHITE } from '../common';

export default function CategoryItemsScreen({route, navigation}) {

  //get data passed from previous screen
  const {categoryName}= route.params; //Name of the category (must same name with parameter)

  let [item, setItem] = useState({name:'ok', quantity:2, price:1200000, sale:0.1, description:'ok ok'})


  return (
      <View style={styles.container}>
        <StatusBar barStyle='light-content' translucent></StatusBar>
        <ImageHeaderScrollView
          maxHeight={350}
          minHeight={100}
          headerImage={require('../assets/banner/dbz_swiper_1.jpg')}
          //Shadow Opacity when scrolling
          maxOverlayOpacity={0.6}
          minOverlayOpacity={0.3}
          fadeOutForeground
          renderForeground={()=>(
            <View style={styles.categoryName}>
              <Text style={styles.categoryNameTxt}>{categoryName}</Text>
            </View>
          )}
        >
          <View style={{ height:1000 }}>
            <TriggeringView onHide={() => console.log("text hidden")}>
              <Text>Scroll Me ok!</Text>
            </TriggeringView>
          </View>
          </ImageHeaderScrollView>
      </View>
  );
}

var styles = StyleSheet.create({
  container:{
    height:'100%'
  },
  categoryName:{
    justifyContent:'center',
    flex:1,
    alignItems:'center',
  },
  categoryNameTxt:{
    fontSize:45,
    color:WHITE,
    fontWeight:'bold',
  },
})
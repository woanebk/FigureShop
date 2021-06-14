import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, StatusBar, TouchableOpacity } from 'react-native';
import { BLACK, DARK_PRIMARY_COLOR, GREY, OFF_WHITE, PRIMARY_COLOR, WHITE } from '../common';
import {  } from '../items';
import { AssetsSelector } from 'expo-images-picker'
import { Ionicons } from '@expo/vector-icons'

export default function MultiImagePickScreen({route, navigation}) {

  const {useImagestoEdit}=route.params //Quay ve man hinh truoc la true:edit hay false:add
  const {id_san_pham}=route.params
  useEffect(()=>{

  })

  const onDone = (data)=>{
    if(data)
    {
      var list = []
      data.forEach(item => {
        list.push(item.uri)
      });
      navigation.navigate('AddFigure',{readonly:useImagestoEdit, images:list, id_san_pham:id_san_pham})
    }
  }

  return (
      <View style={styles.container}>
        <StatusBar barStyle='light-content' translucent backgroundColor={'transparent'} ></StatusBar>
        <View style={styles.topdock}></View>
        <AssetsSelector
            options={{
            /* Add only when u want to Manipulate Assets.
            manipulate: {
            width: 512,
            compress: 0.7,
            base64: false,
            saveTo: 'jpeg',
            },*/
            assetsType: ['photo'],
            maxSelections: 10,
            margin: 3,
            portraitCols: 4,
            landscapeCols: 5,
            widgetWidth: 100,
            widgetBgColor: WHITE,
            selectedBgColor: PRIMARY_COLOR,
            spinnerColor: PRIMARY_COLOR,
            videoIcon: {
                Component: Ionicons,
                iconName: 'ios-videocam',
                color: WHITE,
                size: 20,
            },
            selectedIcon: {
                Component: Ionicons,
                iconName: 'ios-checkmark-circle-outline',
                color: WHITE,
                bg: "#7e7e7e95",
                size: 35,
            },
            defaultTopNavigator: {
                selectedText: 'Đã Chọn   ',
                continueText: 'Xong   ',
                goBackText: '',
                midTextColor: PRIMARY_COLOR,
                backFunction: ()=>{},
                doneFunction: (data)=>onDone(data),
            },
        }}
        />
      </View>
  );
}

var styles = StyleSheet.create({
  container:{
    height:'100%',
    backgroundColor:WHITE
  },
  topdock:{
    height:120,
    backgroundColor:PRIMARY_COLOR,
    borderBottomRightRadius:50
  },
})
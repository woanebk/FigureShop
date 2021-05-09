import react from 'react';
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, StatusBar, TouchableOpacity } from 'react-native';
import {PRIMARY_COLOR, PROFILE_DOCK_COLOR} from '../common'

function DashBoard(props){
    return(
        <View style={styles.container}>
            <View style={styles.tab}>
                <Text style={styles.tabNameTxt}>Đơn Đặt</Text>
                <Text style={styles.tabDetailTxt}>40</Text>
            </View>

            <View style={styles.tab}>
                <Text style={styles.tabNameTxt}>Đơn bán</Text>
                <Text style={styles.tabDetailTxt}>23</Text>
            </View>

            <View style={styles.tab}>
                <Text style={styles.tabNameTxt}>Doanh thu</Text>
                <Text style={styles.tabDetailTxt}>2,8 Tr</Text>
            </View>
        </View>
    );
}

var styles = StyleSheet.create({
  container:{
    height:70,
    borderRadius:5,
    backgroundColor:PRIMARY_COLOR,
    elevation:15,
    justifyContent:'space-evenly',
    flexDirection:'row',
  },
  tab:{
      alignItems:'center',
      alignSelf:'center'
  },
  tabNameTxt:{
    fontSize:14
  },
  tabDetailTxt:{
    fontSize:25,
    marginTop:3,
    fontWeight:'bold',
  }
})

export default DashBoard;



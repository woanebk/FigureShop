import react from 'react';
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, StatusBar, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

function UserPFP(props){
    return(
      <Image style={styles.pfp} source ={props.profileimage}></Image>
    );
}

var styles = StyleSheet.create({
  pfp:{
    width:120,
    height:120,
    borderRadius:100,
    top:120,
    borderWidth:1,
    borderColor:'#000',
  },
})

export default UserPFP;



import react from 'react';
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, StatusBar, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

function UserPFP(props){
    return(//style to use in stylesheet when call component
      <View style={props.style}>
        <Image style={styles.pfp} source ={props.image}></Image>
      </View>
    );
}

var styles = StyleSheet.create({
  pfp:{
    width:120,
    height:120,
    borderRadius:100,
    borderWidth:1,
    borderColor:'#000',
  },
})

export default UserPFP;



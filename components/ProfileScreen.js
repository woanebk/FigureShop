import react from 'react';
import React, { Component } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, StatusBar, TouchableOpacity } from 'react-native';
import '../index'
import UserPFP from './UserPFP';

export default class ProfileScreen extends react.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const {navigate} = this.props.navigation;

    return (
      <View style={styles.container}>
        <StatusBar barStyle='dark-content' translucent/>
        <View style={styles.topdock}>
          <View style={{alignSelf:'center'}}>
            <UserPFP profileimage={require('../assets/banner/op_swiper_1.jpg')}></UserPFP>
          </View>
        </View>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container:{
    top:-110
  },
  topdock:{
    height:400,
    backgroundColor:'#fdfd96',
  },
})
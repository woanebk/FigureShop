import react from 'react';
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, StatusBar, TouchableOpacity } from 'react-native';
import { PRIMARY_COLOR,GREY, RED, BLACK, WHITE } from '../common';

function CategoryCard(props){
    return(
        <View style={[styles.card, props.style]}>
            <Image style={styles.cardImg} source={require('../assets/banner/naruto_swiper_1.jpg')}/>
            <View style={styles.cardInfo}>
                <Text numberOfLines={1} style={styles.nameTxt}>Naruto Shippuden</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card:{
        width:230,
        height:130,
        borderRadius:10,
      },
    cardImg:{
        flex:1,
        width:'100%',
        height:'100%',
        borderRadius:10,
    },
    cardInfo:{ 
        position:'absolute',
        top:'70%'
        },
    nameTxt:{
        fontSize:23,
        fontWeight:'bold',
        color:WHITE,
        //shadow:
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: {width: -5, height: 3},
        textShadowRadius: 7,
        marginLeft:10
    },

    
  });

export default CategoryCard;

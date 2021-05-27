import react from 'react';
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, StatusBar, TouchableOpacity } from 'react-native';
import { GOLD, GREY, WHITE } from '../common';

function Card(props){
    return(
        <View style={styles.card}>
            <Image style = {styles.cardImg} source ={props.itemImage} resizeMode='cover'></Image>
            <View style={styles.cardInfo}>
              <View style={{flex:1}}>
                <Text numberOfLines={1} style={styles.itemName}>{props.title}</Text>
                <View style = {styles.saleTag}>
                  <Text style= {styles.salePercentageTxt}>-10%</Text>
                </View>
              </View>

              <View style={styles.descriptionContainer}>
                <Text numberOfLines={2} style={styles.itemDescripton}> {props.description}</Text>
              </View>

              <View style={{flex:1}}>
                <Text numberOfLines={1} style={styles.itemPrice}> {props.itemPrice}</Text>
                <Text numberOfLines={1} style={styles.itemSalePrice}> {props.itemPrice}</Text>
                
              </View>
            </View>
          </View>
    );
}

const styles = StyleSheet.create({
    card:{
        marginTop:10,
        height:110,
        width:'100%',
        marginVertical:10,
        flexDirection: 'row',
        shadowColor:'#999',
        shadowOffset:{width:0, height:1},
        shadowOpacity:0.8,
        shadowRadius:2,
        elevation: 5,
        borderRadius:1,
        backgroundColor:WHITE
      },
    cardInfo:{ 
        flex:2,
        },
    cardImg:{
        height:'100%',
        width:'100%',
        alignSelf:'center',
        flex:1,
        borderRadius:5 ,
    },
    itemName:{ 
        fontSize:18,
        marginLeft:15,
        marginTop:10,
        fontWeight:'bold',
    },
    descriptionContainer:{
      alignSelf:'center',
      width:'90%',
      marginLeft:5,
      flex:1,
    },
    itemDescripton:{
      fontSize:12,
      color:'#444'
    },
    itemPrice:{
      color:'#FF0000',
      fontWeight:'bold',
      marginLeft:10,
      fontSize:14
    },
    itemSalePrice:{
      color:GREY,
      marginLeft:12,
      fontSize:12,
      textDecorationLine: 'line-through',
      textDecorationStyle: 'solid',
    },
    saleTag:{
      backgroundColor:GOLD,
      width:45,
      height:45,
      borderRadius:50,
      position:'absolute',
      top:'-30%',
      right:'-6%',
      justifyContent:'center',
      alignItems:'center'
    },
    salePercentageTxt:{
      fontSize:14,
      fontWeight:'bold',
    },
  });

export default Card;

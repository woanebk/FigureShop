import react from 'react';
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, StatusBar, TouchableOpacity } from 'react-native';
import { BLACK, DARK_PRIMARY_COLOR, GOLD, GREY, GREY_BORDER, WHITE } from '../common';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
function Card(props){
    return(
        <View style={styles.card}>
            <Image style = {styles.cardImg} source ={props.itemImage} resizeMode='cover'></Image>
            <View style={styles.cardInfo}>

              <View style={{}}>
                <Text numberOfLines={1} style={styles.itemName}>{props.title}</Text>
              </View>

              <View style={styles.descriptionContainer}>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                  <Text style={styles.itemDescripton}> Nhân vật:  </Text>
                  <Text numberOfLines={1} style={styles.itemDescripton2}> {props.nhanvat}</Text>
                </View>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                  <Text style={styles.itemDescripton}> Anime: </Text>
                  <Text numberOfLines={1} style={styles.itemDescripton2}> {props.anime}</Text>
                </View>
                
              </View>
              <View style = {styles.hotTag}>
                  <Text style={styles.hotTxt}>Hot</Text>
                  <MaterialCommunityIcons size={16} name='fire'></MaterialCommunityIcons>
                </View>
              <View style = {styles.saleTag}>
                  <Text style={styles.salePercentageTxt}>Khám Phá Ngay</Text>
                  <MaterialCommunityIcons name='arrow-right-thick'></MaterialCommunityIcons>
                </View>
            </View>
          </View>
    );
}

const styles = StyleSheet.create({
    card:{
        marginTop:10,
        height:100,
        width:'100%',
        marginVertical:10,
        flexDirection: 'row',
        shadowColor:'#999',
        shadowOffset:{width:0, height:1},
        shadowOpacity:0.8,
        shadowRadius:2,
        borderRadius:1,
        backgroundColor:WHITE,
        paddingBottom:10,
        borderBottomWidth:2,
        borderBottomColor:GREY_BORDER
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
        fontSize:16,
        marginLeft:15,
        marginTop:3,
        fontWeight:'bold',
    },
    descriptionContainer:{
      alignSelf:'center',
      width:'90%',
      marginLeft:5,
    },
    itemDescripton:{
      fontSize:12,
      color:'#444'
    },
    itemDescripton2:{
      fontSize:14,
      color:'#000',
      fontWeight:'bold',
      width:'70%', 
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
      width:85,
      textAlign:'center',
    },
    hotTag:{
      backgroundColor:DARK_PRIMARY_COLOR,
      width:60,
      height:20,
      borderRadius:5,
      position:'absolute',
      bottom:-5,
      left:20,
      justifyContent:'center',
      alignItems:'center',
      flexDirection:'row'
    },
    saleTag:{
      backgroundColor:GOLD,
      width:130,
      height:20,
      borderRadius:5,
      position:'absolute',
      bottom:-5,
      left:90,
      justifyContent:'center',
      alignItems:'center',
      flexDirection:'row'
    },
    salePercentageTxt:{
      fontSize:12,
      fontWeight:'bold',
      width:100,
      textAlign:'center'
    },
    hotTxt:{
      fontSize:12,
      fontWeight:'bold',
      width:30,
      textAlign:'center'
    },
  });

export default Card;

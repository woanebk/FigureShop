import react from 'react';
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, StatusBar, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

function Card(props){
    return(
        <View style={styles.card}>
            <Image style = {styles.cardImg} source ={props.itemImage} resizeMode='cover'></Image>
            <View style={styles.cardInfo}>
              <Text numberOfLines={1} style={styles.itemName}>{props.title}</Text>
              <View style={styles.descriptionContainer}>
                <Text numberOfLines={2} style={styles.itemDescripton}> {props.description}</Text>
              </View>
              <Text numberOfLines={1} style={styles.itemPrice}> {props.itemPrice}</Text>
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
        elevation: 1,
        borderRadius:1,
      },
    cardInfo:{ 
        flex:2
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
      height:'40%',
      width:'90%',
      marginLeft:5,
    },
    itemDescripton:{
        fontSize:12,
        color:'#444'
    },
    itemPrice:{
      color:'#FF0000',
      fontWeight:'bold',
      marginLeft:10,
    },
  });

export default Card;

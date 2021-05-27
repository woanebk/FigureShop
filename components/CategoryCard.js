import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {  WHITE } from '../common';

function CategoryCard(props){
    return(
        <TouchableOpacity onPress={props.onPress}>
            <View style={[styles.card, props.style]}>
                <Image style={styles.cardImg} source={props.image}/>
                <View style={styles.cardInfo}>
                    <Text numberOfLines={1} style={styles.nameTxt}>{props.name}</Text>
                </View>
            </View>
        </TouchableOpacity>
        
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
        backgroundColor:'#000',
        opacity:0.95
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

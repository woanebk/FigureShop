import react from 'react';
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, StatusBar, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import {Divider} from 'react-native-paper'
import { PRIMARY_COLOR,GREY, RED } from '../common';
import { ceil } from 'react-native-reanimated';

function ItemCard(props){
    return(
        <View style={styles.card}>
            <Image style={styles.cardImg} source ={require('../assets/banner/op.png')} ></Image>
            <View style={styles.cardInfo}>
                <View style={styles.itemNameWrapper}>
                    <Text style={styles.itemNameTxt} numberOfLines={2}>Nhân vật Naruto bộ truyện tuyệt đỉnh giá thành phải chăng</Text>
                </View>
                
                <View style={styles.iconWrapper}>
                    <Ionicons name='body' color='#F9A602' size={16}></Ionicons>
                    <Text style={{fontSize:13, marginLeft:3}}>Naruto</Text>
                </View>

                <View style={styles.priceWrapper}>
                    <View style={{flex:1}}>
                      <Text style={styles.itemPriceTxt}>1.200.000 VNĐ</Text>
                    </View>

                    <View style={{flex:1, flexDirection:'row'}}>
                        <Text style={styles.itemSalePriceTxt}>1.200.000</Text>
                        <View style={styles.saleTag}>
                            <Text style={styles.salePriceTxt}>-60%</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card:{
        width:150,
        height:'100%',
        borderRadius:10,
      },
    cardImg:{
        flex:1.2,
        width:'100%',
        height:'100%',
        borderTopLeftRadius:10,
        borderTopRightRadius:10,
    },
    cardInfo:{ 
        flex:1,
        },
    itemNameWrapper:{
        width:'90%',
        flex:2,
        alignSelf:'center',
        justifyContent:'center',
        },
    itemNameTxt:{ 
        fontSize:16,
        alignSelf:'center'
    },
    iconWrapper:{
        flexDirection:'row',
        flex:1,
        width:'90%',
        alignSelf:'center',
    },
    priceWrapper:{
        flex:2,
        width:'90%',
        alignSelf:'center',
        borderBottomLeftRadius:10,
        borderBottomRightRadius:10
    },
    itemPriceTxt:{
        fontWeight:'bold',
        fontSize:16,
        color:'#000'
    },
    itemSalePriceTxt:{
        color:GREY,
        fontSize:14,
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid',
        alignSelf:'center'
    },
    saleTag:{
        backgroundColor:RED,
        borderRadius:20,
        height:'65%',
        width:50,
        left:10,
        alignSelf:'center',
        justifyContent:'center'
    },
    salePriceTxt:{
        color:'#fff',
        alignSelf:'center',
        fontWeight:'bold'
    },
  });

export default ItemCard;

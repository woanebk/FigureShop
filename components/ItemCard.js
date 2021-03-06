import React from 'react';
import { View, Text, StyleSheet, Image} from 'react-native';
import { Ionicons} from '@expo/vector-icons';
import { GREY, RED } from '../common';

function ItemCard(props){
    return(
        <View style={styles.card}>
            <Image style={styles.cardImg} source ={props.image} ></Image>
            <View style={styles.cardInfo}>
                <View style={styles.itemNameWrapper}>
                    <Text style={styles.itemNameTxt} numberOfLines={2}>{props.name}</Text>
                </View>
                
                <View style={styles.iconWrapper}>
                    <Ionicons name='body' color='#F9A602' size={16}></Ionicons>
                    <Text style={{fontSize:12, marginLeft:3, width:'100%'}}>{props.nhanvat}</Text>
                </View>

                <View style={styles.priceWrapper}>
                    <View style={{flex:1}}>
                      <Text style={styles.itemPriceTxt}>{props.giaban * (1 - props.giamgia) + ' VNĐ'}</Text>
                    </View>

                    <View style={{flex:1, flexDirection:'row'}}>
                        <Text style={styles.itemSalePriceTxt}>{props.giaban + ' VNĐ'}</Text>
                        <View style={styles.saleTag}>
                            <Text style={styles.salePriceTxt}>{'-' + props.giamgia * 100 +'%  '}</Text>
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
        textAlign:'left',
        fontWeight:'bold'
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
        fontSize:14,
        color:'#000'
    },
    itemSalePriceTxt:{
        color:GREY,
        fontSize:12,
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid',
        alignSelf:'center',
        width:'60%'
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

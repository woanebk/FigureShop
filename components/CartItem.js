import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons} from '@expo/vector-icons';
import { GREY, WHITE, DARK_PRIMARY_COLOR, BLACK } from '../common';
import { IconButton } from 'react-native-paper';

function CartItem(props){
    return(
        <View style={styles.card}>
            <Image style={styles.img} resizeMode='cover' source ={props.itemImage}></Image>
            <View style={styles.infoWrapper}>
                <Text style={styles.nameTxt} numberOfLines={2} >{props.itemName}</Text>
                <Text style={styles.descriptionTxt} numberOfLines={1} >{props.itemDescription}</Text>
                <View style={styles.btnWrapper}>
                    <TouchableOpacity style={styles.quantityBtn} onPress={props.onMinusPress}>
                        <Ionicons name='remove' size={20}></Ionicons>
                    </TouchableOpacity>
                    <Text style={styles.quantityTxt}>{props.value}</Text>
                    <TouchableOpacity style={styles.quantityBtn} onPress={props.onPlusPress}>
                        <Ionicons name='add' size={20}></Ionicons>
                    </TouchableOpacity>
                    <View style={styles.priceWrapper}>
                        <Text style={styles.itemOldPriceTxt}>{props.oldPrice? props.oldPrice + ' VNĐ':' '}</Text>
                        <Text style={styles.itemPriceTxt}>{props.price + ' VNĐ'}</Text>
                    </View>
                </View>
                <IconButton style={styles.deleteBtn} icon='close' onPress={props.onDeletePress} size={20}></IconButton>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card:{
        backgroundColor:WHITE,
        width:'90%',
        height:110,
        alignSelf:'center',
        borderRadius:5,
        elevation:2,
        flexDirection:'row',
        marginVertical:5
    },
    img:{
        //backgroundColor:'#000',
        width:95,
        height:'100%',
        borderTopLeftRadius:5,
        borderBottomLeftRadius:5,
    },
    infoWrapper:{
        //backgroundColor:PRIMARY_COLOR,
        flex:1,
        marginLeft:20
    },
    nameTxt:{
        fontSize:18,
        fontWeight:'bold',
        marginTop:5,
        marginRight:35,
        lineHeight:20,
        //backgroundColor:BLACK
    },
    descriptionTxt:{
        color:GREY,
        fontSize:13,
    },
    btnWrapper:{
        flexDirection:'row',
        alignItems:'center',
        flex:1
    },
    quantityBtn:{
        width:30,
        height:30,
        backgroundColor:'#fff',
        borderRadius:50,
        elevation:5,
        alignSelf:'center',
        justifyContent:'center',
        alignItems:'center'
    },
    quantityTxt:{
        marginHorizontal:5,
        fontSize:15,
        fontWeight:'bold',
        width:20,
        textAlign:'center'
    },
    deleteBtn:{
        position:'absolute',
        right:5
    },
    priceWrapper:{ 
        //backgroundColor:'#000',
        height:'100%',
        flex:1,
        marginLeft:20
    },
    itemOldPriceTxt:{
        alignSelf:'center',
        fontSize:12,
        textDecorationLine:'line-through',
        width:100,
        color:GREY,
        bottom:25,
        position:'absolute'
    },
    itemPriceTxt:{
        alignSelf:'center',
        fontSize:15,
        width:130,
        fontWeight:'bold',
        color:DARK_PRIMARY_COLOR,
        bottom:5,
        position:'absolute'
    },
  });

export default CartItem;

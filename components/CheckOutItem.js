import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons} from '@expo/vector-icons';
import { GREY, WHITE, DARK_PRIMARY_COLOR, BLACK } from '../common';
import { IconButton } from 'react-native-paper';

function CheckOutItem(props){
    return(
        <View style={styles.card}>
            <Image style={styles.img} resizeMode='cover' source ={props.itemImage}></Image>
            <View style={styles.infoWrapper}>
                <Text style={styles.nameTxt} numberOfLines={1}> {props.name}</Text>
                <View style={styles.infoLine}> 
                    <Text style={styles.detailTxt}>SL: {' x' + props.soLuong}</Text>
                    <Text style={styles.detailTxt}>{props.giaBan + ' '} VND</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card:{
        //backgroundColor:'#898900',
        width:'90%',
        height:90,
        alignSelf:'center',
        borderRadius:5,
        flexDirection:'row',
        //borderBottomWidth:1,
        borderBottomColor:GREY,
    },
    img:{
        backgroundColor:'#000',
        width:70,
        height:70,
        //borderTopLeftRadius:5,
        //borderBottomLeftRadius:5,
    },
    infoWrapper:{
        //backgroundColor:PRIMARY_COLOR,
        flex:1,
        marginLeft:10
    },
    nameTxt:{
        fontSize:15,
        marginTop:5,
        lineHeight:20,
        color:GREY,
        width:'100%'
        //backgroundColor:BLACK
    },
    infoLine:{
        flexDirection:'row',
        justifyContent:'space-between',
        marginTop:3
    },
    detailTxt:{
        fontWeight:'bold',
        fontSize:15
    },
  });

export default CheckOutItem;

import React from 'react';
import { View, Text, StyleSheet,} from 'react-native';
import { Ionicons} from '@expo/vector-icons';
import { GREY} from '../common';

function InfoDisplayer(props){
    return(
        <View style={styles.container}>
            <Ionicons style={styles.icon} name={props.ionIconName} size={15} color={GREY} ></Ionicons> 
            <Text numberOfLines={1} style={styles.btnTxt}>{props.text}</Text>
        </View>
    );
}

var styles = StyleSheet.create({
  container:{
    height:30,
    width:120,
    //backgroundColor:'#000',
    flexDirection:'row',
    alignItems:'center'
  },
  icon:{
    //flex:1.5,
    width:15
  },
  btnTxt:{
    fontSize:14,
    color:GREY,
    marginLeft:15,
    flex:10,
    alignSelf:'center'
  },
})

export default InfoDisplayer;



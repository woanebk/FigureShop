import React from 'react';
import { View, Text, StyleSheet, TextInput} from 'react-native';
import { Ionicons} from '@expo/vector-icons';
import {GREY, LIGHT_GREY, PRIMARY_COLOR } from '../common';
import { useState } from 'react/cjs/react.development';

function ActionInput(props){

  const [color, setColor] = useState(GREY)

    return(
        <View style={[styles.Info,{borderBottomColor:color}]}>
          <View style={{flex:0.5, flexDirection:'row'}}>
            <Text style={{width:'90%'}}>{props.title}</Text>
            <Text style={{color:PRIMARY_COLOR, fontSize:17, width:20}}>{props.require?'  *':''}</Text>
          </View>
          <View style={{flex:1, flexDirection:'row'}}>
            <Ionicons style={{alignSelf:'center'}} name={props.ionIconName} size={18} color={color}/>
            <TextInput style={[styles.textInput, {color:color}]} placeholder={props.placeholder}
              onChangeText={props.onChangeText}
              value={props.value}
              editable={props.editable}
              keyboardType={props.keyboardType}
              multiline={props.multiline}
              onFocus = {()=>{setColor(PRIMARY_COLOR)} }
              onBlur = {()=>{setColor(GREY)}}
            />
          </View>
        </View>
    );
}

const styles = StyleSheet.create({
    Info:{
        height:60,
        width:'100%',
        alignSelf:'center',
        marginTop:5,
        marginBottom:10,
        borderBottomWidth:1,
        borderBottomColor:GREY
        //backgroundColor:'#000',
      },
      textInput:{
        flex:1,
        paddingLeft:10,
      },
  });

export default ActionInput;

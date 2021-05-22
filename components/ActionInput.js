import React from 'react';
import { View, Text, StyleSheet, TextInput} from 'react-native';
import { Ionicons} from '@expo/vector-icons';
import {GREY, LIGHT_GREY } from '../common';

function ActionInput(props){
    return(
        <View style={styles.Info}>
          <View style={{flex:1}}>
            <Text>{props.title}</Text>
          </View>
          <View style={{flex:1, flexDirection:'row'}}>
            <Ionicons style={{alignSelf:'center'}} name={props.ionIconName} size={18} color={GREY}/>
            <TextInput style={styles.textInput} placeholder={props.placeholder}
              onChangeText={props.onChangeText}
              value={props.value}
              editable={props.editable}
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
        marginTop:10,
        marginBottom:10,
        borderBottomWidth:1,
        borderBottomColor:LIGHT_GREY,
        //backgroundColor:'#000',
      },
      textInput:{
        flex:1,
        paddingLeft:10,
        color:GREY
      },
  });

export default ActionInput;

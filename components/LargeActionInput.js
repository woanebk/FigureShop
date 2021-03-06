import React from 'react';
import { View, Text, StyleSheet, TextInput} from 'react-native';
import { Ionicons} from '@expo/vector-icons';
import {GREY, LIGHT_GREY } from '../common';

function LargeActionInput(props){
    return(
        <View style={styles.Info}>
          <View style={{flex:0.2}}>
            <Text>{props.title}</Text>
          </View>
          <View style={{flex:1, flexDirection:'row'}}>
            <Ionicons style={{alignSelf:'center'}} name={props.ionIconName} size={18} color={GREY}/>
            <TextInput style={[styles.textInput]} placeholder={props.placeholder}
              onChangeText={props.onChangeText}
              value={props.value}
              editable={props.editable}
              keyboardType={props.keyboardType}
              multiline={props.multiline}
            />
          </View>
        </View>
    );
}

const styles = StyleSheet.create({
    Info:{
        height:160,
        width:'100%',
        alignSelf:'center',
        marginTop:5,
        marginBottom:10,
        borderBottomWidth:1,
        borderBottomColor:LIGHT_GREY,
        //backgroundColor:'#000',
      },
      textInput:{
        flex:1,
        paddingLeft:10,
        color:GREY,
      },
  });

export default LargeActionInput;

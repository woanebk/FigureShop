import React from 'react';
import { View, Text, StyleSheet} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { GREY, PRIMARY_COLOR } from '../common';

function ProfileButton(props){
    return(
          <View style={styles.button}>
            <MaterialCommunityIcons style={styles.icon} name={props.iconName} size={25} color={PRIMARY_COLOR} ></MaterialCommunityIcons> 
            <Text style={styles.btnTxt}>{props.text}</Text>
            <Ionicons style={styles.righticon} name='chevron-forward-outline' size={20} color={PRIMARY_COLOR}></Ionicons>
          </View>
        
        
    );
}

var styles = StyleSheet.create({
  container:{
  },
  button:{
    height:'100%',
    //borderRadius:10,
    flexDirection:'row',
    //backgroundColor:'#0859c6',
    //shadowOpacity:80,
  },
  icon:{
    alignSelf:'center',
    flex:1.5
  },
  btnTxt:{
    alignSelf:'center',
    fontSize:14,
    color:GREY,
    marginLeft:5,
    flex:10
  },
  righticon:{
    alignSelf:'center',
    flex:1
  },
})

export default ProfileButton;



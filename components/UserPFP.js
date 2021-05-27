import React from 'react';
import { View, StyleSheet, Image } from 'react-native';

function UserPFP(props){
    return(//style to use in stylesheet when call component
      <View style={props.style}>
        <Image style={styles.pfp} source ={props.image}></Image>
      </View>
    );
}

var styles = StyleSheet.create({
  pfp:{
    width:120,
    height:120,
    borderRadius:100,
    borderWidth:1,
    borderColor:'#000',
  },
})

export default UserPFP;



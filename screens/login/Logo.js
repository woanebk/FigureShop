//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet,Image } from 'react-native';


// create a component
const Logo = () => {
    return (
        <View>
            <Image resizeMode='center' source={{uri:'https://c35222m1aga1x3ztf1lczpkf-wpengine.netdna-ssl.com/wp-content/uploads/2018/08/FIGURE_Logo.png'}} style={{height:150, width:150}} />
        </View>
    );
};


//make this component available to the app
export default Logo;

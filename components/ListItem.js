import react from 'react';
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, StatusBar, TouchableOpacity, Animated, TouchableWithoutFeedback } from 'react-native';
import { BLACK, GOLD, GREY, WHITE } from '../common';
import { RectButton } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { MaterialIcons } from '@expo/vector-icons';

function ListItem(props){

    const renderRightActions = progress =>{
        
        const trans = progress.interpolate({
            inputRange: [0, 50, 100, 101],
            outputRange: [-20, 0, 0, 1],
        })

        return(
        <View style={{flexDirection:'row', width:190}}>
            {/* <Animated.View style={{flex:1, transform:[{translateX:trans}] }}>
                <RectButton onPress={props.onEditPress} style={[ styles.rightAction, {backgroundColor:'#7E7E7E'} ]}>
                    <MaterialIcons name='edit' size={25} color = {BLACK}></MaterialIcons>
                </RectButton>
            </Animated.View> */}

            <Animated.View style={{flex:1, transform:[{translateX:trans}] }}>
                <RectButton onPress={props.onDeletePress} style={[ styles.rightAction, {backgroundColor:'#dd2c00'} ]}>
                    <MaterialIcons name='delete' size={25} color = {WHITE}></MaterialIcons>
                </RectButton>
            </Animated.View>
        </View>
        )
    }

    

    return(
        <Swipeable 
            friction={2}
            renderRightActions={renderRightActions}
        >
            <TouchableWithoutFeedback onPress = {props.onPress}>
                <View style={styles.container} >
                    <Image style={styles.img} source={props.image}></Image>
                    <View style={styles.textWrapper}>
                        <Text numberOfLines={1} style={styles.nameTxt}>{props.name}</Text>
                        <Text numberOfLines={1} style={styles.descriptionTxt}> {props.description}</Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Swipeable>
    );
}

const styles = StyleSheet.create({
    container:{
        width:'100%',
        flexDirection:'row',
        marginVertical:5,
        backgroundColor:WHITE,
        elevation:5
    },
    img:{
        width:150,
        height:70,
        borderRadius:5,
    },
    textWrapper:{
        flex:1,
        marginLeft:10
    },
    nameTxt: {
        fontSize:16,
    },
    descriptionTxt:{
        fontSize:12,
        color:GREY
    },
    rightAction:{
        alignItems:'center',
        flex:1,
        justifyContent:'center',
        height:75,
        marginVertical:5
    }
  });

export default ListItem;
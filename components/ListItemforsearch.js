import react from 'react';
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, StatusBar,Animated ,TouchableWithoutFeedback} from 'react-native';
import { BLACK, GOLD, GREY, GREY_BORDER, WHITE, RED } from '../common';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { RectButton, TouchableOpacity } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';

function ListItemforsearch(props) {
    const renderRightActions = progress => {

        const trans = progress.interpolate({
            inputRange: [0, 50, 100, 101],
            outputRange: [-20, 0, 0, 1],
        })

        return (
            <View style={{ flexDirection: 'row', width: 190 }}>
                <Animated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
                    <RectButton onPress={props.onADDTOCARTpress} style={[styles.rightAction, { backgroundColor: '#dd2c00' }]}>
                        <MaterialIcons name='shopping-cart' size={25} color={WHITE}></MaterialIcons>
                    </RectButton>
                </Animated.View>
            </View>
        )
    }

       return (
        <Swipeable
            friction={2}
            renderRightActions={renderRightActions}
        >
        <TouchableWithoutFeedback onPress={props.onPress}>

        <View style={styles.card}>
            <Image style={styles.cardImg} source={props.itemImage} resizeMode='cover'></Image>
            <View style={styles.cardInfo}>
                <View style={{ flex: 1 }}>
                    <Text numberOfLines={1} style={styles.itemName}>{props.title}</Text>
                    {props.giamgia > 0 ? <View style={styles.saleTag}>
                        <Text style={styles.salePercentageTxt}>{'-' + props.giamgia * 100 + '%'}</Text>
                    </View> :
                        null
                    }
                </View>

                <View style={styles.descriptionContainer}>
                    <Text numberOfLines={2} style={styles.itemDescripton}> {props.description}</Text>
                </View>

                <View style={{ flex: 1 }}>
                    {/* <Text numberOfLines={1} style={styles.itemton}> {'Số lượng hiện có: '+props.soluongton}</Text> */}

                    <Text numberOfLines={1} style={styles.itemPrice}> {props.giaban}</Text>
                    <Text numberOfLines={1} style={styles.itemSalePrice}>{props.giagoc + ' VNĐ'}</Text>

                </View>
            </View>
        </View>
       </TouchableWithoutFeedback>
        </Swipeable>
    );
}

const styles = StyleSheet.create({
    card: {
        marginTop: 10,
        height: 120,
        width: '100%',
        marginVertical: 10,
        flexDirection: 'row',
        shadowColor: '#999',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        borderRadius: 1,
        backgroundColor: WHITE,
        paddingBottom: 10,
       // borderBottomWidth: 2,
        borderBottomColor: GREY_BORDER
    },
    cardInfo: {
        flex: 2,
    },
    cardImg: {
        height: '100%',
        width: '100%',
        alignSelf: 'center',
        flex: 1,
        borderRadius: 5,
    },
    itemName: {
        fontSize: 18,
        marginLeft: 15,
        marginTop: 10,
        fontWeight: 'bold',
    },
    descriptionContainer: {
        alignSelf: 'center',
        width: '90%',
        marginLeft: 5,
        flex: 1,
    },
    itemDescripton: {
        fontSize: 12,
        color: '#444'
    },
    itemton: {
        fontSize: 10,
        color: '#444',
        paddingLeft:11
    },
    itemPrice: {
        color: '#FF0000',
        fontWeight: 'bold',
        marginLeft: 10,
        fontSize: 14
    },
    itemSalePrice: {
        color: GREY,
        marginLeft: 12,
        fontSize: 12,
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid',
        width: 85,
        textAlign: 'center',
    },
    saleTag: {
        backgroundColor: RED,
        width: 60,
        height: 25,
        borderRadius: 5,
        position: 'relative',
        bottom: -45,
        right: '-70%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    salePercentageTxt: {
        color: WHITE,
        fontSize: 12,
        fontWeight: 'bold',
        width: 100,
        textAlign: 'center'
    },
    rightAction: {
        marginTop: 10,
        alignItems: 'center',
        flex: 1,
        marginVertical: 10,
        justifyContent: 'center',
        height: 70,
        paddingBottom: 10,
        borderBottomWidth: 2,
    },
});

export default ListItemforsearch;

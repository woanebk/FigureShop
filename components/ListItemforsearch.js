import React from 'react';
import { View, Text, StyleSheet, Image, Animated, TouchableWithoutFeedback } from 'react-native';
import { GREY, DARK_PRIMARY_COLOR, WHITE } from '../common';
import { RectButton } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { MaterialIcons } from '@expo/vector-icons';

function ListItemmforsearch(props) {

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
                <View style={styles.container} >
                    <Image style={styles.img} source={props.image}></Image>
                    <View style={styles.textWrapper}>
                        <Text numberOfLines={1} style={styles.nameTxt}>{props.name}</Text>
                        <Text numberOfLines={1} style={styles.descriptionTxt}> {props.description}</Text>
                        <Text numberOfLines={1} style={styles.descriptionTxt}> {props.phoneNumber}</Text>
                        <Text numberOfLines={1} style={styles.priceTxt}>{props.price ? props.price + ' VNĐ' : ''}</Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Swipeable>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        marginVertical: 5,
        backgroundColor: WHITE,
        elevation: 5
    },
    img: {
        width: 150,
        height: 70,
        borderRadius: 5,
    },
    textWrapper: {
        flex: 1,
        marginLeft: 10
    },
    nameTxt: {
        fontSize: 16,
    },
    descriptionTxt: {
        fontSize: 12,
        color: GREY
    },
    rightAction: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        height: 75,
        marginVertical: 5
    },
    priceTxt: {
        color: DARK_PRIMARY_COLOR,
        marginTop: 7,
        fontWeight: 'bold'
    },
});

export default ListItemmforsearch;
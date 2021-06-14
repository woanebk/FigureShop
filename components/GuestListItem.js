import React from 'react';
import { View, Text, StyleSheet, Image, Animated, TouchableWithoutFeedback } from 'react-native';
import { GREY, DARK_PRIMARY_COLOR, WHITE, GREY_BORDER, GREEN, BLACK, GOLD } from '../common';
import { RectButton, TouchableOpacity } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

function GuestListItem(props) {
    return (
        <Swipeable
            friction={2}
        >
            <TouchableWithoutFeedback onPress={props.onPress}>
                <View style={styles.container} >
                    <View style={styles.infoWrapper}>                     
                        <Text style={styles.txt}>Số Điện Thoại: {props.phoneNumber}</Text>
                        <View style={styles.tag}>
                            <Text style={styles.tagTxt}>{props.soLuongSanPham} Sản Phẩm</Text>
                        </View>
                        <View style={styles.tag3}>
                            <Text style={styles.tagTxt}>{props.SoLuongDon} Đơn Hàng</Text>
                        </View>

                    </View>
                    <View style={styles.seeMore}>
                        <Text style={{ fontSize: 12, width: 80 }}>Xem Chi Tiết</Text>
                        <Ionicons name='chevron-forward-outline' size={20}></Ionicons>
                    </View>
                    <View style={styles.time}>
                        <Text style={styles.timeTxt}>{props.ngayDat}</Text>
                    </View>
                    {/* {
                        props.canConfirm ?
                            null
                            :
                            <View style={styles.confirm}>
                                <Text style={styles.confirmTxt}>Không đủ hàng</Text>
                            </View>
                    } */}

                </View>
            </TouchableWithoutFeedback>
        </Swipeable>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: WHITE,
        height: 80,
        borderBottomWidth: 3,
        borderColor: GREY_BORDER,
        marginBottom: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5
    },
    rightAction: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        height: 75,
        marginVertical: 5
    },
    infoWrapper: {
        height:100,
        //backgroundColor:BLACK
    },
    seeMore: {
        width: 100,
        flexDirection: 'row',
        alignItems: 'center'
    },
    txt: {
        fontSize: 13,
        marginLeft: 5,
        width: 250
    },
    tagWrapper: {
        flexDirection: 'row'
    },
    tag: {
        width: 100,
        height: 20,
        backgroundColor: GOLD,
        justifyContent: 'center',
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 5
    },
    tag2: {
        width: 140,
        height: 20,
        backgroundColor: GREEN,
        justifyContent: 'center',
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 5,
    },
    tag3: {
        width: 100,
        height: 20,
        backgroundColor: GREEN,
        justifyContent: 'center',
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 5,
    },
    tagTxt: {
        fontSize: 13,
        fontWeight: 'bold',
        width: '100%',
        textAlign: 'center'
    },
    time: {
        position: 'absolute',
        //backgroundColor:BLACK,
        height: 15,
        width: 90,
        borderLeftWidth: 3,
        borderRightWidth: 3,
        borderColor: GREY_BORDER,
        bottom: 5,
        right: 5,
    },
    timeTxt: {
        fontSize: 12,
        textAlign: 'center'
    },
    confirm: {
        position: 'absolute',
        backgroundColor: DARK_PRIMARY_COLOR,
        height: 20,
        width: 100,
        borderRadius: 10,
        top: 0,
        right: 10
    },
    confirmTxt: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 12,
        textAlign: 'center'
    },
});

export default GuestListItem;
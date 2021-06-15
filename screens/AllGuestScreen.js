import React, { useState, useEffect, useLayoutEffect, Fragment, Children } from 'react';
import { View, StyleSheet, StatusBar, TouchableOpacity, FlatList, Text, ActivityIndicator } from 'react-native';
import { GREY, OFF_WHITE, PRIMARY_COLOR, WHITE } from '../common';
import { ListItem, GuestListItem } from '../items';
import { MaterialIcons } from '@expo/vector-icons';
import { firebaseApp } from '../firebaseconfig';
import Dialog, { DialogFooter, DialogButton, DialogContent, DialogTitle, SlideAnimation } from 'react-native-popup-dialog';
import { Button } from 'react-native-paper';
//import { isObject } from 'core-js/fn/object';

export default function AllGuestScreen({ navigation }) {
  const [listGuest, setListGuest] = useState();
  const [deleteID, setDeleteID] = useState(''); //id Guest để xóa
  const [isLoading, setIsLoading] = useState(true);
  const [soluongdon, setsoluongdon] = useState(0);
  const [dialogVisable, setDialogVisable] = useState(false); // true thì hiện dialog, false thì ẩn
  navigation.addListener('focus', () => { getGuests(); setIsLoading(false) })
  useEffect(() => {
    if (deleteID !== '')
      openDialog();
  })
  const getGuests = () => {
    let list = [];
    firebaseApp.database().ref('Guest').orderByChild('TrangThai').equalTo('on').on('value', (snapshot) => {
      if (snapshot.exists()) {
        list = []; //reset list tránh trùng lặp
        snapshot.forEach((child) => {
          list.push({
            phoneNumber: child.key,
            DonHang: child.val().DonHang,
            SoLuongDon:child.val().DonHang.length,
          })
         // console.log(child.val().DonHang.asArray().length)
        })
        
        setListGuest(list)
      }
    })
  }
  const deleteGuest = async (Guest_id) => {
    try {
      closeDialog();
      await firebaseApp.database().ref('Guest/' + Guest_id).update({
        TrangThai: 'off'
      })
      setDeleteID('')//reset để không mở dialog trong useEffect không cần thiết
      alert('Xóa Thành Công !')
    }
    catch (error) {
      alert(error)
    }
  }

  const onDeleteGuestPress = (id) => {
    setDeleteID(id) //call back useEffect sẽ mở dialog
  }

  //Dialog:
  const openDialog = () => { setDialogVisable(true) }
  const closeDialog = () => {
    setDialogVisable(false);
    setDeleteID('')
  } //reset để không mở dialog trong useEffect không cần thiết 

  const renderDialog = () => (
    <Dialog
      visible={dialogVisable}
      dialogTitle={<DialogTitle title="Thông Báo" />}
      onTouchOutside={() => closeDialog()}
      footer={
        <DialogFooter>
          <DialogButton
            text="CANCEL"
            onPress={() => closeDialog()}
          />
          <DialogButton
            text="OK"
            onPress={() => deleteGuest(deleteID)}
          />
        </DialogFooter>
      }
      dialogAnimation={new SlideAnimation({
        slideFrom: 'bottom',
      })}
    >
      <DialogContent style={styles.dialog}>
        <View style={{ height: '100%' }}>
          <Text style={{ fontSize: 16, alignSelf: 'center' }}> Bạn có chắc muốn Xóa ?</Text>
        </View>
      </DialogContent>
    </Dialog>
  )
  const tinhTongSoLuong = (arr) => {
    var tongsoluong = 0;
    for (var item in arr) {
      tongsoluong +=arr[item].TongSoLuongMua;
    };
    return tongsoluong
  }
  const tinhTongDonHang= (arr) => {
    var tongsoluong = 0;
    for (var item in arr) {
      tongsoluong +=1;
    };
    return tongsoluong
  }
  return (
    <View style={styles.container}>
      <StatusBar barStyle='dark-content' translucent></StatusBar>
      <View style={styles.topdock}></View>
      {
        isLoading ?
          <ActivityIndicator style={styles.indicator} animating={isLoading} color='#bc2b78' size="large" />
          :
          <Fragment>
            <FlatList style={styles.list}
              data={listGuest}
              renderItem={({ item }) => (
                <GuestListItem
                  phoneNumber={item.phoneNumber} 
                  soLuongSanPham={tinhTongSoLuong(item.DonHang)}
                  SoLuongDon={tinhTongDonHang(item.DonHang)}
                  onPress={() => navigation.navigate('Guestinfo', { phoneNumber: item.phoneNumber})}
                ></GuestListItem>
              )}
              keyExtractor={item => item.phoneNumber}
              showsVerticalScrollIndicator={false}
            />
            {renderDialog()}
          </Fragment>
      }

    </View>
  );
}

var styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: WHITE
  },
  topdock: {
    height: 120,
    backgroundColor: PRIMARY_COLOR,
    borderBottomRightRadius: 70
  },
  list: {
    width: '90%',
    alignSelf: 'center'
  },
  newBtn: {
    position: 'absolute',
    width: 70,
    height: 70,
    right: 20,
    bottom: 20,
    borderRadius: 100,
    backgroundColor: PRIMARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5
  },
  dialog: {
    width: 280,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
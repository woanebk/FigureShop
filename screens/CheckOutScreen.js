import React, { Fragment, useEffect } from 'react';
import { useContext, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { useState } from 'react';
import CartContext from '../CartContext';
import { BLACK, DARK_PRIMARY_COLOR, GREY, OFF_WHITE, PRIMARY_COLOR, WHITE, LIGHT_PINK, GREY_BORDER, GUEST_UID, GOLD, GREEN } from '../common';
import { ActionInput, CheckOutItem, CodeInput } from '../items';
import { Ionicons } from '@expo/vector-icons';
import { RadioButton, Checkbox } from 'react-native-paper';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import { firebaseApp } from '../firebaseconfig';
import firebase from 'firebase/app';
import { FirebaseRecaptchaVerifierModal, FirebaseRecaptchaBanner } from 'expo-firebase-recaptcha';
import DropDownPicker from 'react-native-dropdown-picker';

export default function CheckOutScreen({ route, navigation }) {
  const [firstRun, setFirstRun] = useState(0);

  const { cart, setCart } = useContext(CartContext)
  const [tongTien, setTongTien] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  //ThanhToan:
  const [hoTen, setHoTen] = useState('')
  const [diaChi, setDiaChi] = useState('')
  const [soDienThoai, setSoDienThoai] = useState('')
  //dropdownlist:
  const [listSDT, setListSDT] = useState([]);
  const [openList, setOpenList] = useState(false);
  const [isUsingDropDown, setIsUsingDropDown] = useState(false)

  //Capcha
  const firebaseConfig = firebase.apps.length ? firebase.app().options : undefined;
  const attemptInvisibleVerification = false;
  const recaptchaVerifier = useRef(null);
  const [verificationId, setVerificationId] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  //Giao Dien:
  const bottomsheetRef = React.createRef(); //reference attached to bottomsheet
  const fall = new Animated.Value(1); //blur animation

  useEffect(() => {
    if (firstRun == 0) {
      getSDTs()
      setFirstRun((firstRun) => firstRun += 1) //??a??nh d????u l????n cha??y ??????u
    }
    tinhTongTien()
  })

  const tinhTongTien = () => {
    var total = 0;
    if (cart.length > 0) {
      cart.forEach(item => {
        total += item.SoLuongMua * item.GiaBan * (1 - item.GiamGia)
      });
    }
    setTongTien(total)
  }

  const renderItems = () => {
    return cart.map((item, index) => (
      <View key={index}>
        <CheckOutItem name={item.TenSanPham}
          itemImage={{ uri: item.HinhAnh[0] }}
          soLuong={item.SoLuongMua}
          giaBan={item.GiaBan * (1 - item.GiamGia)}
        ></CheckOutItem>
      </View>
    ))
  }

  const validate = () => {
    var result = true
    if (firebaseApp.auth().currentUser.uid == GUEST_UID) {
      if (hoTen == '' || soDienThoai == '' || diaChi == '')
        result = false
    }
    else {
      if (hoTen == '' || soDienThoai == '')
        result = false
    }
    return result
  }

  const getSDTs = () => {
    var list = []
    firebaseApp.database().ref('Guest').once('value', snapshot => {
      for (let [sdt_key, sdt_value] of Object.entries(snapshot.val())) {
        list.push({
          SoDienThoai: sdt_key
        })
      }
      setListSDT(list)
    })
  }

  const Submit = async () => {
    if (!validate()) {
      alert('Vui Lo??ng Nh????p ??u?? Th??ng Tin !')
      return
    }
    if (isNaN(soDienThoai) || soDienThoai < 0) {
      alert('S??? ??i???n tho???i kh??ng h???p l??? !')
      return
    }
    if (firebaseApp.auth().currentUser.uid == GUEST_UID)
      onGuiMaPress()
    else
      banHang()
  }

  const convertPhoneNumber = (number) => {
    if (number.charAt(0) == '+')
      return number

    var convertedNumber = '+84' + number.substring(1)
    return convertedNumber
  }

  const onGuiMaPress = async () => {
    setIsLoading(true)
    var phonenumber = convertPhoneNumber(soDienThoai)
    try {
      const phoneProvider = new firebase.auth.PhoneAuthProvider();
      const verificationId = await phoneProvider.verifyPhoneNumber(
        phonenumber,
        recaptchaVerifier.current
      );
      setVerificationId(verificationId);
      setIsLoading(false)
      alert("G???i m?? x??c nh???n th??nh c??ng, vui l??ng ki???m tra ??i???n tho???i c???a b???n");
      //bottomsheetRef.current.snapTo(1)
    } catch (err) {
      setIsLoading(false)
      alert(err)
    }
  }

  const onXacNhanMaPress = async () => {
    try {
      setIsLoading(true)
      const credential = firebase.auth.PhoneAuthProvider.credential(
        verificationId,
        verificationCode
      );
      var currentdate = new Date();
      var ngay = currentdate.getDate().toString()
      var thang = (currentdate.getMonth() + 1).toString()
      if (ngay.length < 2) ngay = '0' + ngay
      if (thang.length < 2) thang = '0' + thang
      var ngaydat = ngay + '/' + thang + '/' + currentdate.getFullYear()
      var TongSoLuongMua = await tinhTongSoLuong(cart)
      firebaseApp.database().ref('Guest/' + soDienThoai + '/DonHang').push({
        TrangThai: 'on',
        DaXacNhan: 0,
        DiaChi: diaChi,
        HoTen: hoTen,
        TongTien: tongTien,
        SanPhamMua: cart,
        NgayDat: ngaydat,
        TongSoLuongMua:TongSoLuongMua,
      }, () => {
        firebaseApp.database().ref('Guest/' + soDienThoai).update({ TrangThai: 'on' })
      })
      if (firebase.auth().currentUser.phoneNumber != soDienThoai)
        await firebase.auth().currentUser.updatePhoneNumber(credential);
      else
        await firebase.auth().signInWithPhoneNumber(credential);
      setIsLoading(false)
      alert('??????t Ha??ng Tha??nh C??ng')
      navigation.navigate('SuccessOrder', { ten_khach_hang: hoTen, dia_chi: diaChi, so_dien_thoai: soDienThoai, thanh_tien: tongTien })
    } catch (err) {
      setIsLoading(false)
      alert("vui l??ng nh???p l???i m?? x??c nh???n ho???c ti???n h??nh ?????t h??ng l???i")
      return
    }

    //Them Don Dat Han
  }

  const tinhTongSoLuong = (arr) => {
    var tongsoluong = 0
    arr.forEach(item => {
      tongsoluong += item.SoLuongMua
    });
    return tongsoluong
  }

  const banHang = async () => {
    try {
      setIsLoading(true)
      //Them Don Ban Hang
      var currentdate = new Date();
      var ngay = currentdate.getDate().toString()
      var thang = (currentdate.getMonth() + 1).toString()
      if (ngay.length < 2) ngay = '0' + ngay
      if (thang.length < 2) thang = '0' + thang
      var ngaydat = ngay + '/' + thang + '/' + currentdate.getFullYear()
      var TongSoLuongMua = await tinhTongSoLuong(cart)

      await firebaseApp.database().ref('Guest/' + soDienThoai + '/DonHang').push({
        TrangThai: 'on',
        DaXacNhan: 1,
        DiaChi: 'Mua ta??i c????a ha??ng',
        HoTen: hoTen,
        TongTien: tongTien,
        SanPhamMua: cart,
        NgayDat: ngaydat,
        TongSoLuongMua: TongSoLuongMua
      }, () => {
        firebaseApp.database().ref('Guest/' + soDienThoai).update({ TrangThai: 'on' })
        cart.forEach(async (item) => {
          let tonkho = 0
          await firebaseApp.database().ref('Anime/' + item.IdAnime + '/SanPham/' + item.IdSanPham).once('value', snp => {
            if (snp.exists())
              tonkho = snp.val().SoLuong
          })
          await firebaseApp.database().ref('Anime/' + item.IdAnime + '/SanPham/' + item.IdSanPham).update({
            SoLuong: tonkho - item.SoLuongMua
          })
        })
      })
      setIsLoading(false)
      alert('Ta??o ????n Ba??n Ha??ng Tha??nh C??ng')
      navigation.navigate('SuccessOrder', { ten_khach_hang: hoTen, dia_chi: 'Mua ta??i c????a ha??ng', so_dien_thoai: soDienThoai, thanh_tien: tongTien })
    } catch (err) {
      setIsLoading(false)
      alert(err)
      return
    }


  }

  const onCheckPress = () => {
    setIsUsingDropDown(!isUsingDropDown)
    setSoDienThoai('')
  }

  //RENDER BOTTOM SHEET:
  const renderSheet = () => {
    if (firebaseApp.auth().currentUser.uid == GUEST_UID) {
      if (!verificationId)
        return (
          <View style={styles.bottomsheetWrapper}>
            <Text style={styles.panelTitleTxt}>Th??ng Tin ??????t Ha??ng</Text>
            <Text style={styles.panelSubtitleTxt}>Nh????p Th??ng Tin Cu??a Ba??n</Text>
            <ScrollView style={{ width: '90%', flex: 1 }}>
              <ActionInput title='S???? ??i????n Thoa??i' ionIconName='call'
                placeholder='Nh????p S???? ??i????n Thoa??i'
                autoFocus='true'
                require={true}
                value={soDienThoai}
                onChangeText={(text) => { setSoDienThoai(text) }}
              ></ActionInput>
              <ActionInput title='Ho?? T??n' ionIconName='person'
                placeholder='Nh????p Ho?? T??n'
                autoFocus='true'
                require={true}
                value={hoTen}
                onChangeText={(text) => { setHoTen(text) }}
              ></ActionInput>
              <ActionInput title='??i??a Chi??' ionIconName='location'
                placeholder='Nh????p ??i??a Chi??'
                autoFocus='true'
                require={true}
                value={diaChi}
                onChangeText={(text) => { setDiaChi(text) }}
              ></ActionInput>
              <TouchableOpacity style={[styles.commandBtn, { alignSelf: 'center', marginTop: 10 }]}
                onPress={Submit}
              >
                <Text style={styles.commandTxt}>??????t Ha??ng</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        )

      return (
        <View style={styles.bottomsheetWrapper}>
          <CodeInput value={verificationCode}
            onChangeText={(text) => setVerificationCode(text)}
          ></CodeInput>
          <TouchableOpacity style={[styles.commandBtn, { alignSelf: 'center', marginTop: 20 }]}
            onPress={onXacNhanMaPress}
          >
            <Text style={styles.commandTxt}>Xa??c Nh????n</Text>
          </TouchableOpacity>
        </View>
      )
    }
    else return (
      <View style={styles.bottomsheetWrapper}>
        <Text style={styles.panelTitleTxt}>Th??ng Tin ????n Ha??ng</Text>
        <Text style={styles.panelSubtitleTxt}>Nh????p Th??ng Tin Kha??ch Ha??ng</Text>
        <ScrollView style={{ width: '90%', flex: 1 }}>
          <View style={{ flexDirection: 'row', marginBottom: 5 }}>
            <Checkbox status={isUsingDropDown ? 'checked' : 'unchecked'} onPress={onCheckPress}></Checkbox>
            <Text style={{ width: 200, alignSelf: 'center', color: DARK_PRIMARY_COLOR, fontWeight: 'bold' }}>S???? du??ng s???? ??i????n thoa??i co?? s????n</Text>
          </View>
          {isUsingDropDown ?
            <DropDownPicker style={{ marginBottom: 10 }}
              open={openList}
              value={soDienThoai}
              items={listSDT}
              setOpen={setOpenList}
              setValue={setSoDienThoai}
              searchable={true}
              //setItems={setListAnime}
              schema={{
                label: 'SoDienThoai',
                value: 'SoDienThoai',
              }}
              placeholder='Cho??n SDT'
              zIndex={100}
              dropDownDirection='BOTTOM'
              listMode="SCROLLVIEW"
              dropDownContainerStyle={{
                backgroundColor: "#dfdfdf",
                height: 150
              }}
            />
            :
            <ActionInput title='S???? ??i????n Thoa??i' ionIconName='call'
              placeholder='Nh????p S???? ??i????n Thoa??i'
              autoFocus='true'
              require={true}
              value={soDienThoai}
              onChangeText={(text) => { setSoDienThoai(text) }}
            ></ActionInput>
          }
          <ActionInput title='Ho?? T??n' ionIconName='person'
            placeholder='Nh????p Ho?? T??n'
            autoFocus='true'
            require={true}
            value={hoTen}
            onChangeText={(text) => { setHoTen(text) }}
          ></ActionInput>
          <TouchableOpacity style={[styles.commandBtn, { alignSelf: 'center', marginTop: 70 }]}
            onPress={Submit}
          >
            <Text style={styles.commandTxt}>??????t Ha??ng</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    )


  }

  const renderSheetHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHandle}></View>
    </View>
  )

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <StatusBar barStyle='light-content' translucent backgroundColor={'transparent'} ></StatusBar>
        <View style={styles.topdock}></View>
        {
          isLoading ?
            <ActivityIndicator style={styles.indicator} animating={isLoading} color='#bc2b78' size="large" />
            :
            <Fragment>
              <ScrollView style={{ backgroundColor: WHITE, flex: 1 }}>
                <View style={styles.itemsWrapper}>
                  {renderItems()}
                  <View style={styles.tag}>
                    <View style={styles.tag1}>
                      <Ionicons name='card-outline' size={25} color={PRIMARY_COLOR}></Ionicons>
                    </View>
                    <View style={styles.tag2}>
                      <Text style={styles.tag2Txt}>Sa??n ph????m ??a?? cho??n</Text>
                    </View>
                  </View>
                </View>
              </ScrollView>
              {
                firebaseApp.auth().currentUser.uid == GUEST_UID ?
                  <View style={styles.phuongThucTT}>
                    <Text style={styles.boldTxt}>Ph????ng th????c thanh toa??n</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 5 }}>
                      <RadioButton value='Thanh Toa??n Khi Nh????n Ha??ng' status='checked' color={PRIMARY_COLOR} ></RadioButton>
                      <Text>Thanh Toa??n Khi Nh????n Ha??ng</Text>
                    </View>
                  </View>
                  :
                  null
              }


              <View style={styles.btnWrapper}>
                <View style={{ marginLeft: 5 }}>
                  <Text>T????ng C????ng:</Text>
                  <Text style={styles.priceTxt}>{tongTien + ' VN??'}</Text>
                </View>
                <TouchableOpacity style={styles.commandBtn} onPress={() => bottomsheetRef.current.snapTo(1)}>
                  <Text style={styles.commandTxt}> Thanh Toa??n{'   '}</Text>
                </TouchableOpacity>
              </View>
            </Fragment>
        }
        <BottomSheet
          ref={bottomsheetRef}
          snapPoints={[0, 420]}
          initialSnap={0} //0 is 0, 1 is 300
          callbackNode={fall}
          enabledGestureInteraction={true}
          enabledContentGestureInteraction={false}
          renderContent={renderSheet}
          renderHeader={renderSheetHeader}
        />
      </View>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
        attemptInvisibleVerification={attemptInvisibleVerification}
      />
    </View>
  )
}

var styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: WHITE
  },
  topdock: {
    height: 110,
    backgroundColor: PRIMARY_COLOR,
    borderBottomRightRadius: 70
  },
  btnWrapper: {
    height: 60,
    margin: 10,
    marginBottom: 5,
    //backgroundColor:'#000',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 2,
    borderColor: GREY_BORDER,
  },
  commandBtn: {
    borderRadius: 5,
    backgroundColor: DARK_PRIMARY_COLOR,
    alignItems: 'center',
    height: 50,
    width: 150,
    justifyContent: 'center',
    padding: 10,
    elevation: 5,
  },
  commandTxt: {
    color: WHITE,
    fontSize: 18,
    fontWeight: 'bold',
    width: '100%',
    textAlign: 'center'
  },
  priceTxt: {
    fontSize: 20,
    color: DARK_PRIMARY_COLOR
  },
  itemsWrapper: {
    backgroundColor: WHITE,
    width: '94%',
    marginTop: 40,
    borderRadius: 15,
    borderColor: GREY_BORDER,
    borderWidth: 2,
    alignSelf: 'center',
    paddingTop: 40,

  },
  tag: {
    height: 35,
    position: 'absolute',
    backgroundColor: LIGHT_PINK,
    flexDirection: 'row',
    alignItems: 'center',
    top: -20,
    left: 10,
    borderRadius: 8,
    borderColor: PRIMARY_COLOR,
    borderWidth: 1
  },
  tag1: {
    marginLeft: 5
  },
  tag2: {
    marginLeft: 5,
    paddingRight: 5
  },
  tag2Txt: {
    color: DARK_PRIMARY_COLOR
  },
  phuongThucTT: {
    height: 70,
    borderTopWidth: 5,
    borderColor: GREY_BORDER
  },
  boldTxt: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    marginTop: 5
  },
  header: {
    backgroundColor: WHITE,
    shadowColor: '#333333',
    shadowOffset: { width: -1, height: -3 },
    shadowRadius: 2,
    shadowOpacity: 0.4,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    //elevation:20,
    alignItems: 'center',
    borderWidth: 1,
    borderBottomWidth: 0,
    height: 40
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: GREY,
    marginBottom: 10,
  },
  bottomsheetWrapper: {
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 380
  },
  panelTitleTxt: {
    fontSize: 25,
  },
  panelSubtitleTxt: {
    color: GREY,
    fontSize: 13
  },
  indicator: {
    marginTop: 100,
    zIndex: 0
  }
})
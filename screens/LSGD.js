import React, { useState, useEffect, useLayoutEffect, Fragment } from 'react';
import { View, StyleSheet, StatusBar, TouchableOpacity, FlatList, Text, ActivityIndicator,ScrollView } from 'react-native';
import {  BLACK, DARK_PRIMARY_COLOR, GREY, OFF_WHITE, PRIMARY_COLOR, WHITE, LIGHT_PINK, GREY_BORDER, GUEST_UID, GOLD, GREEN } from '../common';
import { ListItem, OrderListItem,ActionInput ,CodeInput} from '../items';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import { firebaseApp } from '../firebaseconfig';
import Dialog, { DialogFooter, DialogButton, DialogContent, DialogTitle, SlideAnimation } from 'react-native-popup-dialog';
import firebase from 'firebase/app';
import { FirebaseRecaptchaVerifierModal, FirebaseRecaptchaBanner } from 'expo-firebase-recaptcha';
import { useContext, useRef } from 'react';

export default function LSGD({ navigation }) {
  const [phoneNumber, setphoneNumber] = useState('');
  //const{GUEST_UID}=""
  const fall = new Animated.Value(1); //blur animation
  const [listDonDatHang, setListDonDatHang] = useState();
  const [firstRun, setFirstRun] = useState(0);
  const [soDienThoai, setSoDienThoai] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [verificationId, setVerificationId] = useState();
  const recaptchaVerifier = useRef(null);
  const firebaseConfig = firebase.apps.length ? firebase.app().options : undefined;
  const attemptInvisibleVerification = false;
  const [verificationCode, setVerificationCode] = useState();
  const bottomsheetRef = React.createRef(); //reference attached to bottomsheet
  navigation.addListener('focus', () => { setFirstRun(0) })
  useEffect(() => {
    if (firstRun == 0) {
      console.log(phoneNumber+'444444444444')
      if (phoneNumber != '')
      {
      getDonDatHang()
      setFirstRun((firstRun) => firstRun += 1)
        } 
        else
        bottomsheetRef.current.snapTo(1)
        setFirstRun((firstRun) => firstRun += 1)
       ;
        }
  })
  const convertPhoneNumber = (number) => {
    if (number.charAt(0) == '+')
      return number
    var convertedNumber = '+84' + number.substring(1)
    return convertedNumber
  }
  const getDonDatHang = () => {
    let list = [];
    firebaseApp.database().ref('Guest/' + phoneNumber + '/DonHang').orderByChild('TrangThai').equalTo('on').on('value', (snapshot) => {
      if (snapshot.exists()) {
        list = [];
        snapshot.forEach((child) => {
          list.push({
            IdDonDatHang: child.key,
            DaXacNhan: child.val().DaXacNhan,
            DiaChi: child.val().DiaChi,
            TenKhachHang: child.val().HoTen,
            NgayDat: child.val().NgayDat,
            TongSoLuongMua: child.val().TongSoLuongMua,
            TongTien: child.val().TongTien,
            TrangThai: child.val().TrangThai,
            SoDienThoai: phoneNumber
          })
        })
      }
    })
    console.log("end")
    setIsLoading(false)
    console.log(list)
    setListDonDatHang(list)
  }

  const canCcanConfirmDatHang = (sdt, iddondathang) => { //Neu du so luong de ban thi true
    var result = true;
    firebaseApp.database().ref('Guest/' + sdt + '/DonHang/' + iddondathang).once('value', snapshot => {
      if (snapshot.exists()) {
        snapshot.val().SanPhamMua.forEach(sanpham => {
          var soluongmua = sanpham.SoLuongMua
          var tonkho = 0
          firebaseApp.database().ref('Anime/' + sanpham.IdAnime + '/SanPham/' + sanpham.IdSanPham).once('value', DonDatHangsnapshot => {
            if (DonDatHangsnapshot.exists())
              tonkho = DonDatHangsnapshot.val().SoLuong
            if (soluongmua > tonkho) {
              result = false;
            }
          })
        });
      }
    })
    return result
  }
  const onGuiMaPress = async () => {
    
    var phonenumber = convertPhoneNumber(soDienThoai)
    try {
      const phoneProvider = new firebase.auth.PhoneAuthProvider();
      const verificationId = await phoneProvider.verifyPhoneNumber(
        phonenumber,
        recaptchaVerifier.current
      );
      setVerificationId(verificationId);
      alert("Gửi mã xác nhận thành công, vui lòng kiểm tra điện thoại của bạn");
    } catch (err) {
      alert(err)
    }
  }
  const validate = () =>{
    var result = true
    if(firebaseApp.auth().currentUser.uid == GUEST_UID)
    {
      if(soDienThoai == '' )
        result = false
    }
        return result

  }
  const Submit = async () => {
    if (!validate()) {
      alert('Vui Lòng Nhập Số Điện Thoại !')
      return
    }
    console.log("gửi mã")
    onGuiMaPress()
  }
  const onXacNhanMaPress = async () => {
    try{
      //
      const credential = firebase.auth.PhoneAuthProvider.credential(
        verificationId,
        verificationCode
      );
      if (firebase.auth().currentUser.phoneNumber!=soDienThoai)
      await firebase.auth().currentUser.updatePhoneNumber(credential);
      else 
      await firebase.auth().signInWithPhoneNumber(credential);
      bottomsheetRef.current.snapTo(0);
      setphoneNumber(soDienThoai);
      setFirstRun(0);
      alert('Xác Nhận Thành Công')
    } catch (err)
    {
      alert(err)
      return
    }
  }
  const renderSheet = () => {
    if (firebaseApp.auth().currentUser.uid == GUEST_UID) {
      if (!verificationId)
        return (
          <View style={styles.bottomsheetWrapper}>
            <Text style={styles.panelTitleTxt}>Thông Tin   </Text>
            <Text style={styles.panelSubtitleTxt}>Nhập Thông Tin Của Bạn   </Text>
            <ScrollView style={{ width: '90%', flex: 1 }}>
              <ActionInput title='Số Điện Thoại' ionIconName='call'
                placeholder='Nhập Số Điện Thoại'
                autoFocus='true'
                require={true}
                keyboardType='numeric'
                value={soDienThoai}
                onChangeText={(text) => { setSoDienThoai(text) }}
              ></ActionInput>
              <TouchableOpacity style={[styles.commandBtn, { alignSelf: 'center', marginTop: 10 }]}
                onPress={Submit}
              >
                <Text style={styles.commandTxt}>Kiểm Tra</Text>
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
            <Text style={styles.commandTxt}>Xác Nhận</Text>
          </TouchableOpacity>
        </View>
      )
    }
    else return (
      <View style={styles.bottomsheetWrapper}>
        <Text style={styles.panelTitleTxt}>Thông Tin Đơn Hàng</Text>
        <Text style={styles.panelSubtitleTxt}>Nhập Thông Tin</Text>
        <ScrollView style={{ width: '90%', flex: 1 }}>
          <View style={{ flexDirection: 'row', marginBottom: 5 }}>
            <Checkbox status={isUsingDropDown ? 'checked' : 'unchecked'} onPress={onCheckPress}></Checkbox>
            <Text style={{ width: 200, alignSelf: 'center', color: DARK_PRIMARY_COLOR, fontWeight: 'bold' }}>Sử dụng số điện thoại có sẵn</Text>
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
              placeholder='Chọn SDT'
              zIndex={100}
              listMode="SCROLLVIEW"
              dropDownContainerStyle={{
                backgroundColor: "#dfdfdf",
                height: 150
              }}
            />
            :
            <ActionInput title='Số Điện Thoại' ionIconName='call'
              placeholder='Nhập Số Điện Thoại'
              autoFocus='true'
              require={true}
              value={soDienThoai}
              onChangeText={(text) => { setSoDienThoai(text) }}
            ></ActionInput>
          }
          <TouchableOpacity style={[styles.commandBtn, { alignSelf: 'center', marginTop: 70 }]}
            onPress={Submit}
          >
            <Text style={styles.commandTxt}>Đặt Hàng</Text>
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
  //Dialog:
  return (
    <View style={styles.container}>
      <StatusBar barStyle='dark-content' translucent></StatusBar>
      
      <BottomSheet
              ref={bottomsheetRef}
              snapPoints={[0, 360]}
              initialSnap={1} //0 is 0, 1 is 300
              callbackNode={fall}
              enabledGestureInteraction={false}
              renderContent={renderSheet}
              renderHeader={renderSheetHeader}
            />
       <FirebaseRecaptchaVerifierModal
              ref={recaptchaVerifier}
              firebaseConfig={firebaseConfig}
              attemptInvisibleVerification={attemptInvisibleVerification}
            />     
      <View style={styles.topdock}></View>
      {
        isLoading ?
          <ActivityIndicator style={styles.indicator} animating={isLoading} color='#bc2b78' size="large" />
          :
          <Fragment>
            {
              listDonDatHang.length!=0?
              <FlatList style={styles.list}
              data={listDonDatHang}
              renderItem={({ item }) => (
                <OrderListItem name={item.TenKhachHang} maDonHang={item.IdDonDatHang}
                  phoneNumber={item.SoDienThoai} soLuongSanPham={item.TongSoLuongMua}
                  canConfirm={true}
                  canConfirm1={item.DaXacNhan?false:true}
                  canDelete={false}
                  tongtien={item.TongTien}
                  onPress={() => navigation.navigate('OrderDetail', { so_dien_thoai: item.SoDienThoai, id_don_dat_hang: item.IdDonDatHang })}
                  ngayDat={item.NgayDat}
                  onDeletePress={() => onDeleteDonDatHang(item.SoDienThoai, item.IdDonDatHang)}
                ></OrderListItem>
              )}
              keyExtractor={item => item.IdDonDatHang}
              showsVerticalScrollIndicator={false}
            />:<Text style={styles.commandTxt2}>Chưa có đơn hàng nào</Text>}
           <TouchableOpacity style={[styles.commandBtn2, { alignSelf: 'center'}]}
            onPress={()=>{setVerificationId(null); bottomsheetRef.current.snapTo(1);setIsLoading(true)}
            }
          >
            <Text style={styles.commandTxt}>Đổi Số Điện Thoại</Text>
          </TouchableOpacity>
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
  bottomsheetWrapper:{
    alignItems:'center',
    backgroundColor:'#fff',
    height:380
  },
  list: {
    width: '95%',
    height:'80%',
    alignSelf: 'center',
    borderWidth: 3,
    borderRadius: 5,
    padding: 5,
    marginTop: 10,
    borderColor: GREY_BORDER
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
  indicator: {
    marginTop: '50%'
  },
  topdock:{
    height:110,
    backgroundColor:PRIMARY_COLOR,
    borderBottomRightRadius:70
  },
  btnWrapper:{
    height:60,
    margin:10,
    marginBottom:5,
    //backgroundColor:'#000',
    alignItems:'center',
    flexDirection:'row',
    justifyContent:'space-between',
    borderTopWidth:2,
    borderColor:GREY_BORDER,
  },
  commandBtn:{
    borderRadius:5,
    backgroundColor:DARK_PRIMARY_COLOR,
    alignItems:'center',
    height:50,
    width:150,
    justifyContent:'center',
    padding:10,
    elevation:5,
  },
  commandBtn2:{
    borderRadius:5,
    backgroundColor:DARK_PRIMARY_COLOR,
    alignItems:'center',
    height:50,
    width:300,
    marginTop:20,
    marginBottom:20,
    justifyContent:'center',
    padding:10,
    elevation:5,
  },
  commandTxt:{
    color:WHITE,
    fontSize:18,
    fontWeight:'bold',
    width:'100%',
    textAlign:'center'
  },

  commandTxt2:{
    color:BLACK,
    fontSize:18,
    fontWeight:'bold',
    width:'100%',
    marginTop:50,
    textAlign:'center'
  },
  priceTxt:{
    fontSize:20,
    color:DARK_PRIMARY_COLOR
  },
  itemsWrapper:{
    backgroundColor:WHITE,
    width:'94%',
    marginTop:40,
    borderRadius:15,
    borderColor:GREY_BORDER,
    borderWidth:2,
    alignSelf:'center',
    paddingTop:40,

  },
  tag:{
    height:35,
    position:'absolute',
    backgroundColor:LIGHT_PINK,
    flexDirection:'row',
    alignItems:'center',
    top:-20,
    left:10,
    borderRadius:8,
    borderColor:PRIMARY_COLOR,
    borderWidth:1
  },
  tag1:{
    marginLeft:5
  },
  tag2:{
    marginLeft:5,
    paddingRight:5
  },
  tag2Txt:{
    color:DARK_PRIMARY_COLOR
  },  
  phuongThucTT:{
    height:70,
    borderTopWidth:5,
    borderColor:GREY_BORDER
  },
  boldTxt:{
    fontSize:16,
    fontWeight:'bold',
    marginLeft:10,
    marginTop:5
  },
  header:{
    backgroundColor:WHITE,
    shadowColor:'#333333',
    shadowOffset:{width:-1, height:-3},
    shadowRadius:2,
    shadowOpacity:0.4,
    paddingTop:20,
    borderTopLeftRadius:20,
    borderTopRightRadius:20,
    //elevation:20,
    alignItems:'center',
    borderWidth:1,
    borderBottomWidth:0,
    height:40
  },
  panelHandle:{
    width:40,
    height:8,
    borderRadius:4,
    backgroundColor:GREY,
    marginBottom:10,
  },
  bottomsheetWrapper:{
    alignItems:'center',
    backgroundColor:'#fff',
    height:380
  },
  panelTitleTxt:{
    fontSize:25,
  },
  panelSubtitleTxt:{
    color:GREY,
    fontSize:13
  },
  indicator:{
    marginTop:100,
    zIndex:0
  }
})
import React, { Fragment, useEffect } from 'react';
import { useContext, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, StatusBar, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { useState } from 'react/cjs/react.development';
import CartContext from '../CartContext';
import { BLACK, DARK_PRIMARY_COLOR, GREY, OFF_WHITE, PRIMARY_COLOR, WHITE, LIGHT_PINK, GREY_BORDER, GUEST_UID, GOLD, GREEN } from '../common';
import { ActionInput, CheckOutItem, CodeInput } from '../items';
import { Ionicons} from '@expo/vector-icons';
import { RadioButton, Checkbox } from 'react-native-paper';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import { firebaseApp } from '../firebaseconfig';
import firebase from 'firebase/app';
import { FirebaseRecaptchaVerifierModal, FirebaseRecaptchaBanner } from 'expo-firebase-recaptcha';
import DropDownPicker from 'react-native-dropdown-picker';

export default function CheckOutScreen({route, navigation}) {
  const [firstRun,setFirstRun]=useState(0);

  const {cart, setCart} = useContext(CartContext)
  const [tongTien, setTongTien] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  //ThanhToan:
  const [hoTen, setHoTen] = useState('')
  const [diaChi, setDiaChi] = useState('')
  const [soDienThoai, setSoDienThoai] = useState('')
  //dropdownlist:
  const [listSDT, setListSDT]= useState([]);
  const [openList, setOpenList] = useState(false);
  const [isUsingDropDown, setIsUsingDropDown]=useState(false)

  //Capcha
  const firebaseConfig = firebase.apps.length ? firebase.app().options : undefined;
  const attemptInvisibleVerification = false;
  const recaptchaVerifier = useRef(null);
  const [verificationId, setVerificationId] = useState();
  const [verificationCode, setVerificationCode] = useState();

  //Giao Dien:
  const bottomsheetRef = React.createRef(); //reference attached to bottomsheet
  const fall= new Animated.Value(1); //blur animation

  useEffect(()=>{
    if(firstRun == 0){
      getSDTs()
      setFirstRun((firstRun)=>firstRun += 1) //đánh dấu lần chạy đầu
    }
    tinhTongTien()
  })

  const tinhTongTien = ()=>{
    var total = 0;
    if(cart.length > 0)
    {
      cart.forEach(item => {
        total += item.SoLuongMua * item.GiaBan * (1 - item.GiamGia)
      });
    }
    setTongTien(total)
  }

  const renderItems = () => {
    return cart.map((item, index) =>(
      <View key = {index}>
        <CheckOutItem name = {item.TenSanPham}
          itemImage={{uri:item.HinhAnh[0]}}
          soLuong = {item.SoLuongMua}
          giaBan = {item.GiaBan * (1 - item.GiamGia)}
        ></CheckOutItem>
      </View>
    ))
  }

  const validate = () =>{
    var result = true
    if(firebaseApp.auth().currentUser.uid == GUEST_UID)
    {
      if(hoTen == '' || soDienThoai == '' || diaChi =='')
        result = false
    }
    else{
      if(hoTen == '' || soDienThoai == '')
          result = false
    }
        return result
  }

  const getSDTs = ()=>{
    var list = []
    firebaseApp.database().ref('Guest').once('value',snapshot=>{
      for (let [sdt_key, sdt_value] of Object.entries(snapshot.val())){
        list.push({
          SoDienThoai: sdt_key
        })
      }
      setListSDT(list)
    })
  }
  
  const Submit = async ()=>{
    if(!validate())
    {
      alert('Vui Lòng Nhập Đủ Thông Tin !')
      return
    }
    if(firebaseApp.auth().currentUser.uid == GUEST_UID)
      onGuiMaPress()
    else
      banHang()
  }

  const convertPhoneNumber = (number)=>{
    if(number.charAt(0) == '+')
      return number

    var convertedNumber = '+84' + number.substring(1)
    return convertedNumber
  }

  const onGuiMaPress = async ()=>{
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
      alert("Gửi mã xác nhận thành công, vui lòng kiểm tra điện thoại của bạn");
      //bottomsheetRef.current.snapTo(1)
    } catch (err) {
      setIsLoading(false)
      alert(err)
    }
  }

  const onXacNhanMaPress = async () => {
    try{
      setIsLoading(true)
      const credential = firebase.auth.PhoneAuthProvider.credential(
        verificationId,
        verificationCode
      );
      var currentdate = new Date();
      var ngay = currentdate.getDate().toString()
      var thang =(currentdate.getMonth()+1).toString()
      if(ngay.length < 2) ngay='0'+ ngay
      if(thang.length < 2) thang='0'+ thang
      var ngaydat = ngay + '/' + thang + '/'+ currentdate.getFullYear() 
      firebaseApp.database().ref('Guest/' + soDienThoai + '/DonHang').push({
        TrangThai: 'on',
        DaXacNhan: 0,
        DiaChi: diaChi,
        HoTen: hoTen,
        TongTien: tongTien,
        SanPhamMua: cart,
        NgayDat: ngaydat
      },()=>{
        firebaseApp.database().ref('Guest/' + soDienThoai).update({TrangThai:'on'})
      })
      //await firebase.auth().currentUser.updatePhoneNumber(credential);
      setIsLoading(false)
      alert('Đặt Hàng Thành Công')
      navigation.navigate('SuccessOrder',{ten_khach_hang:hoTen, dia_chi: diaChi, so_dien_thoai:soDienThoai, thanh_tien:tongTien})
    } catch (err)
    {
      setIsLoading(false)
      alert(err)
      return
    }
    
    //Them Don Dat Han
  }

  const banHang = async () => {
    try{
      setIsLoading(true)
      //Them Don Ban Hang
      var currentdate = new Date();
      var ngay = currentdate.getDate().toString()
      var thang =(currentdate.getMonth()+1).toString()
      if(ngay.length < 2) ngay='0'+ ngay
      if(thang.length < 2) thang='0'+ thang
      var ngaydat = ngay + '/' + thang + '/'+ currentdate.getFullYear() 
      
      await firebaseApp.database().ref('Guest/' + soDienThoai + '/DonHang').push({
        TrangThai: 'on',
        DaXacNhan: 1,
        DiaChi: 'Mua tại cửa hàng',
        HoTen: hoTen,
        TongTien: tongTien,
        SanPhamMua: cart,
        NgayDat: ngaydat
      },()=>{
        firebaseApp.database().ref('Guest/' + soDienThoai).update({TrangThai:'on'})
      })
      setIsLoading(false)
      alert('Tạo Đơn Bán Hàng Thành Công')
      navigation.navigate('SuccessOrder',{ten_khach_hang:hoTen, dia_chi: 'Mua tại cửa hàng', so_dien_thoai:soDienThoai, thanh_tien:tongTien})
    } catch (err)
    {
      setIsLoading(false)
      alert(err)
      return
    }
    
    
  }

  const onCheckPress = ()=>{
    setIsUsingDropDown(!isUsingDropDown)
    setSoDienThoai('')
  }

  //RENDER BOTTOM SHEET:
  const renderSheet = ()=>{
    if(firebaseApp.auth().currentUser.uid == GUEST_UID)
    {
      if(!verificationId)
      return (
        <View style={styles.bottomsheetWrapper}>
        <Text style={styles.panelTitleTxt}>Thông Tin Đặt Hàng</Text>
        <Text style={styles.panelSubtitleTxt}>Nhập Thông Tin Của Bạn</Text>
        <ScrollView style={{width:'90%', flex:1}}>
          <ActionInput title = 'Số Điện Thoại' ionIconName='call'
            placeholder='Nhập Số Điện Thoại'
            autoFocus='true'
            require={true}
            value = {soDienThoai}
            onChangeText={(text)=>{setSoDienThoai(text)}}
          ></ActionInput>
          <ActionInput title = 'Họ Tên' ionIconName='person'
            placeholder='Nhập Họ Tên'
            autoFocus='true'
            require={true}
            value = {hoTen}
            onChangeText={(text)=>{setHoTen(text)}}
          ></ActionInput>
          <ActionInput title = 'Địa Chỉ' ionIconName='location'
            placeholder='Nhập Địa Chỉ'
            autoFocus='true'
            require={true}
            value = {diaChi}
            onChangeText={(text)=>{setDiaChi(text)}}
          ></ActionInput>
          <TouchableOpacity style={[styles.commandBtn, {alignSelf:'center', marginTop:10}]}
            onPress={Submit}
            >
            <Text style = {styles.commandTxt}>Đặt Hàng</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    )

    return(
      <View style={styles.bottomsheetWrapper}>
        <CodeInput value={verificationCode}
          onChangeText = {(text)=>setVerificationCode(text)}
        ></CodeInput>
        <TouchableOpacity style={[styles.commandBtn, {alignSelf:'center', marginTop:20}]}
          onPress={onXacNhanMaPress}
        >
          <Text style = {styles.commandTxt}>Xác Nhận</Text>
        </TouchableOpacity>
      </View>
    )
    }
    else return(
      <View style={styles.bottomsheetWrapper}>
        <Text style={styles.panelTitleTxt}>Thông Tin Đơn Hàng</Text>
        <Text style={styles.panelSubtitleTxt}>Nhập Thông Tin Khách Hàng</Text>
        <ScrollView style={{width:'90%', flex:1}}>
          <View style={{flexDirection:'row', marginBottom:5}}>
            <Checkbox status={isUsingDropDown?'checked':'unchecked'} onPress={onCheckPress}></Checkbox>
            <Text style={{width:200, alignSelf:'center', color:DARK_PRIMARY_COLOR, fontWeight:'bold'}}>Sử dụng số điện thoại có sẵn</Text>
          </View>
          {isUsingDropDown?
          <DropDownPicker style={{marginBottom:10}}
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
            height:150
          }}
        />
        :
        <ActionInput title = 'Số Điện Thoại' ionIconName='call'
            placeholder='Nhập Số Điện Thoại'
            autoFocus='true'
            require={true}
            value = {soDienThoai}
            onChangeText={(text)=>{setSoDienThoai(text)}}
          ></ActionInput>
        }
        <ActionInput title = 'Họ Tên' ionIconName='person'
            placeholder='Nhập Họ Tên'
            autoFocus='true'
            require={true}
            value = {hoTen}
            onChangeText={(text)=>{setHoTen(text)}}
          ></ActionInput>
          <TouchableOpacity style={[styles.commandBtn, {alignSelf:'center', marginTop:70}]}
            onPress={Submit}
            >
            <Text style = {styles.commandTxt}>Đặt Hàng</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    )
    
    
  }

  const renderSheetHeader = ()=>(
    <View style={styles.header}>
        <View style={styles.panelHandle}></View>
    </View>
  )

  return (
      <View style={styles.container}>
        <View style={{flex:1}}>
          <StatusBar barStyle='light-content' translucent backgroundColor={'transparent'} ></StatusBar>
          <View style={styles.topdock}></View>
          {
            isLoading?
            <ActivityIndicator style={styles.indicator} animating={isLoading} color = '#bc2b78' size = "large"/>
            :
            <Fragment>
            <ScrollView style={{backgroundColor:WHITE, flex:1}}>
            <View style={styles.itemsWrapper}>
              {renderItems()}
              <View style={styles.tag}>
                <View style={styles.tag1}>
                  <Ionicons name = 'card-outline' size={25} color={PRIMARY_COLOR}></Ionicons>
                </View>
                <View style={styles.tag2}>
                  <Text style={styles.tag2Txt}>Sản phẩm đã chọn</Text>
                </View>
              </View>
            </View>
          </ScrollView>
          {
            firebaseApp.auth().currentUser.uid == GUEST_UID?
            <View style = {styles.phuongThucTT}>
            <Text style={styles.boldTxt}>Phương thức thanh toán</Text>
            <View style={{flexDirection:'row', alignItems:'center', marginLeft:5}}>
              <RadioButton value='Thanh Toán Khi Nhận Hàng' status='checked' color={PRIMARY_COLOR} ></RadioButton>
              <Text>Thanh Toán Khi Nhận Hàng</Text>
            </View>
          </View>
          :
          null
          }
          

          <View style={styles.btnWrapper}>
            <View style={{marginLeft:5}}>
              <Text>Tổng Cộng:</Text>
              <Text style={styles.priceTxt}>{tongTien + ' VNĐ'}</Text>
            </View>
            <TouchableOpacity style={styles.commandBtn} onPress={()=>bottomsheetRef.current.snapTo(1)}>
              <Text style={styles.commandTxt}> Thanh Toán{'   '}</Text>
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
  container:{
    height:'100%',
    backgroundColor:WHITE
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
  commandTxt:{
    color:WHITE,
    fontSize:18,
    fontWeight:'bold',
    width:'100%',
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
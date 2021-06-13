import React, { useEffect } from 'react';
import { useContext } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, StatusBar, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { useState } from 'react/cjs/react.development';
import CartContext from '../CartContext';
import { BLACK, DARK_PRIMARY_COLOR, GREY, OFF_WHITE, PRIMARY_COLOR, WHITE, LIGHT_PINK, GREY_BORDER } from '../common';
import { ActionInput, CheckOutItem } from '../items';
import { Ionicons} from '@expo/vector-icons';
import { RadioButton } from 'react-native-paper';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import { firebaseApp } from '../firebaseconfig';

export default function CheckOutScreen({route, navigation}) {

  const {cart, setCart} = useContext(CartContext)
  const [tongTien, setTongTien] = useState(0)

  //ThanhToan:
  const [hoTen, setHoTen] = useState('')
  const [diaChi, setDiaChi] = useState('')
  const [soDienThoai, setSoDienThoai] = useState('')

  //Giao Dien:
  const bottomsheetRef = React.createRef(); //reference attached to bottomsheet
  const fall= new Animated.Value(1); //blur animation

  useEffect(()=>{
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
    if(hoTen == '' || soDienThoai == '' || diaChi =='')
      return false
    else
      return true
  }

  const onComplete = ()=>{
    hoTen=''
    diaChi=''
    soDienThoai=''
  }
  
  const Submit = async ()=>{
    if(!validate())
    {
      alert('Vui Lòng Nhập Đủ Thông Tin !')
      return
    }

    var currentdate = new Date();
    var ngaydat = currentdate.getDate() + '/' + (currentdate.getMonth() + 1) + '/'+ currentdate.getFullYear() + '@' + currentdate.getHours()+ ':' + currentdate.getMinutes() + ':' + currentdate.getSeconds()

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
  }

  //RENDER BOTTOM SHEET:
  const renderSheet = ()=>(
    <View style={styles.bottomsheetWrapper}>
      <Text style={styles.panelTitleTxt}>Thông Tin Đặt Hàng</Text>
      <Text style={styles.panelSubtitleTxt}>Nhập Thông Tin Của Bạn</Text>
      <ScrollView style={{width:'90%', flex:1}}>
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
        <ActionInput title = 'Số Điện Thoại' ionIconName='call'
          placeholder='Nhập Số Điện Thoại'
          autoFocus='true'
          require={true}
          value = {soDienThoai}
          onChangeText={(text)=>{setSoDienThoai(text)}}
        ></ActionInput>
        <TouchableOpacity style={[styles.commandBtn, {alignSelf:'center', marginTop:10}]}
          onPress={Submit}
          >
          <Text style = {styles.commandTxt}>Xác Nhận</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
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

          <View style = {styles.phuongThucTT}>
            <Text style={styles.boldTxt}>Phương thức thanh toán</Text>
            <View style={{flexDirection:'row', alignItems:'center', marginLeft:5}}>
              <RadioButton value='Thanh Toán Khi Nhận Hàng' status='checked' color={PRIMARY_COLOR} ></RadioButton>
              <Text>Thanh Toán Khi Nhận Hàng</Text>
            </View>
            
          </View>
          <View style={styles.btnWrapper}>
            <View style={{marginLeft:5}}>
              <Text>Tổng Cộng:</Text>
              <Text style={styles.priceTxt}>{tongTien + ' VNĐ'}</Text>
            </View>
            <TouchableOpacity style={styles.commandBtn} onPress={()=>bottomsheetRef.current.snapTo(1)}>
              <Text style={styles.commandTxt}> Thanh Toán{'   '}</Text>
            </TouchableOpacity>
          </View>
          </View>
          <BottomSheet 
            ref={bottomsheetRef}
            snapPoints={[0, 400]}
            initialSnap={0} //0 is 0, 1 is 300
            callbackNode={fall}
            enabledGestureInteraction={true}
            enabledContentGestureInteraction={false}
            renderContent={renderSheet}
            renderHeader={renderSheetHeader}
            />
      </View>
  );
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
    height:360
  },
  panelTitleTxt:{
    fontSize:25,
  },
  panelSubtitleTxt:{
    color:GREY,
    fontSize:13
  },
})
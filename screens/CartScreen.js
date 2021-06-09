import React, { useEffect } from 'react';
import { useContext } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, StatusBar, TouchableOpacity, FlatList } from 'react-native';
import { useState } from 'react/cjs/react.development';
import CartContext from '../CartContext';
import { BLACK, DARK_PRIMARY_COLOR, GREY, OFF_WHITE, PRIMARY_COLOR, WHITE } from '../common';
import { CartItem } from '../items';

export default function CartScreen({route, navigation}) {

  const {cart, setCart} = useContext(CartContext)
  const [tongTien, setTongTien] = useState(0)

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

  const giamSoLuong = (id) =>{
    console.log('giam')
    let tmp = cart.slice(0)
    tmp.map((item)=>{
      if(item.IdSanPham == id)
      {
        if (item.SoLuongMua <= 0) return
        item.SoLuongMua -= 1
      }
    })
    setCart(tmp)
  }

  const tangSoLuong = (id) =>{
    console.log('tang')
    let tmp = cart.slice(0)
    tmp.map((item)=>{
      if(item.IdSanPham == id)
      {
        if(item.SoLuongMua >= item.TonKho){
          alert('Kho không đủ số lượng để thêm sản phẩm')
          return
        }
        item.SoLuongMua += 1
      }
    })
    setCart(tmp)
  }

  const xoaSanPham = (id)=>{
    let tmp = cart.slice(0)
    let vitrixoa = 0
    tmp.map((item, index)=>{
      if(item.IdSanPham == id)
        vitrixoa = index
    })
    tmp.splice(vitrixoa, 1) //Xoa 1 san pham o vi tri xoa
    setCart(tmp)
  }

  return (
      <View style={styles.container}>
        <StatusBar barStyle='light-content' translucent backgroundColor={'transparent'} ></StatusBar>
        <View style={styles.topdock}></View>
        <Text style={styles.topTxt}>My Bag</Text>
        <FlatList
          style={styles.scroller}
          data={cart}
          renderItem = {({item})=>(
            <CartItem 
            itemImage = {{uri: item.HinhAnh[0]}}
            itemName={item.TenSanPham}
            itemDescription={'Anime: ' + item.TenAnime}
            value={item.SoLuongMua}
            oldPrice={item.GiaBan}
            price={item.GiaBan * (1 - item.GiamGia)}
            onPlusPress = {()=>tangSoLuong(item.IdSanPham)}
            onMinusPress = {()=>giamSoLuong(item.IdSanPham)}
            onDeletePress={()=>xoaSanPham(item.IdSanPham)}/>
          )}
          keyExtractor={item=>item.IdSanPham}
        />
        <View style={styles.total}>
          <Text style={styles.totalTxt}>Thành Tiền{'  '}</Text>
          <Text style={styles.totalpriceTxt}>{tongTien + ' '}VND{'  '}</Text>
        </View>
        <TouchableOpacity style={[styles.commandBtn, cart.length <= 0 ?{backgroundColor:GREY}:{backgroundColor:DARK_PRIMARY_COLOR} ]} 
          disabled={cart.length == 0} 
          onPress={()=>navigation.navigate('CheckOut')}>
          <Text style={styles.commandTxt}> Tiến Hành Đặt Hàng{'   '}</Text>
        </TouchableOpacity>
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
  topTxt:{
    fontWeight:'bold',
    fontSize:30,
    marginLeft:'5%'
  },
  scroller:{
    //backgroundColor:BLACK,
    marginTop:40
  },
  commandBtn:{
    borderRadius:50,
    backgroundColor:DARK_PRIMARY_COLOR,
    alignItems:'center',
    height:50,
    justifyContent:'center',
    margin:10,
    padding:10,
    elevation:5
  },
  commandTxt:{
    color:WHITE,
    fontSize:18,
    fontWeight:'bold',
  },
  total:{
    //backgroundColor:PRIMARY_COLOR,
    height:50,
    width:'90%',
    alignSelf:'center',
    alignItems:'center',
    flexDirection:'row',
    justifyContent:'space-between',
    borderTopWidth:1,
    borderColor:GREY,
    marginTop:10
  },
  totalTxt:{
    color:GREY,
    fontSize:15
  },
  totalpriceTxt:{
    fontSize:20,
    fontWeight:'bold',
    color:DARK_PRIMARY_COLOR
  },
})
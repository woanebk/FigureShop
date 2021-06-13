import react from 'react';
import React, { Component } from 'react';
import { useContext, useState } from 'react';
import { useEffect } from 'react';
import { View, Text, Image, StyleSheet, StatusBar, ScrollView, Button } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Badge, IconButton } from 'react-native-paper';
import Swiper from 'react-native-swiper/src';
import CartContext from '../CartContext';
import {PRIMARY_COLOR, DARK_PRIMARY_COLOR, GREY, WHITE, BLACK} from '../common';
import {firebaseApp} from '../firebaseconfig'
import BottomSheet from 'reanimated-bottom-sheet';
import { Ionicons } from '@expo/vector-icons';

export default function ItemDetailScreen ({route, navigation}){
  const {anime_ID}= route.params; 
  const {sanpham_ID}= route.params;

  const [sanPham,setSanPham] = useState({}) // initial object tranh loi
  const [tenAnime, setTenAnime] = useState('')
  const [hinhAnhs, setHinhAnhs] = useState([])

  const {cart, setCart} = useContext(CartContext)

  const bottomsheetRef = React.createRef(); //reference attached to bottomsheet
  useEffect (()=>{
    navigation.setOptions({
      headerRight:()=>( 
        <View style={{marginLeft:10}}>
          <IconButton icon="shopping" onPress = {()=>navigation.navigate('Cart')}
          color = {PRIMARY_COLOR} size={25}/>
          <Badge visible={cart.length>0} size={15} style={styles.badge}>{cart.length}</Badge>
        </View>
      ),
    })
    navigation.addListener('focus', () => {getSanPham() ; getTenAnime()} )
  })

  const getSanPham = async () => {
    firebaseApp.database().ref('Anime/' + anime_ID + '/SanPham/' + sanpham_ID).once('value', (snapshot)=>{
      if( snapshot.exists())
      {
        setSanPham(snapshot.val())
        setHinhAnhs(snapshot.val().HinhAnh)
      }
    })
  }

  const getTenAnime = async () => {
    firebaseApp.database().ref('Anime/' + anime_ID).once('value', (snapshot)=>{
      if( snapshot.exists())
      {
        setTenAnime(snapshot.val().TenAnime)
      }
    })
  }

  const renderSlides = () => {
    return hinhAnhs.map(element=>(
      <View  key = {element}>
          <Image style={styles.swiperImg}
              source ={{uri: element}}
              resizeMode='cover'
            />
        </View>
    ))
  }

  //RENDER BOTTOM SHEET:
  const renderSheet = ()=>(
    <View style={styles.bottomsheetWrapper}>
      <View style={{width:'90%'}}>
      <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
          <Ionicons name='checkmark-circle-outline' size={20}></Ionicons>
          <Text style={{width:270, fontWeight:'bold'}}>Sản phẩm đã được thêm vào giỏ hàng</Text>
          <IconButton icon = 'close' onPress={()=>bottomsheetRef.current.snapTo(0)}></IconButton>
        </View>
        <View style={{flexDirection:'row'}}>
          <Image style={{width:60, height:60, marginLeft:10}} source={{uri:hinhAnhs[0]}}></Image>
          <View style={{flex:1, paddingLeft:20}}>
            <Text numberOfLines={2}>{sanPham.TenSanPham}</Text>
            <View style={{flexDirection:'row', alignItems:'center'}}>
              <Text style={{color:GREY, fontSize:11}}>{'Anime:  '}</Text>
              <Text style={{width:300}}>{tenAnime}</Text>
            </View>
            
            <Text style={{fontWeight:'bold'}}>{sanPham.GiaBan*(1 - sanPham.GiamGia) + ' VNĐ'}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.commandBtn} onPress={()=>navigation.navigate('Cart')}>
          <Text style={styles.commandTxt}>Xem Giỏ Hàng</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
  const renderSheetHeader = ()=>(
    <View style={styles.header}>
        <View style={styles.panelHandle}></View>
    </View>
  )

  const addToCart = (idSanPham)=>{
    if(cart.length > 0 && cart.some(item => item.IdSanPham == idSanPham) )
    {
      let tmp = cart.slice(0)
      tmp.map((item)=>{
        if(item.IdSanPham == idSanPham)
        {
          if (item.SoLuongMua >= item.TonKho)
            alert('Sản phẩm trong kho không đủ để thêm')
          else
          {
            item.SoLuongMua += 1
            bottomsheetRef.current.snapTo(1)
          }
        }
      })
      setCart(tmp)
    }
    else
    {
      bottomsheetRef.current.snapTo(1)
      setCart(cart => [...cart, {
        IdSanPham:idSanPham,
        SoLuongMua: 1,
        TenSanPham: sanPham.TenSanPham,
        TenAnime: tenAnime,
        TenNhanVat: sanPham.TenNhanVat,
        GiaBan: sanPham.GiaBan,
        GiamGia: sanPham.GiamGia,
        TonKho: sanPham.SoLuong,
        HinhAnh: sanPham.HinhAnh,
        IdAnime: anime_ID,
      }])
    }
    
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle='light-content' translucent/>
      <View style={styles.swiperWrapper}>
        <Swiper>
          {renderSlides()}
        </Swiper>
      </View>
    {/*=============== Info =====================*/}
      <View style={styles.itemInfoWrapper}>
        {/* ==============Ten San Pham */}
        <View style={styles.itemNameWrapper}>
            <Text style={styles.itemNameTxt} numberOfLines={2}>{sanPham.TenSanPham}</Text>
            <Text style={{ fontSize:15, paddingHorizontal:3, color:GREY,}} >Manga/Anime: {' ' + tenAnime}</Text>
            <Text style={{ fontSize:15, paddingHorizontal:3, color:GREY,}} >Nhân vật: {' ' + sanPham.TenNhanVat}</Text>
            <View style={styles.saleTag}>
              <Text style={styles.saleTagTxt}> {'-' + sanPham.GiamGia*100 +'%'}</Text>
            </View>
        </View>

        {/* ==============Gia San Pham */}
        <View style={styles.itemPriceWrapper}>
          <View style={{flex:1, justifyContent:'center' }}>
            <Text style={{fontSize:20, fontWeight:'bold', left:17}} > Giá Bán </Text>
          </View>
          <View style={styles.itemPrice}>
            <Text style={styles.itemSalePriceTxt}> {sanPham.GiaBan}</Text>
            <Text style={styles.itemPriceTxt}>{sanPham.GiaBan * (1 - sanPham.GiamGia) + ' VNĐ'}</Text>
          </View>
        </View>

        {/* ============== Thong so chi tiet San Pham */}
        <View style={styles.itemDetailWrapper}>
          <Text style={{fontSize:18, fontWeight:'bold'}}> Thông số kỹ thuật </Text>
          <View style={{flex:1, flexDirection:'row'}}>
          <View style={styles.itemDetail}>
            <Text style={styles.itemDetailTxt} >Chiều Cao: {sanPham.ChieuCao} cm </Text>
            <Text style={styles.itemDetailTxt} >Chiều Dài: {sanPham.ChieuDai} cm</Text>
            <Text style={styles.itemDetailTxt} >Chiều Rộng: {sanPham.ChieuRong} cm</Text>
          </View>
          <View style={styles.itemDetail}>
            <Text style={styles.itemDetailTxt} >Cân nặng: {sanPham.CanNang} kg</Text>
            <Text style={styles.itemDetailTxt} >Chất Liệu: {sanPham.ChatLieu} </Text>
          </View>
          </View>
        </View>

        {/* ============== Mo ta */}
        <View style={styles.itemDescriptionWrapper}>
        <Text style={{fontSize:18, fontWeight:'bold'}}> Mô tả </Text>
          <ScrollView style={{height:'100%'}}>
            <Text style={styles.itemDescriptionTxt} >{sanPham.MoTa}</Text>
          </ScrollView>
        </View>
      </View>
    {/*============== Buy Button =================*/}
      <View style={styles.buyWrapper}>
        <View style={styles.buyBtn} >
          <TouchableOpacity style={{color:PRIMARY_COLOR}} title='OK' onPress={()=>{addToCart(sanpham_ID)}}>
            <Text style={styles.btnText}>THÊM VÀO GIỎ HÀNG</Text>
          </TouchableOpacity>
        </View>
      </View>
      <BottomSheet 
      ref={bottomsheetRef}
      snapPoints={[0, 250]}
      initialSnap={0} //0 is 0, 1 is 300
      enabledGestureInteraction={true}
      enabledContentGestureInteraction={false}
      renderContent={renderSheet}
      renderHeader={renderSheetHeader}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    backgroundColor:'#fff',
    flex:1,
  },
  swiperWrapper:{
    flex:4,
    borderBottomLeftRadius:40,
    borderBottomRightRadius:40,
  },
  swiperImg:{
    width:'100%',
    height:'100%',
    borderBottomLeftRadius:40,
    borderBottomRightRadius:40,
  },
  itemInfoWrapper:{
    flex:5,
  },
  itemNameWrapper:{
    paddingHorizontal:20,
    marginTop:10,
    height:100,
  },
  itemNameTxt:{
    fontSize:25,
    fontWeight:'bold',
    width:'75%', 
    lineHeight:25,
    backgroundColor:BLACK
  },
  saleTag:{
    position:'absolute',
    width:70,
    height:70,
    backgroundColor:'#ffc726',
    borderRadius:50,
    alignSelf:'center',
    top:-40,
    right:30,
    justifyContent:'center',
    elevation:3,
  },
  saleTagTxt: {
    fontSize:20,
    fontWeight:'bold',
    color:'#fff',
    //alignSelf:'center',
  },
  itemPriceWrapper:{
    height:60,
    flexDirection:'row',
    alignItems:'center',
  },
  itemPrice:{//the tag inside
    flex:1.5,
    flexDirection:'row',
    borderTopLeftRadius:50,
    borderBottomLeftRadius:50,
    backgroundColor:PRIMARY_COLOR,
    height:'70%',
    justifyContent:'center',
    alignItems:'center',
  },
  itemPriceTxt:{
    fontSize:18,
    color:'#fff',
    fontWeight:'bold',
    left:10,
    textAlign:'left',
    flex:1,
  },
  itemSalePriceTxt:{
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    fontWeight:'bold',
    color:'#000',
    fontSize:13,
    marginLeft:15
  },
  itemDetailWrapper:{
    paddingLeft:18,
    height:75
  },
  itemDetail:{ //View inside of Item Detail wrapper
    flex:1,
  },
  itemDetailTxt:{
    fontSize:14, 
    paddingHorizontal:5,
    color:GREY,
  },
  itemDescriptionWrapper:{
    paddingHorizontal:20,
    marginTop:20,
    flex:3,
  },
  itemDescriptionTxt:{
    fontSize:14, 
    paddingHorizontal:3,
    color:GREY,
    height:'100%',
    //backgroundColor:BLACK
  },
  buyWrapper:{
    backgroundColor:'#fff',
    flex:1,
    justifyContent:'center',
  },
  buyBtn:{
    height:'65%',
    backgroundColor:PRIMARY_COLOR,
    borderRadius:10,
    width:'90%',
    alignSelf:'center',
    justifyContent: 'center',
    elevation:5,
  },
  btnText:{
    fontSize:20,
    color:'#fff',
    fontFamily:'sans-serif',
    alignSelf:'center',
  },
  badge: {
    bottom:5,
    left:5,
    position:'absolute'
  },
  commandBtn:{
    padding:15,
    borderRadius:5,
    backgroundColor:DARK_PRIMARY_COLOR,
    alignItems:'center',
    marginTop:20,
    marginHorizontal:10,
    height:50,
    justifyContent:'center',
  },
  commandTxt:{
    color:WHITE, 
    fontSize:18,
    fontWeight:'bold',
    textAlign:'center',
    width:'100%'
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
    borderBottomWidth:0
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
     height:250
  },
});
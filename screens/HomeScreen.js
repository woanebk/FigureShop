import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, StatusBar, TouchableOpacity, TouchableHighlightBase, FlatList, Button } from 'react-native';
import Swiper from 'react-native-swiper/src';

import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import {ItemCard, CategoryCard, Card} from '../items';
import { firebaseApp } from '../firebaseconfig';
import { ActivityIndicator } from 'react-native-paper';
import { BLACK, WHITE } from '../common';

export default function HomeScreen ({navigation}) {

  const [firstRun,setFirstRun]=useState(0);

  const [listAnime, setListAnime] = useState(); //chứa 4 Anime ra màn hình
  const [listSanPhamSale, setListSanPhamSale] = useState() // chứa 4 item sale
  const [listAllSanPham, setListAllSanPham] = useState([]) // chứa 4 item sale
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoadMore, setIsLoadMore] = useState(false)
  const itemsPerPage = 3

  useEffect(()=>{
    
    if(firstRun == 0){
      navigation.addListener('focus', () => {getSanPhamsSale(); getAnimes(); getAllSanPhams() } )
      
      setFirstRun((firstRun)=>firstRun += 1) //đánh dấu lần chạy đầu
    }
  }) 

  const getAnimes = async () => {
    let list=[];
    firebaseApp.database().ref('Anime').orderByChild('TrangThai').equalTo('on').limitToFirst(4).once('value', (snapshot)=>{
      if( snapshot.exists())
      {
        list = []; //reset list tránh trùng lặp
        snapshot.forEach((child)=>
        {
          list.push({
            key: child.key, 
            TenAnime: child.val().TenAnime, 
            HinhAnh:child.val().HinhAnh
          })
        })
        setListAnime(list)
      }
    })
  }

  const getSanPhamsSale = async () => {
    let list=[];
    firebaseApp.database().ref('Anime').orderByChild('TrangThai').equalTo('on').once('value', (snapshot)=>{
      if( snapshot.exists())
      {
        list = []; //reset list tránh trùng lặp
        snapshot.forEach((child)=>
        {
          if(child.val().SanPham) //day la object
          {
            var animename = child.val().TenAnime
            var idAnime = child.key
            for (let [key, value] of Object.entries(child.val().SanPham)) {
              if(value.TrangThai == 'on' && value.GiamGia > 0 && value.SoLuong > 0)
              {
                list.push({
                  IdSanPham : key,
                  TenAnime: animename,
                  IdAnime: idAnime,
                  TenSanPham: value.TenSanPham,
                  TenNhanVat : value.TenNhanVat,
                  GiaBan: value.GiaBan,
                  GiamGia: value.GiamGia,
                  HinhAnh:value.HinhAnh,
                })
              }
            }
          }
        })

        if(list.length >= 4){
          setListSanPhamSale(list.slice(0,4))
        }
        else{
          setListSanPhamSale(list.slice(0, list.length))
        }
      }
    })
  }

  const getAllSanPhams = () => {
    let list=[];
    firebaseApp.database().ref('Anime').orderByChild('TrangThai').equalTo('on').once('value', (snapshot)=>{
      if( snapshot.exists())
      {
        list = []; //reset list tránh trùng lặp
        snapshot.forEach((child)=> //child la anime
        {
          if(child.val().SanPham) //day la object
          {
            var animename = child.val().TenAnime
            var idAnime = child.key
            for (let [key, value] of Object.entries(child.val().SanPham)) {
              if(value.TrangThai == 'on')
              {
                list.push({
                  IdSanPham : key,
                  TenAnime: animename,
                  IdAnime: idAnime,
                  TenSanPham: value.TenSanPham,
                  TenNhanVat : value.TenNhanVat,
                  GiaBan: value.GiaBan,
                  GiamGia: value.GiamGia,
                  HinhAnh:value.HinhAnh,
                  SoLuong:value.SoLuong,
                  MoTa: value.MoTa,
                  GiaGoc:value.giaGoc
                })
              }
            }
          }
        })
        setListAllSanPham(list.slice(0, currentPage * itemsPerPage ))
        setIsLoadMore(false)
      }
    })
  }

  const renderSwiper = ()=>(
    <View style={styles.slidercontainer}>
      <Swiper height={200} activeDotColor='#FF6347' autoplay={true} showsButtons={false}>
        <View style={styles.slide}>
          <Image style={styles.sliderimage}
          source ={require('../assets/banner/naruto_swiper_1.jpg')}
          resizeMode='cover'
          ></Image>
        </View>

        <View style={styles.slide}>
          <Image style={styles.sliderimage}
          source ={require('../assets/banner/op_swiper_1.jpg')}
          resizeMode='cover'
          ></Image>
        </View>

        <View style={styles.slide}>
          <Image style={styles.sliderimage}
          source ={require('../assets/banner/dbz_swiper_1.jpg')}
          resizeMode='cover'
          ></Image>
        </View>
      </Swiper>
      </View>
  )
  const renderFooter = ()=>{
    if(isLoadMore) return(
      <ActivityIndicator style={{height:40}} animating={true} size='large'></ActivityIndicator>
    )
    else return(
      null)
  }

  const handleLoadMore= () => {
      setIsLoadMore(true)
      setCurrentPage(currentPage=>currentPage += 1)
      getAllSanPhams()
      console.log(currentPage)
   
  }
  
  return (
    <ScrollView style = {styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'transparent'}></StatusBar>
      {renderSwiper()}
      {/* ============ character categories ========== */}
      <Text style={styles.subjectsTxt}>Giới Thiệu Cửa Hàng</Text>
      <View style={styles.categoryContainer}>
        <Image resizeMode='stretch' style={{height:150, width:'100%',  backgroundColor:BLACK, opacity:0.6,}}
          source ={require('../assets/banner/mainbanner.jpg')}>
        </Image>
        <View style={{position:'absolute', left:10,width:230, height: 120, paddingLeft:5, top:10, borderRadius:5}}>
          <Text style={{color:WHITE, fontSize:17, fontWeight:'bold'}}>Sản phẩm chính hãng từ Nhật Bản</Text>
          <Text style={{color:WHITE, fontSize:13, height:100}}>Figure Shop là thiên đường với những tín đồ theo đuổi thật sự, đam mê vẻ đẹp cao cấp đầy mê hoặc của Nhật Bản</Text>
        </View>
        {/* <TouchableOpacity onPress = {()=>{navigation.navigate('CategoryItems',{categoryName:'Dragon Ball'})}}>
          <View style={styles.categoryIcon}>
            <Ionicons name='sad' size={30} color='#FF6347'></Ionicons>
          </View>
          <Text style={styles.categoryText}> Goku</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress = {()=>{console.log(listAnime)}}>
          <View style={styles.categoryIcon}>
            <Ionicons name='happy' size={30} color='#FF6347'></Ionicons>
          </View>
          <Text style={styles.categoryText}> Naruto</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress = {()=>{}}>
          <View style={styles.categoryIcon}>
            <Ionicons name='scan' size={30} color='#FF6347'></Ionicons>
          </View>
          <Text style={styles.categoryText}> Luffy</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress = {()=>{}}>
          <View style={styles.categoryIcon}>
            <Ionicons name='scan' size={30} color='#FF6347'></Ionicons>
          </View>
          <Text style={styles.categoryText}> Sasuke</Text>
        </TouchableOpacity> */}

      </View>

      {/*========= SaleCard */}
      <Text style={styles.subjectsTxt}> Sale đặc biệt</Text>
      <FlatList
        style={styles.saleCardsContainer} horizontal={true}
        data={listSanPhamSale}
        renderItem = {({item})=>(
          <TouchableOpacity style={styles.salecardWrapper} onPress={()=>navigation.navigate('ItemDetail', {anime_ID: item.IdAnime, sanpham_ID: item.IdSanPham})}>
            <ItemCard name = {item.TenSanPham} nhanvat={item.TenNhanVat} 
              image={{uri: item.HinhAnh?item.HinhAnh[0]:{} }}
              giamgia={item.GiamGia}
              giaban={item.GiaBan}
              ></ItemCard>
          </TouchableOpacity>
        )}
        keyExtractor={item=>item.IdSanPham}
        showsHorizontalScrollIndicator={false}
      />
      {/* ============ CategoryCard */}
      <Text style={styles.subjectsTxt}> Danh mục Truyện tranh/Anime</Text>
      <FlatList
        style={styles.categoryCardsContainer} horizontal={true}
        data={listAnime}
        renderItem = {({item})=>(
            <CategoryCard style={{padding:5}}
              name={item.TenAnime} image={{uri:item.HinhAnh}}
              onPress = {()=>{navigation.navigate('CategoryItems',{animeID:item.key})}}
            ></CategoryCard>
        )}
        keyExtractor={item=>item.key}
        showsHorizontalScrollIndicator={false}
      />

      {/*========== Best Seller Cards */}
      
      <Text style={styles.subjectsTxt}> Best Seller</Text>
      <FlatList
        style={styles.cardContainer}
        data={listAllSanPham}
        renderItem = {({item})=>(
          <TouchableOpacity onPress={()=>navigation.navigate('ItemDetail')}>
            <Card title={item.TenSanPham} description={item.MoTa}
             giaban={item.GiaBan*(1-item.GiamGia)+' VND'}
             giagoc={item.GiaGoc}
             itemSalePrice='23'
             giamgia={item.GiamGia}
             itemImage={{uri:item.HinhAnh[0]}}></Card>
          </TouchableOpacity>
        )}
        ListFooterComponent={renderFooter}
        //onEndReached={handleLoadMore}
        onEndReachedThreshold={0}
        keyExtractor={item=>item.IdSanPham}
      />
    </ScrollView>
    
  );
}

var styles = StyleSheet.create({
  wrapper: {
  },
  container:{
    flex:1,
    backgroundColor:'#fff'
  },
  slidercontainer:{
    height:180,
    width:'90%',
    marginTop:10,
    justifyContent:'center',
    alignSelf:'center',
    borderRadius:8,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius:8,
  },
  sliderimage:{
    height:'100%',
    width:'100%',
    alignSelf:'center',
    borderRadius:8,
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold'
  },
  categoryContainer:{
    flexDirection:'row',
    width:'100%',
    alignSelf:'center',
    justifyContent:'space-around',
    marginTop:15,
  },
  categoryIcon:{
    borderWidth:0,
    alignItems:'center',
    justifyContent:'center',
    alignSelf:'center',
    width:60,
    height:60,
    backgroundColor:'#f5c4bc',
    borderRadius:50,
  },
  categoryText:{
    fontSize:13,
    marginTop:5,
    alignSelf:'center',
    color: '#FF6347',
    fontFamily:'sans-serif'
  },
  cardContainer:{
    width:'90%',
    alignSelf:'center',
    flex:1
  },
  subjectsTxt:{
    fontSize:17, 
    fontWeight:'bold', 
    textAlign:'left',
    marginTop:15,
    marginLeft:'5%'
  },
  saleCardsContainer:{
    height:300,
    marginLeft:'5%',
    backgroundColor:'#fff'
  },
  categoryCardsContainer:{
    height:130,
    marginLeft:'5%',
    backgroundColor:'#fff',
    marginTop:10
  },
  categoryCardWrapper:{
    
  },
  salecardWrapper:{
    padding:10,
    paddingLeft:0,
  }
})
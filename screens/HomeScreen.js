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

  const [listAnime, setListAnime] = useState([]); //chứa 4 Anime ra màn hình
  const [listSanPhamSale, setListSanPhamSale] = useState([]) // chứa 4 item sale
  const [listAllSanPham, setListAllSanPham] = useState([]) 
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoadMore, setIsLoadMore] = useState(false)

  useEffect(()=>{
    
    if(firstRun == 0){
      navigation.addListener('focus', () => {getSanPhamsSale(); getAnimes();} )
      getBestSeller()
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

  const getBestSeller = async ()=>{
    var tk = []
    await firebaseApp.database().ref('Guest').orderByChild('TrangThai').equalTo('on').once('value', (snapshot)=>{
      if(snapshot.exists())
      {
      for (let [sdt_key, sdt_value] of Object.entries(snapshot.val() )) {
        if(sdt_value.TrangThai == 'on' && sdt_value.DonHang)
        {
            for (let [donhang_key, donhang_value] of Object.entries(sdt_value.DonHang )) {
                if(donhang_value.TrangThai == 'on' && donhang_value.SanPhamMua )
                {
                    for (let [sanphammua_key, sanphammua_value] of Object.entries(donhang_value.SanPhamMua )){
                        const vitri = checkSanPhamExistInArr(tk, sanphammua_value.IdSanPham)
                        if(vitri == -1)
                        {
                            tk.push({
                                    IdSanPham:sanphammua_value.IdSanPham,
                                    IdAnime: sanphammua_value.IdAnime,
                                     SoLuong: sanphammua_value.SoLuongMua,
                                     TenAnime:sanphammua_value.TenAnime,
                                    })
                         }
                        else
                            tk[vitri].SoLuong += sanphammua_value.SoLuongMua

                    }
                }
              }
        }
      }
      if(tk.length > 1) tk.sort((a, b) => parseFloat(b.SoLuong) - parseFloat(a.SoLuong)); //sap xep tang dan
    if(tk.length > 10) tk.slice(0,9)
    
  }
  
    })
    
    tk.forEach(async(item)=>{
      await firebaseApp.database().ref('Anime/'+item.IdAnime+'/SanPham/'+item.IdSanPham).once('value',spSnapshot=>{
        if(spSnapshot.exists()){
          const vt = checkSanPhamExistInArr(tk, item.IdSanPham)
          if(vt != -1){
            tk[vt].TenSanPham = spSnapshot.val().TenSanPham
            tk[vt].HinhAnh = spSnapshot.val().HinhAnh[0]
            tk[vt].TenNhanVat = spSnapshot.val().TenNhanVat
            tk[vt].GiaBan = spSnapshot.val().GiaBan
            tk[vt].GiamGia = spSnapshot.val().GiamGia
            tk[vt].TonKho = spSnapshot.val().SoLuong
          }
        }
      })
    })
    setListAllSanPham(tk)
  }

  const checkSanPhamExistInArr = (arr, idsp)=>{ //Neu tim ra return vi tri trong array, ko tim ra return -1
    var found = -1 ; 
    for(var i = 0; i < arr.length; i++) {
        if (arr[i].IdSanPham == idsp) {
            found = i;
            break;
        }
    }
    return found
  }

  const renderSwiper = ()=>(
    <View style={styles.slidercontainer}>
      <Swiper height={200} activeDotColor='#FF6347' autoplay={true} showsButtons={false}>
        <View style={styles.slide}>
          <Image style={styles.sliderimage}
          source ={require('../assets/banner/banner3.jpg')}
          resizeMode='stretch'
          ></Image>
        </View>

        <View style={styles.slide}>
          <Image style={styles.sliderimage}
          source ={require('../assets/banner/banner2.jpg')}
          resizeMode='stretch' 
          ></Image>
        </View>

        <View style={styles.slide}>
          <Image style={styles.sliderimage}
          source ={require('../assets/banner/banner4.jpg')}
          resizeMode='stretch'
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
          <TouchableOpacity onPress={()=>navigation.navigate('ItemDetail', {anime_ID: item.IdAnime, sanpham_ID: item.IdSanPham})}>
            <Card title={item.TenSanPham}
             nhanvat={item.TenNhanVat}
             anime={item.TenAnime}
             itemImage={{uri:item.HinhAnh}}></Card>
          </TouchableOpacity>
        )}
        //ListFooterComponent={renderFooter}
        //onEndReached={handleLoadMore}
        //onEndReachedThreshold={0}
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
    width:'96%',
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
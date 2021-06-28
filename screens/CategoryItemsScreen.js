import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions , StyleSheet, Image, StatusBar, TouchableOpacity, Button, FlatList } from 'react-native';
import { ImageHeaderScrollView, TriggeringView } from 'react-native-image-header-scroll-view';
import { WHITE } from '../common';
import { firebaseApp } from '../firebaseconfig';
import { BigItemCard } from '../items';

export default function CategoryItemsScreen({route, navigation}) {

  //get data passed from previous screen
  const {animeID}= route.params; //id of the Anime (must same name with parameter)

  const [firstRun,setFirstRun]=useState(0);

  const [bannerImage, setBannerImage] = useState('');
  const [bannerName, setBannerName] = useState('');
  const [listSanPham, setListSanPham] = useState([]);

  useEffect(()=>{
    if(firstRun == 0)
    {
      navigation.addListener('focus', () => {getSanPham(); getBanner()} )
      
      setFirstRun((firstRun)=>firstRun += 1) //đánh dấu lần chạy đầu
    }
  })

  const getBanner = ()=>{
    firebaseApp.database().ref('Anime').orderByKey().equalTo(animeID).limitToFirst(1).once('value', (snapshot)=>{
      if( snapshot.exists())
      {
        snapshot.forEach((child)=>
        {
          setBannerName(child.val().TenAnime)
          setBannerImage(child.val().HinhAnh)
        })
      }
    })
  }

  const getSanPham = async () => {
    let list = []
    firebaseApp.database().ref('Anime/' + animeID + '/SanPham').orderByChild('TrangThai').equalTo('on').once('value', (snapshot)=>{
      if( snapshot.exists())
      {
        list = [] //reset list tranh loi
        for (let [key, value] of Object.entries(snapshot.val()))
        {
          if(value.SoLuong > 0)
            list.push({
              IdSanPham: key,
              TenSanPham: value.TenSanPham,
              TenNhanVat : value.TenNhanVat,
              GiaBan: value.GiaBan,
              GiamGia: value.GiamGia,
              HinhAnh:value.HinhAnh
            })
        }
        setListSanPham(list)
      }
    })
  }

  return (
      <View style={styles.container}>
        <StatusBar barStyle='light-content' translucent></StatusBar>
        <ImageHeaderScrollView
          maxHeight={350}
          minHeight={220}
          headerImage={{uri:bannerImage}}
          //Shadow Opacity when scrolling
          maxOverlayOpacity={0.6}
          minOverlayOpacity={0.3}
          renderForeground={()=>(
            <View style={styles.categoryName}>
              <Text style={styles.categoryNameTxt}>{bannerName +'  '}</Text>
            </View>
          )}
        >
          <View style={{ height:550 }}>
            <TriggeringView>
              <FlatList style={styles.list}
                numColumns= {2}
                data={listSanPham}
                renderItem = {({item})=>(
                  <BigItemCard name = {item.TenSanPham} nhanvat= {item.TenNhanVat}
                  image={{uri: item.HinhAnh[0]}}
                  giamgia={item.GiamGia}
                  giaban={item.GiaBan}
                  onPress = {()=>navigation.navigate('ItemDetail', {anime_ID: animeID, sanpham_ID: item.IdSanPham})}
                  ></BigItemCard>
                )}
                keyExtractor={item=>item.IdSanPham}
              />
            </TriggeringView>
          </View>
          </ImageHeaderScrollView>
      </View>
  );
}

var styles = StyleSheet.create({
  container:{
    height:'100%',
    textAlign:'center'
  },
  categoryName:{
    justifyContent:'center',
    flex:1,
    alignItems:'center',
  },
  categoryNameTxt:{
    fontSize:40,
    color:WHITE,
    fontWeight:'bold',
    width:'100%',
    textAlign:'center',
    marginLeft:20
    //backgroundColor:'#000'
  },
  list:{
    width:'100%',
    alignSelf:'center',
    backgroundColor:WHITE
  },
})
import react from 'react';
import React, {useState, useEffect, useLayoutEffect } from 'react';
import { ListItem } from '../items';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar,FlatList } from 'react-native';
import { AwesomeTextInput } from 'react-native-awesome-text-input';
import { firebaseApp } from '../firebaseconfig';
import { SearchBar } from 'react-native-elements';
import { Card } from '../items';

export default function SearchScreen ({navigation}){

  const [listSanPham,setListSanPham]=useState();
  const [firstRun,setFirstRun]=useState(0); // Lần chạy đầu tiên useEffect sẽ gọi get Anime để đăng kí listenr dữ liệu (Những lần useEffect sau sẽ bỏ qua- tránh lỗi infinite loop)
  const [dialogVisable, setDialogVisable]=useState(false); // true thì hiện dialog, false thì ẩn
  const [deleteSanPhamID, setDeleteSanPhamID] = useState(''); //id sản phẩm để xóa
  const [deleteAnimeID, setDeleteAnimeID] = useState(''); //id anime để xóa
  const [search,setsearch]=useState(null)
  useEffect(()=>{
    if(firstRun == 0){
      navigation.addListener('focus', () => {getSanPhams()})
      setFirstRun((firstRun)=>firstRun += 1) //đánh dấu lần chạy đầu
    }
    if(deleteAnimeID !== '' || deleteAnimeID !== '')
      openDialog(); //callback khi nhấn chọn delete
  }) 
  
  const getSanPhams = () => {
    let list=[];
    firebaseApp.database().ref('Anime').orderByChild('TrangThai').equalTo('on').once('value', (snapshot)=>{
      if( snapshot.exists())
      {
        //console.log(snapshot)
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
                  SoLuong:value.SoLuong
                })
              }
            }
          }
        })
        setListSanPham(list)
      }
    })
  }

  return (
    <View style={{backgroundColor:'#fff'}} >
      <StatusBar barStyle='dark-content'></StatusBar>
      <View style={styles.searchbarWrapper}>
      <SearchBar style={styles.searchbarWrapper}
        placeholder="Nhập tên sản phẩm cần tìm"
        onChangeText={search=>setsearch(search)}
        value={search}
      />
      </View>
      <View style={styles.searchItemWrapper}>
      
      <FlatList style={styles.list}
        data={listSanPham}
        renderItem = {({item})=>(
          <ListItem image={item.HinhAnh?{uri:item.HinhAnh[0]}:{} } 
            name = {item.TenSanPham} 
            description={'Anime: ' + item.TenAnime}
            phoneNumber = {'Tồn Kho: ' + item.SoLuong}
            price={item.GiaBan * (1 - item.GiamGia)}
           onPress={()=>navigation.navigate('ItemDetail', {anime_ID: item.IdAnime, sanpham_ID: item.IdSanPham})}
          ></ListItem>
        )}
        keyExtractor={item=>item.IdSanPham}
        showsVerticalScrollIndicator={false}
      />
            </View>
    </View>
  );
}


const styles = StyleSheet.create({
  searchbarWrapper:{
    marginTop: 10,
    width:'90%',
    height:50,
    alignSelf:'center',
  },
  searchItemWrapper:{
    width:'90%',
    alignSelf:'center',

  marginBottom:10
  },
});
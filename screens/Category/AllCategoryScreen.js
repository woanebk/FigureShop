import React, {useState, useEffect } from 'react';
import { View,StyleSheet, StatusBar, FlatList, Image, Text } from 'react-native';
import { BLACK, PRIMARY_COLOR, WHITE} from '../../common';
import { CategorySmallCard, ListItem } from '../../items';
import { firebaseApp } from '../../firebaseconfig';

export default function AllCategoryScreen({navigation}) {

  const [listAnime,setListAnime]=useState();
  const [firstRun,setFirstRun]=useState(0); // Lần chạy đầu tiên useEffect sẽ gọi get Anime để đăng kí listenr dữ liệu (Những lần useEffect sau sẽ bỏ qua- tránh lỗi infinite loop)
  
  useEffect(()=>{
    if(firstRun == 0){
      getAnimes()
    setFirstRun((firstRun)=>firstRun += 1) //đánh dấu lần chạy đầu
      }
  }) 

  const getAnimes = () => {
    let list=[];
    firebaseApp.database().ref('Anime').orderByChild('TrangThai').equalTo('on').on('value', (snapshot)=>{
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

  return (
    <View style={styles.container}>
      <StatusBar barStyle='dark-content' translucent></StatusBar>
      <View style={styles.banner}>
        <Image style={styles.bannerImg} source={{
          uri: 'https://firebasestorage.googleapis.com/v0/b/figureshop-9cdf3.appspot.com/o/images%2Fcategory%2FAnimeBanner.jpg?alt=media&token=c67c2a50-8672-4b07-980e-7c2754c47646',
        }}></Image>
        <Text style= {styles.bannerTxt}>Danh Mục Anime</Text>
      </View>
        {/* <View style={styles.topdock}></View> */}
      <FlatList style={styles.list}
        data={listAnime}
        renderItem = {({item})=>(
            <CategorySmallCard name={item.TenAnime} image={{uri:item.HinhAnh}}
            onPress = {()=>{navigation.navigate('CategoryItemsTab2',{animeID:item.key})}}
            ></CategorySmallCard>
        )}
        keyExtractor={item=>item.key}
        showsVerticalScrollIndicator={false}
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
    height:120,
    backgroundColor:PRIMARY_COLOR,
    borderBottomRightRadius:70
  },
  list:{
    width:'95%',
    alignSelf:'center',
    marginTop:20
  },
  banner:{
      height:150,
  },
  bannerImg:{
    width:'100%',
    height:'100%',
    backgroundColor:BLACK,
    opacity:0.7
  },
  bannerTxt:{
    fontSize:40,
    alignSelf:'center',
    bottom:'70%',
    fontWeight:'bold',
    color:WHITE,
  },
})
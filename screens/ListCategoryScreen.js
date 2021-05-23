import React, {useState, useEffect } from 'react';
import { View,StyleSheet, StatusBar, TouchableOpacity, FlatList, Button } from 'react-native';
import { GREY, OFF_WHITE, PRIMARY_COLOR, WHITE} from '../common';
import { ListItem } from '../items';
import { MaterialIcons } from '@expo/vector-icons';
import { firebaseApp } from '../firebaseconfig';

export default function ListCategoryScreen({navigation}) {

  const [listAnime,setListAnime]=useState();
  const [firstRun,setFirstRun]=useState(0); // Lần chạy đầu tiên useEffect sẽ gọi get Anime để đăng kí listenr dữ liệu (Những lần useEffect sau sẽ bỏ qua- tránh lỗi infinite loop)

  useEffect(()=>{
    let unmounted = false // biến unmounted đảm bảo sau khi thoát thì các hàm ko chạy nữa

    if (!unmounted) {
      if(firstRun == 0) 
      getAnimes()
    }

    return () => {
      unmounted = true
    }
  }) 

  const getAnimes = async() => {
    let list=[];
    await firebaseApp.database().ref('Anime').on('value', (snapshot)=>{
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
        setFirstRun((firstRun)=>firstRun += 1) //đánh dấu lần chạy đầu
        setListAnime(list)
      }
    })
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle='dark-content' translucent></StatusBar>
      <View style={styles.topdock}></View>
      <FlatList style={styles.list}
        data={listAnime}
        renderItem = {({item})=>(
          <ListItem image={{uri:item.HinhAnh}} name = {item.TenAnime} 
            onPress={()=>{ navigation.navigate('AddCategory',{readonly:true, itemID:item.key}) }}
            onDeletePress={()=>console.log('delete')}
          ></ListItem>
        )}
        keyExtractor={item=>item.key}
        showsVerticalScrollIndicator={false}
      />
      <TouchableOpacity onPress={()=>{navigation.navigate('AddCategory',{readonly:false})}} style={styles.newBtn}>
        <MaterialIcons name='add' size={30} color={WHITE} ></MaterialIcons>
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
    height:120,
    backgroundColor:PRIMARY_COLOR,
    borderBottomRightRadius:70
  },
  list:{
    width:'90%',
    alignSelf:'center'
  },
  newBtn:{
    position:'absolute',
    width:70,
    height:70,
    right:20,
    bottom:20,
    borderRadius:100,
    backgroundColor:PRIMARY_COLOR,
    justifyContent:'center',
    alignItems:'center',
    elevation:5
  },
})
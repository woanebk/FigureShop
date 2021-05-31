import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, StatusBar, TouchableOpacity } from 'react-native';
import { ImageHeaderScrollView, TriggeringView } from 'react-native-image-header-scroll-view';
import { WHITE } from '../common';
import { firebaseApp } from '../firebaseconfig';

export default function CategoryItemsScreen({route, navigation}) {

  //get data passed from previous screen
  const {animeID}= route.params; //id of the Anime (must same name with parameter)

  const [firstRun,setFirstRun]=useState(0);
  
  const [bannerImage, setBannerImage] = useState();
  const [bannerName, setBannerName] = useState('');

  useEffect(()=>{
    if(firstRun == 0)
    {
      getBanner()
      setFirstRun((firstRun)=>firstRun += 1) //đánh dấu lần chạy đầu
    }
  })

  const getBanner = ()=>{
    firebaseApp.database().ref('Anime').orderByKey().equalTo(animeID).limitToFirst(1).on('value', (snapshot)=>{
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

  return (
      <View style={styles.container}>
        <StatusBar barStyle='light-content' translucent></StatusBar>
        <ImageHeaderScrollView
          maxHeight={350}
          minHeight={100}
          headerImage={{uri:bannerImage}}
          //Shadow Opacity when scrolling
          maxOverlayOpacity={0.6}
          minOverlayOpacity={0.3}
          renderForeground={()=>(
            <View style={styles.categoryName}>
              <Text style={styles.categoryNameTxt}>{bannerName}</Text>
            </View>
          )}
        >
          <View style={{ height:1000 }}>
            <TriggeringView onHide={() => console.log("text hidden")}>
              <Text>Scroll Me ok!</Text>
            </TriggeringView>
          </View>
          </ImageHeaderScrollView>
      </View>
  );
}

var styles = StyleSheet.create({
  container:{
    height:'100%'
  },
  categoryName:{
    justifyContent:'center',
    flex:1,
    alignItems:'center',
  },
  categoryNameTxt:{
    fontSize:45,
    color:WHITE,
    fontWeight:'bold',
  },
})
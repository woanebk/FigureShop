import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, StatusBar, TouchableOpacity, TextInput, ActivityIndicator, ScrollView } from 'react-native';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import {IconButton, TouchableRipple } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { GREY, PRIMARY_COLOR, SECONDARY_COLOR, WHITE, LIGHT_GREY, DARK_PRIMARY_COLOR, BLACK } from '../common';
import * as ImagePicker from 'expo-image-picker';
import {firebaseApp} from '../firebaseconfig';
import Swiper from 'react-native-swiper/src';


export default function AddFigureScreen({route, navigation}) {
  //get data passed from previous screen
  const {readonly}= route.params; //true: add , fail: detail và edit !cannot change this!
  const {itemID}=route.params;
  const [firstRun,setFirstRun]=useState(0); // Lần chạy đầu tiên useEffect sẽ gọi get Anime để đăng kí listenr dữ liệu (Những lần useEffect sau sẽ bỏ qua- tránh lỗi infinite loop)

  const [editing, setEditing]=useState(!readonly); //Khi editting: enable input
  const [isLoading, setIsLoading]= useState(false);

  

  
  //Giao Dien:
  const bottomsheetRef = React.createRef(); //reference attached to bottomsheet
  const fall= new Animated.Value(1); //blur animation
  
  useEffect(()=>{
    // Thêm nút vào header
    navigation.setOptions({
      //Neu dang edit thi khong render nut (va nguoc lai)
       headerRight:(!editing)?()=>(<IconButton icon="pencil" onPress={() =>setEditing(true) }
       color = {WHITE} size={25}/>):null
      })

    if(readonly  && firstRun == 0)
    {

    }
  });

  //ASK PERMISSION:

  const uploadImage = async (uri)=>{
    const respone = await fetch(uri);
    const blob = await respone.blob();

    //location in database: dat ten file theo : ten loai san pham.jpg
    const ref = firebaseApp.storage().ref().child('images/category/' + categoryName +'.jpg');
    
    setIsLoading(true);
    
    return ref.put(blob);
  }
  //Data:

  //RENDER BOTTOM SHEET:
  const renderSheet = ()=>(
    <View style={styles.bottomsheetWrapper}>
      <Text style={styles.panelTitleTxt}>Upload Photo</Text>
      <Text style={styles.panelSubtitleTxt}>Chọn Ảnh Đại Diện</Text>
      <View style={{width:'90%'}}>
      <TouchableOpacity style={styles.commandBtn} onPress={()=>{}}>
          <Text style={styles.commandTxt}>Chụp Ảnh</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.commandBtn} onPress={()=>{}} >
          <Text style={styles.commandTxt}>Chọn Từ Kho Ảnh</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.commandBtn} 
        onPress={()=>bottomsheetRef.current.snapTo(0)}>
          <Text style={styles.commandTxt}>Hủy</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
  const renderSheetHeader = ()=>(
    <View style={styles.header}>
        <View style={styles.panelHandle}></View>
    </View>
  )

  const renderSwiper = ()=>(
    <View style={styles.slidercontainer}>
      <Swiper height={200} activeDotColor='#fff' autoplay={false} showsButtons={false}>
        <TouchableOpacity style={styles.slide} onPress={()=>{}}>
          <Image style={styles.sliderimage}
          source ={require('../assets/banner/naruto_swiper_1.jpg')}
          resizeMode='cover'
          ></Image>
        </TouchableOpacity>

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


  return (
    <View style={styles.container}>
      <StatusBar barStyle='dark-content' translucent></StatusBar>
      <BottomSheet 
      ref={bottomsheetRef}
      snapPoints={[0, 300]}
      initialSnap={0} //0 is 0, 1 is 300
      callbackNode={fall}
      enabledGestureInteraction={false}
      renderContent={renderSheet}
      renderHeader={renderSheetHeader}
      />
      <Animated.View style={{opacity: Animated.add(0.1, Animated.multiply(fall,1.0))}}>
        <View style={styles.topdock}></View>
        <ActivityIndicator animating={isLoading} color = '#bc2b78' size = "large"/>
        {renderSwiper()}
      </Animated.View>
    </View>
  );
}

var styles = StyleSheet.create({
  container:{
    height:'100%'
  },
  topdock:{
    height:120,
    backgroundColor:PRIMARY_COLOR,
    borderBottomRightRadius:50
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
  infoWrapper:{
    marginTop:20,
    width:'90%',
    alignSelf:'center',
    //backgroundColor:SECONDARY_COLOR,
  },
  commandBtn:{
    padding:15,
    borderRadius:10,
    backgroundColor:DARK_PRIMARY_COLOR,
    alignItems:'center',
    marginTop:10,
    height:50,
    justifyContent:'center',
  },
  commandTxt:{
    color:WHITE, 
    fontSize:18,
    fontWeight:'bold'
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
    alignItems:'center'
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
  },
  panelTitleTxt:{
    fontSize:25,
  },
  panelSubtitleTxt:{
    color:GREY,
    fontSize:13
  },
  hide:{
    display:'none'
  },
  loading:{
    position:'absolute',
    opacity:0.8,
    left:0,
    top:0,
    right:0,
    bottom:0,
    backgroundColor:'#000',
    zIndex:100
  }
})
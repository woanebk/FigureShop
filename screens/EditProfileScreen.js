import react from 'react';
import React, { Component, Dimensions, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, StatusBar, TouchableOpacity, TextInput } from 'react-native';
import { TouchableRipple, IconButton } from 'react-native-paper';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { GREY, PRIMARY_COLOR, SECONDARY_COLOR, WHITE, LIGHT_GREY, DARK_PRIMARY_COLOR } from '../common';
import UserPFP from '../components/UserPFP';
import * as ImagePicker from 'expo-image-picker';


export default function EditProfileScreen({navigation}) {

  const bottomsheetRef = React.createRef(); //reference attached to bottomsheet
  const fall= new Animated.Value(1); //blur animation
  
  const [image, setImage] = useState(null);

  //ASK PERMISSION:
  var library_status, cam_status;

  async function askLibraryPermission() {
    if (Platform.OS !== 'web') {
      //ask for library accesss:
      library_status = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (library_status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  }

  async function askCameraPermission() {
    if (Platform.OS !== 'web') {
      //ask for library accesss:
      cam_status = await ImagePicker.requestCameraPermissionsAsync();
      if (cam_status !== 'granted') {
        alert('Sorry, we need camera permissions to make this work!');
      }
    }
  }

  const pickImage = async () => {
    bottomsheetRef.current.snapTo(0)
    askLibraryPermission();
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Image,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  }

  const takePhoto = async () => {
    bottomsheetRef.current.snapTo(0)
    askCameraPermission();
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Image,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  }

  //RENDER BOTTOM SHEET:
  const renderSheet = ()=>(
    <View style={styles.bottomsheetWrapper}>
      <Text style={styles.panelTitleTxt}>Upload Photo</Text>
      <Text style={styles.panelSubtitleTxt}>Chọn Ảnh Đại Diện</Text>
      <View style={{width:'90%'}}>
      <TouchableOpacity style={styles.commandBtn} onPress={takePhoto}>
          <Text style={styles.commandTxt}>Chụp Ảnh</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.commandBtn} onPress={pickImage} >
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
      {/* =======Profile Picture Area */}
      <Animated.View style={{opacity: Animated.add(0.1, Animated.multiply(fall,1.0))}}>
      <View style={styles.topdock}></View>
      <TouchableOpacity style={styles.userpfp} onPress={()=>bottomsheetRef.current.snapTo(1)}>
          <View>
            <UserPFP image={require('../assets/banner/op_swiper_1.jpg')} ></UserPFP>
            <Ionicons style={styles.editpfpIcon} name='camera-outline' size={50} color={WHITE}></Ionicons>
            <View style={styles.editpfpBtn}>
              <Ionicons style={{alignSelf:'center'}} name='pencil' color='#fff' size={15} />
            </View>
          </View>
        </TouchableOpacity>

      <View style={styles.infoWrapper}>
        <Text style={styles.usernameTxt}> UserName</Text>

        <View style={styles.userInfo}>
          <Ionicons style={{alignSelf:'center'}} name='person' size={18} color={GREY}/>
          <TextInput style={styles.textInput} placeholder='Họ Tên'/>
        </View>

        <View style={styles.userInfo}>
          <Ionicons style={{alignSelf:'center'}} name='call' size={18} color={GREY}/>
          <TextInput style={styles.textInput} placeholder='Số Điện thoại' keyboardType='number-pad'/>
        </View>

        <View style={styles.userInfo}>
          <Ionicons style={{alignSelf:'center'}} name='location' size={18} color={GREY}/>
          <TextInput style={styles.textInput} placeholder='Địa Chỉ'/>
        </View>

        <View style={styles.userInfo}>
          <Ionicons style={{alignSelf:'center'}} name='mail' size={18} color={GREY}/>
          <TextInput style={styles.textInput} placeholder='Email' keyboardType='email-address'/>
        </View>
        
        <TouchableOpacity style={styles.commandBtn}>
          <Text style={styles.commandTxt}>Xác Nhận</Text>
        </TouchableOpacity>
      </View>
      </Animated.View>
      
    </View>
  );
}

var styles = StyleSheet.create({
  container:{
    height:'100%'
  },
  topdock:{
    height:180,
    backgroundColor:PRIMARY_COLOR,
    borderBottomRightRadius:70
  },
  userpfp:{
    position:'absolute',
    backgroundColor:'#000',
    borderRadius:60,
    left:'50%',
    marginLeft:-60, //margin half the width of PFP Picker
    top:120,
  },
  usernameTxt:{
    fontSize:25,
    alignSelf:'center',
    fontWeight:'bold'
  },
  editpfpBtn:{
    position:'absolute',
    width:30,
    height:30,
    borderRadius:30,
    borderWidth:2,
    borderColor:'#fff',
    backgroundColor:'#000',
    right:0,
    top:5,
    justifyContent:'center'
  },
  editpfpIcon:{
    position:'absolute',
    left:35,
    top:35
  },
  infoWrapper:{
    marginTop:70,
    width:'90%',
    alignSelf:'center',
    //backgroundColor:SECONDARY_COLOR,
  },
  userInfo:{
    height:30,
    alignSelf:'center',
    flexDirection:'row',
    marginTop:10,
    marginBottom:10,
    borderBottomWidth:1,
    borderBottomColor:LIGHT_GREY
  },
  textInput:{
    flex:1,
    paddingLeft:10,
    color:GREY
  },
  commandBtn:{
    padding:15,
    borderRadius:10,
    backgroundColor:DARK_PRIMARY_COLOR,
    alignItems:'center',
    marginTop:10,
    height:50,
    justifyContent:'center'
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
})
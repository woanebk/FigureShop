import react from 'react';
import React, { Component, Dimensions, useState, useEffect,ActivityIndicator } from 'react';
import { View, Text, StyleSheet, Image, StatusBar, TouchableOpacity, TextInput } from 'react-native';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { GREY, PRIMARY_COLOR, SECONDARY_COLOR, WHITE, LIGHT_GREY, DARK_PRIMARY_COLOR } from '../common';
import UserPFP from '../components/UserPFP';
import * as ImagePicker from 'expo-image-picker';
import { ActionInput } from '../items';
import { ScrollView } from 'react-native-gesture-handler';
import { firebaseApp } from '../firebaseconfig';


export default function EditProfileScreen({ navigation }) {
  const [firstRun, setFirstRun] = useState(0); // Lần chạy đầu tiên useEffect sẽ gọi get Anime để đăng kí listenr dữ liệu (Những lần useEffect sau sẽ bỏ qua- tránh lỗi infinite loop)
  const bottomsheetRef = React.createRef(); //reference attached to bottomsheet
  const fall = new Animated.Value(1); //blur animation
  var [user, setuser] = useState(firebaseApp.auth().currentUser);
  var[userid,setuserid]=useState(user.uid)
  var [name, setname] = useState(user.displayName);
  var [email, setemail] = useState(user.email);
  var [phoneNumber, setphoneNumber] = useState(user.phoneNumber);
  var [location, setlocation] = useState(user.location);
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading]= useState(false);
  var library_status, cam_status;
  navigation.addListener('focus', () => {getuserinfo()})
  useEffect(() => {
  });
  const getuserinfo =() => {
    firebaseApp.database().ref('User/' + firebaseApp.auth().currentUser.uid).on('value', (snapshot) => {
      if (snapshot.exists()) {
        setuser(snapshot.val());
        setlocation(snapshot.val().location);
        setphoneNumber(snapshot.val().phoneNumber);
      }
    })
  };
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
  const uploadImage = async (uri) => {
    //setIsLoading(true);
    const respone = await fetch(uri);
    const blob = await respone.blob();
    const ref = firebaseApp.storage().ref().child('images/User/' + email + '.jpg');
    return ref.put(blob);
  }
  //RENDER BOTTOM SHEET:
  const renderSheet = () => (
    <View style={styles.bottomsheetWrapper}>
      <Text style={styles.panelTitleTxt}>Upload Photo</Text>
      <Text style={styles.panelSubtitleTxt}>Chọn Ảnh Đại Diện</Text>
      <View style={{ width: '90%' }}>
        <TouchableOpacity style={styles.commandBtn} onPress={takePhoto}>
          <Text style={styles.commandTxt}>Chụp Ảnh</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.commandBtn} onPress={pickImage} >
          <Text style={styles.commandTxt}>Chọn Từ Kho Ảnh</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.commandBtn}
          onPress={() => bottomsheetRef.current.snapTo(0)}>
          <Text style={styles.commandTxt}>Hủy</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
  const renderSheetHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHandle}></View>
    </View>
  )


  return (
    <ScrollView style={styles.container}>
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
      {
      isLoading?
        <ActivityIndicator
        style={styles.indicator} animating={isLoading} color = '#bc2b78' size = "large"></ActivityIndicator>
        :
      <Animated.View style={{ opacity: Animated.add(0.1, Animated.multiply(fall, 1.0)) }}>
        <View style={styles.topdock}></View>
        <TouchableOpacity style={styles.userpfp} onPress={() => bottomsheetRef.current.snapTo(1)}>
          <View>
              {
              image == null ?
                firebaseApp.auth().currentUser.photoURL!=null?      
                  <UserPFP image={{ uri: firebaseApp.auth().currentUser.photoURL }} ></UserPFP>:
                  <UserPFP image={require('../assets/banner/op_swiper_1.jpg')} ></UserPFP> :
                  <UserPFP image={{ uri: image }} ></UserPFP>
              }
            {/* <Ionicons style={styles.editpfpIcon} name='camera-outline' size={50} color={WHITE}></Ionicons> */}
            <View style={styles.editpfpBtn}>
              <Ionicons style={{ alignSelf: 'center' }} name='pencil' color='#fff' size={15} />
            </View>
          </View>
        </TouchableOpacity>
        <View style={styles.infoWrapper}>
          <Text style={styles.usernameTxt}>{user.displayName}</Text>

          <ActionInput title='Họ Tên' ionIconName='person'
            placeholder='Nhập Họ Tên'
            autoFocus='true'
            value={name}
            onChangeText={setname}
          ></ActionInput>

          <ActionInput title='Số Điện Thoại' ionIconName='call'
            placeholder='Nhập Số Điện Thoại'
            keyboardType='numeric'
            onChangeText={setphoneNumber}
            value={phoneNumber}
            autoFocus='true'
          ></ActionInput>

          <ActionInput title='Địa Chỉ' ionIconName='location'
            placeholder='Nhập Địa Chỉ'
            autoFocus='true'
            onChangeText={setlocation}
            value={location}
          ></ActionInput>

          <ActionInput title='Email' ionIconName='mail'
            placeholder='Nhập Email' keyboardType='email-address'
            autoFocus='true'
            value={email}
            onChangeText={setemail}
          ></ActionInput>

          <TouchableOpacity style={styles.commandBtn} onPress={async () => {
            image==null?
            ()=>{
              
              var update = { displayName: name, email: email, phoneNumber: phoneNumber, location: location,photoURL:firebaseApp.auth().currentUser.photoURL}
              console.log(update)
              firebaseApp.database().ref('User/' + firebaseApp.auth().currentUser.uid).update(update)
              firebaseApp.auth().currentUser.updateProfile(update)
            }:
            uploadImage(image).then(() => { 
              return firebaseApp.storage().ref().child('images/User/' + email + '.jpg').getDownloadURL(); })
              .then((url) => {
                var update = { displayName: name, email: email, phoneNumber: phoneNumber, location: location,photoURL:url}
                console.log(update)
                firebaseApp.database().ref('User/' + firebaseApp.auth().currentUser.uid).update(update)
                firebaseApp.auth().currentUser.updateProfile(update)
              }).then(()=>{
                setIsLoading(false);
                console.log('Thay đổi thông tin thành công')
                alert('Thay đổi thông tin thành công');
              })
              .catch((error)=>{
                setIsLoading(false);
                alert(error);
              })

          }} >
            <Text style={styles.commandTxt}>Xác Nhận</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
      }
      </Animated.View>

    </ScrollView>
  );
}

var styles = StyleSheet.create({
  container: {
    height: '100%'
  },
  topdock: {
    height: 180,
    backgroundColor: PRIMARY_COLOR,
    borderBottomRightRadius: 70
  },
  userpfp: {
    position: 'absolute',
    backgroundColor: '#000',
    borderRadius: 60,
    left: '50%',
    marginLeft: -60, //margin half the width of PFP Picker
    top: 120,
  },
  usernameTxt: {
    fontSize: 25,
    alignSelf: 'center',
    fontWeight: 'bold'
  },
  editpfpBtn: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: '#000',
    right: 0,
    top: 5,
    justifyContent: 'center'
  },
  editpfpIcon: {
    position: 'absolute',
    left: 35,
    top: 35
  },
  infoWrapper: {
    marginTop: 70,
    width: '90%',
    alignSelf: 'center',
    //backgroundColor:SECONDARY_COLOR,
  },
  userInfo: {
    height: 30,
    alignSelf: 'center',
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: LIGHT_GREY
  },
  textInput: {
    flex: 1,
    paddingLeft: 10,
    color: GREY
  },
  commandBtn: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: DARK_PRIMARY_COLOR,
    alignItems: 'center',
    marginTop: 10,
    height: 50,
    justifyContent: 'center'
  },
  commandTxt: {
    color: WHITE,
    fontSize: 18,
    fontWeight: 'bold'
  },
  header: {
    backgroundColor: WHITE,
    shadowColor: '#333333',
    shadowOffset: { width: -1, height: -3 },
    shadowRadius: 2,
    shadowOpacity: 0.4,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    //elevation:20,
    alignItems: 'center'
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: GREY,
    marginBottom: 10,
  },
  bottomsheetWrapper: {
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  panelTitleTxt: {
    fontSize: 25,
  },
  panelSubtitleTxt: {
    color: GREY,
    fontSize: 13
  },
})
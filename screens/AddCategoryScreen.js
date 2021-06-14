import react from 'react';
import React, { Component, Dimensions, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, StatusBar, TouchableOpacity, TextInput, ActivityIndicator, ScrollView } from 'react-native';
import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import { IconButton } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { GREY, PRIMARY_COLOR, SECONDARY_COLOR, WHITE, LIGHT_GREY, DARK_PRIMARY_COLOR, BLACK } from '../common';
import * as ImagePicker from 'expo-image-picker';
import { firebaseApp } from '../firebaseconfig';
import { ActionInput } from '../items';


export default function AddCategoryScreen({ route, navigation }) {
  //get data passed from previous screen
  const { readonly } = route.params; //true: add , fail: detail và edit !cannot change this!
  const { itemID } = route.params;
  const [firstRun, setFirstRun] = useState(0); // Lần chạy đầu tiên useEffect sẽ gọi get Anime để đăng kí listenr dữ liệu (Những lần useEffect sau sẽ bỏ qua- tránh lỗi infinite loop)

  const [editing, setEditing] = useState(!readonly); //Khi editting: enable input
  const [isLoading, setIsLoading] = useState(false);

  const [image, setImage] = useState(null); //hinh anh hien thi
  const [imageURL, setImageURL] = useState(''); //url hinh anh de luu vao database
  const [categoryName, setCategoryName] = useState(''); // ten anime

  //Giao Dien:
  const bottomsheetRef = React.createRef(); //reference attached to bottomsheet
  const fall = new Animated.Value(1); //blur animation

  useEffect(() => {
    // Thêm nút vào header
    navigation.setOptions({
      //Neu dang edit thi khong render nut (va nguoc lai)
      headerRight: (!editing) ? () => (<IconButton icon="pencil" onPress={() => setEditing(true)}
        color={WHITE} size={25} />) : null
    })

    if (readonly && firstRun == 0) {
      GetAnime();
    }
  });

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

    //console.log(result);

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

    //console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  }

  const uploadImage = async (uri) => {
    const respone = await fetch(uri);
    const blob = await respone.blob();

    //location in database: dat ten file theo : ten loai san pham.jpg
    const ref = firebaseApp.storage().ref().child('images/category/' + categoryName + '.jpg');

    setIsLoading(true);

    return ref.put(blob);
  }
  //Data:

  const GetAnime = async () => {
    await firebaseApp.database().ref('Anime/' + itemID).once('value', (snapshot) => {
      console.log('on')
      if (snapshot.exists()) {
        setCategoryName(snapshot.val().TenAnime)
        setImageURL(snapshot.val().HinhAnh)
        setImage(snapshot.val().HinhAnh)
        setFirstRun((firstRun) => firstRun += 1) //đánh dấu lần chạy đầu
      }
    })
  }

  const AddAnime = (ten_anime, url_hinh_anh) => {
    firebaseApp.database().ref('Anime').push({
      TenAnime: ten_anime,
      HinhAnh: url_hinh_anh,
      TrangThai: "on"
    })
  }

  const UpdateAnime = (ten_anime, url_hinh_anh) => {
    firebaseApp.database().ref('Anime/' + itemID).update({
      TenAnime: ten_anime,
      HinhAnh: url_hinh_anh,
    })
  }

  const clearInput = () => {
    setCategoryName('');
    setImage(null);
    setImageURL('');
  }

  const Submit = () => {
    //validate data:
    if (categoryName == '' || image == null) {
      alert('Vui lòng điển đủ thông tin và hình ảnh');
      return;
    }

    if (!readonly) //================ ADD
    {
      // neu da dien du thong tin thi goi ham upload image len firebase storage
      uploadImage(image)
        .then(() => { //sau khi up load thanh cong goi api lay download url cua hinh anh
          return firebaseApp.storage().ref().child('images/category/' + categoryName + '.jpg').getDownloadURL();
        })
        .then((url) => { //gan download url vao bien state imageURL
          setImageURL(url);
          AddAnime(categoryName, url);
        })
        .then(() => {
          setIsLoading(false);
          clearInput();
          alert('Thêm Anime Thành Công');
        })
        .catch((error) => {
          setIsLoading(false);
          alert(error);
        })
    }
    else //=========================EDIT
    {
      uploadImage(image)
        .then(() => { //sau khi up load thanh cong goi api lay download url cua hinh anh
          return firebaseApp.storage().ref().child('images/category/' + categoryName + '.jpg').getDownloadURL();
        })
        .then((url) => { //gan download url vao bien state imageURL
          setImageURL(url);
          UpdateAnime(categoryName, url);
        })
        .then(() => {
          setIsLoading(false);
          setEditing(false)
          alert('Sửa Anime Thành Công');
        })
        .catch((error) => {
          setIsLoading(false);
          alert(error);
        })
    }
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
      <Animated.View style={{ opacity: Animated.add(0.1, Animated.multiply(fall, 1.0)) }}>
        <View style={styles.topdock}></View>
        {
          isLoading ?
            <ActivityIndicator
              style={styles.indicator} animating={isLoading} color='#bc2b78' size="large"></ActivityIndicator>
            :
            <ScrollView style={styles.infoWrapper}>
              <TouchableOpacity disabled={!editing && readonly} style={styles.imgHolder} onPress={() => bottomsheetRef.current.snapTo(1)}>
                <View>
                  <Image style={styles.image} source={{ uri: image }}></Image>
                  <Ionicons style={styles.editpfpIcon} name='camera-outline' size={50} color={BLACK}></Ionicons>
                </View>
              </TouchableOpacity>
              <ActionInput title='Tên Loại Sản Phẩm' ionIconName='ios-logo-android'
                placeholder='Nhập Tên Loại Sản Phẩm' value={categoryName}
                editable={editing} onChangeText={(text) => { setCategoryName(text) }}
              ></ActionInput>

              <TouchableOpacity style={[styles.commandBtn, readonly && !editing ? styles.hide : {}]} onPress={Submit}>
                <Text style={styles.commandTxt}>Xác Nhận</Text>
              </TouchableOpacity>
            </ScrollView>
        }
      </Animated.View>

    </View>
  );
}

var styles = StyleSheet.create({
  container: {
    height: '100%'
  },
  topdock: {
    height: 120,
    backgroundColor: PRIMARY_COLOR,
    borderBottomRightRadius: 50
  },
  imgHolder: {
    marginTop: 30,
    width: '90%',
    alignSelf: 'center',
    borderWidth: 1,
    borderRadius: 10
  },
  image: {
    width: '100%',
    height: 200,
    alignSelf: 'center',
    borderRadius: 10,
  },
  editpfpIcon: {
    position: 'absolute',
    left: '50%',
    marginLeft: -20,
    top: '50%',
    marginTop: -25
  },
  infoWrapper: {
    marginTop: 20,
    width: '90%',
    alignSelf: 'center',
    //backgroundColor:SECONDARY_COLOR,
  },
  commandBtn: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: DARK_PRIMARY_COLOR,
    alignItems: 'center',
    marginTop: 10,
    height: 50,
    justifyContent: 'center',
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
  hide: {
    display: 'none'
  },
  loading: {
    position: 'absolute',
    opacity: 0.8,
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
    zIndex: 100
  },
  indicator: {
    marginTop: '50%'
  },
})
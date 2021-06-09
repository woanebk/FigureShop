import react from 'react';
import React, { Component, Dimensions, useState, useEffect, ActivityIndicator } from 'react';
import { View, Text, StyleSheet, Image, StatusBar, TouchableOpacity, TextInput, ViewBase, Button, Platform } from 'react-native';
import Animated, { color } from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import { IconButton, RadioButton } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { GREY, PRIMARY_COLOR, SECONDARY_COLOR, WHITE, LIGHT_GREY, DARK_PRIMARY_COLOR } from '../common';
import UserPFP from '../components/UserPFP';
import * as ImagePicker from 'expo-image-picker';
import { ActionInput } from '../items';
import { ScrollView } from 'react-native-gesture-handler';
import { firebaseApp } from '../firebaseconfig';
import firebase from 'firebase/app';
import { FirebaseRecaptchaVerifierModal, FirebaseRecaptchaBanner } from 'expo-firebase-recaptcha';

export default function AddGuestScreen({ route, navigation }) {
  const recaptchaVerifier = React.useRef(null);
  const [phoneNumber, setPhoneNumber] = React.useState();
  const [verificationId, setVerificationId] = React.useState();
  const [verificationCode, setVerificationCode] = React.useState();
  const firebaseConfig = firebase.apps.length ? firebase.app().options : undefined;
  const [message, showMessage] = React.useState(
    !firebaseConfig || Platform.OS === 'web'
      ? {
        text:
          'To get started, provide a valid firebase config in App.js and open this snack on an iOS or Android device.',
      }
      : undefined
  );
  const attemptInvisibleVerification = false;
  const { readonly } = route.params;
  const { GuestID } = route.params;
  var [editing, setEditing] = useState(!readonly);
  const bottomsheetRef = React.createRef();
  const fall = new Animated.Value(1);
  var [Guest, setGuest] = useState(null);
  var [checked, setChecked] = useState('');
  var [Guestid, setGuestid] = useState('')
  var [name, setname] = useState("");
  var [email, setemail] = useState("");
  var [location, setlocation] = useState("");
  var [image, setImage] = useState(null);
  var [isLoading, setIsLoading] = useState(false);
  var [password, setpassword] = useState('');
  var [xacnhan, setxacnhan] = useState(false);
  var library_status, cam_status;
  navigation.addListener('focus', () => { if (readonly) getGuestinfo() })
  useEffect(() => {
    navigation.setOptions({
      headerRight: (!editing) ? () => (<IconButton icon="pencil" onPress={() => setEditing(true)}
        color={WHITE} size={25} />) : null
    })
  });
  const getGuestinfo = () => {
    console.log(GuestID)
    firebaseApp.database().ref('Guest/' + GuestID).on('value', (snapshot) => {
      if (snapshot.exists()) {
        setname(snapshot.val().displayName)
        setGuest(snapshot.val());
        setemail(snapshot.val().email)
        setlocation(snapshot.val().location);
        setphoneNumber(snapshot.val().phoneNumber);
        snapshot.val().isAdmin ? setChecked("Admin") : setChecked("Guest")
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
    const ref = firebaseApp.storage().ref().child('images/Guest/' + email + '.jpg');
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
      <Animated.View style={{ opacity: Animated.add(0.1, Animated.multiply(fall, 1.0)) }}>
        {
          isLoading ?
            <ActivityIndicator
              style={styles.indicator} animating={isLoading} color='#bc2b78' size="large"></ActivityIndicator>
            :
            <Animated.View style={{ opacity: Animated.add(0.1, Animated.multiply(fall, 1.0)) }}>
              <View style={styles.topdock}></View>
              <TouchableOpacity style={styles.userpfp} onPress={() => bottomsheetRef.current.snapTo(1)}>
                <View>
                  {
                    image == null ?
                      Guest != null ?
                        <UserPFP image={{ uri: Guest.photoURL }} ></UserPFP> :
                        <UserPFP image={require('../assets/banner/op_swiper_1.jpg')} ></UserPFP> :
                      <UserPFP image={{ uri: image }} ></UserPFP>
                  }
                  <View style={styles.editpfpBtn}>
                    <Ionicons style={{ alignSelf: 'center' }} name='pencil' color='#fff' size={15} />
                  </View>
                </View>
              </TouchableOpacity>
              <View style={styles.infoWrapper} disabled={!editing}>
                {Guest != null ? <Text style={styles.GuestnameTxt}>{Guest.displayName}</Text> : null}

                <ActionInput title='Họ Tên' ionIconName='person'
                  placeholder='Nhập Họ Tên'
                  autoFocus='true'
                  value={name}
                  onChangeText={setname}
                ></ActionInput>
                <ActionInput title='Số Điện Thoại' ionIconName='call'
                  placeholder='Nhập Số Điện Thoại'
                  autoFocus
                  autoCompleteType="tel"
                  value={phoneNumber}
                  keyboardType="phone-pad"
                  onChangeText={phoneNumber => setPhoneNumber(phoneNumber)}
                ></ActionInput>
                {
                  <View style={{ padding: 0, marginTop: 0 }}>
                    <FirebaseRecaptchaVerifierModal
                      ref={recaptchaVerifier}
                      firebaseConfig={firebaseConfig}
                      attemptInvisibleVerification={attemptInvisibleVerification}
                    />
                    <TouchableOpacity style={[styles.commandBtn,]}
                      disabled={!phoneNumber}
                      onPress={async () => {

                        try {
                          const phoneProvider = new firebase.auth.PhoneAuthProvider();
                          const verificationId = await phoneProvider.verifyPhoneNumber(
                            phoneNumber,
                            recaptchaVerifier.current
                          );
                          setVerificationId(verificationId);
                          alert("Gửi mã xác nhận thành công, vui lòng kiểm tra điện thoại của bạn");
                        } catch (err) {
                          showMessage({ text: `Error: ${err.message}`, color: 'red' });
                        }
                      }}>
                      <Text style={styles.commandTxt}>Gửi mã xác nhận</Text>
                    </TouchableOpacity>

                    {
                      !!verificationId ?
                        <ActionInput title='Mã Xác Nhận' ionIconName='call'
                          placeholder='Nhập Mã Xác Nhận'
                          editable={!!verificationId}
                          keyboardType="phone-pad"
                          onChangeText={phoneNumber => setVerificationCode(phoneNumber)}
                        ></ActionInput>
                        : null}
                    {
                      !!verificationId ?
                        <TouchableOpacity style={[styles.commandBtn,]}
                          disabled={!verificationId}
                          onPress={async () => {
                            try {
                              const credential = firebase.auth.PhoneAuthProvider.credential(
                                verificationId,
                                verificationCode
                              );
                              await firebase.auth().currentUser.updatePhoneNumber(credential);
                              //await firebase.auth().signInWithCredential(credential);
                              if (image != null) {
                                uploadImage(image).then(() => {
                                  return firebaseApp.storage().ref().child('images/User/' + email + '.jpg').getDownloadURL();
                                })
                                  .then((url) => {
                                    var update = { displayName: name, TrangThai: "on", phoneNumber: phoneNumber, photoURL: url }
                                    firebaseApp.database().ref('Guest/' + phoneNumber).update(update);
                                  })
                                }
                                else
                                {
                                  var update = { displayName: name, TrangThai: "on", phoneNumber: phoneNumber }
                                  firebaseApp.database().ref('Guest/' + phoneNumber).update(update);
                                } 
                                alert("Xác nhận số điện thoại thành công 👍");
                              
                            } catch (err) {
                              alert(`Error: ${err.message}`);
                            }
                          }}>
                          <Text style={styles.commandTxt}>Xác Nhận</Text>
                        </TouchableOpacity> :
                        null}
                    {attemptInvisibleVerification && <FirebaseRecaptchaBanner />}
                  </View>
                }
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
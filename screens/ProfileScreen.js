import react from 'react';
import React, { Component, Dimensions, useEffect, useContext } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, StatusBar, TouchableOpacity } from 'react-native';
import { TouchableRipple, IconButton } from 'react-native-paper';
import { GREY, LIGHT_GREY, SECONDARY_COLOR } from '../common';
import { DashBoard, UserPFP, ProfileButton, InfoDisplayer } from '../items'
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { firebaseApp } from '../firebaseconfig';
import CartContext from '../CartContext'

export default function ProfileScreen({ navigation }) {
  const { cart, setCart } = useContext(CartContext)
  const [firstRun,setFirstRun]=useState(0); // Lần chạy đầu tiên useEffect sẽ gọi get Anime để đăng kí listenr dữ liệu (Những lần useEffect sau sẽ bỏ qua- tránh lỗi infinite loop)
  var [user, setuser] = useState(firebaseApp.auth().currentUser);
  //thong ke theo thang
  const [soDonDat, setSoDonDat] = useState(0)
  const [soDonBan, setSoDonBan] = useState(0)
  const [doanhThu, setDoanhThu] = useState(0)

  
  useEffect( () => {
    if(firstRun == 0){
    var currentdate = new Date();
    var currentyear = currentdate.getFullYear()
    var currentmonth = currentdate.getMonth() + 1

    navigation.addListener('focus', () => {getuserinfo();
       getSoDonDatHang(currentmonth, currentyear); 
       getSoDonBanHang(currentmonth, currentyear)
       getDoanhThuThang(currentmonth, currentyear)
      })
    
    setFirstRun((firstRun)=>firstRun += 1
    ) 
  }
  if(firebaseApp.auth().currentUser.uid!="Pyino4SsfsPXgD8kNYyKBIO3pMd2")
  navigation.setOptions({
      title: '',
      headerRight: () => (
        <IconButton icon="account-edit" onPress={() => navigation.navigate('EditProfile')}
          color="#FF6347" size={25} />
      )
    })
  });

  const getuserinfo = async() => {
    firebaseApp.database().ref('User/'+ firebaseApp.auth().currentUser.uid).on('value', (snapshot) => {
      if (snapshot.exists()) {
        setuser(snapshot.val())
        firebaseApp.auth().currentUser.updateProfile(snapshot.val())
      }
    })
  //   console.log(user)
  //  await firebaseApp.database().ref('User/'+ firebaseApp.auth().currentUser.uid).update(firebaseApp.auth().currentUser.providerData);
  }

  const getSoDonDatHang = async (thang, nam)=>{
    var tt = 0
    await firebaseApp.database().ref('Guest').orderByChild('TrangThai').equalTo('on').once('value', (snapshot)=>{
      if(snapshot.exists())
      for (let [sdt_key, sdt_value] of Object.entries(snapshot.val() )) {
        if(sdt_value.TrangThai == 'on' && sdt_value.DonHang)
        {
            for (let [donhang_key, donhang_value] of Object.entries(sdt_value.DonHang )) {
                if(donhang_value.TrangThai == 'on' && donhang_value.SanPhamMua && donhang_value.DaXacNhan == 0)
                {
                    var ngay_dat_san_pham = donhang_value.NgayDat.split('/')
                    if(ngay_dat_san_pham[2] == nam && ngay_dat_san_pham[1] == thang)
                        tt += 1
                }
              }
        }
      }
    })
    setSoDonDat(tt)
  }

  const getSoDonBanHang = async (thang, nam)=>{
    var tt = 0
    await firebaseApp.database().ref('Guest').orderByChild('TrangThai').equalTo('on').once('value', (snapshot)=>{
      if(snapshot.exists())
      for (let [sdt_key, sdt_value] of Object.entries(snapshot.val() )) {
        if(sdt_value.TrangThai == 'on' && sdt_value.DonHang)
        {
            for (let [donhang_key, donhang_value] of Object.entries(sdt_value.DonHang )) {
                if(donhang_value.TrangThai == 'on' && donhang_value.SanPhamMua && donhang_value.DaXacNhan == 1)
                {
                    var ngay_dat_san_pham = donhang_value.NgayDat.split('/')
                    if(ngay_dat_san_pham[2] == nam && ngay_dat_san_pham[1] == thang)
                        tt += 1
                }
              }
        }
      }
    })
    setSoDonBan(tt)
  }

  const getDoanhThuThang = async (thang, nam)=>{
    var tt = 0
    await firebaseApp.database().ref('Guest').orderByChild('TrangThai').equalTo('on').once('value', (snapshot)=>{
      if(snapshot.exists())
      for (let [sdt_key, sdt_value] of Object.entries(snapshot.val() )) {
        if(sdt_value.TrangThai == 'on' && sdt_value.DonHang)
        {
            for (let [donhang_key, donhang_value] of Object.entries(sdt_value.DonHang )) {
                if(donhang_value.TrangThai == 'on' && donhang_value.SanPhamMua && donhang_value.DaXacNhan == 1)
                {
                    var ngay_dat_san_pham = donhang_value.NgayDat.split('/')
                    if(ngay_dat_san_pham[2] == nam && ngay_dat_san_pham[1] == thang)
                        tt += donhang_value.TongTien
                }
              }
        }
      }
    })
    setDoanhThu(tt/1000)
  }

  if (user.uid=="Pyino4SsfsPXgD8kNYyKBIO3pMd2")
  return (
    <ScrollView style={styles.container}>
      <StatusBar backgroundColor='transparent' barStyle='dark-content' translucent />
      <View style={styles.topdock}>
        <View style={styles.pfpHolder}>
          <UserPFP image={require('../assets/banner/op_swiper_1.jpg')}></UserPFP>
        </View>
        <View style={styles.userinfo}>
          <Text style={styles.usernameTxt}>
            {user.displayName}
          </Text>
        </View>
      </View>
      <View style={styles.btnsMenuWrapper}>       
        <View style={styles.userBtn}>
        <TouchableRipple onPress={() =>{navigation.navigate('LSGD')}}>
            <ProfileButton iconName='chart-bar' text='Lịch sử giao dịch' ></ProfileButton>
          </TouchableRipple>
        </View>
        <View style={styles.userBtn}>
          <TouchableRipple onPress={() =>{navigation.navigate('Contact')}}>
            <ProfileButton iconName='chart-bar' text='Liên hệ' ></ProfileButton>
          </TouchableRipple>
        </View>
        <View style={styles.userBtn}>
          <TouchableRipple onPress={() =>{ 
            setCart([]);
            setTimeout(function(){firebaseApp.auth().signOut();}, 200);}
          }
          >
            <ProfileButton iconName='logout' text='Đăng xuất' ></ProfileButton>
          </TouchableRipple>
        </View>
      </View>
    </ScrollView>
  );
  else  
  return (
    <ScrollView style={styles.container}>
      <StatusBar backgroundColor='transparent' barStyle='dark-content' translucent />
      <View style={styles.topdock}>
        {
          user.photoURL!=null?
         <View style={styles.pfpHolder}>
         <UserPFP image={{uri:user.photoURL}}></UserPFP>
        </View>:
        <View style={styles.pfpHolder}>
        <UserPFP image={require('../assets/banner/op_swiper_1.jpg')}></UserPFP>
      </View>
        }
        <View style={styles.userinfo}>
          <Text style={styles.usernameTxt}>
            {user.displayName}
          </Text>
          <View style={{ height: 30 }}>
            <InfoDisplayer ionIconName='call' text={user.phoneNumber} ></InfoDisplayer>
          </View>
          <View style={{ height: 30 }}>
            <InfoDisplayer ionIconName='location' text={user.location} ></InfoDisplayer>
          </View>
        </View>
      </View>
  
      <View style={styles.dashboardHolder}>
        <DashBoard sodondat = {soDonDat} sodonban={soDonBan} doanhthu={doanhThu+'k'}></DashBoard>
      </View>

     { firstRun==1?
        user.isAdmin? 
     <View style={styles.btnsMenuWrapper}>
        <View style={styles.userBtn}>
          <TouchableRipple onPress={() => navigation.navigate('ManageCategory')}>
            <ProfileButton iconName='robot' text='Quản Lý Loại Sản Phẩm - Anime' ></ProfileButton>
          </TouchableRipple>
        </View>
      
        <View style={styles.userBtn}>
          <TouchableRipple onPress={() => navigation.navigate('ManageFigures')}>
            <ProfileButton iconName='heart' text='Quản Lý Sản Phẩm' ></ProfileButton>
          </TouchableRipple>
        </View>
  
        <View style={styles.userBtn}>
          <TouchableRipple onPress={() => navigation.navigate('ManageOrder')}>
            <ProfileButton iconName='clock' text='Quản Lý Đặt Hàng' ></ProfileButton>
          </TouchableRipple>
        </View>

        <View style={styles.userBtn}>
          <TouchableRipple onPress={() => navigation.navigate('ManageSold')}>
            <ProfileButton iconName='wallet' text='Quản Lý Bán Hàng' ></ProfileButton>
          </TouchableRipple>
        </View>
  
        <View style={styles.userBtn}>
          <TouchableRipple onPress={() => navigation.navigate('AllUser')}>
            <ProfileButton iconName='human' text='Quản Lý Nhân Viên' ></ProfileButton>
          </TouchableRipple>
        </View>
        <View style={styles.userBtn}>
          <TouchableRipple onPress={() => navigation.navigate('AllGuest')}>
            <ProfileButton iconName='human' text='Quản Lý Khách Hàng' ></ProfileButton>
          </TouchableRipple>
        </View>
  
        <View style={styles.userBtn}>
          <TouchableRipple onPress={() => navigation.navigate('Report')}>
            <ProfileButton iconName='chart-bar' text='Báo Cáo Doanh Thu' ></ProfileButton>
          </TouchableRipple>
        </View>
  
        <View style={styles.userBtn}>
          <TouchableRipple onPress={() =>{
            setCart([])
            setTimeout(function(){firebaseApp.auth().signOut();}, 200);
          }
          }
          >
            <ProfileButton iconName='logout' text='Đăng xuất' ></ProfileButton>
          </TouchableRipple>
        </View>
      </View>
      :

       <View style={styles.btnsMenuWrapper}>
       <View style={styles.userBtn}>
         <TouchableRipple onPress={() => navigation.navigate('ManageOrder')}>
           <ProfileButton iconName='clock' text='Quản Lý Đặt Hàng' ></ProfileButton>
         </TouchableRipple>
       </View>

       <View style={styles.userBtn}>
         <TouchableRipple onPress={() => navigation.navigate('ManageSold')}>
           <ProfileButton iconName='wallet' text='Quản Lý Bán Hàng' ></ProfileButton>
         </TouchableRipple>
       </View>
       <View style={styles.userBtn}>
         <TouchableRipple onPress={() => navigation.navigate('AllGuest')}>
           <ProfileButton iconName='human' text='Quản Lý Khách Hàng' ></ProfileButton>
         </TouchableRipple>
       </View>
       <View style={styles.userBtn}>
         <TouchableRipple onPress={() =>{
           setCart([])
           setTimeout(function(){firebaseApp.auth().signOut();}, 200);
         }
         }
         >
           <ProfileButton iconName='logout' text='Đăng xuất' ></ProfileButton>
         </TouchableRipple>
       </View>
     </View>:null
      }
  
    </ScrollView>
  );
}


var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topdock: {
    height: 400,
    backgroundColor: SECONDARY_COLOR,
  },
  pfpHolder: {
    alignSelf: 'center',
    top: 110,
  },
  usernameTxt: {
    alignSelf: 'center',
    fontSize: 27,
    fontWeight: 'bold',
    width:250, 
    textAlign: 'center'
  },
  userinfo: {
    height: 100,
    top: 120,
    alignItems: 'center'
  },
  dashboardHolder: {
    width: '80%',
    alignSelf: 'center',
    top: -40,
  },
  btnsMenuWrapper: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  userBtn: {
    height: 50,
    width: '80%',
    marginTop: 5,
    borderBottomWidth: 1,
    borderBottomColor: LIGHT_GREY
  },
})
import React, { Fragment, useEffect } from 'react';
import { useContext, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, StatusBar, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { useState } from 'react';
import CartContext from '../CartContext';
import { BLACK, DARK_PRIMARY_COLOR, GREY, OFF_WHITE, PRIMARY_COLOR, WHITE, LIGHT_PINK, GREY_BORDER, GREEN, GOLD, GUEST_UID } from '../common';
import { ActionInput, CheckOutItem, CodeInput } from '../items';
import { Ionicons } from '@expo/vector-icons';
import { firebaseApp } from '../firebaseconfig';

export default function OrderDetailScreen({ route, navigation }) {

  const { cart, setCart } = useContext(CartContext)
  const { so_dien_thoai } = route.params;
  const { id_don_dat_hang } = route.params;
  const [firstRun, setFirstRun] = useState(0);
  const [donDatHang, setDonDatHang] = useState({})
  const [listSanPham, setListSanPham] = useState([])
  const [trangThai, setTrangThai] = useState(0)
  const [listTonkho, setlistTonkho] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  navigation.addListener('focus', () => {
    getDonDatHang(so_dien_thoai, id_don_dat_hang);
  })
  useEffect(() => {
    if (firstRun == 0) {
      // getDonDatHang(so_dien_thoai, id_don_dat_hang)
      setFirstRun((firstRun) => firstRun += 1) //đánh dấu lần chạy đầu
    }
  })
  const getDonDatHang = async (phonenumber, id) => {
      firebaseApp.database().ref('Guest/' + phonenumber + '/DonHang/' + id).on('value', snapshot => {
      if (snapshot.exists()) {
        setDonDatHang(snapshot.val())
        setListSanPham(snapshot.val().SanPhamMua)
        var sanpham = snapshot.val().SanPhamMua
        console.log(sanpham)
        var listTonkho = [];
        for (var item in snapshot.val().SanPhamMua) {
          console.log('Anime/' + sanpham[item].IdAnime + '/SanPham/' + sanpham[item].IdSanPham)
          firebaseApp.database().ref('Anime/' + sanpham[item].IdAnime + '/SanPham/' + sanpham[item].IdSanPham).on('value', snapshot => {
            if (snapshot.exists()) { listTonkho.push(snapshot.val().SoLuong); console.log(snapshot.val().SoLuong) }
          })
        }
        setTimeout(function(){setlistTonkho(listTonkho)}, 1);
        setTrangThai(snapshot.val().DaXacNhan)
      }
      setIsLoading(false)
    })
  }
  const canConfirmDatHang = (sdt, iddondathang) => { //Neu du so luong de ban thi true
    var result = true;
    firebaseApp.database().ref('Guest/' + sdt + '/DonHang/' + iddondathang).on('value', snapshot => {
      if (snapshot.exists()) {
        snapshot.val().SanPhamMua.forEach(sanpham => {
          var soluongmua = sanpham.SoLuongMua
          var tonkho = 0
          firebaseApp.database().ref('Anime/' + sanpham.IdAnime + '/SanPham/' + sanpham.IdSanPham).on('value', SanPhamsnapshot => {
            if (SanPhamsnapshot.exists())
              tonkho = SanPhamsnapshot.val().SoLuong
            if (soluongmua > tonkho) {
              result = false;
            }
          })
        });
      }
    })
    return result
  }

  const updateSoLuongSanPham = (id_anime, id_sanpham, so_luong) => {
    firebaseApp.database().ref('Anime/' + id_anime + '/SanPham/' + id_sanpham).update({
      SoLuong: so_luong
    })
  }

  const getTonKho = (idanime, idsanpham)=>{
    var tonkho = 0
    firebaseApp.database().ref('Anime/'+idanime+'/SanPham/' + idsanpham).on('value',snapshot=>{
      tonkho = snapshot.val().SoLuong
    })
    return tonkho
  }

  const xacNhanDonDathang = (sdt, iddonhang) => {
    var idanime = ''
    var idsanpham = ''
    try {
      firebaseApp.database().ref('Guest/' + sdt + '/DonHang/' + iddonhang).once('value', snapshot => {
        snapshot.val().SanPhamMua.forEach(sanpham => {
          var tonkho = getTonKho(sanpham.IdAnime, sanpham.IdSanPham)
          updateSoLuongSanPham(sanpham.IdAnime, sanpham.IdSanPham, tonkho - sanpham.SoLuongMua)
        });
      })

      firebaseApp.database().ref('Guest/' + sdt + '/DonHang/' + iddonhang).update({
        DaXacNhan: 1
      })
    } catch (err) {
    }
  }

  const renderItems = () => {

    return listSanPham.map((item, index) => (
      <View key={index}>
        <CheckOutItem name={item.TenSanPham}
          itemImage={{ uri: item.HinhAnh[0] }}
          soLuong={item.SoLuongMua}
          giaBan={item.GiaBan * (1 - item.GiamGia)}
        ></CheckOutItem>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: -10 }}>
          <Text style={styles.tonKhoTxt}>Tồn Kho: {listTonkho[index]}</Text>
          {
            item.SoLuongMua > listTonkho[index] && trangThai == 0 ?
              <View style={styles.warningTag}>
                <Ionicons style={{ marginHorizontal: 5 }} name='warning' size={20}></Ionicons>
                <Text style={styles.warningTxt}>Không Đủ Sản Phẩm</Text>
              </View>
              :
              null
          }

        </View>

      </View>
    ))
  }

  const renderStatus = () => {
    if (trangThai == 0)
      return (
        <View style={[styles.status, { backgroundColor: PRIMARY_COLOR }]}>
          <Text style={styles.statusTxt}> Trạng Thái Đơn Hàng: Chưa Xác Nhận</Text>
        </View>
      )
    return (
      <View style={[styles.status, { backgroundColor: GREEN }]}>
        <Text style={styles.statusTxt}> Trạng Thái Đơn Hàng: Đã Xác Nhận</Text>
      </View>
    )
  }

  const renderButton = () => {
    if (trangThai == 0 && canConfirmDatHang(so_dien_thoai, id_don_dat_hang) && firebaseApp.auth().currentUser.uid != GUEST_UID)
      return (
        <TouchableOpacity style={styles.commandBtn} onPress={() => xacNhanDonDathang(so_dien_thoai, id_don_dat_hang)}>
          <Text style={styles.commandTxt}> Xác Nhận Đơn Hàng</Text>
        </TouchableOpacity>
      )
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle='light-content' translucent backgroundColor={'transparent'} ></StatusBar>
      <View style={styles.topdock}></View>
      {
        isLoading ?
          <ActivityIndicator style={styles.indicator} animating={isLoading} color='#bc2b78' size="large" />
          :
          <ScrollView>
            {renderStatus()}
            <View style={styles.infoWrapper}>
              <Text style={styles.infoTitleTxt}>Tổng Tiền:{' ' + donDatHang.TongTien + 'VNĐ'}</Text>
              <Text style={styles.infoTitleTxt}>Thông Tin Khách Hàng</Text>
              <Text style={styles.infoTxt}>ID Đơn Hàng: {' ' + id_don_dat_hang}</Text>
              <Text style={styles.infoTxt}>Họ Tên: {' ' + donDatHang.HoTen}</Text>
              <Text style={styles.infoTxt}>Số Điện Thoại:{' ' + so_dien_thoai}</Text>
              <Text style={styles.infoTxt}>Ngày Đặt Hàng:{' ' + donDatHang.NgayDat}</Text>
              <Text numberOfLines={7} style={styles.infoTxt}>Địa Chỉ:{' ' + donDatHang.DiaChi}</Text>
            </View>

            <View style={{ backgroundColor: WHITE, flex: 1 }}>
              <View style={styles.itemsWrapper}>
                {renderItems()}
                <View style={styles.tag}>
                  <View style={styles.tag1}>
                    <Ionicons name='card-outline' size={25} color={PRIMARY_COLOR}></Ionicons>
                  </View>
                  <View style={styles.tag2}>
                    <Text style={styles.tag2Txt}>Sản phẩm đã chọn</Text>
                  </View>
                </View>
              </View>
            </View>
            {renderButton()}
          </ScrollView>}
    </View>
  )
}

var styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: WHITE
  },
  topdock: {
    height: 110,
    backgroundColor: PRIMARY_COLOR,
    borderBottomRightRadius: 70
  },
  status: {
    width: 300,
    height: 50,
    marginTop: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    justifyContent: 'center'
  },
  statusTxt: {
    fontWeight: 'bold',
    fontSize: 15
  },
  bigTxt: {
    fontSize: 30,
    width: '100%',
    fontWeight: 'bold',
    color: WHITE,
    textAlign: 'center',
    marginTop: 10
  },
  txt: {
    color: WHITE,
    textAlign: 'center',
    width: '100%',
    fontSize: 15,
    marginTop: 10
  },
  itemsWrapper: {
    backgroundColor: WHITE,
    width: '94%',
    marginTop: 40,
    borderRadius: 15,
    borderColor: GREY_BORDER,
    borderWidth: 2,
    alignSelf: 'center',
    paddingTop: 40,

  },
  tag: {
    height: 35,
    position: 'absolute',
    backgroundColor: LIGHT_PINK,
    flexDirection: 'row',
    alignItems: 'center',
    top: -20,
    left: 10,
    borderRadius: 8,
    borderColor: PRIMARY_COLOR,
    borderWidth: 1
  },
  tag1: {
    marginLeft: 5
  },
  tag2: {
    marginLeft: 5,
    paddingRight: 5
  },
  tag2Txt: {
    color: DARK_PRIMARY_COLOR,
    width: 130
  },
  infoWrapper: {
    width: '90%',
    height: 210,
    backgroundColor: WHITE,
    alignSelf: 'center',
    borderRadius: 10,
    marginTop: 10
  },
  infoTitleTxt: {
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 10,
    borderBottomWidth: 1,
    borderColor: GREY_BORDER,
    marginRight: 10,
    marginTop: 5
  },
  infoTxt: {
    fontSize: 14,
    marginLeft: 10,
    marginTop: 5
  },
  commandBtn: {
    alignSelf: 'center',
    backgroundColor: GREEN,
    width: 200,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: BLACK,
    marginTop: 20,
    marginBottom: 30
  },
  commandTxt: {
    color: WHITE,
    fontWeight: 'bold',
    fontSize: 15,
    width: '100%',
    textAlign: 'center'
  },
  tonKhoTxt: {
    fontWeight: 'bold',
    marginBottom: 15,
    marginLeft: 20,
    //marginTop:-15, 
    width: 100,
    textAlignVertical: 'center'
  },
  warningTag: {
    backgroundColor: GOLD,
    width: 180,
    height: 30,
    marginRight: 10,
    marginBottom: 5,
    borderRadius: 5,
    alignItems: 'center',
    flexDirection: 'row',
  },
  warningTxt: {
    fontWeight: 'bold',
    fontSize: 13,
    width: 150
  },
})
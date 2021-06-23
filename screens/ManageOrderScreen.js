import React, { useState, useEffect, useLayoutEffect, Fragment } from 'react';
import { View, StyleSheet, StatusBar, TouchableOpacity, FlatList, Text, ActivityIndicator } from 'react-native';
import { GREY, OFF_WHITE, PRIMARY_COLOR, WHITE, GREY_BORDER } from '../common';
import { ListItem, OrderListItem } from '../items';
import { MaterialIcons } from '@expo/vector-icons';
import { firebaseApp } from '../firebaseconfig';
import Dialog, { DialogFooter, DialogButton, DialogContent, DialogTitle, SlideAnimation } from 'react-native-popup-dialog';
import { Button } from 'react-native-paper';
import ItemDetailScreen from './ItemDetailScreen';
import { SearchBar } from 'react-native-elements';

export default function ManageOrderScreen({ navigation }) {
  const [listDonDatHangtam, setListDonDatHangtam] = useState();
  const [listDonDatHang, setListDonDatHang] = useState();
  const [firstRun, setFirstRun] = useState(0);
  const [deleteID, setDeleteID] = useState(''); //id  để xóa
  const [soDienThoaitoDelete, setSoDienThoaitoDelete] = useState(''); //sdt  để xóa
  const [search, setsearch] = useState(null)
  const [dialogVisable, setDialogVisable] = useState(false); // true thì hiện dialog, false thì ẩn
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (firstRun == 0) {
      navigation.addListener('focus', () => { getDonDatHang(); setsearch('') })
      setFirstRun((firstRun) => firstRun += 1) //đánh dấu lần chạy đầu
    }

    if (deleteID !== '')
      openDialog(); //callback khi nhấn chọn delete tránh trường hợp deleteid không thay đổi ngay
  })

  const getDonDatHang = () => {
    let list = [];
    firebaseApp.database().ref('Guest').orderByChild('TrangThai').equalTo('on').once('value', (snapshot) => {
      if (snapshot.exists())
        for (let [sdt_key, sdt_value] of Object.entries(snapshot.val())) {
          if (sdt_value.TrangThai == 'on' && sdt_value.DonHang) {
            for (let [donhang_key, donhang_value] of Object.entries(sdt_value.DonHang)) {
              if (donhang_value.TrangThai == 'on' && donhang_value.SanPhamMua && donhang_value.DaXacNhan == 0) {
                list.push({
                  IdDonDatHang: donhang_key,
                  DaXacNhan: donhang_value.DaXacNhan,
                  DiaChi: donhang_value.DiaChi,
                  TenKhachHang: donhang_value.HoTen,
                  NgayDat: donhang_value.NgayDat,
                  SanPhamMua: donhang_value.SanPhamMua,
                  TongTien: donhang_value.TongTien,
                  TrangThai: donhang_value.TrangThai,
                  SoDienThoai: sdt_key
                })
              }
            }
          }
        }
      setListDonDatHang(list)
      setListDonDatHangtam(list)
      setIsLoading(false)
    })
  }

  const onDeleteDonDatHang = (sdt, id) => {
    setSoDienThoaitoDelete(sdt)
    setDeleteID(id) //call back useEffect sẽ mở dialog
  }

  const deleteDonHang = (sdt, iddonhang) => {
    try {
      firebaseApp.database().ref('Guest/' + sdt + '/DonHang/' + iddonhang).update({
        TrangThai: 'off'
      }, () => {
        closeDialog()
        getDonDatHang()
      })
    } catch (err) {
      console.log(err)
    }
  }

  const tinhTongSoLuong = (arr) => {
    var tongsoluong = 0
    arr.forEach(item => {
      tongsoluong += item.SoLuongMua
    });
    return tongsoluong
  }

  const canConfirmDatHang = (sdt, iddondathang) => { //Neu du so luong de ban thi true
    var result = true;
    firebaseApp.database().ref('Guest/' + sdt + '/DonHang/' + iddondathang).once('value', snapshot => {
      if (snapshot.exists()) {
        snapshot.val().SanPhamMua.forEach(sanpham => {
          var soluongmua = sanpham.SoLuongMua
          var tonkho = 0
          firebaseApp.database().ref('Anime/' + sanpham.IdAnime + '/SanPham/' + sanpham.IdSanPham).once('value', DonDatHangsnapshot => {
            if (DonDatHangsnapshot.exists())
              tonkho = DonDatHangsnapshot.val().SoLuong
            if (soluongmua > tonkho) {
              result = false;
            }
          })
        });
      }
    })
    return result
  }

  //Dialog:
  const openDialog = () => { setDialogVisable(true) }
  const closeDialog = () => {
    setDeleteID('')
    setSoDienThoaitoDelete('')
    setDialogVisable(false)
  } //reset để không mở dialog trong useEffect không cần thiết 

  const renderDialog = () => (
    <Dialog
      visible={dialogVisable}
      dialogTitle={<DialogTitle title="Thông Báo" />}
      onTouchOutside={() => closeDialog()}
      footer={
        <DialogFooter>
          <DialogButton
            text="CANCEL"
            onPress={() => closeDialog()}
          />
          <DialogButton
            text="OK"
            onPress={() => deleteDonHang(soDienThoaitoDelete, deleteID)}
          />
        </DialogFooter>
      }
      dialogAnimation={new SlideAnimation({
        slideFrom: 'bottom',
      })}
    >
      <DialogContent style={styles.dialog}>
        <View style={{ height: '100%' }}>
          <Text style={{ fontSize: 16, alignSelf: 'center' }}> Bạn có chắc muốn Xóa ?</Text>
        </View>
      </DialogContent>
    </Dialog>
  )
  const searchlist = (s) => {
    var list = [];
    for (var item in listDonDatHang) {
      if (listDonDatHang[item].SoDienThoai.toLowerCase().includes(s.toLowerCase()))
        list.push(listDonDatHang[item]);
    }
    setListDonDatHangtam(list)
  }
  return (
    <View style={styles.container}>
      <StatusBar barStyle='dark-content' translucent></StatusBar>
      <View style={styles.topdock}></View>
      {
        isLoading?
        <ActivityIndicator style={styles.indicator} animating={isLoading} color = '#bc2b78' size = "large"/>
        :
        <Fragment>
           <SearchBar 
          placeholder="Nhập số điện thoại đơn hàng"
          lightTheme={true}
          platform="android"
          round={10}
          onChangeText={search =>{searchlist(search); setsearch(search)  ;         
          }}
          value={search}
        />
          <FlatList style={styles.list}
            data={listDonDatHangtam}
            renderItem = {({item})=>(
              <OrderListItem name = {item.TenKhachHang} maDonHang={item.IdDonDatHang} canDelete={true}
              phoneNumber = {item.SoDienThoai} soLuongSanPham={tinhTongSoLuong(item.SanPhamMua) }
              canConfirm ={canConfirmDatHang(item.SoDienThoai, item.IdDonDatHang) }
              tongtien={item.TongTien}
              onPress={()=>navigation.navigate('OrderDetail',{so_dien_thoai: item.SoDienThoai, id_don_dat_hang: item.IdDonDatHang})}
              ngayDat = {item.NgayDat}
              onDeletePress={()=>onDeleteDonDatHang(item.SoDienThoai, item.IdDonDatHang)}
              ></OrderListItem>
            )}
            keyExtractor={item=>item.IdDonDatHang}
            showsVerticalScrollIndicator={false}
          />
          {renderDialog()}
        </Fragment>
      }

    </View>
  );
}

var styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: WHITE
  },
  topdock: {
    height: 120,
    backgroundColor: PRIMARY_COLOR,
    borderBottomRightRadius: 70
  },
  list: {
    width: '95%',
    alignSelf: 'center',
    borderWidth: 3,
    borderRadius: 5,
    padding: 5,
    marginTop: 10,
    borderColor: GREY_BORDER,
    marginBottom:10,
  },
  newBtn: {
    position: 'absolute',
    width: 70,
    height: 70,
    right: 20,
    bottom: 20,
    borderRadius: 100,
    backgroundColor: PRIMARY_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5
  },
  dialog: {
    width: 280,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    marginTop: '50%'
  }
})
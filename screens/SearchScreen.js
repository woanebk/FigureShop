import react from 'react';
import React, { useState, useEffect, useLayoutEffect, useContext } from 'react';
import { ListItemmforsearch } from '../items';
import { View, Text, Image, StyleSheet, TouchableOpacity, StatusBar, FlatList, ActivityIndicator } from 'react-native';
import { AwesomeTextInput } from 'react-native-awesome-text-input';
import { firebaseApp } from '../firebaseconfig';
import { SearchBar } from 'react-native-elements';
import CartContext from '../CartContext';
import { Card } from '../items';
import BottomSheet from 'reanimated-bottom-sheet';
import { PRIMARY_COLOR, DARK_PRIMARY_COLOR, GREY, WHITE, BLACK } from '../common';
import { Ionicons } from '@expo/vector-icons';
import { Badge, IconButton } from 'react-native-paper';

export default function SearchScreen({ navigation }) {
  const [hinhAnhs, setHinhAnhs] = useState([])
  const { cart, setCart } = useContext(CartContext)
  const [sanPham, setSanPham] = useState(null) // initial object tranh loi
  const bottomsheetRef = React.createRef();
  const [listSanPham, setListSanPham] = useState();
  const [listSanPhamtam, setListSanPhamtam] = useState();
  const [isLoading, setisLoading] = useState(true)
  const [firstRun, setFirstRun] = useState(0); // Lần chạy đầu tiên useEffect sẽ gọi get Anime để đăng kí listenr dữ liệu (Những lần useEffect sau sẽ bỏ qua- tránh lỗi infinite loop)
  const [dialogVisable, setDialogVisable] = useState(false); // true thì hiện dialog, false thì ẩn
  const [deleteAnimeID, setDeleteAnimeID] = useState(''); //id anime để xóa
  const [search, setsearch] = useState(null)
  const [tenAnime, setTenAnime] = useState('')
  useEffect(() => {
    if (firstRun == 0) {
      navigation.addListener('focus', () => { setisLoading(true);
        setsearch(''); getSanPhams() })
      setFirstRun((firstRun) => firstRun += 1) //đánh dấu lần chạy đầu
    }
    if (deleteAnimeID !== '' || deleteAnimeID !== '')
      openDialog(); //callback khi nhấn chọn delete
  })
  const renderSheetHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHandle}></View>
    </View>
  )
  const searchlist = (s) => {
    var list = [];
    for (var item in listSanPham) {
      if (listSanPham[item].TenSanPham.toLowerCase().includes(s))
        list.push(listSanPham[item]);
    }
    setListSanPhamtam(list)
  }
  const getSanPhams = () => {
    let list = [];
    firebaseApp.database().ref('Anime').orderByChild('TrangThai').equalTo('on').once('value', (snapshot) => {
      if (snapshot.exists()) {
        list = []; //reset list tránh trùng lặp
        snapshot.forEach((child) => //child la anime
        {
          if (child.val().SanPham) //day la object
          {
            var animename = child.val().TenAnime
            var idAnime = child.key
            for (let [key, value] of Object.entries(child.val().SanPham)) {
              if (value.TrangThai == 'on') {
                if (value.SoLuong > 0) {
                  list.push({
                    IdSanPham: key,
                    TenAnime: animename,
                    IdAnime: idAnime,
                    TenSanPham: value.TenSanPham,
                    TenNhanVat: value.TenNhanVat,
                    GiaBan: value.GiaBan,
                    GiamGia: value.GiamGia,
                    HinhAnh: value.HinhAnh,
                    SoLuong: value.SoLuong,
                    GiaGoc: value.giaGoc,
                    MoTa: value.MoTa,
                  })
                }
              }
            }
          }
        })

        setListSanPham(list)
        setListSanPhamtam(list)
      }
    })
    setisLoading(false);
  }
  const addToCart = (idSanPham, sanpham) => {
    if (cart.length > 0 && cart.some(item => item.IdSanPham == idSanPham)) {
      let tmp = cart.slice(0)
      tmp.map((item) => {
        if (item.IdSanPham == idSanPham) {
          if (item.SoLuongMua >= item.TonKho)
            alert('Sản phẩm trong kho không đủ để thêm')
          else {
            item.SoLuongMua += 1
            bottomsheetRef.current.snapTo(1)
          }
        }
      })
      setCart(tmp)
    }
    else {

      bottomsheetRef.current.snapTo(1)
      setCart(cart => [...cart, {
        IdSanPham: sanpham.IdSanPham,
        SoLuongMua: 1,
        TenSanPham: sanpham.TenSanPham,
        TenAnime: sanpham.TenAnime,
        TenNhanVat: sanpham.TenNhanVat,
        GiaBan: sanpham.GiaBan,
        GiamGia: sanpham.GiamGia,
        TonKho: sanpham.SoLuong,
        HinhAnh: sanpham.HinhAnh,
        IdAnime: sanpham.IdAnime,
        GiaGoc: sanpham.GiaGoc
      }])
    }

  }
  const renderSheet = () => (
    <View style={styles.bottomsheetWrapper}>
      {
        sanPham != null ? <View style={{ width: '90%' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Ionicons name='checkmark-circle-outline' size={20}></Ionicons>
            <Text style={{ width: 270, fontWeight: 'bold' }}>Sản phẩm đã được thêm vào giỏ hàng</Text>
            <IconButton icon='close' onPress={() => bottomsheetRef.current.snapTo(0)}></IconButton>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Image style={{ width: 60, height: 60, marginLeft: 10 }} source={{ uri: sanPham.HinhAnh[0] }}></Image>
            <View style={{ flex: 1, paddingLeft: 20 }}>
              <Text numberOfLines={2}>{sanPham.TenSanPham}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: GREY, fontSize: 11 }}>{'Anime:  '}</Text>
                <Text style={{ width: 300 }}>{sanPham.TenAnime}</Text>
              </View>
              <Text style={{ fontWeight: 'bold' }}>{sanPham.GiaBan * (1 - sanPham.GiamGia) + ' VNĐ'}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.commandBtn} onPress={() => navigation.navigate('Cart')}>
            <Text style={styles.commandTxt}>Xem Giỏ Hàng</Text>
          </TouchableOpacity>
        </View> : null}
    </View>
  )
  return (
    <View style={{ backgroundColor: '#fff', height: '100%' }} >
      <StatusBar barStyle='dark-content'></StatusBar>
      <View style={styles.searchbarWrapper}>
        <SearchBar style={styles.searchbarWrapper}
          placeholder="Nhập tên sản phẩm cần tìm"
          lightTheme={true}
          platform="android"
          round={10}
          onChangeText={search => {
            searchlist(search); setsearch(search); bottomsheetRef.current.snapTo(0)
          }}
          value={search}
        />
      </View>
      {
        isLoading ?
          <ActivityIndicator style={styles.indicator} animating={isLoading} color='#bc2b78' size="large" />
          :
          <View style={styles.searchItemWrapper}>
            <FlatList style={styles.list}
              data={listSanPhamtam}
              renderItem={({ item }) => (
                <ListItemmforsearch title={item.TenSanPham}
                  description={item.MoTa}
                  giaban={item.GiaBan * (1 - item.GiamGia) + ' VND'}
                  giagoc={item.GiaBan}
                  itemSalePrice='23'
                  soluongton={item.SoLuong}
                  giamgia={item.GiamGia}
                  itemImage={{ uri: item.HinhAnh[0] }}
                  onPress={() => navigation.navigate('ItemDetail', { anime_ID: item.IdAnime, sanpham_ID: item.IdSanPham })}
                  onADDTOCARTpress={() => { setSanPham(item); addToCart(item.IdSanPham, item) }}
                ></ListItemmforsearch>
              )}
              keyExtractor={item => item.IdSanPham}
              showsVerticalScrollIndicator={false}
            />
          </View>}
      <BottomSheet
        ref={bottomsheetRef}
        snapPoints={[0, 250]}
        initialSnap={0} //0 is 0, 1 is 300
        enabledGestureInteraction={true}
        enabledContentGestureInteraction={false}
        renderContent={renderSheet}
        renderHeader={renderSheetHeader}
      />
    </View>

  );
}


const styles = StyleSheet.create({
  searchbarWrapper: {
    width: '100%',
    alignSelf: 'center',
  },
  searchItemWrapper: {
    //marginTop: 10,
    width: '90%',
    alignSelf: 'center',
    //marginBottom: 60,
    flex: 1,
  },
  bottomsheetWrapper: {
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 250
  },
  commandBtn: {
    padding: 15,
    borderRadius: 5,
    backgroundColor: DARK_PRIMARY_COLOR,
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 10,
    height: 50,
    justifyContent: 'center',
  },
  commandTxt: {
    color: WHITE,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    width: '100%'
  },
});
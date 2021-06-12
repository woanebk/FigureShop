import React, {useState, useEffect, useLayoutEffect } from 'react';
import { View,StyleSheet, StatusBar, TouchableOpacity, FlatList, Text, Button } from 'react-native';
import { GREY, OFF_WHITE, PRIMARY_COLOR, WHITE} from '../common';
import { ListItem } from '../items';
import { MaterialIcons } from '@expo/vector-icons';
import { firebaseApp } from '../firebaseconfig';
import Dialog, { DialogFooter, DialogButton, DialogContent, DialogTitle, SlideAnimation } from 'react-native-popup-dialog';

export default function ManageFiguresScreen({navigation}) {

  const [listSanPham,setListSanPham]=useState();
  const [firstRun,setFirstRun]=useState(0); // Lần chạy đầu tiên useEffect sẽ gọi get Anime để đăng kí listenr dữ liệu (Những lần useEffect sau sẽ bỏ qua- tránh lỗi infinite loop)
  const [dialogVisable, setDialogVisable]=useState(false); // true thì hiện dialog, false thì ẩn
  const [deleteSanPhamID, setDeleteSanPhamID] = useState(''); //id sản phẩm để xóa
  const [deleteAnimeID, setDeleteAnimeID] = useState(''); //id anime để xóa
  useEffect(()=>{
    if(firstRun == 0){
      navigation.addListener('focus', () => {getSanPhams()})
      getSanPhams();
      setFirstRun((firstRun)=>firstRun += 1) //đánh dấu lần chạy đầu
    }
    if(deleteAnimeID !== '' || deleteAnimeID !== '')
      openDialog(); //callback khi nhấn chọn delete
  }) 

  const getSanPhams = () => {
    let list=[];
    firebaseApp.database().ref('Anime').orderByChild('TrangThai').equalTo('on').once('value', (snapshot)=>{
      if( snapshot.exists())
      {
        //console.log(snapshot)
        list = []; //reset list tránh trùng lặp
        snapshot.forEach((child)=> //child la anime
        {
          if(child.val().SanPham) //day la object
          {
            var animename = child.val().TenAnime
            var idAnime = child.key
            for (let [key, value] of Object.entries(child.val().SanPham)) {
              if(value.TrangThai == 'on')
              {
                list.push({
                  IdSanPham : key,
                  TenAnime: animename,
                  IdAnime: idAnime,
                  TenSanPham: value.TenSanPham,
                  TenNhanVat : value.TenNhanVat,
                  GiaBan: value.GiaBan,
                  GiamGia: value.GiamGia,
                  HinhAnh:value.HinhAnh,
                  SoLuong:value.SoLuong
                })
              }
            }
          }
        })
        setListSanPham(list)
      }
    })
  }

  const deleteSanPham = async (id_anime, id_sanpham)=>{
    try{
      closeDialog()//reset để không mở dialog trong useEffect không cần thiết
      await firebaseApp.database().ref('Anime/' + id_anime +'/SanPham/' + id_sanpham).update({
        TrangThai: 'off'
      })
      alert('Xóa Thành Công !')
      getSanPhams()
    }
    catch(error)
    {
      alert(error)
    }
  }

  const onDeleteSanPhamPress = (id_anime, id_sp)=>{
    setDeleteSanPhamID(id_sp) //call back useEffect sẽ mở dialog
    setDeleteAnimeID(id_anime)
  }

    //Dialog:
    const openDialog = ()=>{setDialogVisable(true)}
    const closeDialog = ()=>{
      setDialogVisable(false); 
      setDeleteAnimeID('')
      setDeleteSanPhamID('')} //reset để không mở dialog trong useEffect không cần thiết 
  
    const renderDialog = ()=>(
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
              onPress={() => {deleteSanPham(deleteAnimeID, deleteSanPhamID)}}
            />
          </DialogFooter>
        }
        dialogAnimation={new SlideAnimation({
          slideFrom: 'bottom',
        })}
      > 
        <DialogContent style={styles.dialog}>
          <View style={{ height:'100%'}}>
            <Text style={{fontSize:16, alignSelf:'center'}}> Bạn có chắc muốn Xóa ?</Text>
          </View>
        </DialogContent>
      </Dialog>
    )

  return (
    <View style={styles.container}>
      <StatusBar barStyle='dark-content' translucent></StatusBar>
      <View style={styles.topdock}></View>

      <FlatList style={styles.list}
        data={listSanPham}
        renderItem = {({item})=>(
          <ListItem image={item.HinhAnh?{uri:item.HinhAnh[0]}:{} } 
            name = {item.TenSanPham} 
            description={'Anime: ' + item.TenAnime}
            phoneNumber = {'Tồn Kho: ' + item.SoLuong}
            price={item.GiaBan * (1 - item.GiamGia)}
            onPress={()=>{ }}
            onDeletePress={()=>{onDeleteSanPhamPress(item.IdAnime, item.IdSanPham)}}
          ></ListItem>
        )}
        keyExtractor={item=>item.IdSanPham}
        showsVerticalScrollIndicator={false}
      />
      <TouchableOpacity onPress={()=>{navigation.navigate('AddFigure',{readonly:false})}} style={styles.newBtn}>
        <MaterialIcons name='add' size={30} color={WHITE} ></MaterialIcons>
      </TouchableOpacity>
      {renderDialog()}
    </View>
  );
}

var styles = StyleSheet.create({
  container:{
    height:'100%',
    backgroundColor:WHITE
  },
  topdock:{
    height:120,
    backgroundColor:PRIMARY_COLOR,
    borderBottomRightRadius:70
  },
  list:{
    width:'90%',
    alignSelf:'center'
  },
  newBtn:{
    position:'absolute',
    width:70,
    height:70,
    right:20,
    bottom:20,
    borderRadius:100,
    backgroundColor:PRIMARY_COLOR,
    justifyContent:'center',
    alignItems:'center',
    elevation:5
  },
  dialog:{
    width:280,
    height:40,
    justifyContent:'center',
    alignItems:'center',
  },
})
import React, {useState, useEffect, useLayoutEffect } from 'react';
import { View,StyleSheet, StatusBar, TouchableOpacity, FlatList, Text } from 'react-native';
import { GREY, OFF_WHITE, PRIMARY_COLOR, WHITE} from '../common';
import { ListItem } from '../items';
import { MaterialIcons } from '@expo/vector-icons';
import { firebaseApp } from '../firebaseconfig';
import Dialog, { DialogFooter, DialogButton, DialogContent, DialogTitle, SlideAnimation } from 'react-native-popup-dialog';
import { Button } from 'react-native-paper';

export default function ManageCategoryScreen({navigation}) {

  const [listAnime,setListAnime]=useState();
  const [firstRun,setFirstRun]=useState(0); // Lần chạy đầu tiên useEffect sẽ gọi get Anime để đăng kí listenr dữ liệu (Những lần useEffect sau sẽ bỏ qua- tránh lỗi infinite loop)
  const [deleteID, setDeleteID] = useState(''); //id anime để xóa
  const [dialogVisable, setDialogVisable]=useState(false); // true thì hiện dialog, false thì ẩn

  useEffect(()=>{
    if(firstRun == 0){
      navigation.addListener('focus', () => {getAnimes()})
      setFirstRun((firstRun)=>firstRun += 1) //đánh dấu lần chạy đầu
    }

    if(deleteID !== '')
      openDialog(); //callback khi nhấn chọn delete tránh trường hợp deleteid không thay đổi ngay
  }) 

  const getAnimes = () => {
    let list=[];
    firebaseApp.database().ref('Anime').orderByChild('TrangThai').equalTo('on').once('value', (snapshot)=>{
      if( snapshot.exists())
      {
        list = []; //reset list tránh trùng lặp
        snapshot.forEach((child)=>
        {
          list.push({
            key: child.key, 
            TenAnime: child.val().TenAnime, 
            HinhAnh:child.val().HinhAnh
          })
        })
        setListAnime(list)
      }
    })
  }

  const deleteAnime = async(anime_id)=>{
    try{
      closeDialog();
      await firebaseApp.database().ref('Anime/' + anime_id).update({
        TrangThai: 'off'
      })
      setDeleteID('')//reset để không mở dialog trong useEffect không cần thiết
      alert('Xóa Thành Công !')
    }
    catch(error)
    {
      alert(error)
    }
  }

  const onDeleteAnimePress = (id)=>{
    setDeleteID(id) //call back useEffect sẽ mở dialog
  }

  //Dialog:
  const openDialog = ()=>{setDialogVisable(true)}
  const closeDialog = ()=>{
    setDialogVisable(false); 
    setDeleteID('')} //reset để không mở dialog trong useEffect không cần thiết 

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
            onPress={() => deleteAnime(deleteID)}
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
        data={listAnime}
        renderItem = {({item})=>(
          <ListItem image={{uri:item.HinhAnh}} name = {item.TenAnime} 
            onPress={()=>{ navigation.navigate('AddCategory',{readonly:true, itemID:item.key}) }}
            onDeletePress={()=>onDeleteAnimePress(item.key)}
          ></ListItem>
        )}
        keyExtractor={item=>item.key}
        showsVerticalScrollIndicator={false}
      />
      <TouchableOpacity onPress={()=>{navigation.navigate('AddCategory',{readonly:false})}} style={styles.newBtn}>
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
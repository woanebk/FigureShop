import React, {useState, useEffect, useLayoutEffect } from 'react';
import { View,StyleSheet, StatusBar, TouchableOpacity, FlatList, Text } from 'react-native';
import { GREY, OFF_WHITE, PRIMARY_COLOR, WHITE} from '../common';
import { ListItem } from '../items';
import { MaterialIcons } from '@expo/vector-icons';
import { firebaseApp } from '../firebaseconfig';
import Dialog, { DialogFooter, DialogButton, DialogContent, DialogTitle, SlideAnimation } from 'react-native-popup-dialog';
import { Button } from 'react-native-paper';
import { SearchBar } from 'react-native-elements';

export default function AllUserScreen({navigation}) {
  const [listUsertam,setListUsertam]=useState();
  const [listUser,setListUser]=useState();
  const [search, setsearch] = useState(null)
  const [deleteID, setDeleteID] = useState(''); //id User để xóa
  const [dialogVisable, setDialogVisable]=useState(false); // true thì hiện dialog, false thì ẩn
  navigation.addListener('focus', () => {getUsers();setsearch('')})
  useEffect(()=>{
    if(deleteID !== '')
      openDialog();
  }) 
  const getUsers = () => {
    let list=[];
    firebaseApp.database().ref('User').orderByChild('TrangThai').equalTo('on').on('value', (snapshot)=>{
      if( snapshot.exists())
      {
        list = []; //reset list tránh trùng lặp
        snapshot.forEach((child)=>
        {
          list.push({
            key: child.key, 
            displayName:child.val().displayName, 
            photoURL:child.val().photoURL,
            isAdmin:child.val().isAdmin,
            phoneNumber:child.val().phoneNumber,
          })
        })
        setListUser(list)
        setListUsertam(list)

      }
    })
  }
  const deleteUser = async(User_id)=>{
    try{
      closeDialog();
      await firebaseApp.database().ref('User/' + User_id).update({
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

  const onDeleteUserPress = (id)=>{
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
            onPress={() => deleteUser(deleteID)}
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
  const searchlist = (s) => {
    var list = [];
    for (var item in listUser) {
      if (listUser[item].displayName.toLowerCase().includes(s))
        list.push(listUser[item]);
    }
    setListUsertam(list)
  }
  return (
    <View style={styles.container}>
      <StatusBar barStyle='dark-content' translucent></StatusBar>
      <View style={styles.topdock}></View>
      <SearchBar
              placeholder="Nhập tên người dùng"
              lightTheme={true}
              platform="android"
              round={10}
              onChangeText={search => {
                searchlist(search); setsearch(search);
              }}
              value={search}
            />
      <FlatList style={styles.list}
        data={listUsertam}
        renderItem = {({item})=>(
          <ListItem image={{uri:item.photoURL}} name = {item.displayName}
           description={item.isAdmin?'Admin':'User'} phoneNumber = {item.phoneNumber}
            onPress={()=>{ navigation.navigate('AddUser',{readonly:true, userID:item.key}) }}
            onDeletePress={()=>onDeleteUserPress(item.key)}
          ></ListItem>
        )}
        keyExtractor={item=>item.key}
        showsVerticalScrollIndicator={false}
      />
      <TouchableOpacity onPress={()=>{navigation.navigate('AddUser',{readonly:false})}} style={styles.newBtn}>
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
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, StatusBar, TouchableOpacity, TextInput, ActivityIndicator, ScrollView, Button, FlatList } from 'react-native';
import Animated, { sub } from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';
import {IconButton, TouchableRipple } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { GREY, PRIMARY_COLOR, SECONDARY_COLOR, WHITE, LIGHT_GREY, DARK_PRIMARY_COLOR, BLACK } from '../common';
import * as ImagePicker from 'expo-image-picker';
import {firebaseApp} from '../firebaseconfig';
import { ActionInput, LargeActionInput } from '../items';
import DropDownPicker from 'react-native-dropdown-picker';


export default function AddFigureScreen({route, navigation}) {
  //get data passed from previous screen
  const {readonly}= route.params; //fail: add, true: detail
  const {images} = route.params; //Hình ảnh truyền từ màn hình chọn ảnh[]
  const {id_san_pham}=route.params;

  const [firstRun,setFirstRun]=useState(0); // Lần chạy đầu tiên useEffect sẽ gọi get Anime để đăng kí listenr dữ liệu (Những lần useEffect sau sẽ bỏ qua- tránh lỗi infinite loop)

  const [editing, setEditing]=useState(!readonly); //Khi editting: enable input
  const [isLoading, setIsLoading]= useState(false);

  const [HinhAnhs, setHinhAnhs] = useState([]); //đường dẫn trên máy khi chọn từ màn hình multi images picker

  //dropdownlist:
  const [listAnime, setListAnime]= useState([]);
  const [openList, setOpenList] = useState(false);
  //firebase:
  const [idAnime, setIDAnime] = useState('');
  const [idSanPham, setIdSanPham] = useState('');
  const [tenSanPham, setTenSanPham] = useState('');
  const [soLuong, setSoLuong] = useState('');
  const [urlHinhAnhs, setUrlHinhAnhs] = useState([]);
  const [tenNhanVat, setTenNhanVat] = useState('');
  const [giaGoc, setGiaGoc] = useState('');
  const [giaBan, setGiaBan] = useState('');
  const [giamGia, setGiamGia] = useState('');
  const [chieuCao, setChieuCao] = useState('');
  const [chieuDai, setChieuDai] = useState('');
  const [chieuRong, setChieuRong] = useState('');
  const [canNang, setCanNang] = useState('');
  const [chatLieu, setChatLieu] = useState('');
  const [moTa, setMoTa] = useState('');

  var listURL = []

  //Giao Dien:
  const bottomsheetRef = React.createRef(); //reference attached to bottomsheet
  const fall= new Animated.Value(1); //blur animation
  
  useEffect(()=>{
    navigation.setOptions({
      //Neu dang edit thi khong render nut (va nguoc lai)
      headerRight: (!editing) ? () => (<IconButton icon="pencil" onPress={() => setEditing(true)}
        color={WHITE} size={25} />) : null
    })
    navigation.addListener('focus', () => {images == undefined?{}:setHinhAnhs(images)}) //Hàm được gọi mỗi khi focus, khi chuyển sang trang chọn ảnh screen bị unfocus chứ ko mất đi
    if( firstRun == 0)
    {
      if(readonly)getSanPham()
      getAnimes() //dropdownlist
      setFirstRun((firstRun)=>firstRun+1)
    }

    if(urlHinhAnhs !== [] && idSanPham != '' && idAnime != '' && !readonly) //Callback Update Hình ảnh đã upload vào sản phẩm add
    {setTimeout(() => {
      firebaseApp.database().ref('Anime/'+ idAnime + '/SanPham/' + idSanPham ).update({ //thêm ảnh vào sản phẩm đã tạo
        HinhAnh: urlHinhAnhs
      })
      
     }, 5000);
    }
    if(urlHinhAnhs !== [] && idSanPham != '' && idAnime != '' && readonly) //Callback Update Hình ảnh đã upload vào sản phẩm add
    {setTimeout(() => {
      firebaseApp.database().ref('Anime/'+ idAnime + '/SanPham/' + idSanPham ).update({ //thêm ảnh vào sản phẩm đã tạo
        HinhAnh: urlHinhAnhs
      },()=>setIdSanPham('') )//callback stop if nay
      console.log(urlHinhAnhs !== [])
      
     }, 5000);
    }
  });

  const uploadImage = async (uri, id, index)=>{
    const respone = await fetch(uri);
    const blob = await respone.blob();

    //location in database: dat ten file theo : ten loai san pham.jpg
    const ref = firebaseApp.storage().ref().child('images/sanpham/'+ id +'/' + id + '_' + index +'.jpg');
    
    await ref.put(blob);
    return await ref.getDownloadURL();
  }
  //Data:

  const getSanPham = async ()=>{
    setIsLoading(true)
    await firebaseApp.database().ref('Anime').once('value', snapshot=>{
      //console.log(snapshot.val())
      for (let [anime_key, anime_value] of Object.entries(snapshot.val())){
        if(anime_value.SanPham)
        {
          for (let [sanpham_key, sanpham_value] of Object.entries(anime_value.SanPham)){
            if(sanpham_key == id_san_pham) {
              //setIdSanPham(sanpham_key)
              setIDAnime(anime_key)
              setTenSanPham(sanpham_value.TenSanPham)
              setSoLuong(sanpham_value.SoLuong)
              setTenNhanVat(sanpham_value.TenNhanVat)
              setGiaGoc(sanpham_value.giaGoc)
              setGiaBan(sanpham_value.GiaBan)
              setGiamGia(sanpham_value.GiamGia)
              setChieuCao(sanpham_value.ChieuCao)
              setChieuDai(sanpham_value.ChieuDai)
              setChieuRong(sanpham_value.ChieuRong)
              setChatLieu(sanpham_value.ChatLieu)
              setCanNang(sanpham_value.CanNang)
              setMoTa(sanpham_value.MoTa)

              setHinhAnhs(sanpham_value.HinhAnh)
            }
          }
        }
      }
    })
    setIsLoading(false)
  }

  const getHinhAnhfromServer = async ()=>{
    var hinhanh =[]
    await firebaseApp.database().ref('Anime').once('value', snapshot=>{
      //console.log(snapshot.val())
      for (let [anime_key, anime_value] of Object.entries(snapshot.val())){
        if(anime_value.SanPham)
        {
          for (let [sanpham_key, sanpham_value] of Object.entries(anime_value.SanPham)){
            if(sanpham_key == id_san_pham) {
              hinhanh = sanpham_value.HinhAnh
            }
          }
        }
      }
    })
    return hinhanh
  }

  const AddSanPham = (ten_san_pham, id_anime, ten_nhan_vat, gia_goc, gia_ban, giam_gia, so_luong, chieu_cao, chieu_dai, chieu_rong, chat_lieu, can_nang, mo_ta )=>{
    const id = firebaseApp.database().ref('Anime/' + id_anime + '/SanPham').push({ //Chưa add hình ảnh
      TenSanPham: ten_san_pham,
      TenAnime: id_anime,
      TenNhanVat: ten_nhan_vat,
      giaGoc: gia_goc,
      GiaBan: gia_ban,
      GiamGia: giam_gia,
      SoLuong: so_luong,
      ChieuCao: chieu_cao,
      ChieuDai: chieu_dai,
      ChieuRong: chieu_rong,
      ChatLieu: chat_lieu,
      CanNang: can_nang,
      TrangThai: "on",
      MoTa: mo_ta
    }).key
    setIdSanPham(id)
    return id;
  }

  const UpdateSanPham = (id_sp, ten_san_pham, id_anime, ten_nhan_vat, gia_goc, gia_ban, giam_gia, so_luong, chieu_cao, chieu_dai, chieu_rong, chat_lieu, can_nang, mo_ta )=>{
    firebaseApp.database().ref('Anime/' + id_anime + '/SanPham/' + id_sp).update({ //Chưa add hình ảnh
      TenSanPham: ten_san_pham,
      TenAnime: id_anime,
      TenNhanVat: ten_nhan_vat,
      giaGoc: gia_goc,
      GiaBan: gia_ban,
      GiamGia: giam_gia,
      SoLuong: so_luong,
      ChieuCao: chieu_cao,
      ChieuDai: chieu_dai,
      ChieuRong: chieu_rong,
      ChatLieu: chat_lieu,
      CanNang: can_nang,
      TrangThai: "on",
      MoTa: mo_ta
    })
  }

  const resetInput = ()=>{
    //setIdSanPham('')
    setTenSanPham('')
    setSoLuong(0)
    //setUrlHinhAnhs([])
    setTenNhanVat('')
    setGiaGoc('')
    setGiaBan('')
    setGiamGia('')
    setChieuCao('')
    setChieuDai('')
    setChieuRong('')
    setChatLieu('')
    setCanNang('')
    setMoTa('')

    setHinhAnhs([])
  }

  const Submit = ()=>{
    if( tenSanPham == '' || tenNhanVat == '' || giaGoc == '' || giaBan == '' || soLuong == '' ||
    giamGia == '' || chieuCao == '' || chieuDai == '' || chieuRong == '' || chatLieu == '' ||
    canNang == '' || HinhAnhs.length == 0 || idAnime == '' )
    {
      alert('Vui lòng điển đủ thông tin và hình ảnh');
      return;
    }

    // ===== ADD:
    if(!readonly)
    {
      setIsLoading(true);
      listURL = []

      var id_sp = AddSanPham(tenSanPham, idAnime, tenNhanVat, giaGoc, giaBan, giamGia, soLuong, chieuCao, chieuDai, chieuRong, chatLieu, canNang, moTa)
      
        HinhAnhs.forEach(async (element, index) => { //upload ảnh
          let url = await uploadImage(element, id_sp, index);
          listURL.push(url)
        })
         setUrlHinhAnhs(listURL)
         setTimeout(() => {
          resetInput()
          setIsLoading(false)
          alert('Thêm Sản Phẩm Thành Công !')
         }, 500);
         //Update ảnh vào sản phẩm: CallBack ở useEffect
    }
    else{
      setIsLoading(true);
      listURL = []
      UpdateSanPham(id_san_pham, tenSanPham, idAnime, tenNhanVat, giaGoc, giaBan, giamGia, soLuong, chieuCao, chieuDai, chieuRong, chatLieu, canNang, moTa)
      if( HinhAnhs !== getHinhAnhfromServer()){
        HinhAnhs.forEach(async (element, index) => { //upload ảnh
          let url = await uploadImage(element, id_san_pham, index);
          listURL.push(url)
        })
         setUrlHinhAnhs(listURL)
         setIdSanPham(id_san_pham)
         setTimeout(() => {
          //resetInput()
          setIsLoading(false)
          alert('Sửa Sản Phẩm Thành Công !')
         }, 500);
         //Update ảnh vào sản phẩm: CallBack ở useEffect
      }
    }
  }

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

  //RENDER BOTTOM SHEET:
  const renderSheet = ()=>(
    <View style={styles.bottomsheetWrapper}>
      <Text style={styles.panelTitleTxt}>Upload Photo</Text>
      <Text style={styles.panelSubtitleTxt}>Chọn Ảnh Đại Diện</Text>
      <View style={{width:'90%'}}>
      <TouchableOpacity style={styles.commandBtn} onPress={()=>{}}>
          <Text style={styles.commandTxt}>Chụp Ảnh</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.commandBtn} onPress={()=>{}} >
          <Text style={styles.commandTxt}>Chọn Từ Kho Ảnh</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.commandBtn} 
        onPress={()=>bottomsheetRef.current.snapTo(0)}>
          <Text style={styles.commandTxt}>Hủy</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
  const renderSheetHeader = ()=>(
    <View style={styles.header}>
        <View style={styles.panelHandle}></View>
    </View>
  )

  const renderSwiper = ()=>{
    return(
      <FlatList style={styles.slidercontainer} horizontal={true}
        data={HinhAnhs}
        renderItem={({item})=>(
          <View style={styles.slide} >
            <Image style={styles.sliderimage}
            source ={{uri:item}}
            resizeMode='stretch'
            ></Image>
            </View>
        )}
      ></FlatList>
    )
  }


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
      <Animated.View style={{opacity: Animated.add(0.1, Animated.multiply(fall,1.0))}}>
        <View style={styles.topdock}></View>
        {
          isLoading?
          <ActivityIndicator style={styles.indicator} animating={isLoading} color = '#bc2b78' size = "large"/>
          :
          <ScrollView style={{marginBottom:120}}>
          <IconButton style={[styles.camBtn, (editing || !readonly) ?{}:styles.hide]} icon="camera" color={PRIMARY_COLOR}
            size={30}
            onPress={() => {navigation.navigate('MultiImagePick',{useImagestoEdit:readonly, id_san_pham:id_san_pham})}}/>
          {renderSwiper()}
          <View style={styles.infoWrapper}>

            <DropDownPicker style={{marginBottom:10}}
              open={openList}
              value={idAnime}
              items={listAnime}
              setOpen={setOpenList}
              setValue={setIDAnime}
              disabled={readonly}
              //setItems={setListAnime}
              schema={{
                label: 'TenAnime',
                value: 'key',
              }}
              placeholder='Chọn Anime'
              zIndex={1000}
              listMode="SCROLLVIEW"
              editable={editing || !readonly}
              dropDownContainerStyle={{
                backgroundColor: "#dfdfdf"
              }}
            />

            <ActionInput title= 'Tên Sản Phẩm' ionIconName='caret-forward-outline' placeholder ='Nhập Tên Sản Phẩm' 
            value={tenSanPham} onChangeText={(text)=>{setTenSanPham(text)}} editable={editing || !readonly}
            ></ActionInput>

            <ActionInput title= 'Tên Nhân Vật' ionIconName='body-outline' placeholder ='Nhập Tên Nhân Vật'
            value={tenNhanVat} onChangeText={(text)=>{setTenNhanVat(text)}} editable={editing || !readonly}></ActionInput>

            <ActionInput title= 'Giá Gốc (VNĐ)' ionIconName='cash-outline' placeholder ='Nhập Giá Gốc' keyboardType ='numeric' 
            value={giaGoc.toString()} onChangeText={(text)=>{setGiaGoc(text)}} editable={editing || !readonly}></ActionInput>

            <ActionInput title= 'Giá Bán (VNĐ)' ionIconName='cash-outline' placeholder ='Nhập Giá Bán' keyboardType ='numeric' 
            value={giaBan.toString()} onChangeText={(text)=>{setGiaBan(text)}} editable={editing || !readonly}></ActionInput>

            <ActionInput title= 'Giảm Giá' ionIconName='pricetag-outline' placeholder ='Nhập % Giảm Giá' keyboardType ='numeric' 
            value={giamGia.toString()} onChangeText={(text)=>{setGiamGia(text)}} editable={editing || !readonly}></ActionInput>

            <ActionInput title= 'Số Lượng' ionIconName='pricetag-outline' placeholder ='Nhập Số Lượng' keyboardType ='numeric' 
            value={soLuong.toString()} onChangeText={(text)=>{setSoLuong(text)}} editable={editing || !readonly}></ActionInput>

            <ActionInput title= 'Chiều Cao (cm)' ionIconName='swap-vertical-outline' placeholder ='Nhập Chiều Cao' keyboardType ='numeric' 
            value={chieuCao.toString()} onChangeText={(text)=>{setChieuCao(text)}} editable={editing || !readonly}></ActionInput>

            <ActionInput title= 'Chiều Dài (cm)' ionIconName='swap-horizontal-outline' placeholder ='Nhập Chiều Dài' keyboardType ='numeric' 
            value={chieuDai.toString()} onChangeText={(text)=>{setChieuDai(text)}} editable={editing || !readonly}></ActionInput>

            <ActionInput title= 'Chiều Rộng (cm)' ionIconName='resize-outline' placeholder ='Nhập Chiều Rộng' keyboardType ='numeric' 
            value={chieuRong.toString()} onChangeText={(text)=>{setChieuRong(text)}} editable={editing || !readonly}></ActionInput>

            <ActionInput title= 'Chất Liệu (kg)' ionIconName='barbell' placeholder ='Nhập Chất Liệu'  
            value={chatLieu} onChangeText={(text)=>{setChatLieu(text)}} editable={editing || !readonly}></ActionInput>

            <ActionInput title= 'Cân Nặng (kg)' ionIconName='barbell' placeholder ='Nhập Cân Nặng' keyboardType ='numeric' 
            value={canNang.toString()} onChangeText={(text)=>{setCanNang(text)}} editable={editing || !readonly}></ActionInput>

            <LargeActionInput title= 'Mô Tả' ionIconName='pencil-outline' placeholder ='Nhập Mô Tả' multiline={true} 
            value={moTa} onChangeText={(text)=>{setMoTa(text)}} editable={editing || !readonly}></LargeActionInput>
          </View>

            <TouchableOpacity style={[styles.commandBtn,  (editing || !readonly) ? {}:styles.hide ]} onPress={Submit}>
              <Text style={styles.commandTxt}>Xác Nhận</Text>
            </TouchableOpacity>
        </ScrollView>
        }
        </Animated.View>
    </View>
  );
}

var styles = StyleSheet.create({
  container:{
    height:'100%'
  },
  topdock:{
    height:120,
    backgroundColor:PRIMARY_COLOR,
    borderBottomRightRadius:50
  },
  slidercontainer:{
    height:220,
    width:'100%',
    alignSelf:'center',
    //borderTopWidth:1,
    borderBottomWidth:1,
    borderTopWidth:1,
    borderColor:GREY
  },
  slide: {
    height:'90%',
    width:220,
    alignSelf:'center',
    marginHorizontal:5,
  },
  sliderimage:{
    width:'100%',
    height:'100%'
  },
  infoWrapper:{
    marginTop:20,
    width:'90%',
    alignSelf:'center',
    //backgroundColor:SECONDARY_COLOR,
  },
  commandBtn:{
    padding:15,
    borderRadius:5,
    backgroundColor:DARK_PRIMARY_COLOR,
    alignItems:'center',
    marginTop:10,
    marginBottom:10,
    marginHorizontal:10,
    height:50,
    justifyContent:'center',
  },
  commandTxt:{
    color:WHITE, 
    fontSize:18,
    fontWeight:'bold',
    textAlign:'center',
    width:'100%'
  },
  header:{
    backgroundColor:WHITE,
    shadowColor:'#333333',
    shadowOffset:{width:-1, height:-3},
    shadowRadius:2,
    shadowOpacity:0.4,
    paddingTop:20,
    borderTopLeftRadius:20,
    borderTopRightRadius:20,
    //elevation:20,
    alignItems:'center'
  },
  panelHandle:{
    width:40,
    height:8,
    borderRadius:4,
    backgroundColor:GREY,
    marginBottom:10,
  },
  bottomsheetWrapper:{
    alignItems:'center',
     backgroundColor:'#fff',
  },
  panelTitleTxt:{
    fontSize:25,
  },
  panelSubtitleTxt:{
    color:GREY,
    fontSize:13
  },
  hide:{
    display:'none'
  },
  loading:{
    position:'absolute',
    opacity:0.8,
    left:0,
    top:0,
    right:0,
    bottom:0,
    backgroundColor:'#000',
    zIndex:100
  },
  camBtn:{
    alignSelf:'flex-end', marginRight:20
  },
  infoWrapper:{
    marginTop:20,
    width:'90%',
    alignSelf:'center',
    //backgroundColor:SECONDARY_COLOR,
  },
  indicator:{
    marginTop:'50%'
  },
})
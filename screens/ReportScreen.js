import React, {useState, useEffect, useLayoutEffect, Fragment } from 'react';
import { View,StyleSheet, StatusBar, Dimensions, ScrollView, Text, Image } from 'react-native';
import { BLACK, DARK_PRIMARY_COLOR, GREEN, GREY, OFF_WHITE, PRIMARY_COLOR, WHITE} from '../common';
import { ListItem } from '../items';
import { MaterialIcons } from '@expo/vector-icons';
import { firebaseApp } from '../firebaseconfig';
import Dialog, { DialogFooter, DialogButton, DialogContent, DialogTitle, SlideAnimation } from 'react-native-popup-dialog';
import { ActivityIndicator, Button, IconButton } from 'react-native-paper';
import { LineChart, PieChart } from 'react-native-chart-kit';
import ModalDropdown from 'react-native-modal-dropdown';
import { LinearGradient } from 'expo-linear-gradient';
import { FlatList } from 'react-native-gesture-handler';

export default function ReportScreen({navigation}) {

  const [firstRun,setFirstRun]=useState(0); // Lần chạy đầu tiên useEffect sẽ gọi get Anime để đăng kí listenr dữ liệu (Những lần useEffect sau sẽ bỏ qua- tránh lỗi infinite loop)
  const screenWidth = Dimensions.get("window").width;
    const [isLoading, setIsLoading]=useState(true)
    const [nam, setNam]=useState(2021)
    const [nThangGanNhat, setNThangGanNhat]=useState(6)
    const [tongDoanhThu, setTongDoanhThu] = useState(0)
    const [tongLoiNhuan, setTongLoiNhuan] = useState(0)
    const [soDonDatHang, setSoDonDatHang] = useState(0)
    const [soDonBanHang, setSoDonBanHang] = useState(0)

  const default_data = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
        strokeWidth: 2 // optional
      },
    ],
    legend: [" Doanh Thu 6 Tháng Gần Nhất"] // optional
  };


  const dropdownOption = ['1 Tháng Gần Nhất', '2 Tháng Gần Nhất', '3 Tháng Gần Nhất', '4 Tháng Gần Nhất', '5 Tháng Gần Nhất', '6 Tháng Gần Nhất', '7 Tháng Gần Nhất', '8 Tháng Gần Nhất', '9 Tháng Gần Nhất', '10 Tháng Gần Nhất', '11 Tháng Gần Nhất', '12 Tháng Gần Nhất']

  const [data, setData]=useState(default_data)
  const [thongKeAnime, setThongKeAnime]=useState([])
  const [thongKeSanPham, setThongKeSanPham]=useState([])
  const [soThang, setSoThang]=useState(6)

  const chartConfig = {
    backgroundGradientFrom: "#000",
    backgroundGradientFromOpacity: 0.2,
    backgroundGradientTo: "#000",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(256, 256, 256, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
  };

  const piechartConfig = {
    backgroundGradientFrom: "#000",
    backgroundGradientFromOpacity: 0.2,
    backgroundGradientTo: "#000",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(256, 256, 256, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optional
  };
  
  useEffect(()=>{
    if(firstRun == 0){
      navigation.addListener('focus', () => {})

      var currentdate = new Date();
      var currentyear = currentdate.getFullYear()
      setNam(currentyear)
    
      getThongKeAnime()
      getThongKeSanPham()
      getDoanhThuNam(currentyear)
      getLoiNhuanNam(currentyear)
      getSoDonDatHang(currentyear)
      getSoDonBanHang(currentyear)

      getDoanhThuNThang(6, nam)
      setFirstRun((firstRun)=>firstRun += 1) //đánh dấu lần chạy đầu
    }
  }) 

  const getDoanhThuNThang = async (n, year)=>{
    var currentdate = new Date();
    var currentMonth = currentdate.getMonth() + 1
    var currentYear = currentdate.getFullYear()

    var lbls = [] //Label Tháng
    for (var i = 1; i <= n; i++)
    {
        var thang = currentMonth - n + i
        if (thang <= 0) thang += 12
        lbls.push('T.'+ thang.toString() )
    }

    var doanhthus=[]
    for (var i = currentMonth - n + 1; i <= currentMonth; i++ )
    {
        var th = i
        if(th <= 0) 
        {
            th += 12
            var doanhthuthang_n = await getDoanhThuThang(th, year - 1)/1000 //chuyen thanh k
            doanhthus.push(doanhthuthang_n)
        }
        else
        {
            var doanhthuthang_n = await getDoanhThuThang(th, year)/1000 //chuyen thanh k
            doanhthus.push(doanhthuthang_n)
        }
    }

    setData({
        labels: lbls,
        datasets: [
          {
            data: doanhthus,
            strokeWidth: 2 // optional
          },
        ],
        legend: [" Doanh Thu "+ n + " Tháng Gần Nhất"] // optional
      })
    setIsLoading(false)
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
    return tt
  }

  const getDoanhThuNam = async (nam)=>{
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
                    if(ngay_dat_san_pham[2] == nam)
                        tt += donhang_value.TongTien
                }
              }
        }
      }
    })
    setTongDoanhThu(tt)
  }

  const getThongKeAnime = async ()=>{
    var tk = []
    await firebaseApp.database().ref('Guest').orderByChild('TrangThai').equalTo('on').once('value', (snapshot)=>{
      if(snapshot.exists())
      for (let [sdt_key, sdt_value] of Object.entries(snapshot.val() )) {
        if(sdt_value.TrangThai == 'on' && sdt_value.DonHang)
        {
            for (let [donhang_key, donhang_value] of Object.entries(sdt_value.DonHang )) {
                if(donhang_value.TrangThai == 'on' && donhang_value.SanPhamMua )
                {
                    for (let [sanphammua_key, sanphammua_value] of Object.entries(donhang_value.SanPhamMua )){
                        const vitri = checkAnimeExistInArr(tk, sanphammua_value.TenAnime)
                        if(vitri == -1)
                        {
                            var clr = GenerateColor()
                            tk.push({name: sanphammua_value.TenAnime,
                                     SoLuong: sanphammua_value.SoLuongMua, 
                                     color: clr,
                                     legendFontColor: "#000",
                                     legendFontSize: 12
                                    })
                         }
                        else
                            tk[vitri].SoLuong += sanphammua_value.SoLuongMua

                    }
                }
              }
        }
      }
    })
    setThongKeAnime(tk)
  }

  const getThongKeSanPham = async ()=>{
    var tk = []
    await firebaseApp.database().ref('Guest').orderByChild('TrangThai').equalTo('on').once('value', (snapshot)=>{
      if(snapshot.exists())
      for (let [sdt_key, sdt_value] of Object.entries(snapshot.val() )) {
        if(sdt_value.TrangThai == 'on' && sdt_value.DonHang)
        {
            for (let [donhang_key, donhang_value] of Object.entries(sdt_value.DonHang )) {
                if(donhang_value.TrangThai == 'on' && donhang_value.SanPhamMua )
                {
                    for (let [sanphammua_key, sanphammua_value] of Object.entries(donhang_value.SanPhamMua )){
                        const vitri = checkSanPhamExistInArr(tk, sanphammua_value.IdSanPham)
                        if(vitri == -1)
                        {
                            tk.push({TenSanPham: sanphammua_value.TenSanPham,
                                    IdSanPham:sanphammua_value.IdSanPham,
                                     SoLuong: sanphammua_value.SoLuongMua,
                                     HinhAnh:sanphammua_value.HinhAnh[0],
                                     TenAnime:sanphammua_value.TenAnime,
                                    })
                         }
                        else
                            tk[vitri].SoLuong += sanphammua_value.SoLuongMua

                    }
                }
              }
        }
      }
    })
    if(tk.length > 1) tk.sort((a, b) => parseFloat(b.SoLuong) - parseFloat(a.SoLuong)); //sap xep tang dan
    if(tk.length > 10) tk.slice(0,9)
    setThongKeSanPham(tk)
  }

  const checkAnimeExistInArr = (arr, anime)=>{ //Neu tim ra return vi tri trong array, ko tim ra return -1
    var found = -1 ; 
    for(var i = 0; i < arr.length; i++) {
        if (arr[i].name == anime) {
            found = i;
            break;
        }
    }
    return found
  }

  const checkSanPhamExistInArr = (arr, idsp)=>{ //Neu tim ra return vi tri trong array, ko tim ra return -1
    var found = -1 ; 
    for(var i = 0; i < arr.length; i++) {
        if (arr[i].IdSanPham == idsp) {
            found = i;
            break;
        }
    }
    return found
  }

  const GenerateColor = ()=>{
    const randomColor = Math.floor(Math.random()*16777215).toString(16);
    const result = '#'+ randomColor
    if(result.length < 7)
    result += '9' //random number
    return result
  }

  const getLoiNhuanNam = async (nam)=>{
    var ln = 0
    var dt = 0
    await firebaseApp.database().ref('Guest').orderByChild('TrangThai').equalTo('on').once('value', (snapshot)=>{
      if(snapshot.exists())
      {
        for (let [sdt_key, sdt_value] of Object.entries(snapshot.val() )) {
          if(sdt_value.TrangThai == 'on' && sdt_value.DonHang)
          {
              for (let [donhang_key, donhang_value] of Object.entries(sdt_value.DonHang )) {
                  if(donhang_value.TrangThai == 'on' && donhang_value.SanPhamMua && donhang_value.DaXacNhan == 1)
                  {
                      var ngay_dat_san_pham = donhang_value.NgayDat.split('/')
                      if(ngay_dat_san_pham[2] == nam)
                      {
                        dt+= donhang_value.TongTien
                        for (let [sanphammua_key, sanphammua_value] of Object.entries(donhang_value.SanPhamMua )){
                          ln += sanphammua_value.GiaGoc*sanphammua_value.SoLuongMua
                        }
                      }
                  }
                }
          }
        }
        var kq = dt - ln
        setTongLoiNhuan(kq)
      }
    })
    
  }

  const getSoDonDatHang = async (nam)=>{
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
                    if(ngay_dat_san_pham[2] == nam)
                        tt += 1
                }
              }
        }
      }
    })
    setSoDonDatHang(tt)
  }

  const getSoDonBanHang = async (nam)=>{
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
                    if(ngay_dat_san_pham[2] == nam)
                        tt += 1
                }
              }
        }
      }
    })
    setSoDonBanHang(tt)
  }

  const onSelectThang = (index, value)=>{
    setIsLoading(true)
    getDoanhThuNThang(index+1, nam)
    setNThangGanNhat(index+1)
  }


  const canPlusYear = ()=>{
    var result = true
    var currentdate = new Date();
    var currentyear = currentdate.getFullYear()
    if (nam >= currentyear) result = false
    return result
  }

  const PlusYear = async ()=>{
      setIsLoading(true)
      await getDoanhThuNam(nam+1)
      await getLoiNhuanNam(nam+1)
      await getSoDonDatHang(nam+1)
      await getSoDonBanHang(nam+1)
      await getDoanhThuNThang(nThangGanNhat, nam + 1)
      setNam(nam => nam+=1)

  }
  const minusYear = async ()=>{
    setIsLoading(true)
    await getDoanhThuNam(nam-1)
    await getLoiNhuanNam(nam-1)
    await getSoDonDatHang(nam-1)
    await getSoDonBanHang(nam-1)
    await getDoanhThuNThang(nThangGanNhat, nam - 1)
    setNam(nam => nam-=1)
}

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle='dark-content' translucent></StatusBar>
      <View style={styles.topdock}></View>
      {
          isLoading?
          <ActivityIndicator style={styles.indicator} color={WHITE} size='large' animating={true} ></ActivityIndicator>
        :
        <Fragment>
            <View style={styles.dropdownWrapper}>
                <View style={{flexDirection:'row'}}>
                    <IconButton icon='menu-left-outline' onPress={minusYear} color ={WHITE}></IconButton>
                    <Text style={styles.dropdownTxt}>Năm: {nam} </Text>
                    <IconButton style={canPlusYear()?{}:{display:'none'}} onPress={PlusYear} icon='menu-right-outline' color ={WHITE}></IconButton>
                </View>
                <ModalDropdown style={styles.dropdown} textStyle={styles.dropdownTxt} 
                options={dropdownOption}
                defaultIndex={5} 
                onSelect={onSelectThang}
                >
                    <Text style={styles.dropdownTxt}>{nThangGanNhat+' Tháng Gần Nhất'}</Text>
                </ModalDropdown>
            </View>
            <LineChart style={{alignSelf:'center', borderRadius:5, marginTop:10, marginBottom:10}}
            data={data}
            width={screenWidth*0.95}
            height={250}
            chartConfig={chartConfig}
            renderDotContent={({x, y, index}) => 
            (<View key={index}>
                <Text style={{position:'absolute', left:x-20, top:y+10, color:WHITE}}>{data.datasets[0].data[index]+'k'}</Text>
            </View>)}
            />
            <View style={styles.cardWrapper}>
                <LinearGradient 
                colors={['#9cff9c', GREEN]} 
                start={{x:0.3, y:0}} end={{x:1,y:0}}
                style={[styles.card,{ marginRight:5}]}>
                    <Text  style={styles.smallTxt}>Tổng Doanh Thu Năm</Text>
                    <Text style={styles.bigTxt}> {tongDoanhThu+' VNĐ'}</Text>
                </LinearGradient>
                <LinearGradient 
                colors={['#fabf66', '#ff7b00']} 
                start={{x:0.3, y:0}} end={{x:1,y:0}}
                style={[styles.card,{ marginRight:5}]}>
                    <Text  style={styles.smallTxt}>Tổng Lợi Nhuận Năm</Text>
                    <Text style={styles.bigTxt}> {tongLoiNhuan + ' VNĐ'}</Text>
                </LinearGradient>
            </View>

            <View style={styles.cardWrapper}>
                <LinearGradient 
                colors={['#61cdff', '#0062ff']} 
                start={{x:0.3, y:0}} end={{x:1,y:0}}
                style={[styles.card,{ marginRight:5}]}>
                    <Text  style={styles.smallTxt}>Số Đơn Bán Trong Năm</Text>
                    <Text style={styles.bigTxt}> {soDonBanHang}</Text>
                </LinearGradient>
                <LinearGradient 
                colors={['#de91ed', '#e505ed']} 
                start={{x:0.3, y:0}} end={{x:1,y:0}}
                style={[styles.card,{ marginRight:5}]}>
                    <Text  style={styles.smallTxt}>Số Đơn Đặt Trong Năm</Text>
                    <Text style={styles.bigTxt}> {soDonDatHang}</Text>
                </LinearGradient>
            </View>

            <View style={styles.pieChartWrapper}>
                <Text style={{fontWeight:'bold', fontSize:16, color:BLACK, marginLeft:20}}>Thống Kê Anime được chọn mua nhiều</Text>
                <PieChart
                data={thongKeAnime}
                width={screenWidth}
                height={220}
                chartConfig={chartConfig}
                accessor={"SoLuong"}
                backgroundColor={"transparent"}
                paddingLeft={"0"}
                //center={[10, 50]}
                //absolute
                />
            </View>

            <View style={styles.pieChartWrapper}>
                <Text style={{fontWeight:'bold', fontSize:16, color:BLACK, marginLeft:20}}>Thống Kê Top Sản Phẩm được chọn mua nhiều</Text>
                <FlatList style={styles.listSp}
                    data={thongKeSanPham}
                    keyExtractor={item=>item.HinhAnh}
                    renderItem={({item})=>(
                        <View style={styles.itemcard}>
                        <Image style={styles.img} resizeMode='cover' source ={{uri:item.HinhAnh}}></Image>
                        <View style={styles.cardInfoWrapper}>
                            <Text style={styles.nameTxt} numberOfLines={1}> {item.TenSanPham}</Text>
                            <View style={{flexDirection:'row'}}>
                                <Text style={{color:GREY}}> Anime: </Text>
                                <Text style={styles.detailTxt}>{item.TenAnime}</Text>
                            </View>
                            <Text style={styles.detailTxt}>Đã Bán: {' '+item.SoLuong}</Text>
                        </View>
                    </View>
                    )}
                ></FlatList>
            </View>
        </Fragment>
        }
    </ScrollView>
  );
}

var styles = StyleSheet.create({
  container:{
    height:'100%',
    backgroundColor:PRIMARY_COLOR
  },
  topdock:{
    height:120,
    backgroundColor:PRIMARY_COLOR,
    borderBottomRightRadius:70
  },
  indicator:{
      marginTop:'50%'
  },
  dropdownWrapper:{
      width:'100%',
      flexDirection:'row',
      justifyContent:'space-between',
      alignItems:'center',
      paddingRight:20,
      paddingLeft:10,
      marginTop:10,
  },
  dropdown:{
    borderWidth:1,
    borderColor:WHITE,
    height:30,
    width:140,
    borderRadius:5,
    justifyContent:'center',
    paddingLeft:5
  },
  dropdownTxt:{
      color:WHITE,
      textAlign:'center',
      alignSelf:'center',
},
cardWrapper:{
    height:90,
    //backgroundColor:BLACK,
    flexDirection:'row',
    paddingHorizontal:'5%',
    paddingTop:10,
},
card:{
    flex:1,
    borderRadius:5,
    paddingTop:5,
    paddingLeft:10,
},
smallTxt:{
    color:BLACK,
    fontSize:13,
},
bigTxt:{
    color:BLACK,
    fontSize:20,
    fontWeight:'bold',
    
},
pieChartWrapper:{
    backgroundColor:WHITE,
    marginTop:20,
    marginHorizontal:'5%',
    paddingVertical:10,
    borderRadius:5

},
listSp:{
    marginTop:10
},
//card:
itemcard:{
    //backgroundColor:'#898900',
    width:'90%',
    height:90,
    alignSelf:'center',
    borderRadius:5,
    flexDirection:'row',
    //borderBottomWidth:1,
    borderBottomColor:GREY,
},
img:{
    backgroundColor:'#000',
    width:70,
    height:70,
    borderRadius:5
    //borderTopLeftRadius:5,
    //borderBottomLeftRadius:5,
},
cardInfoWrapper:{
    //backgroundColor:PRIMARY_COLOR,
    flex:1,
    marginLeft:10,
},
nameTxt:{
    fontSize:15,
    marginTop:5,
    lineHeight:20,
    color:GREY,
    width:'100%'
    //backgroundColor:BLACK
},
detailTxt:{
    fontWeight:'bold',
    fontSize:15,
    width:100,
    marginLeft:5
    //backgroundColor:BLACK
},
})
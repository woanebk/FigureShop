import React, { useState, useEffect, useLayoutEffect, Fragment } from 'react';
import { View, StyleSheet, StatusBar, TouchableOpacity, FlatList, Text, ActivityIndicator } from 'react-native';
import { GREY, GREY_BORDER, OFF_WHITE, PRIMARY_COLOR, WHITE } from '../common';
import { ListItem, OrderListItem } from '../items';
import { firebaseApp } from '../firebaseconfig';
import Dialog, { DialogFooter, DialogButton, DialogContent, DialogTitle, SlideAnimation } from 'react-native-popup-dialog';

export default function Guestinfo({ route, navigation }) {
    const { phoneNumber } = route.params;
    const [listDonDatHang, setListDonDatHang] = useState();
    const [firstRun, setFirstRun] = useState(0);
    const [deleteID, setDeleteID] = useState(''); //id  để xóa
    const [soDienThoaitoDelete, setSoDienThoaitoDelete] = useState(''); //sdt  để xóa

    const [dialogVisable, setDialogVisable] = useState(false); // true thì hiện dialog, false thì ẩn
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (firstRun == 0) {
            navigation.addListener('focus', () => { getDonDatHang() })
            setFirstRun((firstRun) => firstRun += 1) //đánh dấu lần chạy đầu
        }

        if (deleteID !== '')
            openDialog(); //callback khi nhấn chọn delete tránh trường hợp deleteid không thay đổi ngay
    })

    const getDonDatHang = () => {
        let list = [];
        firebaseApp.database().ref('Guest/' + phoneNumber+'/DonHang').orderByChild('TrangThai').equalTo('on').on('value', (snapshot) => {
            if (snapshot.exists()) {
                list = []; 
                snapshot.forEach((child) => {
                    
                    list.push({
                        IdDonDatHang: child.key,
                        DaXacNhan: child.val().DaXacNhan,
                        DiaChi: child.val().DiaChi,
                        TenKhachHang: child.val().HoTen,
                        NgayDat: child.val().NgayDat,
                        TongSoLuongMua: child.val().TongSoLuongMua,
                        TongTien: child.val().TongTien,
                        TrangThai: child.val().TrangThai,
                        SoDienThoai: phoneNumber
                      })
                })
            }
        })
        setListDonDatHang(list)
        console.log("done")
        setIsLoading(false)
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
        // arr.forEach(item => {
        //     tongsoluong += item.SoLuongMua
        // });
        return tongsoluong
    }

    const canCcanConfirmDatHang = (sdt, iddondathang) => { //Neu du so luong de ban thi true
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

    return (
        <View style={styles.container}>
            <StatusBar barStyle='dark-content' translucent></StatusBar>
            <View style={styles.topdock}></View>
            {
                isLoading ?
                    <ActivityIndicator style={styles.indicator} animating={isLoading} color='#bc2b78' size="large" />
                    :
                    <Fragment>
                        <FlatList style={styles.list}
                            data={listDonDatHang}
                            renderItem={({ item }) => (
                                <OrderListItem name={item.TenKhachHang} maDonHang={item.IdDonDatHang}
                                    phoneNumber={item.SoDienThoai} soLuongSanPham={item.TongSoLuongMua}
                                    canConfirm={true}
                                    tongtien={item.TongTien}
                                    onPress={() => navigation.navigate('OrderDetail', { so_dien_thoai: item.SoDienThoai, id_don_dat_hang: item.IdDonDatHang })}
                                    ngayDat={item.NgayDat}
                                    onDeletePress={() => onDeleteDonDatHang(item.SoDienThoai, item.IdDonDatHang)}
                                ></OrderListItem>
                            )}
                            keyExtractor={item => item.IdDonDatHang}
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
        borderColor: GREY_BORDER
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
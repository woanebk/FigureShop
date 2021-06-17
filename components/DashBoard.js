import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {PRIMARY_COLOR} from '../common'

function DashBoard(props){
    return(
        <View style={styles.container}>
            <View style={styles.tab}>
                <Text style={styles.tabNameTxt}>Đơn Đặt{'  '}</Text>
                <Text style={styles.tabDetailTxt}>{props.sodondat + '  '}</Text>
            </View>

            <View style={styles.tab}>
                <Text style={styles.tabNameTxt}>Đơn bán{'  '}</Text>
                <Text style={styles.tabDetailTxt}>{props.sodonban + '  '}</Text>
            </View>

            <View style={styles.tab}>
                <Text style={styles.tabNameTxt}>Doanh thu{'  '}</Text>
                <Text style={styles.tabDetailTxt}>{props.doanhthu + '  '}</Text>
            </View>
        </View>
    );
}

var styles = StyleSheet.create({
  container:{
    height:70,
    borderRadius:5,
    backgroundColor:PRIMARY_COLOR,
    elevation:15,
    justifyContent:'space-evenly',
    flexDirection:'row',
  },
  tab:{
      alignItems:'center',
      alignSelf:'center'
  },
  tabNameTxt:{
    fontSize:14
  },
  tabDetailTxt:{
    fontSize:25,
    marginTop:3,
    fontWeight:'bold',
  }
})

export default DashBoard;



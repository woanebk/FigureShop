import React,{state,useEffect} from 'react';
import { StyleSheet,ImageBackground, LogBox, View,StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {TabNavigator} from './StackNavigate';
import { PRIMARY_COLOR, WHITE } from './common';
import { createStackNavigator } from '@react-navigation/stack';
import CartScreen from './screens/CartScreen';
import BG from './images/bg.png'
import LoginForm from './screens/login/LoginForm';
import Loading from './screens/login/Loading'
import CartContext from './CartContext'
// //Bottom Tab:
import { useState } from 'react';
import { firebaseApp } from './firebaseconfig';
import ItemDetailScreen from './screens/ItemDetailScreen';
import CheckOutScreen from './screens/CheckOutScreen';
import SuccessOrderScreen from './screens/SuccessOrderScreen';

const MainStack = createStackNavigator()

export default function App(navigation) { 
  const [state, setState] = useState(false)
  const [cart, setCart] = useState([])
  const defaultCartContextValue = {cart, setCart} //value của context gồm 1 biến state, 1 setstate của App.js
  
  useEffect(() => {
    firebaseApp.auth().onAuthStateChanged(async(user)  => {
      if(user){
         setState(true
         )
      }else{
        setState(false)
       // setCart([])
      }
    })
    return () => { }
  })

  LogBox.ignoreLogs(['Warning: ...']);
  LogBox.ignoreAllLogs();//ignore warning

// return <authen/>
    switch (state) {
    case false:
      return(
        <View style={{flex:1}}>
   
      <ImageBackground style={styles.container} source={BG} >
        <LoginForm />
      </ImageBackground></View>);
    case true:
      return (
        <CartContext.Provider value = {defaultCartContextValue}>
          <NavigationContainer >
            <MainStack.Navigator initialRouteName='Tab'>
              <MainStack.Screen name='Tab' component={TabNavigator}
              options={{
                headerShown:false,
              }}
              ></MainStack.Screen>
              <MainStack.Screen name='Cart' component={CartScreen}
                options={{
                  headerShown:true,
                  headerTransparent:true,
                  headerTintColor:WHITE,
                  title:''
                }}
              ></MainStack.Screen>
              <MainStack.Screen name='ItemDetail' component={ItemDetailScreen}
                options={{
                  headerTitleStyle:{
                    color:'#fff',
                  },
                  title:'',
                  headerTransparent:true,
                  headerStyle: {
                    backgroundColor: 'transparent',
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 0,
                  },
                  headerTintColor: PRIMARY_COLOR,
                }}
                ></MainStack.Screen>
                <MainStack.Screen name='CheckOut' component={CheckOutScreen}
                options={{
                  headerShown:true,
                  headerTransparent:true,
                  headerTintColor:WHITE,
                  title:'Thanh Toán',
                }}
              ></MainStack.Screen>
              <MainStack.Screen name='SuccessOrder' component={SuccessOrderScreen}
                options={{
                  headerShown:false,
                  headerTransparent:true,
                  headerTintColor:WHITE,
                  title:'Chi Tiết Đơn Hàng',
                }}
              ></MainStack.Screen>
            </MainStack.Navigator>
          </NavigationContainer>
        </CartContext.Provider>
      )
      default: 
      return <Loading/>
    }
  }
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


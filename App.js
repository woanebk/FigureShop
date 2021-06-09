import React,{state,useEffect} from 'react';
import { StyleSheet,ImageBackground, } from 'react-native';
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
import { useState } from 'react/cjs/react.development';
import { firebaseApp } from './firebaseconfig';
import ItemDetailScreen from './screens/ItemDetailScreen';
import CheckOutScreen from './screens/CheckOutScreen';

const MainStack = createStackNavigator()

export default function App(navigation) { 

  const [state, setState] = useState(null)
  const [cart, setCart] = useState([])
  const defaultCartContextValue = {cart, setCart} //value của context gồm 1 biến state, 1 setstate của App.js
  
  useEffect(() => {
    firebaseApp.auth().onAuthStateChanged(user => {
      if(user){
         setState(true
         )
      }else{
        setState(false
        )
      }
    })
    return () => { }
  })
// return <authen/>
    switch (state) {
    case false:
      return <ImageBackground style={styles.container} source={BG} >
        <LoginForm />
      </ImageBackground>
    case true:
      return (
        <CartContext.Provider value = {defaultCartContextValue}>
          <NavigationContainer >
            <MainStack.Navigator>
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


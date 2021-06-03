import { StatusBar } from 'expo-status-bar';
import React,{state,useEffect} from 'react';
import { StyleSheet,ImageBackground } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import {TabNavigator, CategoryStackNavigator, HomeStackNavigator, ProfileStackNavigator, SearchStackNavigator } from './StackNavigate';
import { PRIMARY_COLOR, WHITE } from './common';
import { createStackNavigator } from '@react-navigation/stack';
import CartScreen from './screens/CartScreen';
import BG from './images/bg.png'
import LoginForm from './screens/login/LoginForm';
import Loading from './screens/login/Loading'

// import firebase from './firebaseconfig';
// //Bottom Tab:
import firebase from 'firebase/app';
import { useState } from 'react/cjs/react.development';
import { firebaseApp } from './firebaseconfig';

const MainStack = createStackNavigator()

export default function App(navigation) { 
  const [state, setState] = useState(null)
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
    switch (state) {
    case false:
      return <ImageBackground style={styles.container} source={BG} >
        <LoginForm />
      </ImageBackground>
    case true:
      return (
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
        </MainStack.Navigator>
      </NavigationContainer>
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


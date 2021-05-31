import { StatusBar } from 'expo-status-bar';
import React,{state} from 'react';
import { StyleSheet,ImageBackground } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import { NavigationContainer } from '@react-navigation/native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { CategoryStackNavigator, HomeStackNavigator, ProfileStackNavigator, SearchStackNavigator } from './StackNavigate';
import { PRIMARY_COLOR } from './common';
import BG from './images/bg.png'
import LoginForm from './screens/login/LoginForm';
import Loading from './screens/login/Loading'

// import firebase from './firebaseconfig';
// //Bottom Tab:
import firebase from 'firebase/app';
import { useState } from 'react/cjs/react.development';

const Tab = createMaterialBottomTabNavigator();

export default function App(navigation) {
  //  state = {
  //   loggedIn: null
  // }
  
  const [state, setState] = useState({
    loggedIn: false
  })
  // componentDidMount() 
  // {
    var firebaseConfig = {
      apiKey: "AIzaSyC9c1G185BnPCkyv7UxL3vfJEtSyaPJjUI",
      authDomain: "figureshop-9cdf3.firebaseapp.com",
      projectId: "figureshop-9cdf3",
      storageBucket: "figureshop-9cdf3.appspot.com",
      messagingSenderId: "1035269537251",
      appId: "1:1035269537251:web:0b3f5398cda9723e68b4d6",
      databaseURL: "https://figureshop-9cdf3-default-rtdb.asia-southeast1.firebasedatabase.app"
    };
    // componentDidMount()
    // { 
     firebase.auth().onAuthStateChanged(user => {
          if(user){
             this.setState({
               loggedIn:true
             })
          }else{
            this.setState({
              loggedIn:false
            })
          }
     })
     //}
  switch (state.loggedIn) {
    case false:
      return <ImageBackground style={styles.container} source={BG} >
        <LoginForm />
      </ImageBackground>
    case true:
      return (

        <NavigationContainer >
          <Tab.Navigator
            shifting='true'
            activeColor="#f0edf6"
            inactiveColor="#000000"
            barStyle={{ backgroundColor: '#fe4a49' }}>
            <Tab.Screen name="HomeTab" component={HomeStackNavigator}
              options={{
                tabBarLabel: 'Home', tabBarColor: PRIMARY_COLOR, tabBarIcon: ({ color }) => (
                  <MaterialIcons name='home' color={color} size={26}></MaterialIcons>
                ),
              }} />

            <Tab.Screen name="CategoryTab" component={CategoryStackNavigator}
              options={{
                tabBarLabel: 'Anime', tabBarColor: PRIMARY_COLOR, tabBarIcon: ({ color }) => (
                  <MaterialIcons name='menu' color={color} size={26}></MaterialIcons>
                ),
              }} />

            <Tab.Screen name="SearchTab" component={SearchStackNavigator}
              options={{
                tabBarLabel: 'Search', tabBarColor: PRIMARY_COLOR, tabBarIcon: ({ color }) => (
                  <MaterialIcons name='search' color={color} size={26}></MaterialIcons>
                ),
              }} />

            <Tab.Screen name="ProFileTab" component={ProfileStackNavigator}
              options={{
                tabBarLabel: 'Profile', tabBarColor: PRIMARY_COLOR, tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="account" color={color} size={26} />
                ),
              }} />
          </Tab.Navigator>
        </NavigationContainer>
      )
      default: 
      return <Loading/>
    }}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


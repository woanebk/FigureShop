import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import {TabNavigator, CategoryStackNavigator, HomeStackNavigator, ProfileStackNavigator, SearchStackNavigator } from './StackNavigate';
import { PRIMARY_COLOR, WHITE } from './common';
import { createStackNavigator } from '@react-navigation/stack';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';

const MainStack = createStackNavigator()

export default function App(navigation) {
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
        <MainStack.Screen name='Login' component={LoginScreen}
        ></MainStack.Screen>
      </MainStack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


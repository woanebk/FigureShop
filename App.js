import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import { NavigationContainer } from '@react-navigation/native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { HomeStackNavigator, ProfileStackNavigator, SearchStackNavigator } from './StackNavigate';
import { PRIMARY_COLOR } from './common';

//Bottom Tab:
const Tab = createMaterialBottomTabNavigator();

export default function App(navigation) {
  return (
    <NavigationContainer >
      <Tab.Navigator
      shifting='true'
      activeColor="#f0edf6"
      inactiveColor="#000000"
      barStyle={{ backgroundColor: '#fe4a49' }}>
        <Tab.Screen name="HomeTab" component={HomeStackNavigator} 
        options={{ tabBarLabel: 'Home', tabBarColor:PRIMARY_COLOR, tabBarIcon: ({ color }) => (
            <MaterialIcons name='home' color={color} size={26}></MaterialIcons>
          ),
        }}/>
        
        <Tab.Screen name="SearchTab" component={SearchStackNavigator} 
        options={{ tabBarLabel: 'Search', tabBarColor:PRIMARY_COLOR, tabBarIcon: ({ color }) => (
          <MaterialIcons name='search' color={color} size={26}></MaterialIcons>
          ),
        }}/>

        <Tab.Screen name="ProFileTab" component={ProfileStackNavigator} 
        options={{ tabBarLabel: 'Profile',tabBarColor:PRIMARY_COLOR, tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account" color={color} size={26} />
          ),
        }}/>
      </Tab.Navigator>
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


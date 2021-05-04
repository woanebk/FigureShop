import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { View, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

import { HomeScreen, SearchScreen, ProfileScreen, ItemDetailScreen } from './index';
import { IconButton } from "react-native-paper";

const HomeStack = createStackNavigator();
const SearchStack = createStackNavigator();
const ProfileStack = createStackNavigator();

const HomeStackNavigator = (navigation)=>{
    return(
        <HomeStack.Navigator
            screenOptions={{
            headerStyle: {
              backgroundColor: '#FFF',
              //xoa shadow header
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            headerTintColor: '#333',
            headerTitleStyle: {
              alignSelf:'center'
            },
            headerTitleAlign:'center'
          }}
        >
            <HomeStack.Screen name='Home' component={HomeScreen}
            options={{
              title:'Figure Shop',
              headerLeft:()=>(
                <View style={{marginLeft:10}}>
                  <IconButton icon="menu" onPress={() => console.log('Menu Pressed')}
                color = "#FF6347" size={25}/>
                </View>
              ),
              headerRight:()=>(
                <View style={{marginLeft:10}}>
                  <IconButton icon="shopping" onPress={() => console.log('Bag Pressed')}
                color = "#FF6347" size={25}/>
                </View>
              ),
            }}
            />

            <HomeStack.Screen name='ItemDetail' component={ItemDetailScreen}
            options={{
              headerTitleStyle:{
                color:'#fff',
              },
              title:'',
              headerStyle: {
                backgroundColor: 'transparent',
                elevation: 0,
                shadowOpacity: 0,
                borderBottomWidth: 0,
              },
              headerTintColor: '#fff',
              headerRight:()=>(
                <View style={{marginLeft:10}}>
                  <IconButton icon="shopping" onPress={() => console.log('Bag Pressed')}
                color = "#fff" size={25}/>
                </View>
              ),
            }}
            ></HomeStack.Screen>
        </HomeStack.Navigator>
    );
}

const SearchStackNavigator = (navigation)=>{
  return(
      <SearchStack.Navigator
          screenOptions={{
          headerStyle: {
            backgroundColor: '#FFF',
            //xoa shadow header
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTintColor: '#333',
          headerTitleStyle: {
            alignSelf:'center'
          },
          headerTitleAlign:'center'
        }}
      >
          <SearchStack.Screen name='Search' component={SearchScreen}
          options={{
            title:'Figure Shop',
            headerLeft:()=>(
              <View style={{marginLeft:10}}>
                <IconButton icon="menu" onPress={() => console.log('Menu Pressed')}
              color = "#FF6347" size={25}/>
              </View>
            ),
            headerRight:()=>(
              <View style={{marginLeft:10}}>
                <IconButton icon="shopping" onPress={() => console.log('Bag Pressed')}
              color = "#FF6347" size={25}/>
              </View>
            ),
          }}
          />

          <SearchStack.Screen name='ItemDetail' component={ItemDetailScreen}
          options={{
            headerTitleStyle:{
              color:'#fff',
            },
            title:'',
            headerStyle: {
              backgroundColor: 'transparent',
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            headerTintColor: '#fff',
            headerRight:()=>(
              <View style={{marginLeft:10}}>
                <IconButton icon="shopping" onPress={() => console.log('Bag Pressed')}
              color = "#fff" size={25}/>
              </View>
            ),
          }}
          ></SearchStack.Screen>
      </SearchStack.Navigator>
  );
}

const ProfileStackNavigator = (navigation)=>{
  return(
      <ProfileStack.Navigator
          screenOptions={{
          headerStyle: {
            backgroundColor: '#FFF',
            //xoa shadow header
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTintColor: '#333',
          headerTitleStyle: {
            alignSelf:'center'
          },
          headerTitleAlign:'center'
        }}
      >
          <ProfileStack.Screen name='Profile' component={ProfileScreen}
          options={{
            title:'',
            headerStyle:{
              backgroundColor:'transparent',
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 0,
            },
            headerLeft:()=>(
              <View style={{marginLeft:10}}>
                <IconButton icon="menu" onPress={() => console.log('Menu Pressed')}
              color = "#FF6347" size={25}/>
              </View>
            ),
          }}
          />
      </ProfileStack.Navigator>
  );
}

export {HomeStackNavigator,SearchStackNavigator, ProfileStackNavigator};
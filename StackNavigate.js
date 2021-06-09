import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { View, TouchableOpacity } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import ProfileScreen from './screens/ProfileScreen';
import ItemDetailScreen from './screens/ItemDetailScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import AllUserScreen from './screens/AllUserScreen';
import AddUserScreen from './screens/AddUserScreen';
import AllGuestScreen from './screens/AllGuestScreen';
import AddGuestScreen from './screens/AddGuestScreen';
import CategoryItemsScreen from './screens/CategoryItemsScreen';
import AddCategoryScreen from './screens/AddCategoryScreen';
import ManageCategoryScreen from './screens/ManageCategoryScreen';
import CartScreen from './screens/CartScreen';

import { IconButton } from "react-native-paper";
import { BLACK, PRIMARY_COLOR, WHITE } from "./common";
import AllCategoryScreen from "./screens/AllCategoryScreen";
import ManageFiguresScreen from "./screens/ManageFiguresScreen";
import AddFigureScreen from "./screens/AddFigureScreen";
import MultiImagePickScreen from "./screens/MultiImagePickScreen";

const Tab = createMaterialBottomTabNavigator();//Bottom Tab:

const HomeStack = createStackNavigator();
const SearchStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const CategoryStack = createStackNavigator();

const TabNavigator = ({ navigation }) => {
  return (
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
  )
}

const HomeStackNavigator = ({ navigation }) => {
  return (
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
          alignSelf: 'center'
        },
        headerTitleAlign: 'center',
        headerRight: () => (
          <View style={{ marginLeft: 10 }}>
            <IconButton icon="shopping" onPress={() => navigation.navigate('Cart')}
              color='#fff' size={25} />
          </View>
        ),
      }}
    >
      <HomeStack.Screen name='Home' component={HomeScreen}
        options={{
          title: 'Figure Shop',
          headerLeft: () => (
            <View style={{ marginLeft: 10 }}>
              <IconButton icon="menu" onPress={() => console.log('Menu Pressed')}
                color="#FF6347" size={25} />
            </View>
          ),
          headerRight: () => ( //Để Cái nút này cho Khác màu với cái nút chung ở các màn hình khác
            <View style={{ marginLeft: 10 }}>
              <IconButton icon="shopping" onPress={() => navigation.navigate('Cart')}
                color={PRIMARY_COLOR} size={25} />
            </View>
          ),
        }}
      />

      <HomeStack.Screen name='CategoryItems' component={CategoryItemsScreen}
        options={{
          headerTitleStyle: {
            color: '#fff',
          },
          title: '',
          headerTransparent: true,
          headerStyle: {
            backgroundColor: 'transparent',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTintColor: '#fff',
        }}
      ></HomeStack.Screen>
    </HomeStack.Navigator>
  );
}

const CategoryStackNavigator = ({ navigation }) => {
  return (
    <CategoryStack.Navigator
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
          alignSelf: 'center'
        },
        headerTitleAlign: 'center',
        headerRight: () => (
          <View style={{ marginLeft: 10 }}>
            <IconButton icon="shopping" onPress={() => navigation.navigate('Cart')}
              color={BLACK} size={25} />
          </View>
        ),
      }}
    >
      <CategoryStack.Screen name='AllCategory' component={AllCategoryScreen}
        options={{
          headerTitleStyle: {
            color: '#000',
          },
          title: 'Danh Mục Anime',
          headerStyle: {
            backgroundColor: '#fff',
            //elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTintColor: '#fff',
        }}
      ></CategoryStack.Screen>

      <HomeStack.Screen name='CategoryItemsTab2' component={CategoryItemsScreen}
        options={{
          headerTitleStyle: {
            color: '#fff',
          },
          title: '',
          headerTransparent: true,
          headerStyle: {
            backgroundColor: 'transparent',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTintColor: '#fff',
        }}
      ></HomeStack.Screen>
    </CategoryStack.Navigator>
  );
}

const SearchStackNavigator = ({ navigation }) => {
  return (
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
          alignSelf: 'center'
        },
        headerTitleAlign: 'center',
        headerRight: () => (
          <View style={{ marginLeft: 10 }}>
            <IconButton icon="shopping" onPress={() => navigation.navigate('Cart')}
              color="#FF6347" size={25} />
          </View>
        ),
      }}
    >
      <SearchStack.Screen name='Search' component={SearchScreen}
        options={{
          title: 'Figure Shop',
          headerLeft: () => (
            <View style={{ marginLeft: 10 }}>
              <IconButton icon="menu" onPress={() => console.log('Menu Pressed')}
                color="#FF6347" size={25} />
            </View>
          ),
        }}
      />
    </SearchStack.Navigator>
  );
}

const ProfileStackNavigator = (navigation) => {
  return (
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
          alignSelf: 'center'
        },
        headerTitleAlign: 'center'
      }}
    >
      <ProfileStack.Screen name='Profile' component={ProfileScreen}
        options={{
          title: '',
          headerStyle: {
            backgroundColor: 'transparent',
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTransparent: true,
          headerLeft: () => (
            <View style={{ marginLeft: 10 }}>
              <IconButton icon="menu" onPress={() => console.log('Menu Pressed')}
                color="#FF6347" size={25} />
            </View>
          ),

        }}
      />

      <ProfileStack.Screen name='EditProfile' component={EditProfileScreen}
        options={{
          headerTransparent: true,
          headerTintColor: '#fff'
        }}>
      </ProfileStack.Screen>
      <ProfileStack.Screen name='AllUser' component={AllUserScreen}
        options={{
          headerTransparent: true,
          headerTintColor: '#fff',
          title: 'Danh Sách Người Dùng'
        }}>
      </ProfileStack.Screen>

      <ProfileStack.Screen name='AddUser' component={AddUserScreen}
        options={{
          headerTransparent: true,
          headerTintColor: '#fff',
          title: 'Thông tin người dùng'
        }}>
      </ProfileStack.Screen>
      <ProfileStack.Screen name='AllGuest' component={AllGuestScreen}
        options={{
          headerTransparent: true,
          headerTintColor: '#fff',
          title: 'Danh Sách Khách hàng'
        }}>
      </ProfileStack.Screen>

      <ProfileStack.Screen name='AddGuest' component={AddGuestScreen}
        options={{
          headerTransparent: true,
          headerTintColor: '#fff',
          title: 'Thông tin khách hàng'
        }}>
      </ProfileStack.Screen>

      <ProfileStack.Screen name='ManageCategory' component={ManageCategoryScreen}
        options={{
          headerTransparent: true,
          headerTintColor: '#fff',
          title: 'Danh Sách Loại Sản Phẩm'
        }}>
      </ProfileStack.Screen>

      <ProfileStack.Screen name='AddCategory' component={AddCategoryScreen}
        options={{
          headerTransparent: true,
          headerTintColor: '#fff',
          title: 'Thêm Loại Sản Phẩm'
        }}>
      </ProfileStack.Screen>

      <ProfileStack.Screen name='ManageFigures' component={ManageFiguresScreen}
        options={{
          headerTransparent: true,
          headerTintColor: '#fff',
          title: 'Danh Sách Sản Phẩm'
        }}>
      </ProfileStack.Screen>

      <ProfileStack.Screen name='AddFigure' component={AddFigureScreen}
        options={{
          headerTransparent: true,
          headerTintColor: '#fff',
          title: 'Thêm Sản Phẩm'
        }}>
      </ProfileStack.Screen>
      <ProfileStack.Screen name='MultiImagePick' component={MultiImagePickScreen}
        options={{
          headerTransparent: true,
          headerTintColor: '#000',
          title: 'Chọn Ảnh'
        }}>
      </ProfileStack.Screen>

    </ProfileStack.Navigator>
  );
}

export { TabNavigator, HomeStackNavigator, SearchStackNavigator, ProfileStackNavigator, CategoryStackNavigator };
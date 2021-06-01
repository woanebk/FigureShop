//import liraries
import React, { Component } from 'react';
import firebase from 'firebase'
import { View, Text, StyleSheet,TextInput,TouchableOpacity, LogBox } from 'react-native';
import Dialog, { DialogFooter, DialogButton, DialogContent, DialogTitle, SlideAnimation } from 'react-native-popup-dialog';

// create a component
class EmailAndPassword extends Component {
    state={
        email:'',
        password:'',
        error:'',
        loading:false
    }
    onBottomPress = () =>{
        firebase.auth().signInWithEmailAndPassword(this.state.email,this.state.password)
        .then(this.onLoginSuccess)
        .catch(err => {
          this.setState({
            error:err.message })
        })

    
    }
    onBottomPressguest = () =>{
      firebase.auth().signInWithEmailAndPassword("khach@gmail.com","khachdata").then(this.onLoginSuccess)
      }
  
    onLoginSuccess =  () =>{
        this.setState({
            error:'',
            loading:false
        })
    }


    render() {
        return (
            <View style={styles.container}>
                 <TextInput
                    placeholder="email" 
                    style={styles.input} 
                    value={this.state.email}
                    onChangeText={email=> this.setState({email})}
                     />

                 <TextInput 
                    placeholder="password" 
                    style={styles.input}
                    secureTextEntry
                     value={this.state.password}
                     onChangeText={password => this.setState({password})}
                     />

                 <TouchableOpacity style={styles.buttonContainer} onPress=
                 {this.onBottomPress} >
                     <Text style={styles.buttonText}>Login</Text>
                 </TouchableOpacity>

                 <Text style={styles.errorText,fontSize=14
                } >
                         {this.state.error}
                     </Text>
                  <TouchableOpacity style={styles.buttonText} onPress=
                  {
                    this.onBottomPressguest 
                    
                  } >
                     <Text style={styles.buttonText}>Continue as guest</Text>
                 </TouchableOpacity>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding:20
      
     
    },
    input:{
        height:40,
        backgroundColor:'rgba(255,255,255,.5)',
        //width:200,
        alignItems:'center',
        paddingLeft:10,
        marginBottom:15,
        borderRadius:5,
        fontSize:15,
    
    },
    errorText:{
        fontSize:25,
        color:'red',
        alignSelf:'center',
        marginTop:10

    },
    buttonText:{
        textAlign:'center',
        color:'#fff',
        fontWeight:'bold',
        fontSize:20
    },
    buttonContainer:{
        backgroundColor:'#FF6347',
        padding:15,
        borderRadius:8
    }
});

//make this component available to the app
export default EmailAndPassword;

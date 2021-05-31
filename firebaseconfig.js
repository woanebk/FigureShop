import firebase from 'firebase/app';
// import 'firebase/storage';
// import 'firebase/database';
// import 'firebase/auth';

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyC9c1G185BnPCkyv7UxL3vfJEtSyaPJjUI",
  authDomain: "figureshop-9cdf3.firebaseapp.com",
  projectId: "figureshop-9cdf3",
  storageBucket: "figureshop-9cdf3.appspot.com",
  messagingSenderId: "1035269537251",
  appId: "1:1035269537251:web:0b3f5398cda9723e68b4d6",
  databaseURL: "https://figureshop-9cdf3-default-rtdb.asia-southeast1.firebasedatabase.app"
};
// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
export const firebaseApp = firebase.app();
//export const firebaseApp = firebase.initializeApp(firebaseConfig);

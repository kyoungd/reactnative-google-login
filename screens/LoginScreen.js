import React, { Component } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import firebase from 'firebase';

class LoginScreen extends Component {

  isUserEqual = (googleUser, firebaseUser) => {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (
          providerData[i].providerId ===
            firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.getBasicProfile().getId()
        ) {
          // We don't need to reauth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  }

  onGoogleSignIn = googleUser => {
    console.log('Google Auth Response', googleUser);
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    var unsubscribe = firebase.auth().onAuthStateChanged(
      function(firebaseUser) {
        unsubscribe();
        // Check if we are already signed-in Firebase with the correct user.
        if (!this.isUserEqual(googleUser, firebaseUser)) {
          // Build Firebase credential with the Google ID token.
          var credential = firebase.auth.GoogleAuthProvider.credential(
            googleUser.idToken,
            googleUser.accessToken
          );
          // Sign in with credential from the Google user.
          firebase
            .auth()
            .signInAndRetrieveDataWithCredential(credential)
            .then(function(result) {
              console.log('user signed in ');
              const db = firebase.firestore();
              console.log('user signed in 1');
              db.settings({ timestampsInSnapshots: true }); 
              console.log('user signed in 2');
              const timestamp = new Date().getDate();
              console.log('user signed in 3');
              if (result.additionalUserInfo.isNewUser) {
                console.log('is a new user');
                db.collection('users').add({
                  loginType : 'google',
                  idToken: googleUser.idToken,
                  gmail: result.user.email,
                  profilePicture: result.additionalUserInfo.profile.picture,
                  firstName: result.additionalUserInfo.profile.given_name,
                  lastName: result.additionalUserInfo.profile.family_name,
                  lastLogin: timestamp,
                  createdOn: timestamp
                });
                // firebase
                //   .database()
                //   .ref('/users/' + result.user.uid)
                //   .set({
                //     gmail: result.user.email,
                //     profile_picture: result.additionalUserInfo.profile.picture,
                //     first_name: result.additionalUserInfo.profile.given_name,
                //     last_name: result.additionalUserInfo.profile.family_name,
                //     created_at: Date.now()
                //   })
                //   .then(function(snapshot) {
                //     // console.log('Snapshot', snapshot);
                //   });
              } else {
                console.log('is not a new user');
                db.collection('users').where('loginType', '==', 'google').where('idToken', '==', googleUser.idToken).update({
                  lastLogin: timestamp,
                });
                // firebase
                //   .database()
                //   .ref('/users/' + result.user.uid)
                //   .update({
                //     last_logged_in: Date.now()
                //   });
              }
            })
            .catch(function(error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              // The email of the user's account used.
              var email = error.email;
              // The firebase.auth.AuthCredential type that was used.
              var credential = error.credential;
              // ...
            });
        } else {
          console.log('User already signed-in Firebase.');
        }
      }.bind(this)
    );
  };

  signInWithGoogleAsync = async () => {
    try {
      const result = await Expo.Google.logInAsync({
        androidClientId: '1031848241926-6eknt8dhrp6b2d79t9jc15gs3eo3a9nh.apps.googleusercontent.com',
        behavior: 'web',
        iosClientId: '1031848241926-5gqrg2f1r1red453dulse793nd7pv32n.apps.googleusercontent.com',
        scopes: ['profile', 'email']
      });

      if (result.type === 'success') {
        this.onGoogleSignIn(result);
        return result.accessToken;
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      return { error: true };
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Button
          title="Signin with Google"
          onPress={() => this.signInWithGoogleAsync()}
        />
      </View>
    );
  }
}
export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

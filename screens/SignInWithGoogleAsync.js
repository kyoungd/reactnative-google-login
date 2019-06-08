import firebase from '../Firebase';
import { clientConfig } from '../clientConfig';

const isUserEqual = (googleUser, firebaseUser) => {
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

const onGoogleSignIn = googleUser => {
  console.log('Google Auth Response', googleUser);
  // We need to register an Observer on Firebase Auth to make sure auth is initialized.
  var unsubscribe = firebase.auth().onAuthStateChanged(
    function(firebaseUser) {
      unsubscribe();
      // Check if we are already signed-in Firebase with the correct user.
      if (!isUserEqual(googleUser, firebaseUser)) {
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
            const { uid } = result.user;
            const users = firebase.firestore().collection('users');
            console.log('user signed in ');
            const timestamp = Date.now();
            if (result.additionalUserInfo.isNewUser) {
              console.log('is a new user');
              const item = {
                loginType : 'google',
                idToken: googleUser.idToken,
                gmail: result.user.email,
                profilePicture: result.additionalUserInfo.profile.picture,
                firstName: result.additionalUserInfo.profile.given_name,
                lastName: result.additionalUserInfo.profile.family_name,
                createdOn: timestamp,
                lastLogin: timestamp,
              };
              console.log(result);
              // users.add(item)
              users.doc(uid).set(item)
              .then(status => {
                console.log('added to db: ', status);
              }).catch(err => {
                console.log('err: ' + err);
              })
              console.log('is a new user 2');
            } else {
              console.log('is not a new user');
              users.doc(uid).update({
                lastLogin: timestamp,
              }).then(result => {
                console.log(result);
              }).catch(err => {
                console.log('err: ' + err);
              })
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

const signInWithGoogleAsync = async () => {
  try {
    const result = await Expo.Google.logInAsync(clientConfig);
    if (result.type === 'success') {
      onGoogleSignIn(result);
      return result.accessToken;
    } else {
      return { cancelled: true };
    }
  } catch (e) {
    return { error: true };
  }
};

export default signInWithGoogleAsync

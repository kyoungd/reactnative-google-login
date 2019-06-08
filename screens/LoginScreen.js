import React, { Component } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import firebase from '../Firebase';
import signInWithGoogleAsync from './SignInWithGoogleAsync';

class LoginScreen extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <Button
          title="Signin with Google"
          onPress={() => signInWithGoogleAsync()}
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

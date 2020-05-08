
import React, {Component} from 'react'
import {Platform, StyleSheet, Text, View, Button, Alert} from 'react-native'

import RNUserIdentity, { ICLOUD_ACCESS_ERROR } from 'react-native-user-identity'


export default class App extends Component {

  state = {
    result: null
  }

  buttonPress = async () => {
    try {
      const result = await RNUserIdentity.getUserId({
          androidAccountSelectionMessage: 'Choose an account for testing:',
          iosUserConfirmation: {
              title: 'Confirm sign in',
              message: 'Sign in requires user confirmation',
              signInButtonText: 'Confirm',
              cancelButtonText: 'Back'
          }
      })
      if (result === null) {
        this.setState({result: 'User canceled sign in flow'})          
      } else {
        this.setState({result: result})          
      }
    } catch(error) {
      if (error == ICLOUD_ACCESS_ERROR) {
        this.setState({result: 'Please set up an iCloud account in settings'})
      }
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Button title="Fetch user identity" onPress={this.buttonPress} />
        <Text>{this.state.result}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
})

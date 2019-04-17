
import React, {Component} from 'react'
import {Platform, StyleSheet, Text, View, Button} from 'react-native'

import RNUserIdentity from 'react-native-user-identity'


export default class App extends Component {

  state = {
    result: null
  }

  buttonPress = async () => {

    const result = await RNUserIdentity.getUserId({
            androidAccountSelectionMessage: 'Choose an account for testing:',
            androidAccountType: 'com.google'
    })

    if (result === null) {
      if (Platform.OS === 'ios') {
        alert('Please set up an iCloud account in settings')
      } else if (Platform.OS === 'android') {
        alert('Please select an existing account or create a new one')
      }
    }

    this.setState({result: result})    
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

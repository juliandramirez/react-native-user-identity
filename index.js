
import { Platform, NativeModules, Alert } from 'react-native'

const { RNUserIdentity } = NativeModules


export const ICLOUD_ACCESS_ERROR = 'ICLOUD_ACCESS_ERROR'
export default {
    getUserId: async ({ androidAccountSelectionMessage, iosUserConfirmation } = {
        androidAccountSelectionMessage: null,
        iosUserConfirmation: null
    }) => {
        if (Platform.OS === 'ios') {

            const showUserConfirmation = () => new Promise((resolve, reject) => {
                const {
                    title = 'Sign in with iCloud',
                    message = 'Your iCloud account will be used to sign in',
                    signInButtonText = 'Sign In',
                    cancelButtonText = 'Cancel'
                } = iosUserConfirmation

                Alert.alert(
                    title, 
                    message, 
                    [{
                        text: signInButtonText,
                        onPress: () => {
                            RNUserIdentity.getUserIdentity()
                                .then(value => resolve(value))
                                .catch(error => {
                                    reject(error)
                                })
                        }
                    }, {
                        text: cancelButtonText,
                        onPress: () => resolve(null),
                        style: 'cancel',
                    }]
                )
            })

            try {
                if (iosUserConfirmation) {
                    return await showUserConfirmation()
                } else {
                    return await RNUserIdentity.getUserIdentity()
                }                
            } catch (error) {
                if (error && error.code == 'NO_ACCOUNT_ACCESS_ERROR') {
                    // there is no account configured...
                    throw ICLOUD_ACCESS_ERROR
                } else {
                    throw error
                }
            }
        } else if (Platform.OS === 'android') {
            try {
                return await RNUserIdentity.triggerAccountSelection(androidAccountSelectionMessage, 'com.google')
            } catch (error) {           
                if (error && error.code == 'USER_CANCELED_ACCOUNT_SELECTION') {
                    // user cancelled the account selection process...
                    return null
                } else {
                    // should not happen as long as an activity is available...
                    throw error
                }
            }
        }
    },
};
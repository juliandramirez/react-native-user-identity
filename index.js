
import { Platform, NativeModules } from 'react-native'

const { RNUserIdentity } = NativeModules

export default {
    getUserId: async (data = {
        androidAccountSelectionMessage: null,
        androidAccountType: null
    }) => {
        if (Platform.OS === 'ios') {
            try {
                return await RNUserIdentity.getUserIdentity();
            } catch (error) {
                if (error && error.code == 'NO_ACCOUNT_ACCESS_ERROR') {
                    // there is no account configured...
                    return null;
                } else {
                    throw error;
                }
            }
        } else if (Platform.OS === 'android') {
            let {androidAccountSelectionMessage, androidAccountType} = data;
    
            try {
                return await RNUserIdentity.triggerAccountSelection(androidAccountSelectionMessage, androidAccountType);
            } catch (error) {           
                if (error && error.code == 'USER_CANCELED_ACCOUNT_SELECTION') {
                    // user cancelled the account selection process...
                    return null;
                } else {
                    // should not happen as long as an activity is available...
                    throw error;
                }
            }
        }
    },
};
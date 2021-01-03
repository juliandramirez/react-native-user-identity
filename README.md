
# react-native-user-identity

![npm](https://img.shields.io/npm/v/react-native-user-identity.svg) ![npm](https://img.shields.io/npm/dt/react-native-user-identity) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/react-native-user-identity.svg) ![Supports Android and iOS](https://img.shields.io/badge/platforms-android%20|%20ios-lightgrey.svg) ![GitHub](https://img.shields.io/github/license/juliandramirez/react-native-user-identity.svg) ![Codecov](https://img.shields.io/codecov/c/github/juliandramirez/react-native-user-identity.svg)

Get the user id configured for the device (iCloud recordID for iOS, email of a device account for android)

## Why should you use this?

When implementing a mobile application you want to provide your users as much functionality as you can without having them sign up. After all, [Every Step Costs You 20% of Users](https://medium.com/gabor/every-step-costs-you-20-of-users-b613a804c329). <br>
Sign up may very well be the step where most of your potential users are lost.

Now imagine you could get a unique identifier that worked across all of the devices of the user.
You could even have in-app purchases that are shared across devices **without having to sign-up**.

This library aims to provide all of the above in the simplest way possible:
* For ios it uses the record name of CloudKit so it uniquely identifies an ios user. It's difficult to imagine an apple user that does not have an iCloud account configured in each of their devices.
* For android it presents to the user a list of all the accounts configured in the device to choose from.<br>It presents the list of google accounts configured (...@gmail, ...@corporateGmail) since it's one of the first steps of configuring an android device nowadays.

<br>
Note: If you are already using firebase authentication see the FAQ for instructions on how to upgrade its anonymous authentication
<br><br>
Note: If you are considering using Sign In with Apple see the FAQ section first

## Why shouldn't you use this?
This package requires you to activate the iCloud entitlement on iOS. <br>
As of today apple does not permit transfering ownership of an application that has this entitlement active for **ANY** of it's versions. Read more [here](https://help.apple.com/app-store-connect/#/devaf27784ff) <br>
<br>
If you want to transfer your app in the future and you still want to use this package consider using an apple developer account exclusively for the app, and when the time comes transfer the account.<br>
A personal apple developer account can be changed to a corporate account if needed, as is most of its information.

## Installation
**1. Install the library**
```
yarn add react-native-user-identity
```
**2. Run pod install**
```
cd ios
pod install
```
**3. Configure swift support for your iOS project** 

This configures your iOS project to use the module correctly since the library contains swift code (see the [official react native documentation](https://reactnative.dev/docs/native-modules-ios.html#exporting-swift) for more information)

**Note:** If your iOS project is alredy using swift files and you have a bridging header you may skip this step.

a. Create a swift file with any name in the root of your project:

![alt text](https://raw.githubusercontent.com/juliandramirez/react-native-user-identity/master/docs/img/create-swift.png)

b. Select "Create Bridging Header" when Xcode asks for it:

![alt text](https://raw.githubusercontent.com/juliandramirez/react-native-user-identity/master/docs/img/create-header.png)

**4. Build the project**

You should be able to build the project now. <br>
**Note:** The package functionality will not work until you follow the steps of the next section

**Note 2:** If you are having trouble building your project after executing the example try opening XCode preferences, select the "Locations" tab and set DerivedData to be a relative folder.

## Configuration

### Android

Nothing to configure.

### iOS 
(Screenshots taken with Xcode 11.x)

1. Make sure your app has a unique bundle identifier and does not show any errors in the Signing section (requires an apple development account):

![alt text](https://raw.githubusercontent.com/juliandramirez/react-native-user-identity/master/docs/img/xcode-signing.png)

2. Add the iCloud capability for the project:

![alt text](https://raw.githubusercontent.com/juliandramirez/react-native-user-identity/master/docs/img/xcode-cloudkit.png)

3. Enable the cloudkit option, add a container and name it **exactly as the bundle identifier of the application** for default usage:

![alt text](https://raw.githubusercontent.com/juliandramirez/react-native-user-identity/master/docs/img/xcode-cloudcontainer.png)

4. Verify the configuration:

**Verify all of the following:**
* The format of the container name is iCloud.$(PRODUCT_BUNDLE_IDENTIFIER) or another iCloud container you have created on iCloud dashboard (https://icloud.developer.apple.com/dashboard/)
* Press the "Cloudkit Dashboard" button, sign in with your developer account. You should see your newly created container in the list of containers (If you don't see it go to XCode and press the refresh button until it does). Verify that there is no error when selecting your container in the web dashboard. <br> If there is an error just wait and keep trying until the container is created succesfully (web dashboard/Xcode 11 seems to be buggy here since creating an iCloud container actually takes a couple of minutes).
* Go back to XCode and verify that the container name is not highlighted in red after you press the refresh option

![alt text](https://raw.githubusercontent.com/juliandramirez/react-native-user-identity/master/docs/img/xcode-icloudverified.png)

## Usage

* There is only one public function available called ***getUserId***
* The function is marked as ***async***
* The resolved value is ***null*** when the user cancels the UI flow
* On **ios** the function will throw ICLOUD_ACCESS_ERROR when there is no icloud account configured

### Default container iCloud.$(PRODUCT_BUNDLE_IDENTIFIER)
```javascript
import RNUserIdentity, { ICLOUD_ACCESS_ERROR } from 'react-native-user-identity'

fetchUserIdentity = async () => {
	try {
		const result = await RNUserIdentity.getUserId()
		if (result === null) {
			alert('User canceled UI flow')
		} 
	} catch(error) {
		if (error === ICLOUD_ACCESS_ERROR) {
			alert('Please set up an iCloud account in settings')
		}
	}
}
```
### Named container iCloud.com.myCompany.myMultiContainerApp
```javascript
import RNUserIdentity, { ICLOUD_ACCESS_ERROR } from 'react-native-user-identity'

fetchUserIdentity = async () => {
	try {
		const result = await RNUserIdentity.getUserId({
            iosOptions: {
                containerIdentifier: 'iCloud.com.myCompany.myMultiContainerApp'
            }
        })
		if (result === null) {
			alert('User canceled UI flow')
		} 
	} catch(error) {
		if (error === ICLOUD_ACCESS_ERROR) {
			alert('Please set up an iCloud account in settings')
		}
	}
}
```

### IOS user confirmation (only if you want user intervention)

On iOS fetching the id **does not require user intervention**. However, it might be useful in some instances to have the user confirm the action.<br>
You may send a *truthy* value for the **iosUserConfirmation** parameter for this to happen.

The following code:

```javascript
RNUserIdentity.getUserId({
		iosUserConfirmation: true
})
```

Presents this dialog:

![alt text](https://raw.githubusercontent.com/juliandramirez/react-native-user-identity/master/docs/img/ios-user-confirmation.png)

The resolved value will be ***null*** if the user dismisses the dialog
<br><br>
You can also configure the text shown to the user:

```javascript
RNUserIdentity.getUserId({
		iosUserConfirmation: {
			title: 'Confirm sign in',
			message: 'Sign in requires user confirmation',
			signInButtonText: 'Confirm',
			cancelButtonText: 'Back'
		}
})
```

### Android account chooser options

There is an optional parameter you can send:
* **androidAccountSelectionMessage**: The text to display in the account chooser modal in android. By default there is no message configured.

The following code:

```javascript
RNUserIdentity.getUserId({
		androidAccountSelectionMessage: 'Choose an account for testing:'
})
```

Presents this modal (the modal styles are OS dependant):

![alt text](https://raw.githubusercontent.com/juliandramirez/react-native-user-identity/master/docs/img/android-account-chooser.png)

### Running the example project

Use yarn to install the dependencies. Npm installs local dependencies using symbolic links and the react native packager does not support this.

## FAQ

### Why can't we get the iCloud email and instead we get this long obfuscated string?
The CloudKit framework prevents applications from accesing the user email for privacy purposes.

### How is this different from Sign In with apple on iOS?
Sign in with Apple requires the user to complete a full sign in flow.<br>
The point of using this package is to skip entirely this flow so your users can directly start using your application<br>
Furthermore, activating sign in with Apple also prevents your app from being transferable (see the **Why shouldn't you use this?** section above)

### I can not make this work on iOS...
Make sure you followed all of the steps in the installation and configuration section and pay attention to the verification note at the end of the configuration section

### Is there another option for having a user id without asking users to sign up?
You could use the same principle behind [Firebase anonymous authentication](https://firebase.google.com/docs/auth/web/anonymous-auth) but most likely you will run into the same limitations: Identities are associated to app installations (or devices in the best case scenario).<br>
**Once a user uninstalls the app, signs out or changes devices the user identity is lost.**

### How to integrate with firebase authentication?
If you are already using firebase authentication you want to incorporate react-native-user-identity as another option for the user to sign in (or maybe you just want to replace anonymous authentication).<br><br>
You should then:
1. Create a custom token with the firebase admin sdk.<br> 
Custom tokens should be created on the server side of your application, as they should be signed and secured. See [Creating custom tokens for firebase](https://firebase.google.com/docs/auth/admin/create-custom-tokens).<br>
If you are going serverless you can easily deploy the following cloud function to firebase:
```javascript
const functions = require('firebase-functions')
const admin = require('firebase-admin')

admin.initializeApp()

exports.tokenFromUID = functions.https.onCall( async (data, context) => {    
    const { uid } = data

    try {
        return await admin.auth().createCustomToken(uid)
    } catch(error) {
        console.log('Error creating custom token: ', error)
        throw new functions.https.HttpsError('internal', error ? error.message : '')
    }
})
```
With this cloud function you also need to configure permissions for your firebase instance. See [this section of the firebase documentation](https://firebase.google.com/docs/auth/admin/create-custom-tokens#troubleshooting) for details
<br><br>

2. Sign in with the custom token on your app<br> Assuming you are using [rnfirebase](https://rnfirebase.io/):

Replace this:
```javascript
import auth from '@react-native-firebase/auth'

const userCredential = await auth().signInAnonymously()
```
With this:
```javascript
import auth from '@react-native-firebase/auth'
import functions from '@react-native-firebase/functions'
import RNUserIdentity from 'react-native-user-identity'

// get uid for user...
const uid = await RNUserIdentity.getUserId()
if (uid != null) {
	// Server call (a firebase cloud function in this case)
	const tokenResponse = await functions().httpsCallable('tokenFromUID')({ uid })
	const userCredential = await auth().signInWithCustomToken(tokenResponse.data)
}
```

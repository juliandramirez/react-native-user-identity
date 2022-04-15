/**
 * Copyright (c) Julian Ramírez.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

package com.github.juliandramirez.rn.useridentity;

import android.accounts.AccountManager;
import android.app.Activity;
import android.content.Intent;
import android.os.Build;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.module.annotations.ReactModule;


@ReactModule(name="RNUserIdentity")
public class RNUserIdentityModule extends ReactContextBaseJavaModule {

  /* MARK: - Constants */
  public static final int INTENT_REQUEST_CODE = 1;

  /* MARK: - Properties */
  private Promise promise;
  private final ReactApplicationContext reactContext;

  /* MARK: - Constructors */
  public RNUserIdentityModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
    this.reactContext.addActivityEventListener(new BaseActivityEventListener() {
      public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {      
        if (requestCode == INTENT_REQUEST_CODE) {
          if (promise != null) {
            if (resultCode == Activity.RESULT_OK) {
              String accountName = data.getStringExtra(AccountManager.KEY_ACCOUNT_NAME);
              promise.resolve(accountName);
            } else {
                promise.reject("USER_CANCELED_ACCOUNT_SELECTION", "User cancelled the account selection dialog");
            }
          }
        }
      }
    });
  }

  /* MARK: - Methods */
  @ReactMethod
  public void triggerAccountSelection(String message, String accountType, Promise promise) {
      this.promise = promise;

      Intent intent = null;
      if(Build.VERSION.SDK_INT <= 22) {
          intent = AccountManager.newChooseAccountIntent(
                  null,
                  null,
                  accountType == null ? null : new String[]{accountType},
                  true,
                  message,
                  null,
                  null,
                  null );
      } else {
          intent = AccountManager.newChooseAccountIntent(
                  null,
                  null,
                  accountType == null ? null : new String[]{accountType},
                  message,
                  null,
                  null,
                  null );
      }

      Activity activity = this.getCurrentActivity();

      if(activity == null) {
          this.promise.reject("NO_CURRENT_UI_ACTIVITY", "There is not an activity to execute an intent");
      } else {
          activity.startActivityForResult(intent, INTENT_REQUEST_CODE);
      }
  }

  @Override
  public String getName() {
    return "RNUserIdentity";
  }
}

package com.useridentityexample;

import com.facebook.react.ReactActivity;
import android.content.Intent;
import com.github.juliandramirez.rn.useridentity.RNUserIdentityModule;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "UserIdentityExample";
  }

  @Override
  public void onActivityResult(final int requestCode, final int resultCode, final Intent data) {
    super.onActivityResult(requestCode, resultCode, data);

    if(requestCode == RNUserIdentityModule.INTENT_REQUEST_CODE) {
      RNUserIdentityModule module = 
        this.getReactInstanceManager().getCurrentReactContext().getNativeModule(RNUserIdentityModule.class);
      module.onActivityResult(resultCode, data);
    }
  }    
}

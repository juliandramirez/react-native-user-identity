/**
 * Copyright (c) Julian Ramírez.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

package com.github.juliandramirez.rn.useridentity.example;

import android.content.Intent;
import com.facebook.react.ReactActivity;
import com.github.juliandramirez.rn.useridentity.RNUserIdentityModule;


public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
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

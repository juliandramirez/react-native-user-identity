/**
 * Copyright (c) Julian Ramírez.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(RNUserIdentity, NSObject)
RCT_EXTERN_METHOD(getUserIdentity:(NSDictionary *)iosOptions resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
@end

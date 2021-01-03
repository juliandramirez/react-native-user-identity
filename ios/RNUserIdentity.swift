/**
 * Copyright (c) Julian Ramírez.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

import CloudKit
import Foundation


@objc(RNUserIdentity)
class RNUserIdentity: NSObject
{

  // MARK: - Services

  @objc
  public func getUserIdentity(_ iosOptions: NSDictionary, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock)
  {
    guard let iosOptionsDictionary = iosOptions as? [String: Any],
          let containerId = iosOptionsDictionary["containerIdentifier"] as? String else {
            reject("CloudKitError", "Error retrieving record id", nil)
            return;
        }

    let container: CKContainer
    if containerId != "default" {
      container = CKContainer.init(identifier: containerId)
    } else {
      container = CKContainer.default()
    }

    container.fetchUserRecordID()
    {
      recordID, error in

      if let result = recordID?.recordName {
        resolve(result)
      } else {
        if let ckerror = error as? CKError, ckerror.code == CKError.notAuthenticated {
          reject("NO_ACCOUNT_ACCESS_ERROR", "No iCloud account is associated with the device, or access to the account is restricted", nil);
          return;
        }

        if let error = error as? NSError {
          reject("CloudKitError", error.localizedDescription, error);
          return;
        }

        reject("CloudKitError", "Error retrieving record id", nil)
      }
    }
  }

  @objc
  static func requiresMainQueueSetup() -> Bool
  {
    return true
  }
}


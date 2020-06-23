// Type definitions for react-native-user-identity 1.5.1
// Project: https://github.com/juliandramirez/react-native-user-identity
// Definitions by: wwdrew <https://github.com/wwdrew>
// TypeScript Version: 3.8

declare module "react-native-user-identity" {

  export const ICLOUD_ACCESS_ERROR: string;

  type IosUserConfirmationOptions = {
    title?: string;
    message?: string;
    signInButtonText?: string;
    cancelButtonText?: string;
  }

  type UserIdOptions = {
    iosUserConfirmation?: boolean | IosUserConfirmationOptions;
    androidAccountSelectionMessage?: string;
  }

  const RNUserIdentity: RNUserIdentity;

  export interface RNUserIdentity {
    /**
     * Get the user ID value.
     */
    getUserId(options: UserIdOptions): Promise<string | null>;
  }

  export default RNUserIdentity;
}

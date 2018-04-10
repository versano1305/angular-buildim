import { CognitoUserSession } from 'amazon-cognito-identity-js';

export class AuthonticationResponse {
  success: boolean = false;
  newPasswordRequired: boolean = false;
  session: CognitoUserSession;
  userConfirmationNecessary: boolean = false;
  err: any;
  result: any;
  userAttributes: any;
  requiredAttributes: any;

}

export class ConfirmNewPasswordResponse {
  confirm: boolean = false;
  err: any;
}

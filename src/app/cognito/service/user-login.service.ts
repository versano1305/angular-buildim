import {AuthonticationResponse, ConfirmNewPasswordResponse} from '../model/authonticationresponse';
import {CognitoUtilService} from './cognito-util.service';
import {Injectable} from '@angular/core';
import {AuthenticationDetails, CognitoUser} from 'amazon-cognito-identity-js';
import * as AWS from 'aws-sdk/global';
import * as STS from 'aws-sdk/clients/sts';

@Injectable()
export class UserLoginService {

  constructor(private cognitoUtil: CognitoUtilService) {
    console.log('init UserLoginService');
  }

  authenticate(username: string, password: string): Promise<AuthonticationResponse> {
    var tt = this;
    return new Promise(
      function(resolve, reject) {
        console.log('UserLoginService: starting the authentication');
        let response: AuthonticationResponse = new AuthonticationResponse();
        let authenticationData = {
          Username: username,
          Password: password,
        };
        let authenticationDetails = new AuthenticationDetails(authenticationData);

        let userData = {
          Username: username,
          Pool: tt.cognitoUtil.getUserPool()
        };

        console.log('UserLoginService: Params set...Authenticating the user');
        const cognitoUser = new CognitoUser(userData);
        console.log('UserLoginService: config is ' + AWS.config);
        cognitoUser.authenticateUser(authenticationDetails, {
          newPasswordRequired: (userAttributes, requiredAttributes) => {
            
                    cognitoUser.completeNewPasswordChallenge('vers1305',null,{
          onSuccess: function(cognitoUserSession) {
            
          },
          onFailure: function(err: any) {
            console.error(err)
          }
        });
            
            response.newPasswordRequired = true;
            response.requiredAttributes = requiredAttributes;
            response.userAttributes = userAttributes;
            resolve(response);
          },
          onSuccess: result => {
            response.success = true;
            response.result = result;
            resolve(response);
          },
          onFailure: err => {
            response.success = false;
            response.err = err;
            resolve(response);
          },
          mfaRequired: (challengeName, challengeParameters) => {
            console.log('mfaRequired not implemented !')
            //            callback.handleMFAStep(challengeName, challengeParameters, (confirmationCode: string) => {
            //              cognitoUser.sendMFACode(confirmationCode, {
            //                onSuccess: result => this.onLoginSuccess(callback, result),
            //                onFailure: err => this.onLoginError(callback, err)
            //              });
            //            });
          }
        });
      }
    );
  }

  logout() {
    console.log('UserLoginService: Logging out');
    this.cognitoUtil.getCurrentUser().signOut();
  }

  confirmNewPassword(email: string, verificationCode: string, password: string): Promise<ConfirmNewPasswordResponse> {
    var tt = this;
    return new Promise(
      function(resolve, reject) {
        const confirmNewPasswordResponse: ConfirmNewPasswordResponse = new ConfirmNewPasswordResponse();
        const userData = {
          Username: email,
          Pool: tt.cognitoUtil.getUserPool()
        };

        const cognitoUser = new CognitoUser(userData);
        cognitoUser.confirmPassword(verificationCode, password, {
          onSuccess: function() {
            confirmNewPasswordResponse.confirm = true;
            resolve(confirmNewPasswordResponse);
          },
          onFailure: function(err) {
            confirmNewPasswordResponse.confirm = false;
            confirmNewPasswordResponse.err = err;
            resolve(confirmNewPasswordResponse);
          }
        });
      }
    );
  }

  completeNewPassword(newPassword: string, attributesData?: any): Promise<boolean> {
    var tt = this;
    return new Promise(
      function(resolve, reject) {
        const cognitoUser = tt.cognitoUtil.getCurrentUser();
        cognitoUser.completeNewPasswordChallenge(newPassword, attributesData, {
          onSuccess: function(cognitoUserSession) {
            resolve(true);
          },
          onFailure: function(err: any) {
            resolve(false);
          }
        });
      });
  }

  isAuthenticated(): Promise<boolean> {
    var tt = this;
    return new Promise(
      function(resolve, reject) {
        const cognitoUser = tt.cognitoUtil.getCurrentUser();
        if (cognitoUser != null) {
          cognitoUser.getSession(function(err, session) {
            if (err) {
              console.log('UserLoginService: Couldn\'t get the session: ' + err, err.stack);
              resolve(false);
            }
            else {
              console.log('UserLoginService: Session is ' + session.isValid());
              resolve(session.isValid());
            }
          });
        } else {
          console.log('UserLoginService: can\'t retrieve the current user');
          resolve(false);
        }
      }
    );
  }
}

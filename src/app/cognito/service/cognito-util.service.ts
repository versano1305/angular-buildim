import {CognitoUserPool} from 'amazon-cognito-identity-js';
import * as AWS from 'aws-sdk/global';
import * as awsservice from 'aws-sdk/lib/service';
import * as CognitoIdentity from 'aws-sdk/clients/cognitoidentity';

import {environment} from '../../../environments/environment';
import {Injectable} from '@angular/core';

@Injectable()
export class CognitoUtilService {

  public static _REGION = environment.region;

  public static _IDENTITY_POOL_ID = environment.identityPoolId;
  public static _USER_POOL_ID = environment.userPoolId;
  public static _CLIENT_ID = environment.clientId;

  public static _POOL_DATA: any = {
    UserPoolId: CognitoUtilService._USER_POOL_ID,
    ClientId: CognitoUtilService._CLIENT_ID
  };

  public cognitoCreds: AWS.CognitoIdentityCredentials;

  constructor() {
  console.log('init CognitoUtilService');
    console.log('init params: ' + environment.region)
  }
  getUserPool() {
    if (environment.cognito_idp_endpoint) {
      CognitoUtilService._POOL_DATA.endpoint = environment.cognito_idp_endpoint;
    }
    return new CognitoUserPool(CognitoUtilService._POOL_DATA);
  }

  getCurrentUser() {
    return this.getUserPool().getCurrentUser();
  }

  // AWS Stores Credentials in many ways, and with TypeScript this means that
  // getting the base credentials we authenticated with from the AWS globals gets really murky,
  // having to get around both class extension and unions. Therefore, we're going to give
  // developers direct access to the raw, unadulterated CognitoIdentityCredentials
  // object at all times.
  setCognitoCreds(creds: AWS.CognitoIdentityCredentials) {
    this.cognitoCreds = creds;
  }

  getCognitoCreds() {
    return this.cognitoCreds;
  }

  // This method takes in a raw jwtToken and uses the global AWS config options to build a
  // CognitoIdentityCredentials object and store it for us. It also returns the object to the caller
  // to avoid unnecessary calls to setCognitoCreds.
  buildCognitoCreds(idTokenJwt: string) {
    let url = 'cognito-idp.' + CognitoUtilService._REGION.toLowerCase() + '.amazonaws.com/' + CognitoUtilService._USER_POOL_ID;
    if (environment.cognito_idp_endpoint) {
      url = environment.cognito_idp_endpoint + '/' + CognitoUtilService._USER_POOL_ID;
    }
    let logins: CognitoIdentity.LoginsMap = {};
    logins[url] = idTokenJwt;
    let params = {
      IdentityPoolId: CognitoUtilService._IDENTITY_POOL_ID, /* required */
      Logins: logins
    };
    let serviceConfigs = <awsservice.ServiceConfigurationOptions>{};
    if (environment.cognito_identity_endpoint) {
      serviceConfigs.endpoint = environment.cognito_identity_endpoint;
    }
    let creds = new AWS.CognitoIdentityCredentials(params, serviceConfigs);
    this.setCognitoCreds(creds);
    return creds;
  }


  getCognitoIdentity(): string {
    return this.cognitoCreds.identityId;
  }

  getAccessToken(): Promise<any> {
        var tt = this;
    return new Promise(
      function(resolve, reject) {
        if (tt.getCurrentUser() != null) {
          tt.getCurrentUser().getSession(function(err, session) {
            if (err) {
              reject(new Error('CognitoUtil: Can\'t set the credentials:' + err));
            } else {
              if (session.isValid()) {
                resolve(session.getAccessToken().getJwtToken());
              }
            }
          });
        } else {
          reject(new Error('No current user found !'));
        }
      }
    );

  }

  getIdToken(): Promise<any> {
        var tt = this;
    return new Promise(
      function(resolve, reject) {
        if (tt.getCurrentUser() != null) {
          tt.getCurrentUser().getSession(function(err, session) {
            if (err) {
              reject(new Error('CognitoUtil: Can\'t set the credentials:' + err));
            } else {
              if (session.isValid()) {
                resolve(session.getIdToken().getJwtToken());
              } else {
                console.log('CognitoUtil: Got the id token, but the session isn\'t valid');
              }
            }
          });
        } else {
          reject(new Error('CognitoUtil: Got the id token, but the session isn\'t valid'));
        }
      }
    );
  }

  getRefreshToken(): Promise<any> {
        var tt = this;
    return new Promise(
      function(resolve, reject) {
        if (tt.getCurrentUser() != null) {
          tt.getCurrentUser().getSession(function(err, session) {
            if (err) {
              reject(new Error('CognitoUtil: Can\'t set the credentials:' + err));
            } else {
              if (session.isValid()) {
                resolve(session.getRefreshToken());
              }
            }
          });
        } else {
          reject(new Error('No current user found !'));
        }
      }
    );
  }

  refresh(): void {
    this.getCurrentUser().getSession(function(err, session) {
      if (err) {
        console.log('CognitoUtil: Can\'t set the credentials:' + err);
      }

      else {
        if (session.isValid()) {
          console.log('CognitoUtil: refreshed successfully');
        } else {
          console.log('CognitoUtil: refreshed but session is still not valid');
        }
      }
    });
  }
}
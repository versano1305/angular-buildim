import {CognitoUtilService} from './cognito-util.service';
import {Injectable} from '@angular/core';
import * as AWS from 'aws-sdk/global';

@Injectable()
export class AwsutilService {

  public static firstLogin: boolean = false;
  public static runningInit: boolean = false;
  constructor(public cognitoUtil: CognitoUtilService) {
    console.log('init AwsutilService');
    AWS.config.region = CognitoUtilService._REGION;
  }

  /**
   * This is the method that needs to be called in order to init the aws global creds
   */
  initAwsService(isLoggedIn: boolean, idToken: string): Promise<boolean> {
    return new Promise(function(resolve, reject) {
        if (AwsutilService.runningInit) {
          // Need to make sure I don't get into an infinite loop here, so need to exit if this method is running already
          console.log('AwsutilService: Aborting running initAwsService()...it\'s running already.');
          // instead of aborting here, it's best to put a timer
          resolve(true);
          return;
        } else {
          console.log('AwsutilService: Running initAwsService()');
          AwsutilService.runningInit = true;
          //          let mythis = this;
          // First check if the user is authenticated already
          if (isLoggedIn) {
            this.setupAWS(isLoggedIn, idToken).then(
              (result) =>  {
                AwsutilService.runningInit = false;
                resolve(true);
              }
            );
          }
        }
      }
    );
  }


  /**
   * Sets up the AWS global params
   *
   * @param isLoggedIn
   * @param callback
   */
  setupAWS(isLoggedIn: boolean, idToken: string): Promise<any> {
    return new Promise(function(resolve, reject) {
        console.log('AwsutilService: in setupAWS()');
        if (isLoggedIn) {
          // TODO: The mobile Analytics client needs some work to handle Typescript. Disabling for the time being.
          // var mobileAnalyticsClient = new AMA.Manager(options);
          // mobileAnalyticsClient.submitEvents();
          this.addCognitoCredentials(idToken);
          console.log('AwsutilService: Retrieving the id token');
        } else {
          console.log('AwsutilService: User is not logged in');
        }
        resolve(true);
      });
  }

  addCognitoCredentials(idTokenJwt: string): void {
        const creds = this.cognitoUtil.buildCognitoCreds(idTokenJwt);

        AWS.config.credentials = creds;

        creds.get(function(err) {
          if (!err) {
            if (AwsutilService.firstLogin) {
              // save the login info to DDB
              this.ddb.writeLogEntry('login');
              AwsutilService.firstLogin = false;
            }
          }
        });
      }

  static getCognitoParametersForIdConsolidation(idTokenJwt: string): {} {
        console.log("AwsutilService: enter getCognitoParametersForIdConsolidation()");
        let url = 'cognito-idp.' + CognitoUtilService._REGION.toLowerCase() + '.amazonaws.com/' + CognitoUtilService._USER_POOL_ID;
        let logins: Array<string> = [];
        logins[url] = idTokenJwt;
        let params = {
          IdentityPoolId: CognitoUtilService._IDENTITY_POOL_ID, /* required */
          Logins: logins
        };

        return params;
      }

}

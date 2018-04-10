import { AwsutilService } from './service/awsutil.service';
import { CognitoUtilService } from './service/cognito-util.service';
import { UserLoginService } from './service/user-login.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

export class CognitoConfig {
    region: string;
    identityPoolId: string;
    userPoolId: string;
    clientId: string;
}

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    UserLoginService,
    AwsutilService,
    CognitoUtilService
  ]
})
export class CognitoModule {
     static initialize(config: CognitoConfig) {
        return {
            ngModule: CognitoModule,
//            providers: [
//                { provide: FirebaseAppConfig, useValue: config },
//                { provide: FirebaseAppName, useValue: appName }
//            ]
        }
    }
 }

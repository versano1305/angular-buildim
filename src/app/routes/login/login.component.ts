import {AuthonticationResponse} from '../../cognito/model/authonticationresponse';
import {UserLoginService} from '../../cognito/service/user-login.service';
import {Component, OnInit} from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  errorMsg: any;
  isNewPasswordNeeded: boolean = false;

  constructor(private userLoginService: UserLoginService) {
      userLoginService.isAuthenticated()
        .then(
    (fdg) =>{}
  )
    
  }

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl(),
      password: new FormControl(),
      newPassword: new FormControl() 
    });
  }

  login() {
    let email = this.loginForm.controls['email'].value;
    let password = this.loginForm.controls['password'].value;
    this.userLoginService.authenticate(email, password).then(
      (response: AuthonticationResponse) => {
        this.handleAuthonticationResponse(response);
        console.log(JSON.stringify(response));
      }
    ).catch(
      (err) => {
        console.error(err);
        this.errorMsg = err;
      }
      );
  }

  completeNewPassword() {
    let newPassword = this.loginForm.controls['newPassword'].value;
    this.userLoginService.completeNewPassword(newPassword).then(
      (isComplete) => {
        console.log('isComplete NewPassword' + isComplete);
      }
    );

  }
  private handleAuthonticationResponse(authonticationResponse: AuthonticationResponse) {
  if (authonticationResponse.success) {

  } else {
    if (authonticationResponse.newPasswordRequired) {
      this.isNewPasswordNeeded = true;
    }
  }
  }

}

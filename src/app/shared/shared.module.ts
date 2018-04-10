import { CognitoModule } from '../cognito/cognito.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
        BrowserModule,
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    CognitoModule,
  ],
  declarations: []
})
export class SharedModule { }

import { SharedModule } from '../shared/shared.module';
import { LoginComponent } from './login/login.component';
import { routes } from './main-routes';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forRoot(routes),
  ],
  declarations: [LoginComponent]
})
export class AppRoutesModule { }

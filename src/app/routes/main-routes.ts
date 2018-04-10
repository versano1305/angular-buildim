import { LoginComponent } from './login/login.component';
export const routes = [

  {
    path: '',
    component: LoginComponent,
//    children: [
//      { path: '', redirectTo: 'main', pathMatch: 'full' },
//      { path: 'main', component: MainComponent },      
//    ]
  },


  // Not found
  { path: '**', redirectTo: 'home' }
];

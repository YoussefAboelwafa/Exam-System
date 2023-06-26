import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { VerificationComponent } from './verification/verification.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: 'signup',
    component:SignUpComponent ,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'verify',
    component: VerificationComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  // {
  //   path: 'home/:name',
  //   component: HomeComponent,
  //   children:[
  //     {
  //       path: 'show/:mails',
  //       component:ShowComponent
    
    
  //     }
      
  //   ]
  // },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

// this.route.paramMap.subscribe((x) => (
//   this.email = x.get('name')
// ));

// this.router.navigate([`/home/${this.email}/show/inbox`]);
// routerLink="show/inbox"
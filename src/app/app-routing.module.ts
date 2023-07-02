import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { VerificationComponent } from './verification/verification.component';
import { HomeComponent } from './home/home.component';
import { GuardServiceService } from './services/guard-service.service';
import { HomeBarComponent } from './home-bar/home-bar.component';
import { ExamsBarComponent } from './exams-bar/exams-bar.component';
import { RankingBarComponent } from './ranking-bar/ranking-bar.component';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { AdminCalendarComponent } from './admin-calendar/admin-calendar.component';
import { AdminExamsComponent } from './admin-exams/admin-exams.component';
import { AdminAnalyticsComponent } from './admin-analytics/admin-analytics.component';
import { AdminLocationBarComponent } from './admin-location-bar/admin-location-bar.component';

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
    // canActivate:[GuardServiceService]

    children:[
      {
        path:'home_bar',
        component:HomeBarComponent,    


      },
      {
        path:'exam_bar',
        component:ExamsBarComponent,

      },
       {
    path: 'ranking_bar',
    component: RankingBarComponent,   

    }
    ]
  },
  {
    path: 'admin_home',
    component: AdminHomeComponent,
    children:[
      {
        path:'admin_calendar',
        component:AdminCalendarComponent,    


      },
      {
        path:'admin_exams',
        component:AdminExamsComponent,

      },
       {
       path: 'admin_analytics',
       component: AdminAnalyticsComponent,   

    },
    {
       path: 'admin_location',
       component: AdminLocationBarComponent,   

 }
    ] 
  }
 
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
// this.route.queryParamMap.subscribe(params => {
//   this.user = params.get('user');
// });

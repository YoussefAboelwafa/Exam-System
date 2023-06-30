import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ServicService } from './services/servic.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { users } from './objects/users';
import { SignUpComponent } from './sign-up/sign-up.component';
import { VerificationComponent } from './verification/verification.component';
import { FormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng2-validation';
import { HomeComponent } from './home/home.component';
import { GuardServiceService } from './services/guard-service.service';
import { HomeBarComponent } from './home-bar/home-bar.component';
import { ExamsBarComponent } from './exams-bar/exams-bar.component';
import { PopUpComponent } from './pop-up/pop-up.component';
import { RankingBarComponent } from './ranking-bar/ranking-bar.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignUpComponent,
    VerificationComponent,
    HomeComponent,
    HomeBarComponent,
    ExamsBarComponent,
    PopUpComponent,
    RankingBarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    CustomFormsModule,
    
  ],
  providers: [ServicService,users,GuardServiceService],
  bootstrap: [AppComponent]
})
export class AppModule { }

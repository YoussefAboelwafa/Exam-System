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
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignUpComponent,
    VerificationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    CustomFormsModule,
    
  ],
  providers: [ServicService,users],
  bootstrap: [AppComponent]
})
export class AppModule { }

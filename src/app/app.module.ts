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
import { NgxTypedJsModule } from 'ngx-typed-js';
import { AdminHomeComponent } from './admin-home/admin-home.component';
import { AdminLocationBarComponent } from './admin-location-bar/admin-location-bar.component';
import { AdminCalendarComponent } from './admin-calendar/admin-calendar.component';
import { AdminExamsComponent } from './admin-exams/admin-exams.component';
import { AdminAnalyticsComponent } from './admin-analytics/admin-analytics.component';
import { AdminQuestionsComponent } from './admin-questions/admin-questions.component';
import { AdminNewsComponent } from './admin-news/admin-news.component';
import { NewsBarComponent } from './news-bar/news-bar.component';
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
    AdminHomeComponent,
    AdminLocationBarComponent,
    AdminCalendarComponent,
    AdminExamsComponent,
    AdminAnalyticsComponent,
    AdminQuestionsComponent,
    AdminNewsComponent,
    NewsBarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    CustomFormsModule,
    NgxTypedJsModule,
  ],
  providers: [ServicService, users, GuardServiceService],
  bootstrap: [AppComponent],
})
export class AppModule {}

import { Injectable } from "@angular/core"
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { CommaExpr } from "@angular/compiler";

// import {class you made}
@Injectable({
  providedIn: 'root'
})


export class ServicService {
  private apiServerUrl = 'http://localhost:8080';
  constructor(private http: HttpClient) { }

//send user with all date ,recieve flag ==0 if the email or phone are found in system
//else i recieve flag==1  back active verification code and i will send to backend the verify 
public sign_up(new_user:any):Observable<any>{
  return this.http.post<any>(`${this.apiServerUrl}/sign_up`,new_user);
}
//send user with email and pass if the user not found recive flag==0 else recive some date i will tell you soon ...
public login(user:any):Observable<any>{
  return this.http.post<any>(`${this.apiServerUrl}/login`,user);
}
// i will send verify code to back and if it wrong i will recive flag==0 else flag ==1;
public verify_code(code:any):Observable<any>{
  return this.http.post<any>(`${this.apiServerUrl}/verify_code`,code);
}
// i will send this request if user go to sign up and i recive pair of array ,
//one to all city ,other to all country. it can be not used and replace this request
// with arrays in frontend and this array fill with any  cities and countries  
public city_country():Observable<any>{
  return this.http.get<any>(`${this.apiServerUrl}/city_country`);
}




}

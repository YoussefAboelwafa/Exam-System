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

//send user with all date ,recieve json="success=false" if the email or phone are found in system
//else i recieve json="success=true"  backend active verification code and i will send to backend the verify 
public sign_up(new_user:any):Observable<any>{
  return this.http.post<any>(`${this.apiServerUrl}/sign_up`,{email: new_user.email,phone: new_user.phone});
}
//send user with email and pass if the user not found recive json="success=false"else recive json="success=true ,user:user" with all data
public login(user:any):Observable<any>{
  return this.http.post<any>(`${this.apiServerUrl}/login`,user);
}
// i will send verify code to back and if it code is wrong i will recive json="success=false ", code good but email is token {success=true created=false } redirect to sign up
// {success=true created=false } redirect to login
public verify_code(code:any,user:any):Observable<any>{
  return this.http.post<any>(`${this.apiServerUrl}/verify_code`,{code:code,user:user});
}

public send_again(user:any):Observable<any>{
  return this.http.post<any>(`${this.apiServerUrl}/send_agin`,user.phone);
}
// i will send this request if user go to sign up and i recive pair of array ,
//one to all city ,other to all country. it can be not used and replace this request
// with arrays in frontend and this array fill with any  cities and countries  
public city_country():Observable<any>{
  return this.http.get<any>(`${this.apiServerUrl}/city_country`);
}
public is_signin():Observable<any>{
  return this.http.get<any>(`${this.apiServerUrl}/is_signedin`);
}
 




}

import { Injectable } from "@angular/core"
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { CommaExpr } from "@angular/compiler";
import { users } from "../objects/users";

// import {class you made}
@Injectable({
  providedIn: 'root'
})


export class ServicService {
  private apiServerUrl = 'http://localhost:8080';
  user!: users;
  upcoming_ex!:any[];
  token_ex!:any[];
  non_token!:any[];
  ids_ex!:any[];
  constructor(private http: HttpClient) { }

  

//send user with all date ,recieve json="success=false" if the email or phone are found in system
//else i recieve json="success=true"  backend active verification code and i will send to backend the verify 
public sign_up(new_user:any):Observable<any>{
  return this.http.post<any>(`${this.apiServerUrl}/sign_up`,{email: new_user.get_email(),phone_namber: new_user.get_phone_namber()});
}
//send user with email and pass if the user not found recive json="success=false"else recive json="success=true ,user:user" with all data
public login(user:any):Observable<any>{
  return this.http.post<any>(`${this.apiServerUrl}/login`,user, { withCredentials: true });
}
// i will send verify code to back and if it code is wrong i will recive json="success=false ", code good but email is token {success=true created=false } redirect to sign up
// {success=true created=false } redirect to login
public verify_code(code:any):Observable<any>{
  return this.http.post<any>(`${this.apiServerUrl}/verify_code`,{code: code, user:this.user});
}

// send another verification code again  
public send_again():Observable<any>{
  console.log(this.user.get_phone_namber());
  
  return this.http.post<any>(`${this.apiServerUrl}/send_agin`,{phone_namber:this.user.get_phone_namber()});
}
// i will send this request if user go to sign up and i recive pair of array ,
//one to all city ,other to all country. it can be not used and replace this request
// with arrays in frontend and this array fill with any  cities and countries  
public city_country():Observable<any>{
  return this.http.get<any>(`${this.apiServerUrl}/city_country`);
}

//it checks if the user is in sign in a system or not and authenticated to the system
public is_signin():Observable<any>{
  return this.http.get<any>(`${this.apiServerUrl}/is_signedin`, { withCredentials: true });
}

// it take url of the new photo of the user and return no thing
public change_photo(url:any):Observable<any>{
  return this.http.post<any>(`${this.apiServerUrl}/change_photo`,{url:url});
}

// when i enter home bar i send request and want to receive json that contains {user:user,non_taken_exam:any exam that the user does not take it yet}
public home_bar_init():Observable<any>{
  return this.http.get<any>(`${this.apiServerUrl}/home/home_bar`, { withCredentials: true });
}
// when i enter home bar i send request and want to receive json that contains {user:user,non_taken_exam:any exam that the user does not take it yet}
//he take ids of all exams in user
public exam_bar_init():Observable<any>{
  console.log(this.ids_ex)
  return this.http.post<any>(`${this.apiServerUrl}/home/exams`,{ids:this.ids_ex}, { withCredentials: true });
}
 


}

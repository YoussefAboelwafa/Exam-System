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
public is_signin():Observable<any>{
  return this.http.get<any>(`${this.apiServerUrl}/is_signedin`, { withCredentials: true });
}

public openModal() {
  const modal = document.getElementById('ERROR');
  if (modal) {
    modal.classList.add('show');
    modal.style.display = 'block';
  }
}

public closeModal() {
  const modal = document.getElementById('ERROR');
  if (modal) {
    modal.classList.remove('show');
    modal.style.display = 'none';
  }
}
 


}
// //send user with all date ,recieve flag ==0 if the email or phone are found in system
// //else i recieve flag==1  back active verification code and i will send to backend the verify 
// public sign_up({email, phone}:any):Observable<any>{
//   return this.http.post<any>(${this.apiServerUrl}/sign_up, {email, phone});
// }
// //send user with email and pass if the user not found recive flag==0 else recive some date i will tell you soon ...
// public login(user:any):Observable<any>{
//   return this.http.post<any>(${this.apiServerUrl}/login,user);
// }
// // i will send verify code to back and if it wrong i will recive flag==0 else flag ==1;
// public verify_code(code:any, new_user):Observable<any>{
//   return this.http.post<any>(${this.apiServerUrl}/verify_code,{code, new_user});
// }
// // i will send this request if user go to sign up and i recive pair of array ,
// //one to all city ,other to all country. it can be not used and replace this request
// // with arrays in frontend and this array fill with any  cities and countries  
// public city_country():Observable<any>{
//   return this.http.get<any>(${this.apiServerUrl}/city_country);
// }


// }

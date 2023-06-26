import { Injectable } from "@angular/core"
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";

// import {class you made}
@Injectable({
  providedIn: 'root'
})


export class ServicService {
  private apiServerUrl = 'http://localhost:8080';
  constructor(private http: HttpClient) { }


public sign_up(new_user:any):Observable<any>{
  return this.http.post<any>(`${this.apiServerUrl}/sign_up`,new_user);
}
public login(user:any):Observable<any>{
  return this.http.post<any>(`${this.apiServerUrl}/login`,user);
}



}

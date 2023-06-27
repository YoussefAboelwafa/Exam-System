import { Component, OnInit } from '@angular/core';
import { users } from '../objects/users';
import { ServicService } from '../services/servic.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user_login:any;
  power=-1;
  constructor(user:users,private service:ServicService) {
    this.user_login = user;
   }

  ngOnInit(): void {
  }

  submit(){
     //service with user_login
    //  this.service.login(this.user_login).subscribe
    //        (
            
              
    //          (x)=> {
              


    //          error:(error: HttpErrorResponse) =>alert(error.message);
    //           }
            
  }

 
  
  
}

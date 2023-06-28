import { Router } from '@angular/router';
import { Component, Inject, OnInit } from '@angular/core';
import { users } from '../objects/users';
import { ServicService } from '../services/servic.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { ModalPopServiceService } from '../services/modal-pop-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user_login:any;
  power=-1;
  pop_up:any;
  constructor(user:users,private service:ServicService, private router: Router,private pop_service:ModalPopServiceService) {
    this.user_login = user;
  
   }

  ngOnInit(): void {
  }


  submit(){
    //  service with user_login
     this.service.login(this.user_login).subscribe
           (  
             (x)=> {
              if(x.success==false){
                this.pop_service.open_error_login();
              }
              else{
                 this.router.navigate(['/home/home_bar'])
              }
              


             error:(error: HttpErrorResponse) =>{
              console.log('hel submit login');
              alert(error.message)};
              }
           )
            
  }


  
}

import { Router } from '@angular/router';
import { Component, Inject, OnInit } from '@angular/core';
import { users } from '../objects/users';
import { ServicService } from '../services/servic.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user_login:any;
  power=-1;
  constructor(user:users,private service:ServicService, private router: Router) {
    this.user_login = user;
   }

  ngOnInit(): void {
  }


  submit(){
    //  service with user_login
    console.log('helllo world from submit login');
     this.service.login(this.user_login).subscribe
           (  
             (x)=> {
              if(x.success==false){
                alert("fault");
              }
              else{
                console.log('helllo world from indeisnd login');                
                this.router.navigate(['/home'])
              }
              


             error:(error: HttpErrorResponse) =>{
              console.log('hel submit login');
              alert(error.message)};
              }
           )
            
  }
  
}

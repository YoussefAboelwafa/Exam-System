import { Component, OnInit } from '@angular/core';
import { users } from '../objects/users';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user_login:any;
  power=-1;
  constructor(user:users) {
    this.user_login = user;
   }

  ngOnInit(): void {
  }

  power_password(password: string){
    // Define the regular expressions for each character type
    console.log(password);
    const lowercaseRegex = /[a-z]/;
    const uppercaseRegex = /[A-Z]/;
    const digitRegex = /\d/;
    const specialRegex = /[@$!%*?&]/;
    if(password.length==0){
         this.power= -1;
    }
    // Check if the password meets all criteria
   else  if (lowercaseRegex.test(password)
        ||specialRegex.test(password)
        ||(uppercaseRegex.test(password)
        && digitRegex.test(password))
        && password.length >= 11) {
      this.power= 3;  // strong password
    }
    else if (password.length >= 9 
    || uppercaseRegex.test(password)
    || digitRegex.test(password)
    || specialRegex.test(password)
    )
    {
      this.power=2;  // medium password
    }
    else if(password.length>=7)   this.power= 1; // weak password
    else if( password.length!=0)   this.power= 0;
 
  }
  
  
}

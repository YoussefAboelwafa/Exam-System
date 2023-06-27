import { Component, OnInit } from '@angular/core';
import { users } from '../objects/users';
import { ServicService } from '../services/servic.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  signup_user:any;
  pow_password=-1;
  flag_choose_city=false;
  flag_choose_country=false;


  cities = [
    'Cairo',
    'New York',
    'Toronto',
    'Sydney',
    'Auckland'
  ];
  countries = [
    'Egypt',
    'usa',
    'canada',
    'australia',
    'new zealan'
  
];
  constructor(user:users, private service:ServicService) {
    this.signup_user=user;
  
   }

  ngOnInit(): void {
  }

  power_password(password: string) {
    // Define the regular expressions for each character type
    const lowercaseRegex = /[a-z]/;
    const uppercaseRegex = /[A-Z]/;
    const digitRegex = /\d/;
    const specialRegex = /[@$!%*?&]/;
    
    if (password.length == 0) {
      this.pow_password = -1;
    } else if (
     (password.length >= 8 
      && lowercaseRegex.test(password)
      && uppercaseRegex.test(password)
      && digitRegex.test(password)
      && specialRegex.test(password))
      ||password.length >= 18 
    ) {
      this.pow_password = 3;  // strong password
    } else if (password.length >= 8 
      && (lowercaseRegex.test(password) || uppercaseRegex.test(password))
      && (digitRegex.test(password) || specialRegex.test(password))
    ) {
      this.pow_password = 2;  // medium password
    } else if (password.length >= 8) {
      this.pow_password = 1; // weak password
    } else {
      this.pow_password = 0; // very weak password
    }
  }
  select_country(value:any){
    if(value=="Select"){
      this.flag_choose_country=false;
      this.signup_user.set_country("")
    }
    else{
      this.flag_choose_country=true;
      this.signup_user.set_country(value)

    }
  }
  select_city(value:any){
    if(value=="Select"){
      this.flag_choose_city=false;
      this.signup_user.set_city("")
    }
    else{
      this.flag_choose_city=true;
      this.signup_user.set_city(value)

    }
  }
  submit(){
    this.service.sign_up(this.signup_user).subscribe(
      (x)=> {
        
        console.log(x.status);
      })
    
  }

}

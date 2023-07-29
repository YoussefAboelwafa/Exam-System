import { Component, OnInit, Renderer2 } from '@angular/core';
import { users } from '../objects/users';
import { ServicService } from '../services/servic.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { ModalPopServiceService } from '../services/modal-pop-service.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit {
  signup_user: any;
  pow_password = -1;
  flag_choose_city = false;
  flag_choose_country = false;
  index_country = 0;
  flag_sign_up = true;

  countries = [
    'United States',
    'China',
    'Japan',
    'Germany',
    'United Kingdom',
    'India',
    'France',
    'Brazil',
    'Italy',
    'Canada',
    'South Korea',
    'Russia',
    'Australia',
    'Spain',
    'Mexico',
    'Indonesia',
    'Algeria',
    'Bahrain',
    'Comoros',
    'Djibouti',
    'Egypt',
    'Iraq',
    'Jordan',
    'Kuwait',
    'Lebanon',
    'Libya',
    'Mauritania',
    'Morocco',
    'Oman',
    'Palestine',
    'Qatar',
    'Saudi Arabia',
    'Somalia',
    'Sudan',
    'Syria',
    'Tunisia',
    'United Arab Emirates',
    'Yemen',
  ];

  countryPhoneCodes = [
    '+1',
    '+86',
    '+81',
    '+49',
    '+44',
    '+91',
    '+33',
    '+55',
    '+39',
    '+1',
    '+82',
    '+7',
    '+61',
    '+34',
    '+52',
    '+62',
    '+213',
    '+973',
    '+269',
    '+253',
    '+20',
    '+964',
    '+962',
    '+965',
    '+961',
    '+212',
    '+218',
    '+212',
    '+968',
    '+970',
    '+974',
    '+925',
    '+974',
    '+966',
    '+249',
    '+249',
    '+963',
    '+216',
    '+971',
    '+250',
  ];

  constructor(
    user: users,
    private service: ServicService,
    private router: Router,
    private pop_service: ModalPopServiceService
  ) {
    this.signup_user = user;
  }

  ngOnInit(): void {}

  power_password(password: string) {
    // Define the regular expressions for each character type
    const lowercaseRegex = /[a-z]/;
    const uppercaseRegex = /[A-Z]/;
    const digitRegex = /\d/;
    const specialRegex = /[@$!%*?&]/;

    if (password.length == 0) {
      this.pow_password = -1;
    } else if (
      (password.length >= 8 &&
        lowercaseRegex.test(password) &&
        uppercaseRegex.test(password) &&
        digitRegex.test(password) &&
        specialRegex.test(password)) ||
      password.length >= 18
    ) {
      this.pow_password = 3; // strong password
    } else if (
      password.length >= 8 &&
      (lowercaseRegex.test(password) || uppercaseRegex.test(password)) &&
      (digitRegex.test(password) || specialRegex.test(password))
    ) {
      this.pow_password = 2; // medium password
    } else if (password.length >= 8) {
      this.pow_password = 1; // weak password
    } else {
      this.pow_password = 0; // very weak password
    }
  }
  select_country(value: any) {
    if (value == 'Select') {
      this.flag_choose_country = false;
      this.signup_user.set_country('');
    } else {
      this.flag_choose_country = true;
      this.signup_user.set_country(value);

      for (let i = 0; i < this.countries.length; i++) {
        if (this.countries[i] == value) {
          this.index_country = i;
          this.signup_user.phone_namber = '+' + this.index_country;
          break;
        }
      }
    }
  }
  select_city(value: any) {
    if (value == 'Select') {
      this.flag_choose_city = false;
      this.signup_user.set_city('');
    } else {
      this.flag_choose_city = true;
      this.signup_user.set_city(value);
    }
  }
  submit() {
    this.service.user = this.signup_user;
    this.flag_sign_up = false;
    this.service.sign_up(this.signup_user).subscribe((x) => {
      if (x.success == false) {
        this.pop_service.open_error_signup();
        this.flag_sign_up = true;
      } else {
        this.router.navigate([`/verify`]);
      }
      error: (error: HttpErrorResponse) => alert(error.message);
    });
  }
}

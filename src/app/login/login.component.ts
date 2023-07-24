import { ActivatedRoute, Router } from '@angular/router';
import { Component, Inject, OnInit } from '@angular/core';
import { users } from '../objects/users';
import { ServicService } from '../services/servic.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { ModalPopServiceService } from '../services/modal-pop-service.service';

declare const $: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  user_login: any;
  power = -1;
  pop_up: any;
  constructor(
    user: users,
    private service: ServicService,
    private router: Router,
    private pop_service: ModalPopServiceService,
    private route: ActivatedRoute
  ) {
    this.user_login = user;
  }

  ngOnInit() {}

  submit() {
    //  service with user_login
    this.service.login(this.user_login).subscribe((x) => {
      if (x.success == 2) {
        this.router.navigate(['/admin_home/admin_location']);
      } else if (x.success == 1) {
        this.router.navigate(['/home/home_bar']);
      } else {
        this.pop_service.open_error_login();
      }

      error: (error: HttpErrorResponse) => {
        alert(error.message);
      };
    });
  }

  forget_pass_first_step(email: any) {
    // this.service.get_code_to_change_pass(email).subscribe(
    //   x=>{
    //     if(x.success==true){
    //       $('#forget_pass_send_email').modal('hide');
    //       $('#verify_email_to_change').modal('show');
    //     }
    //     else{
    //       $('#forget_pass_send_email').modal('hide');
    //       this.pop_service.open_error_book(x.error);
    //     }
    // })
  }

  forget_pass_second_step(verify_code: any) {
    // this.service.verify_code_to_change_pass(verify_code).subscribe(
    //   x=>{
    //     if(x.success==true){
    //       $('#verify_email_to_change').modal('hide');
    //       $('#change_pass').modal('show');
    //     }
    //     else{
    //       $('#verify_email_to_change').modal('hide');
    //       this.pop_service.open_error_book(x.error);
    //     }
    // })
  }

  forget_pass_final_step(new_pass: any) {
    // this.service.change_pass(new_pass).subscribe(
    //   x=>{
    //     if(x.success==true){
    //       $('#change_pass').modal('hide');
    //     }
    //     else{
    //       $('#change_pass').modal('hide');
    //       this.pop_service.open_error_book(x.error);
    //     }
    // })
  }

 }

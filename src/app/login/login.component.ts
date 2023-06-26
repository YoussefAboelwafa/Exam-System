import { Component, OnInit } from '@angular/core';
import { users } from '../objects/users';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(user:users) {
   }

  ngOnInit(): void {
  }
}

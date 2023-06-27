import { Component, OnInit } from '@angular/core';
import { ServicService } from '../services/servic.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
 current_user:any;
  constructor(private service:ServicService,private router: Router) { 
    this.current_user=
    this.service.is_signin().subscribe
           (
             (x)=> {
              if(x.signed_in==true){
              this.current_user=x.user;
              }
              else{
                this.router.navigate(['/login'])
              }

             error:(error: HttpErrorResponse) =>alert(error.message);
              }
           )
  }

  ngOnInit(): void {
  }

}

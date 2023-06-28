import { Component, OnInit } from '@angular/core';
import { ServicService } from '../services/servic.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.css']
})
export class VerificationComponent implements OnInit {

  digits:any[] = [];
  user:any;
  constructor(private service:ServicService,private router: Router,private route: ActivatedRoute,
    ) { }

  ngOnInit(): void {
  }

  submit(){
     let code=this.digits[0]+''+this.digits[1]+''+this.digits[2]+''+this.digits[3]+''+this.digits[4]+''+this.digits[5];
     
    //  this.route.paramMap.subscribe(params => {
    //   console.log(params);
      
    //   this.user = params.get('user');
    // });

       //service with verify
       console.log('helllo wfrom verify');
       
      this.service.verify_code(code).subscribe
       (
         (x)=> {

          if(x.success==false){
            alert("wrong code");
          }
          //code correct but email is token now
          else if(x.success==true&&x.created==false) {
            this.router.navigate([`/signup`]);
            }
            else{
              this.router.navigate([`/login`]);

            }

         error:(error: HttpErrorResponse) =>alert(error.message);
          }
       )

  }


  send(){
    // this.route.paramMap.subscribe(params => {
    //   this.user = params.get('user');
    // });


       //service to make backend to send code again 
      this.service.send_again().subscribe
       (
         (x)=> {
      error:(error: HttpErrorResponse) =>alert(error.message);
          }
       )

  }
  
   moveToNext(currentInput:any, nextInputId:any) {
    const maxLength = parseInt(currentInput.getAttribute('maxlength'));
    const currentLength = currentInput.value.length;
  
    if (currentLength === maxLength) {
      const nextInput = document.getElementById(nextInputId);
      if (nextInput) {
        nextInput.focus();
      } else {
        currentInput.blur();
      }
    }
  }
}

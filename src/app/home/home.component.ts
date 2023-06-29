import { Component, OnInit } from '@angular/core';
import { ServicService } from '../services/servic.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
declare const $: any;
 

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  photo="../../assets/images/img3.jpg";
 current_user:any;


 snacks=["kikat",'twix','snickers'];


  constructor(private service:ServicService,private router: Router) { 
    // this.current_user=
    // this.service.is_signin().subscribe
    //        (
    //          (x)=> {
    //           if(x.signed_in==true){
    //           this.current_user=x.user;
    //           }
    //           else{
    //             this.router.navigate(['/login'])
    //           }

    //          error:(error: HttpErrorResponse) =>alert(error.message);
    //           }
    //        )
  }

  ngOnInit(): void {
  }
  take_exam() {
    $('#DiscoverExams').modal('hide');
  }

  see(){
    console.log("kimp")
  }

  onFileSelect(event: any) {
    const file = event.target.files[0];
  
    if (!(file instanceof Blob)) {
      console.error('Invalid file type');
      return;
    }
  
    // Create a FileReader object
    const reader = new FileReader();
  
    // Set up an event listener for when the file is loaded
    reader.onload = (event: any) => {
      this.photo = event.target.result;
  
      // Reset the input field
      event.target.value = '';
    };
    // Read the file as a data URL
    reader.readAsDataURL(file);
  }

  select_snack(value:any){

  }
  submit(){}

}

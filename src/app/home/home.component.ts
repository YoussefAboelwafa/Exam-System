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
 //if user change url of photo in his computer the photo will spoil
 current_user={
  first_name:"Youssef",
  last_name:'Aboelwafa',
  photo:"../../assets/images/img3.jpg",  
  _id:1234567
};


 snacks=["kikat",'twix','snickers'];


  constructor(private service:ServicService,private router: Router) { 
    this.current_user={
      first_name:service.user.get_first_name(),
      last_name:service.user.get_last_name(),
      photo:service.user.get_photo(),  
      _id:service.user.get_id()
    };
    // this.service.is_signin().subscribe
    //        (
    //          (x)=> {
    //           if(x.signed_in==true){
    //           this.current_user.id=x.user.id;
    //           this.current_user.first_name=x.user.first_name;
    //          this.current_user.last_name=x.user.last_name;
    //           this.current_user.photo=x.user.photo;
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
      this.service.user.set_photo(event.target.result);
  
      // Reset the input field
      event.target.value = '';
    };
    // Read the file as a data URL
    reader.readAsDataURL(file);

      //service change photo
    // this.service.change_photo(this.service.user.get_photo().subscribe(
    //            (x)=> {
               
    //            error:(error: HttpErrorResponse) =>alert(error.message);
    //             }
    //          )
             
  }

  select_snack(value:any){

  }
  submit(){}

}

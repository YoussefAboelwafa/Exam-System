import { Component, OnInit } from '@angular/core';
import { ServicService } from '../services/servic.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { exams } from '../objects/exams';
import {NgxTypedJsModule} from 'ngx-typed-js';
declare const $: any;
 

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
 //if user change url of photo in his computer the photo will spoil
 



 snacks=["kikat",'twix','snickers'];

 upcoming_exam:any[]=[];
 token_exam:any[]=[]
 ids_exams:any[]=[]


 
   //take it from back
 non_token_exam:any={
   title:"Algoritms",
   about:"algorithms are a fundamental concept in computer science, and are essential for solving complex problems and developing efficient software systems.There are many different types of algorithms, including sorting algorithms, searching algorithms, graph algorithms, and optimization algorithms. ",
   info:["sorting","DAG","DFS algoritm"],
   _id:"",
 }  

 current_user = {
  first_name: "wait",
  last_name: "wait",
  photo:"../../assets/images/img3.jpg",  
  _id: ""
};
flag_type=true;
  constructor(private service:ServicService,private router: Router) { 

    this.service.home_bar_init().subscribe
    (
      (x)=> {

        this.service.user=x.user;
        this.current_user.first_name=x.user.first_name;
        this.current_user.last_name=x.user.last_name;
        this.current_user._id=x.user._id;
        this.service.user=x.user;
        this.non_token_exam=x.other_exam;
        let up=0,token=0;

         for(var i=0; i<x.user.exams.length; i++){  
            if(x.user.exams[i].exam.percentage==-1){
              this.upcoming_exam.push(new exams)
              this.upcoming_exam[up].country=x.user.exams[i].exam.country;
              this.upcoming_exam[up].city=x.user.exams[i].exam.city;
              this.upcoming_exam[up].location=x.user.exams[i].exam.location;
              this.upcoming_exam[up].snack=x.user.exams[i].exam.snack;
              this.upcoming_exam[up].percentage=x.user.exams[i].exam.percentage;
              this.upcoming_exam[up].appointment=x.user.exams[i].exam.appointment;
              this.upcoming_exam[up]._id=x.user.exams[i].exam._id;
              this.upcoming_exam[up].title=x.token_exam_info[i].title;
              up++;  
              this.ids_exams.push(x.user.exams[i].exam._id)
             }
             else{
              this.token_exam.push(new exams);
              this.token_exam[token].country=x.user.exams[i].exam.country;
              this.token_exam[token].city=x.user.exams[i].exam.city;
              this.token_exam[token].location=x.user.exams[i].exam.location;
              this.token_exam[token].snack=x.user.exams[i].exam.snack;
              this.token_exam[token].percentage=x.user.exams[i].exam.percentage;
              this.token_exam[token].appointment=x.user.exams[i].exam.appointment;
              this.token_exam[token]._id=x.user.exams[i].exam._id;
              this.ids_exams.push(x.user.exams[i].exam._id)
              this.token_exam[token].title=x.token_exam_info[i].title;
              this.token_exam[token].about=x.token_exam_info[i].about;
              this.token_exam[token].info=x.token_exam_info[i].info;

              token++;
             }
         }
         

         this.service.ids_ex=this.ids_exams;
         this.service.upcoming_ex=this.upcoming_exam;
         this.service.token_ex=this.token_exam;
         


    this.service.exam_bar_init().subscribe
    (
      (x)=> {
        this.service.non_token=x  
       }

    )
  
         
    this.flag_type=false;
    

       error:(error: HttpErrorResponse) =>alert(error.message);
       }

    )

    // this.current_user={
    //   first_name:service.user.get_first_name(),
    //   last_name:service.user.get_last_name(),
    //   photo:service.user.get_photo(),  
    //   _id:service.user.get_id()
    // };
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

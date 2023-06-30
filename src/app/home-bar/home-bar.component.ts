import { Component, OnInit } from '@angular/core';
import { ServicService } from '../services/servic.service';
import { HttpErrorResponse } from '@angular/common/http';
import { exams } from '../objects/exams';
declare const $: any;

@Component({
  selector: 'app-home-bar',
  templateUrl: './home-bar.component.html',
  styleUrls: ['./home-bar.component.css']
})
export class HomeBarComponent implements OnInit {
  
  
  
  
  

  flag_snack=false;
  flag_book=false;
  flag_time=false;
  book_title_course="";

  //after you order exam you should clear it
  order_exam:any={
    country:"country",
    city:"city",
    location:"location",
    snack:"snack",
    day:"Select a day",
    appointment:"Select an Appointment",
    _id:"", //id of exam
    title:"",
   }

upcoming_exam:any[]=[];
token_exam:any[]=[]
ids_exams:any[]=[]
  //take it from back
  non_token_exam:any


  // ranking_exam:any;


  current_user_h_bar={
  }

  //take it fom back
  snacks=["kikat",'twix','snickers'];
  cities=["alex","cairo"];
  locations=["smouha","sidi gaber"];
  countries=["egypt","dubai"];
  days=["14 April","12 May"];
  Appointments=["3pm","4pm","8pm"]
  




  constructor(private service:ServicService) {

    this.service.home_bar_init().subscribe
    (
      (x)=> {

        this.service.user=x.user;
        this.non_token_exam=x.other_exam;
        let up=0,token=0;        
         for(var i=0; i<x.user.exams.length; i++){  
          console.log(x)
            if(x.user.exams[i].exam.percentage==-1){
              this.upcoming_exam.push(exams)
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
              this.token_exam.push(exams);
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
              token++;
             }
         }
         this.service.ids_ex=this.ids_exams;
         this.service.upcoming_ex=this.upcoming_exam;
         this.service.token_ex=this.token_exam;
         
        
       
       error:(error: HttpErrorResponse) =>alert(error.message);
       }

    )



  }

  ngOnInit(): void {
  }


  reset_order_exam(){
    this.order_exam={
      country:"country",
      city:"city",
      location:"location",
      snack:"snack",
      day:"Select a day",
      appointment:"Select an Appointment",
      id:"", //id of exam
      title:"",
     }
   }
  

  clear_flag_book(){
    this.flag_snack=false;
    this.flag_book=false;
    this.flag_time=false;
    }
  
    //service to take city,snack,locatin ....
    select_snack(value:any){
      this.order_exam.snack=value;

    }
    select_day(value:any){
      this.order_exam.day=value;


    }
    select_appointment(value:any){
      this.order_exam.appointment=value;
    }

    select_country(value:any){
      this.order_exam.country=value;

    }
    select_city(value:any){
      this.order_exam.city=value;

    }
    select_location(value:any){
      this.order_exam.location=value;

    }

    submit_book(){ 
      //service becouse i need city and country and location then next step
      this.clear_flag_book();
      this.flag_snack=true;
    }
    submit_snack(){
          //service becouse i need all kinds of snacks then next step
      this.clear_flag_book();
      this.flag_time=true;
  
  
    }
    submit_time(){
          //service becouse i need Day of exam and Appointment then next step
      this.clear_flag_book();
      // this.submit_time();
    }
  
    take_exam(name_exam:any,id_exam:any){
      this.book_title_course=name_exam;
      //becouse if the user click take exam from modal,hide pop up if it show
      this.order_exam._id=id_exam;
      $('#not_token_exam').modal('hide');
      this.flag_book=true;
    }
  
    close_book(){
      this.clear_flag_book();
      this.reset_order_exam();
    }



    //service.user=current_user
}

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
non_token_exam:any={
  title:"Algoritms",
  about:"algorithms are a fundamental concept in computer science, and are essential for solving complex problems and developing efficient software systems.There are many different types of algorithms, including sorting algorithms, searching algorithms, graph algorithms, and optimization algorithms. ",
  info:["sorting","DAG","DFS algoritm"],
  _id:"",
}

  learn_dataof_nontoken:any={
    title:"Algoritms",
    about:"algorithms are a fundamental concept in computer science, and are essential for solving complex problems and developing efficient software systems.There are many different types of algorithms, including sorting algorithms, searching algorithms, graph algorithms, and optimization algorithms. ",
    info:["sorting","DAG","DFS algoritm"],
    _id:"",
  };
  learn_dataof_token:any={
    title:"Algoritms",
    about:"algorithms are a fundamental concept in computer science, and are essential for solving complex problems and developing efficient software systems.There are many different types of algorithms, including sorting algorithms, searching algorithms, graph algorithms, and optimization algorithms. ",
    info:["sorting","DAG","DFS algoritm"],
    _id:"",
  };
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
  


ngOnInit(): void {
  }

  constructor(private service:ServicService) {
    this.upcoming_exam=this.service.upcoming_ex;
    this.token_exam=this.service.token_ex;
    this.non_token_exam=this.service.non_token[0];

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
      $('#token_exam').modal('hide');
      this.flag_book=true;
    }
  
    close_book(){
      this.clear_flag_book();
      this.reset_order_exam();
    }

    learn_token(value_send_by_btn_learn:any){
      this.learn_dataof_token=value_send_by_btn_learn;
    }
    learn_non_token(value_send_by_btn_learn:any){
      this.learn_dataof_nontoken=value_send_by_btn_learn;
    }

    //service.user=current_user
}

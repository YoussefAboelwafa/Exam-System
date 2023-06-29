import { Component, OnInit } from '@angular/core';
declare const $: any;

@Component({
  selector: 'app-exams-bar',
  templateUrl: './exams-bar.component.html',
  styleUrls: ['./exams-bar.component.css']
})

export class ExamsBarComponent implements OnInit {

  flag_snack=false;
  flag_book=false;
  flag_time=false;

  name_exam="Algorithms";
  snacks=["kikat",'twix','snickers'];
  
  name_course="Algoritms Course"
  discription="algorithms are a fundamental concept in computer science, and are essential for solving complex problems and developing efficient software systems.There are many different types of algorithms, including sorting algorithms, searching algorithms, graph algorithms, and optimization algorithms. "
  about_course=["sorting algoritms","DFS algoritm","DAG algoritm"]
  

  constructor() { 
  }

  ngOnInit(): void {
  }

  clear_flag_book(){
  this.flag_snack=false;
  this.flag_book=false;
  this.flag_time=false;
  }

  select_snack(value:any){
    
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
    //hide pop up if it show
    $('#not_taken_exam').modal('hide');
    this.name_exam=name_exam;
    this.flag_book=true;
  }

  close_book(){
    this.clear_flag_book();
  }
  

  see(){
    console.log("kimp")
  }
  


}

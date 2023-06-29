import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-exams-bar',
  templateUrl: './exams-bar.component.html',
  styleUrls: ['./exams-bar.component.css']
})
export class ExamsBarComponent implements OnInit {

  flag_snack=false;
  flag_book=false;
  flag_time=true;
  snacks=["kikat",'twix','snickers'];

  constructor() { 
  }

  ngOnInit(): void {
  }

  select_snack(value:any){

  }
  submit(){}

}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-calendar',
  templateUrl: './admin-calendar.component.html',
  styleUrls: ['./admin-calendar.component.css']
})
export class AdminCalendarComponent implements OnInit {


  flag_student=false;
  flag_all_student=true;
  flag_calender=false;
  token_exam:any[]=[
    {
      title:"Algoritms ",
      _id:"",
      country:"Egypt",
      city:"Alex",
      location:"sss",
      snack:"kitkat",
      day:"15 April",
      appointment:"3.00 pm",
      percentage:"00"
    },
    {
      title:"data structure ",
      _id:"",
      country:"Egypt",
      city:"Alex",
      location:"sss",
      snack:"kitkat",
      day:"15 April",
      appointment:"3.00 pm",
      percentage:"00"
    },
    {
      title:"data structure ",
      _id:"",
      country:"Egypt",
      city:"Alex",
      location:"sss",
      snack:"kitkat",
      day:"15 April",
      appointment:"3.00 pm",
      percentage:"00"
    },
    {
      title:"data structure ",
      _id:"",
      country:"Egypt",
      city:"Alex",
      location:"sss",
      snack:"kitkat",
      day:"15 April",
      appointment:"3.00 pm",
      percentage:"00"
    },
  ]


  current_user = {
    first_name: "Samy",
    last_name: "tarek",
    photo:"../../assets/images/img5.svg",  
    _id: "1234567"
  };
  

  constructor() { }

  ngOnInit(): void {
  }


  close_card(){
    this.flag_student=false;
  
  }
}

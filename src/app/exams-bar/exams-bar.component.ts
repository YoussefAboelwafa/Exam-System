import { Component, OnInit } from '@angular/core';
import { ServicService } from '../services/servic.service';
import { HttpErrorResponse } from '@angular/common/http';
import { address } from '../objects/loction_address';
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
  upcoming_exam:any[]=[]
  token_exam:any[]=[]
  //take it from back
  learn_dataof_nontoken:any=[];
  learn_dataof_token:any=[]
  non_token_exam:any[]=[]

  current_user_h_bar={
  }

  //take it fom back
  snacks=["kikat",'twix','snickers'];
  cities=["alex","cairo"];
  locations=["smouha","sidi gaber"];
  countries=["egypt","dubai"];
  days=["14 April","12 May"];
  Appointments=["3pm","4pm","8pm"]
  all_locations: any;
  country: any;
  calendar: any;
  address: any;
  temp_city_address:any =null;
  city: any;
  index_city:any;
  index_country: any;
  temp_location_address:any= null;
  temp_country_address= null;
  index_location: any;
  id_location: any;
  

  constructor(private service:ServicService) {
    this.upcoming_exam=this.service.upcoming_ex;
    this.token_exam=this.service.token_ex;
    this.non_token_exam=this.service.non_token;
    console.log(this.token_exam)


    this.service.get_places().subscribe(
      (x)=> {
        this.all_locations=x;
        this.country= x.map((cont:any)=> cont.country_name);

        let combinations: string[] = [];

this.all_locations.forEach((country: any) => {
  country.cities.forEach((city: any) => {
    city.locations.forEach((location: any) => {
      combinations.push(`${country.country_name}:${city.city_name}:${location.location_name}:${location.max_number}:${location.snacks}:${location._id}`);
    });
  });
});


this.service.get_calender().subscribe(
  x=>{
    this.calendar=x;
})

for(let i=0; i<combinations.length; i++) {
  let x=new address;
  const dateArr = combinations[i].split(":");

  x.country=dateArr[0];
  x.city=dateArr[1];
  x.location=dateArr[2];
  x.capacity=dateArr[3];
  x.snacks=dateArr[4];
  x._id=dateArr[5]
  console.log(x);
  this.address.push(x);
}

console.log(combinations);



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
      _id:"", //id of exam
      title:"",
     }
   }

  clear_flag_book(){
  this.flag_snack=false;
  this.flag_book=false;
  this.flag_time=false;
  }
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
    //send notification and reset order exam 

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

  learn_non_token(value_send_by_btn_learn:any){
    this.learn_dataof_nontoken=value_send_by_btn_learn;
  }

  learn_token(value_send_by_btn_learn:any){
    console.log(value_send_by_btn_learn)
    this.learn_dataof_token=value_send_by_btn_learn;
  }





  onCountrySelected(event: Event,flag:any) {
    console.log(flag)
     const selectedCountry = (event.target as HTMLSelectElement).value;
    // Call your function here with the selectedCountry value
    //flag==1 that meen filter
    if(flag==1){
    if(this.temp_country_address!=null) {
    this.calendar=this.temp_country_address;
    this.temp_country_address = null;
    }
    if(selectedCountry != "Country" ){
      this.temp_country_address=this.calendar;
       this.calendar = this.calendar.filter((obj: { country: string; }) => obj.country === selectedCountry);

    }
    else{
      this.city=[]
      return
    }
  }
    for (let i=0; i<this.country.length; i++){
      if(this.country[i]==selectedCountry){
        this.index_country=i;
      }
    }

    this.city= this.all_locations.map((cont:any)=> cont.cities)[this.index_country].map((c:any)=> c.city_name);
  }

  oncitySelected(event: Event,flag:any){
    const selectedCity = (event.target as HTMLSelectElement).value;
    // Call your function here with the selectedCountry value
    if(flag ==1){
    if(this.temp_city_address!=null) {
      this.calendar=this.temp_city_address;
      this.temp_city_address = null;
      }
    if(selectedCity  != "City" ){
      
      this.temp_city_address=this.calendar;
       this.calendar = this.calendar.filter((obj: { city: any; }) => (obj.city === selectedCity) );
    }
    else{
      this.locations=[]
      return
    }
  }
    
    for (let i=0; i<this.city.length; i++){
      if(this.city[i]==selectedCity){
        this.index_city=i;
      }
    }
      console.log(this.index_city)
    this.locations= this.all_locations.map((cont:any)=> cont.cities)[this.index_country].map((c:any)=> c.locations)[this.index_city].map((c:any)=> c.location_name)
  }

  onlocationSelected(event: Event,flag:any){
    const selectedlocation = (event.target as HTMLSelectElement).value;

    if(flag==1){
    if(this.temp_location_address!=null) {
      this.calendar=this.temp_location_address;
      this.temp_location_address = null;
      }
    if(selectedlocation  != "Location" ){
      
      this.temp_location_address=this.calendar;
       this.calendar = this.calendar.filter((obj: { location: string; }) => (obj.location === selectedlocation) );
    }
  }

    for (let i=0; i<this.locations.length; i++){
      if(this.locations[i]==selectedlocation){
        this.index_location=i;
      }
    }
    // this.snacks= this.all_locations.map((cont:any)=> cont.cities)[this.index_country].map((c:any)=> c.locations)[this.index_city].map((c:any)=> c.snacks)
    this.id_location= this.all_locations.map((cont:any)=> cont.cities)[this.index_country].map((c:any)=> c.locations)[this.index_city].map((c:any)=> c._id)[this.index_location]

}
}

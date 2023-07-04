import { Component, HostListener, OnInit } from '@angular/core';
import { ServicService } from '../services/servic.service';
import { HttpErrorResponse } from '@angular/common/http';
import { exams } from '../objects/exams';
import { calendar } from '../objects/calender';
import { address } from '../objects/loction_address';
import { Router } from '@angular/router';
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


  snacks=[];
  snac:any;
  locations=[];
  countries=[];
  day=[];
  time=[]
  all_locations: any;
  countrys: any;
  calendar:calendar[]=[];
  address: address[]=[];
  temp_city_address:any =null;
  citys: any;
  index_city:any;
  index_country: any;
  temp_location_address:any= null;
  temp_country_address:any= null;
  index_location: any;
  id_location: any;
  select_snacks:any="Snack";
  selectedlocation:any="location";
  selectedCity:any="city";
  selectedCountry:any="country";
  selectedday:any='Select a day';
  selectedappointment:any="Select an Appointmen"
  index_day:any;
  day_id:any="";
  book_id_exam:any="";

  avilable_time:any;

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

upcoming_exam:exams[]=[];
token_exam:exams[]=[]
ids_exams:any[]=[]
  //take it from back
non_token_exam:any={}
  learn_dataof_nontoken=new exams
  learn_dataof_token=new exams
  // ranking_exam:any;



ngOnInit(): void {
  }

  constructor(private service:ServicService,private router:Router) {
    this.upcoming_exam=this.service.upcoming_ex;
    this.token_exam=this.service.token_ex;
    
    this.non_token_exam=this.service.non_token[0];




    this.service.get_places().subscribe(
      (x)=> {
        this.all_locations=x;
        this.countrys= x.map((cont:any)=> cont.country_name);
      
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
  this.address.push(x);
}

console.log(combinations);



         error:(error: HttpErrorResponse) =>alert(error.message);
       }
  
    )


  }


  

reset_order_exam(){
 this.select_snacks="Snack";
 this.selectedlocation="location";
 this.selectedCity="city";
 this.selectedCountry="country";
 this.selectedday='Select a day';
 this.selectedappointment="Select an Appointmen"
 this.avilable_time="";
 this.snacks = []
 }

  clear_flag_book(){
  this.flag_snack=false;
  this.flag_book=false;
  this.flag_time=false;
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
    let x={
      location_id:this.id_location,
      day_id:this.day_id,
      exam_id:this.book_id_exam,
      snack:this.select_snacks,
      appointment:this.selectedappointment,
    }
    this.service.book_exam(x).subscribe(
      x=>{

      }
  )
  this.reset_order_exam();
        //service becouse i need Day of exam and Appointment then next step
    this.clear_flag_book();

    //send notification and reset order exam 
    this.router.navigate(['home'])
  }

  take_exam(name_exam:any,id_exam:any){
    this.book_title_course=name_exam;
    //becouse if the user click take exam from modal,hide pop up if it show
    this.book_id_exam=id_exam;
    $('#not_token_exam').modal('hide');
    $('#token_exam').modal('hide');
    this.flag_book=true;
    this.reset_order_exam()
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





  onCountrySelected(event: Event) {
     this.selectedCountry = (event.target as HTMLSelectElement).value;
    // Call your function here with the selectedCountry value
    //flag==1 that meen filter
    if(this.temp_country_address!=null) {
    this.calendar=this.temp_country_address;
    this.temp_country_address = null;
    }
    if(this.selectedCountry != "Country" ){
      this.temp_country_address=this.calendar;
       this.calendar = this.calendar.filter((obj: { country: string; }) => obj.country === this.selectedCountry);

    }
    else{
      this.citys=[]
      return
    }
  
    for (let i=0; i<this.countrys.length; i++){
      if(this.countrys[i]==this.selectedCountry){
        this.index_country=i;
      }
    }

    this.citys= this.all_locations.map((cont:any)=> cont.cities)[this.index_country].map((c:any)=> c.city_name);
  }

  oncitySelected(event: Event){
    this.selectedCity = (event.target as HTMLSelectElement).value;
    // Call your function here with the selectedCountry value
    if(this.temp_city_address!=null) {
      this.calendar=this.temp_city_address;
      this.temp_city_address = null;
      }
    if(this.selectedCity  != "City" ){
      
      this.temp_city_address=this.calendar;
       this.calendar = this.calendar.filter((obj: { city: any; }) => (obj.city === this.selectedCity) );
    }
    else{
      this.locations=[]
      return
    }
  
    
    for (let i=0; i<this.citys.length; i++){
      if(this.citys[i]==this.selectedCity){
        this.index_city=i;
      }
    }
      console.log(this.index_city)
    this.locations= this.all_locations.map((cont:any)=> cont.cities)[this.index_country].map((c:any)=> c.locations)[this.index_city].map((c:any)=> c.location_name)
  }

  onlocationSelected(event: Event){
    this.selectedlocation = (event.target as HTMLSelectElement).value;

    if(this.temp_location_address!=null) {
      this.calendar=this.temp_location_address;
      this.temp_location_address = null;
      }
    if(this.selectedlocation  != "Location" ){
      
      this.temp_location_address=this.calendar;
       this.calendar = this.calendar.filter((obj: { location: string; }) => (obj.location === this.selectedlocation) );
    }
 

    for (let i=0; i<this.locations.length; i++){
      if(this.locations[i]==this.selectedlocation){
        this.index_location=i;
      }
    }
    this.snacks= this.all_locations.map((cont:any)=> cont.cities)[this.index_country].map((c:any)=> c.locations)[this.index_city].map((c:any)=> c.snacks);
    this.id_location= this.all_locations.map((cont:any)=> cont.cities)[this.index_country].map((c:any)=> c.locations)[this.index_city].map((c:any)=> c._id)[this.index_location]
}

onselectsnack(event: Event){
  this.select_snacks=(event.target as HTMLSelectElement).value;
}

ondayselect(event:Event){
  this.selectedday=(event.target as HTMLSelectElement).value;
    console.log(this.selectedday)
  for(var i=0;i<this.calendar.length;i++){
    if(this.calendar[i].day_number==this.selectedday.split(" : ")[0]){
      this.avilable_time=this.calendar[i].time;
      this.day_id=this.calendar[i]._id;


  };

  if(this.selectedday=='Select a day'){
    this.selectedappointment="";
    this.avilable_time="";
  }
}
}


ontimeselect(event:Event){
  this.selectedappointment=(event.target as HTMLSelectElement).value;
}


    //service.user=current_user
}

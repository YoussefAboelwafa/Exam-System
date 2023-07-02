import { Component, OnInit } from '@angular/core';
import { calendar } from '../objects/calender';
import { book_user } from '../objects/book_user';
import { ServicService } from '../services/servic.service';
import { address } from '../objects/loction_address';
import { HttpErrorResponse } from '@angular/common/http';
declare const $: any;

@Component({
  selector: 'app-admin-calendar',
  templateUrl: './admin-calendar.component.html',
  styleUrls: ['./admin-calendar.component.css']
})
export class AdminCalendarComponent implements OnInit {


  flag_student=false;
  flag_all_student=false;
  flag_calender=true;
  moderator_name='';
  user_exam:book_user[]=[
    {
      name_user:"karim tarek",
      _id:"",
      _id_user:"123456",
      photo_user:"",
      exam_title:"c++",
      location:"smoha",
      snack:"kitkat",
      time_book:"15 April 3.00 pm",
      percentage_user:"00",
      _id_exam:"",
    },
    {
      name_user:"ahmed ali",
      _id:"",
      _id_user:"124481",
      photo_user:"",
      exam_title:"python",
      location:"smoha",
      snack:"moro",
      time_book:"15 April 3.00 pm",
      percentage_user:"00",
      _id_exam:"",
    },{
      name_user:"noha tarek",
      _id:"",
      _id_user:"114845",
      photo_user:"",
      exam_title:"algorithms",
      location:"smoha",
      snack:"kitkat",
      time_book:"15 April 3.00 pm",
      percentage_user:"00",
      _id_exam:"",
      
    },{
      name_user:"kimo fathy",
      _id:"",
      _id_user:"123456",
      photo_user:"",
      exam_title:"data structure",
      location:"smoha",
      snack:"kitkat",
      time_book:"15 April 3.00 pm",
      percentage_user:"00",
      _id_exam:"",
    },
  ]
  current_user = {
    first_name: "karim",
    last_name: "tarek",
    photo:"../../assets/images/img5.svg",  
    _id: "1234567"
  };

  calendar:calendar[]=[
    {
      day_number:1,
      day_name:"saturday",
      month_name:"jan",
      month_number:"march",
      country:"egypt",
      city:"alex",
      location:"smouha",
      location_id:"ksdc",
      _id: "1",
      time:"5 pm",
      moderator:"",
      student:21,
      capacity:25,
    },
  ]

  remove_calend=new calendar;
  index_calend:any;
  day_all:any;
  month_all:any;
  change_user:any;
  index_change_user:any;


  all_locations:any;
  country:any[]=[];
  city:any[]=[];
  locations:any[]=[];
  snacks:any[]=[];
  capacity:any[]=[];
  index_country:any;
  index_city:any;
  index_location:any;
  id_location:any;


  address:address[]=[]
  temp_country_address:any;
  temp_city_address:any;
  temp_location_address:any;
  constructor(private service:ServicService) {

    this.service.get_places().subscribe(
      (x)=> {
        this.all_locations=x;
        this.country= x.map((cont:any)=> cont.country_name);
      //  this.city= x.map((cont:any)=> cont.cities)[0].map((c:any)=> c.city_name);
      //   console.log(x);
        
        // console.log(x[0].cities);
        // console.log(x[0].cities[0].city_name);
        // console.log(x[0].cities[0].locations);
        // console.log(x[0].cities[0].locations[0].location_name);
        // console.log(x[0].cities[0].locations[0].snacks);
        // console.log(x[0].cities[0].locations[0].snacks[0]);
        // console.log(x[0].cities[0].locations[0].max_number);
        let combinations: string[] = [];

this.all_locations.forEach((country: any) => {
  country.cities.forEach((city: any) => {
    city.locations.forEach((location: any) => {
      combinations.push(`${country.country_name}: ${city.city_name}: ${location.location_name}:${location.max_number}:${location.snacks}:${location._id}`);
    });
  });
});

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
  //   this.service.get_calender().subscribe(
  //     (x:any) => {
  //       console.log(x);
  //     }
  //   )
  //  }

  ngOnInit(): void {
  }


   get_name_date(dateStr: string, flag: number): string {
    const dateArr = dateStr.split("-");
    const year = parseInt(dateArr[0]);
    const month = parseInt(dateArr[1]) - 1;
    const day = parseInt(dateArr[2]);
  
    const dateObj = new Date(year, month, day);
    let result = "";
  
    if (flag === 1) {
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      result = days[dateObj.getDay()];
    } else if (flag === 0) {
      const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      result = months[dateObj.getMonth()];
    } else {
      result = "Invalid flag value. Flag must be 0 or 1.";
    }
  
    return result;
  }
  remove_calender(value:any,index:any) {
    this.remove_calend=value;
    this.index_calend=index; 
  }

  totaly_remove(){
   //service_remove exam pass object 
   this.calendar.splice(this.index_calend, 1);
   this.close_popup();
   this.remove_calend=new calendar;
    this.index_calend="";
  }
  close() {
    this.close_popup();
    this.remove_calend=new calendar;
    this.index_calend="";
  }
  close_popup(){
    $('#confirmation').modal('hide');
    $('#addappointmodal').modal('hide');
    $('#moderatormodal').modal('hide');

  }

  close_card(){
    this.flag_student=false;
  }

  goto_all_student(day:any,month:any){
    this.day_all=day;
    this.month_all=month;
    this.flag_calender=false;
    this.flag_all_student=true;
  }

  add_calendar(add_date:any,add_time:any){
    let x=new calendar;
    let dateArr = add_date.split("-");
    const month = parseInt(dateArr[1]);
    const day = parseInt(dateArr[2]);
    const timeArr = add_time.split(":");
    let hours = parseInt(timeArr[0]);
    const minutes = parseInt(timeArr[1]);
    
    let ampm = "AM";
    if (hours >= 12) {
      ampm = "PM";
    }
    if (hours > 12) {
      hours -= 12;
    }    
    const time = `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  
    // x.country=add_country;
    // x.city=add_city;
    // x.location=add_location;
    x.location_id=this.id_location;
    x.day_number=day;
    x.month_number=month;
    x.time=time;
    x.day_name=this.get_name_date(add_date,1);
    x.month_name=this.get_name_date(add_date,0);
    this.close();
    this.calendar.push(x);
    console.log(x.day_name)
    //services add calendar : capacity from location 
  }

  open_user_card(user_value:any,index:any){
    this.change_user=user_value;
    this.flag_student=true;
    this.index_change_user=index;
  }

  change_percentage(value:any){

    this.user_exam[this.index_change_user].percentage_user=value;
    //service send _id_user and new_percentage
    this.close_card();
  }
  close_all_student(){
    this.flag_all_student=false;
    this.flag_calender=true;
  }
  add_moderator(value:any){
    this.moderator_name=value;
    this.close_popup();

  }

  onCountrySelected(event: Event) {
    const selectedCountry = (event.target as HTMLSelectElement).value;
    // Call your function here with the selectedCountry value
    if(selectedCountry != "Country" ){
      this.temp_country_address=this.address;
       this.address = this.address.filter(obj => obj.country === selectedCountry);
    }
    else{
      this.address=this.temp_country_address;
      this.temp_country_address = null;
    }
    for (let i=0; i<this.country.length; i++){
      if(this.country[i]==selectedCountry){
        this.index_country=i;
      }
    }

    this.city= this.all_locations.map((cont:any)=> cont.cities)[this.index_country].map((c:any)=> c.city_name);
  }

  oncitySelected(event: Event){
    const selectedCity = (event.target as HTMLSelectElement).value;
    // Call your function here with the selectedCountry value
    if(selectedCity != "City" ){
      
      this.temp_city_address=this.address;
       this.address = this.address.filter(obj => obj.city === selectedCity);
    }
    else{
      this.address=this.temp_city_address;
      this.temp_city_address = null;
    }
    for (let i=0; i<this.city.length; i++){
      if(this.city[i]==selectedCity){
        this.index_city=i;
      }
    }
      console.log(this.index_city)
    this.locations= this.all_locations.map((cont:any)=> cont.cities)[this.index_country].map((c:any)=> c.locations)[this.index_city].map((c:any)=> c.location_name)
    ;
    console.log(this.locations)
  }

  onlocationSelected(event: Event){
    const selectedlocation = (event.target as HTMLSelectElement).value;

    for (let i=0; i<this.locations.length; i++){
      if(this.locations[i]==selectedlocation){
        this.index_location=i;
      }
    }
    // this.snacks= this.all_locations.map((cont:any)=> cont.cities)[this.index_country].map((c:any)=> c.locations)[this.index_city].map((c:any)=> c.snacks)
    this.id_location= this.all_locations.map((cont:any)=> cont.cities)[this.index_country].map((c:any)=> c.locations)[this.index_city].map((c:any)=> c._id)


  }


}

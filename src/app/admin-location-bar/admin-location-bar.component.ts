import { Component, OnInit } from '@angular/core';
import { address } from '../objects/loction_address';
import { ServicService } from '../services/servic.service';
import { HttpErrorResponse } from '@angular/common/http';
declare const $: any;

@Component({
  selector: 'app-admin-location-bar',
  templateUrl: './admin-location-bar.component.html',
  styleUrls: ['./admin-location-bar.component.css']
})
export class AdminLocationBarComponent implements OnInit {


  address:address[]=[]
  temp_country_address:any;
  temp_city_address:any;
  temp_location_address:any;
  remove_ad:address=new address;
  edit_ad=new address;
  index_remved_address:any;
  index_edit_address:any;
  
  all_locations:any;
   country:any[]=[];
   city:any[]=[];
   locations:any[]=[];
   snacks:any[]=[];
   capacity:any[]=[];
   index_country:any;
   index_city:any;
   index_location:any;

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

  ngOnInit(): void {
  }

  close_popup(){
    $('#confirm_adress').modal('hide');
    $('#editlocationmodal').modal('hide');
    $('#addlocationmodal').modal('hide');

  } 
  close() {
    this.close_popup();
    this.remove_ad=new address;
    this.index_remved_address="";
    this.edit_ad=new address;
  }
  
  remove_address(value:any,index:any){
    this.remove_ad=value;
    this.index_remved_address=index
  }

  totaly_remove(){
    let x=new address;
   x=this.address[this.index_remved_address];
    this.address.splice(this.index_remved_address, 1);
    this.close_popup();
   this.remove_ad=new address;
   this.index_remved_address="";
   //service remove address
   this.service.remove_locate(x._id).subscribe(
    (x)=> {
       error:(error: HttpErrorResponse) =>alert(error.message);
     }

  )


  }
  // edit_address(value:any,index:any) {
  //   this.edit_ad=value;
  //   this.index_edit_address=index;
  // }

  // totaly_edit(ed_country:any,ed_city:any,ed_location:any,ed_capacity:any,ed_snacks:any){
  //   this.address[this.index_edit_address].country=ed_country;
  //   this.address[this.index_edit_address].city=ed_city;
  //   this.address[this.index_edit_address].location=ed_location;
  //   this.address[this.index_edit_address].capacity=ed_capacity;
  //   this.address[this.index_edit_address].snacks=ed_snacks;

  //   this.close_popup();

  //   this.service.edit_location(this.address[this.index_edit_address]._id,this.address[this.index_edit_address]).subscribe(
  //     (x)=> {
  
  //        error:(error: HttpErrorResponse) =>alert(error.message);
  //      }
  
  //   )

  //   //service edit address
  // }

  add_locate(add_country:any,add_city:any,add_location:any,add_capacity:any,add_snacks:any) {
    let x=new address;
    x.country=add_country;
    x.city=add_city;
    x.location=add_location;
    x.capacity=add_capacity;
    x.snacks=add_snacks;
    this.address.push(x);
    this.close_popup();
    //serviec add new address and recieve id and set it

    this.service.add_location(x).subscribe(
      (x)=> {
       this.address[this.address.length-1]._id=x._id;
       console.log(this.address[this.address.length-1])

         error:(error: HttpErrorResponse) =>alert(error.message);
       }
  
    )

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
    this.snacks= this.all_locations.map((cont:any)=> cont.cities)[this.index_country].map((c:any)=> c.locations)[this.index_city].map((c:any)=> c.snacks)
    this.capacity= this.all_locations.map((cont:any)=> cont.cities)[this.index_country].map((c:any)=> c.locations)[this.index_city].map((c:any)=> c.max_number)




  }

}

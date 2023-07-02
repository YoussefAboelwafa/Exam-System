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


  address:address[]=[
  {
    country: "Egypt",
    city:"Alexandria",
    capacity: 50,
    location:"smouha",
    _id:null,
    snacks:"kooookooo",
  },
  {
    country: "Egypt",
    city:"cairo",
    capacity: 20,
    location:"ramsis",
    _id:null,
    snacks:"kooookooo",
  },
  {
    country: "UAE",
    city:"Dubai",
    capacity: 90,
    location:"Maydan",
    _id:null,
    snacks:"kooookooo",

  },{
    country: "UAE",
    city:"Dubai",
    capacity: 90,
    location:"Maydan",
    _id:null,
    snacks:"kooookooo",

  },
  ]

  remove_ad:address=new address;
  edit_ad=new address;
  index_remved_address:any;
  index_edit_address:any;
  

  constructor(private service:ServicService) { }

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
    this.address.splice(this.index_remved_address, 1);
    this.close_popup();
   this.remove_ad=new address;
   this.index_remved_address="";
   //service remove address
   this.service.add_location(this.address[this.index_remved_address]._id).subscribe(
    (x)=> {
       error:(error: HttpErrorResponse) =>alert(error.message);
     }

  )


  }
  edit_address(value:any,index:any) {
    this.edit_ad=value;
    this.index_edit_address=index;
  }

  totaly_edit(ed_country:any,ed_city:any,ed_location:any,ed_capacity:any,ed_snacks:any){
    this.address[this.index_edit_address].country=ed_country;
    this.address[this.index_edit_address].city=ed_city;
    this.address[this.index_edit_address].location=ed_location;
    this.address[this.index_edit_address].capacity=ed_capacity;
    this.address[this.index_edit_address].snacks=ed_snacks;

    this.close_popup();

    this.service.edit_location(this.address[this.index_edit_address]._id,this.address[this.index_edit_address]).subscribe(
      (x)=> {
  
         error:(error: HttpErrorResponse) =>alert(error.message);
       }
  
    )

    //service edit address
  }

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
  
       this.address[this.address.length-1]._id=x;
         error:(error: HttpErrorResponse) =>alert(error.message);
       }
  
    )

  }

  
 

}

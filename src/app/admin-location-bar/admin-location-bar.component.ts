import { Component, OnInit } from '@angular/core';
import { address } from '../objects/loction_address';
import { ServicService } from '../services/servic.service';
import { HttpErrorResponse } from '@angular/common/http';
declare const $: any;

@Component({
  selector: 'app-admin-location-bar',
  templateUrl: './admin-location-bar.component.html',
  styleUrls: ['./admin-location-bar.component.css'],
})
export class AdminLocationBarComponent implements OnInit {
  address: address[] = [];
  temp_country_address: any = null;
  temp_city_address: any = null;
  temp_location_address: any = null;
  remove_ad: address = new address();
  edit_ad = new address();
  index_remved_address: any;
  index_edit_address: any;
  flag_type = true;
  all_locations: any;
  country: any[] = [];
  city: any[] = [];
  locations: any[] = [];
  snacks: any[] = [];
  capacity: any[] = [];
  index_country: any;
  index_city: any;
  index_location: any;
  flag_show_location=true
  constructor(private service: ServicService) {
    this.get_all_place();
  }

  ngOnInit(): void {}
  temp_loction: any;
  get_all_place() {
    this.service.get_places().subscribe((x) => {
      this.all_locations = x;
      this.temp_loction = x;
      this.country = x.map((cont: any) => cont.country_name);

      let combinations: string[] = [];

      this.all_locations.forEach((country: any) => {
        country.cities.forEach((city: any) => {
          city.locations.forEach((location: any) => {
            combinations.push(
              `${country.country_name}:${city.city_name}:${location.location_name}:${location.max_number}:${location.snacks}:${location._id}`
            );
          });
        });
      });

      let temp: address[] = [];
      for (let i = 0; i < combinations.length; i++) {
        let x = new address();
        const dateArr = combinations[i].split(':');

        x.country = dateArr[0];
        x.city = dateArr[1];
        x.location = dateArr[2];
        x.capacity = dateArr[3];
        x.snacks = dateArr[4];
        x._id = dateArr[5];
        temp.push(x);
      }

      this.address = temp;

      this.flag_type = false;
      error: (error: HttpErrorResponse) => alert(error.message);
    });
  }

  close_popup() {
    $('#confirm_adress').modal('hide');
    $('#editlocationmodal').modal('hide');
    $('#addlocationmodal').modal('hide');
  }
  close() {
    this.close_popup();
    this.remove_ad = new address();
    this.index_remved_address = '';
    this.edit_ad = new address();
  }

  remove_address(value: any, index: any) {
    this.remove_ad = value;
    this.index_remved_address = index;
  }

  totaly_remove() {
    let x = new address();
    x = this.address[this.index_remved_address];
    this.address.splice(this.index_remved_address, 1);
    this.close_popup();
    this.remove_ad = new address();
    this.index_remved_address = '';
    this.service.remove_locate(x._id).subscribe((x) => {
      this.get_all_place();
      error: (error: HttpErrorResponse) => alert(error.message);
    });
  }
  edit_address(value: any, index: any) {
    this.edit_ad = value;
    this.index_edit_address = index;
  }

  totaly_edit(ed_capacity: any, ed_snacks: any) {
    this.address[this.index_edit_address].capacity = ed_capacity;
    this.address[this.index_edit_address].snacks = ed_snacks;

    this.close_popup();

    this.service
      .edit_location(
        this.address[this.index_edit_address]._id,
        this.address[this.index_edit_address]
      )
      .subscribe((x) => {
        error: (error: HttpErrorResponse) => alert(error.message);
      });

    // service edit address
  }

  add_locate(
    add_country: any,
    add_city: any,
    add_location: any,
    add_capacity: any,
    add_snacks: any
  ) {
    let x = new address();
    x.country = add_country;
    x.city = add_city;
    x.location = add_location;
    x.capacity = add_capacity;
    x.snacks = add_snacks;
    this.address.push(x);
    this.close_popup();
    //serviec add new address and recieve id and set it

    this.service.add_location(x).subscribe((x) => {
      this.address[this.address.length - 1]._id = x._id;

      this.get_all_place();
      error: (error: HttpErrorResponse) => alert(error.message);
    });
  }

  onCountrySelected(event: Event) {
    const selectedCountry = (event.target as HTMLSelectElement).value;
    // Call your function here with the selectedCountry value

    if (this.temp_country_address != null) {
      this.address = this.temp_country_address;
      this.temp_country_address = null;
    }
    if (selectedCountry != 'Country') {
      this.temp_country_address = this.address;
      this.address = this.address.filter(
        (obj) => obj.country === selectedCountry
      );
    } else {
      this.city = [];
      return;
    }

    for (let i = 0; i < this.country.length; i++) {
      if (this.country[i] == selectedCountry) {
        this.index_country = i;
      }
    }

    this.city = this.all_locations
      .map((cont: any) => cont.cities)
      [this.index_country].map((c: any) => c.city_name);
  }

  oncitySelected(event: Event) {
    const selectedCity = (event.target as HTMLSelectElement).value;
    // Call your function here with the selectedCountry value
    if (this.temp_city_address != null) {
      this.address = this.temp_city_address;
      this.temp_city_address = null;
    }
    if (selectedCity != 'City') {
      this.temp_city_address = this.address;
      this.address = this.address.filter((obj) => obj.city === selectedCity);
    } else {
      this.locations = [];
      return;
    }

    for (let i = 0; i < this.city.length; i++) {
      if (this.city[i] == selectedCity) {
        this.index_city = i;
      }
    }
    this.locations = this.all_locations
      .map((cont: any) => cont.cities)
      [this.index_country].map((c: any) => c.locations)
      [this.index_city].map((c: any) => c.location_name);
  }

  onlocationSelected(event: Event) {
    const selectedlocation = (event.target as HTMLSelectElement).value;

    if (this.temp_location_address != null) {
      this.address = this.temp_location_address;
      this.temp_location_address = null;
    }
    if (selectedlocation != 'Location') {
      this.temp_location_address = this.address;
      this.address = this.address.filter(
        (obj) => obj.location === selectedlocation
      );
    }

    // for (let i=0; i<this.locations.length; i++){
    //   if(this.locations[i]==selectedlocation){
    //     this.index_location=i;
    //   }
    // }
    // this.snacks= this.all_locations.map((cont:any)=> cont.cities)[this.index_country].map((c:any)=> c.locations)[this.index_city].map((c:any)=> c.snacks)
    // this.capacity= this.all_locations.map((cont:any)=> cont.cities)[this.index_country].map((c:any)=> c.locations)[this.index_city].map((c:any)=> c.max_number)
  }
}

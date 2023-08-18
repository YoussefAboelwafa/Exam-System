import { Component, HostListener, OnInit } from '@angular/core';
import { ServicService } from '../services/servic.service';
import { HttpErrorResponse } from '@angular/common/http';
import { exams } from '../objects/exams';
import { calendar } from '../objects/calender';
import { address } from '../objects/loction_address';
import { Router } from '@angular/router';
import { ModalPopServiceService } from '../services/modal-pop-service.service';
import { Reciept } from '../objects/reciept';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Manchete } from '../objects/manchete';
declare const $: any;
@Component({
  selector: 'app-home-bar',
  templateUrl: './home-bar.component.html',
  styleUrls: ['./home-bar.component.css', '../seats/seats.component.css'],
})
export class HomeBarComponent implements OnInit {
  flag_snack = false;
  flag_book = false;
  flag_time = false;
  flag_seat = false;
  book_title_course = '';

  snacks = [];
  snac: any;
  locations = [];
  countries = [];
  day = [];
  time = [];
  all_locations: any;
  countrys: any;
  calendar: calendar[] = [];
  address: address[] = [];
  temp_city_address: any = null;
  citys: any;
  index_city: any;
  index_country: any;
  temp_location_address: any = null;
  temp_country_address: any = null;
  index_location: any;
  id_location: any;
  select_snacks: any = 'Snack';
  selectedlocation: any = 'location';
  selectedCity: any = 'city';
  selectedCountry: any = 'country';
  selectedday: any = 'Select a day';
  selectedappointment: any = 'Select an Appointmen';
  index_day: any;
  day_id: any = '';
  book_id_exam: any = '';
  flag_type: any;
  avilable_time: any;
  grid: any[] = [[]];

  selected_seat_i = -1;
  selected_seat_j = -1;

  show_seat=false;

  //after you order exam you should clear it

  upcoming_exam: exams[] = [];
  token_exam: exams[] = [];
  ids_exams: any[] = [];
  //take it from back
  non_token_exam = new exams();
  learn_dataof_nontoken = new exams();
  learn_dataof_token = new exams();
  // ranking_exam:any;
  temp_countries: any;
  phone_number: any;
  reciept: Reciept = new Reciept();
  start_manchete: any;
  manchete: Manchete[] = [];

  ngOnInit(): void {}

  constructor(
    private service: ServicService,
    private router: Router,
    private popup: ModalPopServiceService,
    private sanitizer: DomSanitizer
  ) {
    this.flag_type = true;
    const queryParams = new URLSearchParams(window.location.search);
    const paramsObj: any = {};
    for (const [name, value] of queryParams.entries()) {
      paramsObj[name] = value;
    }
    if (
      paramsObj['type'] != undefined &&
      paramsObj['orderStatus'] != undefined &&
      paramsObj.length != 0
    ) {
      if (paramsObj['statusCode'] == '200') {
        this.service.book_exam(paramsObj).subscribe((x) => {
          if (x.success == false) {
            this.popup.open_error_book(x.error);
          }
        });
      }
      this.router.navigate(['/home/home_bar']);
    }

    this.refresh_all();
    this.upcoming_exam = this.service.upcoming_ex;
    this.token_exam = this.service.token_ex;

    if (this.service.non_token !== undefined) {
      this.non_token_exam = this.service.non_token[0];
    }

    // this.manchete=[];
  }

  navigate_to_news() {
    this.router.navigate(['/home/news_bar']);
  }
  refresh_all() {
    this.flag_type = true;
    this.service.get_manshete(5).subscribe((x) => {
      //i need title and imgurl
      console.log(x);
      this.manchete = [];
      this.start_manchete = null;
      this.start_manchete = x[0];
      for (let i = 0; i < x.length; i++) {
        x[i].manchete = 'http://i.imgur.com/' + x[i].manchete;
      }
      this.manchete = x;
      this.manchete.splice(0, 1);
    });
    this.service.get_places().subscribe((x) => {
      this.temp_countries = x;
      this.all_locations = x;
      this.countrys = x.map((cont: any) => cont.country_name);

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

      this.service.get_calender().subscribe((x) => {
        this.calendar = x;
        console.log(this.calendar);
      });
      this.address = [];
      for (let i = 0; i < combinations.length; i++) {
        let x = new address();
        const dateArr = combinations[i].split(':');

        x.country = dateArr[0];
        x.city = dateArr[1];
        x.location = dateArr[2];
        x.capacity = dateArr[3];
        x.snacks = dateArr[4];
        x._id = dateArr[5];
        this.address.push(x);
      }

      error: (error: HttpErrorResponse) => alert(error.message);
    });

    this.service.home_bar_init().subscribe((x) => {
      console.log(x);
      this.service.user = x.user;
      this.phone_number = this.service.user.phone;
      this.non_token_exam = x.other_exam;
      let up = 0,
        token = 0,
        y: any[] = [],
        z: any[] = [],
        temp: any[] = [];

      for (var i = 0; i < x.user.exams.length; i++) {
        if (x.user.exams[i].exam.percentage == -1) {
          y.push(new exams());
          y[up].country = x.user.exams[i].exam.country;
          y[up].city = x.user.exams[i].exam.city;
          y[up].location = x.user.exams[i].exam.location;
          y[up].snack = x.user.exams[i].exam.snack;
          y[up].percentage = x.user.exams[i].exam.percentage;
          y[up].appointment = x.user.exams[i].exam.appointment;
          y[up].day = x.user.exams[i].exam.day;
          y[up]._id = x.user.exams[i].exam._id;
          y[up].title = x.token_exam_info[i].title;
          up++;
          temp.push(x.user.exams[i].exam._id);
        } else {
          z.push(new exams());
          z[token].country = x.user.exams[i].exam.country;
          z[token].city = x.user.exams[i].exam.city;
          z[token].location = x.user.exams[i].exam.location;
          z[token].snack = x.user.exams[i].exam.snack;
          z[token].percentage = x.user.exams[i].exam.percentage;
          z[token].appointment = x.user.exams[i].exam.appointment;
          z[token]._id = x.user.exams[i].exam._id;
          temp.push(x.user.exams[i].exam._id);
          z[token].title = x.token_exam_info[i].title;
          z[token].about = x.token_exam_info[i].about;
          z[token].info = x.token_exam_info[i].info;

          token++;
        }
      }

      this.service.ids_ex = temp;
      this.ids_exams = temp;
      this.service.upcoming_ex = y;
      this.upcoming_exam = y;
      this.service.token_ex = z;
      this.token_exam = z;

      this.service.exam_bar_init().subscribe((x) => {
        this.service.non_token = x;
      });

      this.flag_type = false;
      error: (error: HttpErrorResponse) => alert(error.message);
    });
  }
  reset_order_exam() {
    this.select_snacks = 'Snack';
    this.selectedlocation = 'location';
    this.selectedCity = 'city';
    this.selectedCountry = 'country';
    this.selectedday = 'Select a day';
    this.selectedappointment = 'Select an Appointmen';
    this.avilable_time = '';
    this.snacks = [];
  }

  clear_flag_book() {
    this.flag_snack = false;
    this.flag_book = false;
    this.flag_time = false;
    this.flag_seat = false;
  }

  submit_book() {
    //service becouse i need city and country and location then next step
    this.clear_flag_book();
    this.flag_snack = true;
  }
  submit_snack() {
    //service becouse i need all kinds of snacks then next step
    this.clear_flag_book();
    this.flag_time = true;
  }
  submit_seat() {
    //service becouse i need all kinds of time then next step
    let country_id;
    for (let i = 0; i < this.temp_countries.length; i++) {
      if (this.temp_countries[i].country_name == this.selectedCountry) {
        country_id = this.temp_countries[i]._id;
        break;
      }
    }
    this.service.get_payment_reciept(country_id).subscribe((x) => {
      if (x.success == true) {
        this.reciept = x;
        this.reciept.phone = this.service.user.phone;
        $('#reciept').modal('show');
      } else {
        this.popup.open_error_book(x.error);
      }
    });
  }
  submit_time() {
    this.service.get_layout(this.id_location, this.day_id).subscribe((x) => {

      if (x.success == true) {
        if(x.state==false){
          this.show_seat=false;
        }else{
          
        this.show_seat=true;
        for (let i = 0; i < x.booked.length; i++) {
          x.layout[x.booked[i][0]][x.booked[i][1]] =
            x.layout[x.booked[i][0]][x.booked[i][1]] + ' booked';
        }
        for (let i = 0; i < x.being_booked.length; i++) {
          x.layout[x.being_booked[i][0]][x.being_booked[i][1]] =
            x.layout[x.being_booked[i][0]][x.being_booked[i][1]] +
            ' beingbooked';
        }
        this.grid = x.layout;
      }
    }
      
      else {
        this.popup.open_error_book(x.error);
      }
    });
    if(this.show_seat==true){
    this.clear_flag_book();
    this.flag_seat = true;
    }
    else{
      this.submit_seat();

    }
  }

  set_seat(i: number, j: number) {
    if (this.grid[i][j] == 'seat') {
      if (this.selected_seat_i == -1 || this.selected_seat_j == -1) {
        this.grid[i][j] = 'seat select';
        this.selected_seat_i = i;
        this.selected_seat_j = j;
      } else {
        this.grid[this.selected_seat_i][this.selected_seat_j] = 'seat';
        this.grid[i][j] = 'seat select';
        this.selected_seat_i = i;
        this.selected_seat_j = j;
      }
    }
  }

  pay_now() {
    let book_exam = {
      location_id: this.id_location,
      day_id: this.day_id,
      exam_id: this.book_id_exam,
      snack: this.select_snacks,
      appointment: this.selectedappointment,
      chair: { i: this.selected_seat_i, j: this.selected_seat_j,chair_number:this.selected_seat_i * this.grid[0].length + this.selected_seat_j + 1 },
    };

    this.service.payment(book_exam, this.reciept).subscribe((x) => {
      console.log(x);
      if (x.success == true) {
        window.location.href = x.token;
      } else {
        this.popup.open_error_book(x.error);
      }
    });
  }

  take_exam(name_exam: any, id_exam: any) {
    this.book_title_course = name_exam;
    //becouse if the user click take exam from modal,hide pop up if it show
    this.book_id_exam = id_exam;
    this.reset_order_exam();
    $('#not_token_exam').modal('hide');
    $('#token_exam').modal('hide');
    this.flag_book = true;
  }

  close_book() {
    this.clear_flag_book();
    this.reset_order_exam();
    this.selected_seat_j = -1;
    this.selected_seat_i = -1;
    this.refresh_all();
  }

  close() {
    $('#reciept').modal('hide');
  }

  learn_non_token(value_send_by_btn_learn: any) {
    this.learn_dataof_nontoken = value_send_by_btn_learn;
  }

  learn_token(value_send_by_btn_learn: any) {
    this.learn_dataof_token = value_send_by_btn_learn;
  }

  onCountrySelected(event: Event) {
    this.selectedCountry = (event.target as HTMLSelectElement).value;
    // Call your function here with the selectedCountry value
    //flag==1 that meen filter

    this.citys = [];
    this.locations = [];
    if (this.temp_country_address != null) {
      this.calendar = this.temp_country_address;
      this.temp_country_address = null;
    }
    if (this.selectedCountry != 'Country') {
      this.temp_country_address = this.calendar;
      this.calendar = this.calendar.filter(
        (obj: { country: string }) => obj.country === this.selectedCountry
      );
    } else {
      return;
    }

    for (let i = 0; i < this.countrys.length; i++) {
      if (this.countrys[i] == this.selectedCountry) {
        this.index_country = i;
      }
    }

    this.citys = this.all_locations
      .map((cont: any) => cont.cities)
      [this.index_country].map((c: any) => c.city_name);
  }

  oncitySelected(event: Event) {
    this.locations = [];
    this.selectedCity = (event.target as HTMLSelectElement).value;
    // Call your function here with the selectedCountry value
    if (this.temp_city_address != null) {
      this.calendar = this.temp_city_address;
      this.temp_city_address = null;
    }
    if (this.selectedCity != 'City') {
      this.temp_city_address = this.calendar;
      this.calendar = this.calendar.filter(
        (obj: { city: any }) => obj.city === this.selectedCity
      );
    } else {
      return;
    }

    for (let i = 0; i < this.citys.length; i++) {
      if (this.citys[i] == this.selectedCity) {
        this.index_city = i;
      }
    }
    this.locations = this.all_locations
      .map((cont: any) => cont.cities)
      [this.index_country].map((c: any) => c.locations)
      [this.index_city].map((c: any) => c.location_name);
  }

  onlocationSelected(event: Event) {
    this.selectedlocation = (event.target as HTMLSelectElement).value;

    if (this.temp_location_address != null) {
      this.calendar = this.temp_location_address;
      this.temp_location_address = null;
    }
    if (this.selectedlocation != 'Location') {
      this.temp_location_address = this.calendar;
      this.calendar = this.calendar.filter(
        (obj: { location: string }) => obj.location === this.selectedlocation
      );
    }

    for (let i = 0; i < this.locations.length; i++) {
      if (this.locations[i] == this.selectedlocation) {
        this.index_location = i;
      }
    }
    this.snacks = this.all_locations
      .map((cont: any) => cont.cities)
      [this.index_country].map((c: any) => c.locations)
      [this.index_city].map((c: any) => c.snacks)[this.index_location];
    this.id_location = this.all_locations
      .map((cont: any) => cont.cities)
      [this.index_country].map((c: any) => c.locations)
      [this.index_city].map((c: any) => c._id)[this.index_location];
  }

  onselectsnack(event: Event) {
    this.select_snacks = (event.target as HTMLSelectElement).value;
  }

  ondayselect(event: Event) {
    this.selectedday = (event.target as HTMLSelectElement).value;
    for (var i = 0; i < this.calendar.length; i++) {
      if (this.calendar[i].day_number == this.selectedday.split(' : ')[0]) {
        this.avilable_time = this.calendar[i].time;
        this.day_id = this.calendar[i]._id;
      }

      if (this.selectedday == 'Select a day') {
        this.selectedappointment = 'Select an Appointmen';
        this.avilable_time = '';
      }
    }
  }

  ontimeselect(event: Event) {
    this.selectedappointment = (event.target as HTMLSelectElement).value;
  }

  //service.user=current_user
}

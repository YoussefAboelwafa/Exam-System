import { Component, OnInit } from '@angular/core';
import { ServicService } from '../services/servic.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { exams } from '../objects/exams';
import { NgxTypedJsModule } from 'ngx-typed-js';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ModalPopServiceService } from '../services/modal-pop-service.service';
declare const $: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  //if user change url of photo in his computer the photo will spoil

  snacks = ['kikat', 'twix', 'snickers'];

  upcoming_exam: any[] = [];
  token_exam: any[] = [];
  ids_exams: any[] = [];
  photo_url: any = null;
  photo_event_service: any = null;
  photo_sendin_service: any;
  //take it from back
  non_token_exam: exams = new exams();

  current_user = {
    first_name: 'loading',
    last_name: '..',
    photo: '',
    _id: '',
  };
  flag_type = false;
  constructor(
    private service: ServicService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private popup: ModalPopServiceService
  ) {
    this.refresh();
    // this.get_user_photo();
  }

  ngOnInit(): void {}

  onFileSelect(event: any) {
    const file = event.target.files[0];
    this.photo_event_service = event;
    if (!(file instanceof Blob)) {
      console.error('Invalid file type');
      return;
    }

    // Create a FileReader object
    const reader = new FileReader();

    // Set up an event listener for when the file is loaded
    reader.onload = (event: any) => {
      // this.service.user.photo = event.target.result;
      this.photo_url = event.target.result;
      // this.current_user.photo=event.target.result;
      // Reset the input field
      event.target.value = '';
    };
    // Read the file as a data URL
    reader.readAsDataURL(file);
  }

  add_user_photo() {
    if (this.photo_event_service == null) {
      return;
    }
    const inputElement = this.photo_event_service.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      const formData = new FormData();
      formData.append('photo', inputElement.files[0]);

      this.current_user.photo = this.photo_url;

      this.service.change_photo_user(formData).subscribe((x) => {
        if (x.success) {
          this.service.user.photo = this.photo_url;
          this.photo_event_service = null;
        } else {
          //error message
        }
      });
    }
  }

  refresh() {
    this.flag_type = true;
    this.service.home_bar_init().subscribe((x) => {
      this.service.user = x.user;
      this.current_user = x.user;
      if (x.user.photo != null && x.user.photo != undefined) {
        this.current_user.photo = 'http://i.imgur.com/' + x.user.photo;
      } else {
        this.current_user.photo =
          'https://cdn-icons-png.flaticon.com/512/1946/1946429.png';
      }
      this.flag_type = false;

      this.service.user = x.user;
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
        if (x.length == 0) {
          x = [];
        }
        this.service.non_token = x;
      });

      error: (error: HttpErrorResponse) => alert(error.message);
    });
    // this.router.navigate(['home/home_bar'])
  }

  logout() {
    this.service.log_out().subscribe((x) => {
      if (x.success == true) {
        this.router.navigate(['']);
      } else {
        this.popup.open_error_book(x.error);
      }
    });
  }
}

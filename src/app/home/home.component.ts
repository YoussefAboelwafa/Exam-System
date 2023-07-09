import { Component, OnInit } from '@angular/core';
import { ServicService } from '../services/servic.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { exams } from '../objects/exams';
import { NgxTypedJsModule } from 'ngx-typed-js';
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

  //take it from back
  non_token_exam: any = {
    title: 'Algoritms',
    about:
      'algorithms are a fundamental concept in computer science, and are essential for solving complex problems and developing efficient software systems.There are many different types of algorithms, including sorting algorithms, searching algorithms, graph algorithms, and optimization algorithms. ',
    info: ['sorting', 'DAG', 'DFS algoritm'],
    _id: '',
  };

  current_user = {
    first_name: 'none',
    last_name: 'none',
    photo: '../../assets/images/img5.svg',
    _id: '',
  };
  flag_type = false;
  constructor(private service: ServicService, private router: Router) {
    this.refresh();

    // this.current_user = {
    //   first_name: this.service.user.get_first_name(),
    //   last_name: this.service.user.get_last_name(),
    //   photo: this.service.user.get_photo(),
    //   _id: this.service.user.get_id(),
    // };
    // this.service.is_signin().subscribe
    //        (
    //          (x)=> {
    //           if(x.signed_in==true){
    //           this.current_user._id=x.user.id;
    //           this.current_user.first_name=x.user.first_name;
    //          this.current_user.last_name=x.user.last_name;
    //           this.current_user.photo=x.user.photo;
    //           }
    //           else{
    //             this.router.navigate(['/login'])
    //           }

    //          error:(error: HttpErrorResponse) =>alert(error.message);
    //           }
    //        )
  }

  ngOnInit(): void {}

  onFileSelect(event: any) {
    const file = event.target.files[0];

    if (!(file instanceof Blob)) {
      console.error('Invalid file type');
      return;
    }

    // Create a FileReader object
    const reader = new FileReader();

    // Set up an event listener for when the file is loaded
    reader.onload = (event: any) => {
      this.service.user.photo = event.target.result;

      // Reset the input field
      event.target.value = '';
    };
    // Read the file as a data URL
    reader.readAsDataURL(file);

    //service change photo
    // this.service.change_photo(this.service.user.get_photo().subscribe(
    //            (x)=> {

    //            error:(error: HttpErrorResponse) =>alert(error.message);
    //             }
    //          )
  }

  refresh() {
    this.flag_type = false;
    this.service.home_bar_init().subscribe((x) => {
      this.service.user = x.user;
      this.current_user.first_name = x.user.first_name;
      this.current_user.last_name = x.user.last_name;
      this.current_user._id = x.user._id;
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
        if(x.length==0){
          x=[];
        }
        this.service.non_token = x;
      });

      this.flag_type = false;

      error: (error: HttpErrorResponse) => alert(error.message);
    });
    // this.router.navigate(['home/home_bar'])
  }
}

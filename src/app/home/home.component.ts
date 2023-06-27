import { Component, OnInit } from '@angular/core';
import { ServicService } from '../services/servic.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
declare const $: any;
 

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  photo="../../assets/images/img3.jpg";
 current_user:any;
 name_course="Algoritms Course"
 discription="algorithms are a fundamental concept in computer science, and are essential for solving complex problems and developing efficient software systems.There are many different types of algorithms, including sorting algorithms, searching algorithms, graph algorithms, and optimization algorithms. "
 about_course=["sorting algoritms","DFS algoritm","DAG algoritm"]
  constructor(private service:ServicService,private router: Router) { 
    // this.current_user=
    // this.service.is_signin().subscribe
    //        (
    //          (x)=> {
    //           if(x.signed_in==true){
    //           this.current_user=x.user;
    //           }
    //           else{
    //             this.router.navigate(['/login'])
    //           }

    //          error:(error: HttpErrorResponse) =>alert(error.message);
    //           }
    //        )
  }

  ngOnInit(): void {
  }
  take_exam() {
    $('#DiscoverExams').modal('hide');
  }

  see(){
    console.log("kimp")
  }

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
      this.photo = event.target.result;
  
      // Reset the input field
      event.target.value = '';
    };
  
    // Read the file as a data URL
    reader.readAsDataURL(file);
  }
}

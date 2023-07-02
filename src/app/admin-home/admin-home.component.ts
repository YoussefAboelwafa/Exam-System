import { Component, OnInit } from '@angular/core';
import { ServicService } from '../services/servic.service';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {

  current_user = {
    first_name: "wait",
    last_name: "wait",
    photo:"../../assets/images/img3.jpg",  
    _id: ""
  };
  flag_type=false;
  constructor(private service:ServicService) { }

  ngOnInit(): void {
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
      this.service.user.set_photo(event.target.result);
  
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
}
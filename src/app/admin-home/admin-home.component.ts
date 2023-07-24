import { Component, OnInit } from '@angular/core';
import { ServicService } from '../services/servic.service';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css'],
})
export class AdminHomeComponent implements OnInit {
  current_user = {
    first_name: 'Ahmed',
    last_name: 'Ali',
    photo: '../../assets/images/img5.svg',
    _id: '1256893',
  };
  flag_type = false;
  photo_url: any;
  photo_event_service:any=null;
  photo_sendin_service: any;

  constructor(private service: ServicService) {
    this.service.home_bar_init().subscribe((x) => {
      this.service.user = x.user;
      this.current_user.first_name = x.user.first_name;
      this.current_user.last_name = x.user.last_name;
      this.current_user._id = x.user._id;
    });
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

    if(this.photo_event_service==null){
      return;
    }
    const inputElement = this.photo_event_service.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.photo_sendin_service = inputElement.files[0];
    }

    if (this.photo_sendin_service) {
      const formData = new FormData();
      formData.append('photo', this.photo_sendin_service);

      this.service.change_photo_admin(formData).subscribe((x) => {
        if (x.success) {
          console.log(x);
          this.current_user.photo = this.photo_url;
          this.service.user.photo = this.photo_url;
          this.photo_event_service=null;
        } else {
          //error message
        }
      });
    }
  }


  get_user_photo() {


  }
}

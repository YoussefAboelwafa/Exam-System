import { Component, OnInit } from '@angular/core';
import { ServicService } from '../services/servic.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalPopServiceService } from '../services/modal-pop-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css'],
})
export class AdminHomeComponent implements OnInit {
  flag_type = false;
  photo_url: any = null;
  photo_event_service: any = null;
  photo_sendin_service: any;
  current_user = {
    first_name: 'Ahmed',
    last_name: 'Ali',
    photo: '',
    _id: '1256893',
  };
  constructor(
    private service: ServicService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private popup: ModalPopServiceService
  ) {
    this.service.home_bar_init().subscribe((x) => {
      this.current_user = x.user;

      if (x.user.photo != null && x.user.photo != undefined) {
        this.current_user.photo = 'http://i.imgur.com/' + x.user.photo;
      } else {
        this.current_user.photo =
          'https://cdn-icons-png.flaticon.com/512/1946/1946429.png';
      }
      this.service.user = x.user;
    });
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
      this.photo_sendin_service = inputElement.files[0];
    }

    if (this.photo_sendin_service) {
      const formData = new FormData();
      formData.append('photo', this.photo_sendin_service);

      this.service.change_photo_user(formData).subscribe((x) => {
        if (x.success) {
          this.current_user.photo = this.photo_url;
          this.service.user.photo = this.photo_url;
          this.photo_event_service = null;
        } else {
          //error message
        }
      });
    }
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

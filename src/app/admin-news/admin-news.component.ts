import { Component, OnInit } from '@angular/core';
import { ServicService } from '../services/servic.service';

@Component({
  selector: 'app-admin-news',
  templateUrl: './admin-news.component.html',
  styleUrls: ['./admin-news.component.css'],
})
export class AdminNewsComponent implements OnInit {
  constructor(private service: ServicService) {

    this.get_blogs();
  }

  ngOnInit(): void {}
  add_url_to_service: any;
  my_add_event: any;
  current_url: any;
  flag_type = false;
  News = [
    {
      title: 'New courses are available',
      url: 'https://placehold.co/800x200',
      blog: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas fringilla, libero at mattis scelerisque, dui nisl placerat justo, quis bibendum dui mauris faucibus felis. Nunc egestas fermentum sem, et blandit nibh feugiat vitae. Integer velit neque, laoreet nec nibh at, maximus vehicula nisi. Maecenas tempor nisi id diam finibus auctor. Etiam fermentum semper augue lacinia laoreet. Aliquam imperdiet tincidunt odio in mollis. Cras euismod et massa at eleifend. Phasellus fermentum eu nulla eget cursus',
      _id: '',
    },
    {
      title: 'C++ advanced course is now available',
      url: 'https://placehold.co/800x200',
      blog: 'This is a blog',
      _id: '',
    },
  ];

  urls: string[] = [
    'https://placehold.co/1000x200',
    'https://placehold.co/1000x200',
    'https://placehold.co/1000x200',
  ];

  appendUrl(event: any) {
    const file = event.target.files[0];

    if (!(file instanceof Blob)) {
      console.error('Invalid file type');
      return;
    }

    // Create a FileReader object
    const reader = new FileReader();

    // Set up an event listener for when the file is loaded
    reader.onload = (event: any) => {
      // Push the data URL to the urls array
      this.current_url = event.target.result;
      // this.urls.push(this.current_url);
      // Reset the input field
      this.flag_type = false;
    };

    // Read the file as a data URL
    reader.readAsDataURL(file);
  }

  onFileSelected(event: any) {
    this.flag_type = true;

    this.my_add_event = event;
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.add_url_to_service = inputElement.files[0];
    }

    if (this.add_url_to_service.size < 510000) {
      console.log(this.add_url_to_service);
    }
    this.appendUrl(this.my_add_event);
  }
  addNews(title: string, blog: string) {
    const object = {
      title: title,
      url: this.current_url,
      blog: blog,
      _id: '',
    };

    if (this.add_url_to_service) {
      const formData = new FormData();
      formData.append('photo', this.add_url_to_service);
      formData.append('title', title);
      formData.append('description', blog);

      this.service.add_blog(formData).subscribe((x) => {
        if (x.success) {
          object._id = x.id;
          this.News.push(object);
        } else {
          //error message
        }
      });
    }
  }

  deleteNews(index: number) {
    this.service.delete_blog(this.News[index]._id).subscribe((x) => {
      if (x.success == true) {
        this.News.splice(index, 1);
      } else {
        //error message
      }
    });
  }

  get_blogs() {
    //update ya kimo
    this.service.get_blogs(10, 1).subscribe((data) => {
      if (data.success == true) {
        let a=[];
        this.flag_type=true
        for (var i = 0; i < data.blogs.length; i++) {

          const photo_blob = new Blob([data.blogs[i].photo.body.data], {
            type: data.blogs[i].photo.ContentType,
          });
          let imageSrc = URL.createObjectURL(photo_blob);

          const object = {
            title: data.blogs[i].title,
            url: imageSrc,
            blog: data.blogs[i].description,
            _id: data.blogs[i].description._id,
          };
        a.push(object);
        }
        this.News = a;

        this.flag_type=false;

      } else {
        //error message
      }
    });
  }
}

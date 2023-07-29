import { Component, OnInit } from '@angular/core';
import { ServicService } from '../services/servic.service';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import { News } from '../objects/news';
import { ModalPopServiceService } from '../services/modal-pop-service.service';

@Component({
  selector: 'app-admin-news',
  templateUrl: './admin-news.component.html',
  styleUrls: ['./admin-news.component.css'],
})
export class AdminNewsComponent implements OnInit {
  constructor(private service: ServicService, private sanitizer:DomSanitizer,private popup:ModalPopServiceService) {
  
    this.get_blogs();
  }

  ngOnInit(): void {}
  add_url_to_service: any=null;
  manchete_to_service: any=null;
  my_add_event: any;
  current_url: any;
  News: News[]=[]
  flag_type=false
  urls: any = [
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
    };

    // Read the file as a data URL
    reader.readAsDataURL(file);
  }

  onFileSelected(event: any) {
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


  onFileSelected2(event:any){
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.manchete_to_service = inputElement.files[0];
    }
    if (this.manchete_to_service.size < 510000) {
      console.log(this.manchete_to_service);
    }    
  }

  
  addNews(title: string, blog: string) {
    const object = {
      title: title,
      photo: this.current_url,
      description: blog,
      _id: '',
    };
    if (this.add_url_to_service) {
      const formData = new FormData();
      formData.append('photo', this.add_url_to_service);
      formData.append('manchete', this.manchete_to_service);
      formData.append('title', title);
      formData.append('description', blog);

      console.log(3)
      this.flag_type=true;
      this.service.add_blog(formData).subscribe((x) => {
        this.flag_type=false;
        if (x.success) {
          console.log(x);
          object._id = x.blog_id;
          this.News.push(object);
        } else {
          //error message
          this.popup.open_error_book('These photo sizes are very big to upload.')
        }
      });
      this.manchete_to_service=null
      this.add_url_to_service=null
    }
  }

  close(){
   this.manchete_to_service=null
   this.add_url_to_service=null
  }

  deleteNews(index: number) { 
    let x=this.News[index]
    this.News.splice(index, 1);
    this.service.delete_blog(x._id).subscribe((x) => {
      if (x.success == true) {
       } else {
        //error message
      }
    });
  }

  get_blogs() {
    //update ya kimo
    this.News = [];

    this.service.get_blogs(10, 1).subscribe(x=>{
      console.log(x);
      for(let i=0; i<x.length; i++){
          x[i].photo='http://i.imgur.com/'+x[i].photo
      } 
      this.News=x;
    })


    // this.service.get_blogs(10, 1).subscribe({
    //     next: (blog) => {
    //       blog = blog.slice(0, -3)
    //       blog.split('\n\r\n').forEach((blog: any) => {
    //         blog = JSON.parse(blog)
    //         this.flag_type = true;
    //         const photo_blob = new Blob([new Uint8Array(blog.photo.Body.data)], {
    //           type: blog.photo.ContentType,
    //         });
    //         console.log(photo_blob);
            
    //         let imageSrc = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(photo_blob));
  
    //         this.News.push({
    //           title: blog.title,
    //           url: imageSrc,
    //           blog: blog.description,
    //           _id: blog._id,
    //         });
  
    //         this.flag_type = false;  
    //       });
    //     },
    //     complete: () => {
    //       console.log('done');
    //     },
    //     error: (error) => {
    //       console.log(error);
    //     }
    // });
  }
}

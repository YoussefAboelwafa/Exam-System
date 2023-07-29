import { Component, OnInit } from '@angular/core';
import { ServicService } from '../services/servic.service';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import { News } from '../objects/news';

@Component({
  selector: 'app-news-bar',
  templateUrl: './news-bar.component.html',
  styleUrls: ['./news-bar.component.css']
})
export class NewsBarComponent implements OnInit {
 
  flag_type=false
  constructor(private service:ServicService, private sanitizer:DomSanitizer) { 

    this.get_blogs();
  }

  ngOnInit(): void {
  }
  News:News[] =[]

  showContent: boolean[] = new Array(this.News.length).fill(false);

  toggleVisibility(index: number) {
    this.showContent[index] = !this.showContent[index];
  }

  get_blogs() {
    //update ya kimo
    
    this.News = [];
    this.service.get_blogs_user(10, 1).subscribe({
      next: (blog) => {
        blog = blog.slice(0, -3)
        blog.split('\n\r\n').forEach((blog: any) => {
          blog = JSON.parse(blog)
          const photo_blob = new Blob([new Uint8Array(blog.photo.Body.data)], {
            type: blog.photo.ContentType,
          });
          console.log(photo_blob);
          
          let imageSrc = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(photo_blob));

          //hene
          this.News.push({
            title: blog.title,
            url: imageSrc,
            blog: blog.description,
            _id: blog._id,
          });

        });
      },
      complete: () => {
        console.log('done');
        this.flag_type=false;
      },
      error: (error) => {
        console.log(error);
      }
  });
  }

}

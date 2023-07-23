import { Component, OnInit } from '@angular/core';
import { ServicService } from '../services/servic.service';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-news-bar',
  templateUrl: './news-bar.component.html',
  styleUrls: ['./news-bar.component.css']
})
export class NewsBarComponent implements OnInit {
 
  constructor(private service:ServicService, private sanitizer:DomSanitizer) { }

  ngOnInit(): void {
  }
  News:any = [
    {
      title: 'New courses are available',
      url: 'https://placehold.co/800x300',
      blog: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas fringilla, libero at mattis scelerisque, dui nisl placerat justo, quis bibendum dui mauris faucibus felis. Nunc egestas fermentum sem, et blandit nibh feugiat vitae. Integer velit neque, laoreet nec nibh at, maximus vehicula nisi. Maecenas tempor nisi id diam finibus auctor. Etiam fermentum semper augue lacinia laoreet. Aliquam imperdiet tincidunt odio in mollis. Cras euismod et massa at eleifend. Phasellus fermentum eu nulla eget cursus',
    },
    {
      title: 'C++ advanced course is now available',
      url: 'https://placehold.co/800x200',
      blog: 'This is a blog',
    },
  ];

  showContent: boolean[] = new Array(this.News.length).fill(false);

  toggleVisibility(index: number) {
    this.showContent[index] = !this.showContent[index];
  }

  get_blogs() {
    //update ya kimo
    this.service.get_blogs(10, 1).subscribe((x) => {
      console.log(x);
      if (x.success == true) {
        let a = [];
         for (var i = 0; i < x.blogs.length; i++) {
          const photo_blob = new Blob([new Uint8Array(x.blogs[i].photo.Body.data)], {
            type: x.blogs[i].photo.ContentType,
          });
          console.log(photo_blob);
          
          let imageSrc = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(photo_blob));
          const object = {
            title: x.blogs[i].title,
            url: imageSrc,
            blog: x.blogs[i].description,
            _id: x.blogs[i]._id,
          };
          a.push(object);
        }
        this.News = a;

       } else {
        //error message
      }
    });
  }

}

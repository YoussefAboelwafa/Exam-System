import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-news',
  templateUrl: './admin-news.component.html',
  styleUrls: ['./admin-news.component.css'],
})
export class AdminNewsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  News = [
    {
      title: 'New courses are available',
      url: 'https://placehold.co/800x200',
      blog: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas fringilla, libero at mattis scelerisque, dui nisl placerat justo, quis bibendum dui mauris faucibus felis. Nunc egestas fermentum sem, et blandit nibh feugiat vitae. Integer velit neque, laoreet nec nibh at, maximus vehicula nisi. Maecenas tempor nisi id diam finibus auctor. Etiam fermentum semper augue lacinia laoreet. Aliquam imperdiet tincidunt odio in mollis. Cras euismod et massa at eleifend. Phasellus fermentum eu nulla eget cursus',
    },
    {
      title: 'C++ advanced course is now available',
      url: 'https://placehold.co/800x200',
      blog: 'This is a blog',
    },
  ];


  urls: string[] = [
    'https://placehold.co/1000x200',
    'https://placehold.co/1000x200',
    'https://placehold.co/1000x200',
  ];
  // appendUrl(event: any) {
  //   const file = event.target.files[0];

  //   if (!(file instanceof Blob)) {
  //     console.error('Invalid file type');
  //     return;
  //   }

  //   // Create a FileReader object
  //   const reader = new FileReader();

  //   // Set up an event listener for when the file is loaded
  //   reader.onload = (event: any) => {
  //     // Push the data URL to the urls array
  //     this.urls.push(event.target.result);
  //     console.log(this.urls);

  //     // Reset the input field
  //     event.target.value = '';
  //   };

  //   // Read the file as a data URL
  //   reader.readAsDataURL(file);
  // }

  addNews(title: string, url: string, blog: string) {
    const object = {
      title: title,
      url: url,
      blog: blog,
    };
    this.News.push(object);
  }
  deleteNews(index: number) {
    this.News.splice(index, 1);
  }
}

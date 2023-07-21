import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-news',
  templateUrl: './admin-news.component.html',
  styleUrls: ['./admin-news.component.css'],
})
export class AdminNewsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  manshets: string[] = [
    'Now you can get your own website ',
    'C++ advanced course is now available',
    'New courses are available',
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
      this.urls.push(event.target.result);
      console.log(this.urls);

      // Reset the input field
      event.target.value = '';
    };

    // Read the file as a data URL
    reader.readAsDataURL(file);
  }
  deleteUrl(index: number) {
    this.urls.splice(index, 1);
  }
  addNews(value: any) {
    this.manshets.push(value);
  }
  deleteNews(index: number) {
    this.manshets.splice(index, 1);
  }
}

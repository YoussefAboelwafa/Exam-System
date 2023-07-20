import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-news',
  templateUrl: './admin-news.component.html',
  styleUrls: ['./admin-news.component.css'],
})
export class AdminNewsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  urls: string[] = [
    '../../assets/images/img4.jpg',
    '../../assets/images/img6.svg',
    '../../assets/images/img7.svg',
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
  deleteNews(index: number) {
    this.urls.splice(index, 1);
  }
}

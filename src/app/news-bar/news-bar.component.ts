import { Component, OnInit } from '@angular/core';
import { ServicService } from '../services/servic.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { News } from '../objects/news';

@Component({
  selector: 'app-news-bar',
  templateUrl: './news-bar.component.html',
  styleUrls: ['./news-bar.component.css'],
})
export class NewsBarComponent implements OnInit {
  flag_type = false;
  constructor(private service: ServicService, private sanitizer: DomSanitizer) {
    this.get_blogs();
  }

  ngOnInit(): void {}
  News: News[] = [];

  showContent: boolean[] = new Array(this.News.length).fill(false);

  toggleVisibility(index: number) {
    this.showContent[index] = !this.showContent[index];
  }

  get_blogs() {
    //update ya kimo
    this.flag_type=true
    this.News = [];
    this.service.get_blogs_user(10, 1).subscribe((x) => {
      this.flag_type=false
      for (let i = 0; i < x.length; i++) {
        x[i].photo = 'http://i.imgur.com/' + x[i].photo;
      }
      this.News = x;
    });
  }
}

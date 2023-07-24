import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { registerables } from 'chart.js';

@Component({
  selector: 'app-admin-analytics',
  templateUrl: './admin-analytics.component.html',
  styleUrls: ['./admin-analytics.component.css'],
})
export class AdminAnalyticsComponent implements OnInit {
  constructor() {}

  ctx: any;
  config: any;
  chartData: number[] = [];
  chartDatalabels: any[] = [];

  ngOnInit() {
    this.chartData.push(3);
    this.chartData.push(5);

    this.chartDatalabels.push('C++');
    this.chartDatalabels.push('Algorithm');

    this.ctx = document.getElementById('myChart');
    this.config = {
      type: 'bar',
      options: {},
      data: {
        labels: this.chartDatalabels,
        datasets: [
          {
            label: 'Monthly Report',
            data: this.chartData,
            borderWidth: 2,
            borderColor: 'black',
            backgroundColor: ['green', 'yellow', 'red'],
          },
        ],
      },
    };
    const myChart = new Chart(this.ctx, this.config);
  }
}

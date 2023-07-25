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

  bar_ctx: any;
  bar_config: any;
  bar_chartData: number[] = [];
  bar_chartDatalabels: any[] = [];

  pie_ctx: any;
  pie_config: any;
  pie_chartData: number[] = [];
  pie_chartDatalabels: any[] = [];

  ret_ctx: any;
  ret_config: any;
  ret_chartData: number[] = [];
  ret_chartDatalabels: any[] = [];

  score_ctx: any;
  score_config: any;
  score_chartData: number[] = [];
  score_chartDatalabels: any[] = [];

  ngOnInit() {
    this.barChartDemo();
    this.retentionChartDemo();
    this.scoreChartDemo();
  }

  barChartDemo() {
    this.bar_chartData.push(10);
    this.bar_chartData.push(20);
    this.bar_chartData.push(55);
    this.bar_chartData.push(42);
    this.bar_chartData.push(23);
    this.bar_chartData.push(15);
    this.bar_chartData.push(53);
    this.bar_chartData.push(65);
    this.bar_chartData.push(23);
    this.bar_chartData.push(15);
    this.bar_chartData.push(53);
    this.bar_chartData.push(65);

    this.bar_chartDatalabels.push('Feb');
    this.bar_chartDatalabels.push('Jan');
    this.bar_chartDatalabels.push('Mar');
    this.bar_chartDatalabels.push('Apr');
    this.bar_chartDatalabels.push('May');
    this.bar_chartDatalabels.push('Jun');
    this.bar_chartDatalabels.push('Jul');
    this.bar_chartDatalabels.push('Aug');
    this.bar_chartDatalabels.push('Sep');
    this.bar_chartDatalabels.push('Oct');
    this.bar_chartDatalabels.push('Nov');
    this.bar_chartDatalabels.push('Dec');

    this.bar_ctx = document.getElementById('barChart');
    this.bar_config = {
      type: 'bar',
      options: {
        transitions: {
          easing: 'easeInOutCubic', // Use a custom easing function or one of the built-in options like 'linear', 'easeInQuad', 'easeOutCubic', etc.
          duration: 2000, // Set the duration in milliseconds (2 seconds in this example)
        },
      },
      data: {
        labels: this.bar_chartDatalabels,
        datasets: [
          {
            label: '2020 Monthly Report',
            data: this.bar_chartData,
            borderWidth: 2,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
          },
        ],
      },
    };
    const myChart = new Chart(this.bar_ctx, this.bar_config);
  }
  pieChartDemo() {
    this.pie_chartData.push(10);
    this.pie_chartData.push(20);
    this.pie_chartData.push(55);
    this.pie_chartData.push(42);

    this.pie_chartDatalabels.push('C++');
    this.pie_chartDatalabels.push('Algorithms');
    this.pie_chartDatalabels.push('Flutter');
    this.pie_chartDatalabels.push('Data Structure');

    this.pie_ctx = document.getElementById('myChart');
    this.pie_config = {
      type: 'pie',
      options: {
        transitions: {
          easing: 'easeInOutCubic', // Use a custom easing function or one of the built-in options like 'linear', 'easeInQuad', 'easeOutCubic', etc.
          duration: 2000, // Set the duration in milliseconds (2 seconds in this example)
        },
      },
      data: {
        labels: this.pie_chartDatalabels,
        datasets: [
          {
            label: 'Report',
            data: this.pie_chartData,
            borderWidth: 3,
            borderColor: 'black',
            backgroundColor: [
              'rgba(255, 99, 132)',
              'rgba(54, 162, 235)',
              'rgba(255, 206, 86)',
              'rgba(75, 192, 192)',
              'rgba(153, 102, 255)',
              'rgba(255, 159, 64)',
            ],
          },
        ],
      },
    };
    const myChart = new Chart(this.pie_ctx, this.pie_config);
  }
  retentionChartDemo() {
    this.ret_chartData.push(10);
    this.ret_chartData.push(20);
    this.ret_chartData.push(55);
    this.ret_chartData.push(42);
    this.ret_chartData.push(23);
    this.ret_chartData.push(15);
    this.ret_chartData.push(53);
    this.ret_chartData.push(65);
    this.ret_chartData.push(23);
    this.ret_chartData.push(15);
    this.ret_chartData.push(53);
    this.ret_chartData.push(65);

    this.ret_chartDatalabels.push('Jan');
    this.ret_chartDatalabels.push('Feb');
    this.ret_chartDatalabels.push('Mar');
    this.ret_chartDatalabels.push('Apr');
    this.ret_chartDatalabels.push('May');
    this.ret_chartDatalabels.push('Jun');
    this.ret_chartDatalabels.push('Jul');
    this.ret_chartDatalabels.push('Aug');
    this.ret_chartDatalabels.push('Sep');
    this.ret_chartDatalabels.push('Oct');
    this.ret_chartDatalabels.push('Nov');
    this.ret_chartDatalabels.push('Dec');

    this.ret_ctx = document.getElementById('barChart2');
    this.ret_config = {
      type: 'bar',
      options: {
        transitions: {
          easing: 'easeInOutCubic', // Use a custom easing function or one of the built-in options like 'linear', 'easeInQuad', 'easeOutCubic', etc.
          duration: 2000, // Set the duration in milliseconds (2 seconds in this example)
        },
      },
      data: {
        labels: this.ret_chartDatalabels,
        datasets: [
          {
            label: '2020 Monthly retention Report',
            data: this.ret_chartData,
            borderWidth: 2,
            borderColor: 'rgba(255, 145, 76,1)',
            backgroundColor: 'rgba(255, 145, 76,0.2)',
          },
        ],
      },
    };
    const myChart = new Chart(this.ret_ctx, this.ret_config);
  }
  scoreChartDemo() {
    this.score_chartData.push(10);
    this.score_chartData.push(20);
    this.score_chartData.push(55);
    this.score_chartData.push(40);
    this.score_chartData.push(23);
    this.score_chartData.push(10);
    this.score_chartData.push(5);
    this.score_chartData.push(10);
    this.score_chartData.push(0);
    this.score_chartData.push(0);

    this.score_chartDatalabels.push('90-100');
    this.score_chartDatalabels.push('80-90');
    this.score_chartDatalabels.push('70-80');
    this.score_chartDatalabels.push('60-70');
    this.score_chartDatalabels.push('50-60');
    this.score_chartDatalabels.push('40-50');
    this.score_chartDatalabels.push('30-40');
    this.score_chartDatalabels.push('20-30');
    this.score_chartDatalabels.push('10-20');
    this.score_chartDatalabels.push('0-10');

    this.score_ctx = document.getElementById('pieChart2');
    this.score_config = {
      type: 'pie',
      options: {
        transitions: {
          easing: 'easeInOutCubic', // Use a custom easing function or one of the built-in options like 'linear', 'easeInQuad', 'easeOutCubic', etc.
          duration: 2000, // Set the duration in milliseconds (2 seconds in this example)
        },
      },
      data: {
        labels: this.score_chartDatalabels,
        datasets: [
          {
            label: 'Report',
            data: this.score_chartData,
            borderWidth: 6,
            borderColor: 'white',
            backgroundColor: [
              'rgba(0, 50, 55, 1)',

              'rgba(0, 85, 84, 0.9)',

              'rgba(0, 100, 100, 0.7)',

              'rgba(0, 128, 129, 0.6)',

              'rgba(155, 213, 212, 0.5)',

              '	rgb(184,184,184)',
              '	rgb(160,160,160)',
              ' rgb(128,128,128)',
              '	rgb(96,96,96)',
              '	rgb(64,64,64)',
              '	rgb(40,40,40)',
            ],
          },
        ],
      },
    };
    const myChart = new Chart(this.score_ctx, this.score_config);
  }
}

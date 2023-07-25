import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-admin-analytics',
  templateUrl: './admin-analytics.component.html',
  styleUrls: ['./admin-analytics.component.css']
})
export class AdminAnalyticsComponent implements OnInit {

  constructor() { }

  ctx : any;
  config : any;
  chartData : number[] = [];
  chartDatalabels : any[] = [];
  
    ngOnInit(){
  
      this.chartData.push(0);
      this.chartData.push(2);
      this.chartData.push(3);
      this.chartData.push(3);

      this.chartDatalabels.push('A');
      this.chartDatalabels.push('B');
      this.chartDatalabels.push('C');
      this.chartDatalabels.push('C');

  
      this.ctx = document.getElementById('myChart');
      this.config = {
        type : 'pie',
        options : {
        },
        data : {
          labels : this.chartDatalabels,
          datasets : [{ 
            label: 'Chart Data',
            data: this.chartData,
            borderWidth: 5,
            borderColor: 'grey',
            backgroundColor: ['pink', 'yellow','red']
        }],
        }
      }
      const myChart = new Chart(this.ctx, this.config);
    }
}

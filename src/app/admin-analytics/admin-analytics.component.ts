import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartComponent } from "ng-apexcharts";

import { 
  ApexNonAxisChartSeries,
  ApexChart,
  ApexResponsive 
} from "ng-apexcharts";

@Component({
  selector: 'app-admin-analytics',
  templateUrl: './admin-analytics.component.html',
  styleUrls: ['./admin-analytics.component.css']
})
export class AdminAnalyticsComponent implements OnInit {

  @ViewChild("chart") chart!: ChartComponent;
  
  public chartOptions: any = {
    series: [] as ApexNonAxisChartSeries, 
    chart: {
      width: 380,
      type: "pie"   
    },
    responsive: [] as ApexResponsive[],
    labels: []    
  };

  constructor() { }

  ngOnInit(): void {
    // Assign initial data
    this.chartOptions.series = [44, 55, 13, 43, 22];
    this.chartOptions.labels = ["Team A", "Team B", "Team C", "Team D", "Team E"]; 

    this.chartOptions.responsive.push({       
      breakpoint: 480,
      options: {
        chart: {
          width: 200
         },         
         legend: {
           position: "bottom"
         } 
      }
    }); 
  }

}
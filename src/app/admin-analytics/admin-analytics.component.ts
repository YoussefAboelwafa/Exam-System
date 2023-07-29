import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { registerables } from 'chart.js';
import { ServicService } from '../services/servic.service';

@Component({
  selector: 'app-admin-analytics',
  templateUrl: './admin-analytics.component.html',
  styleUrls: ['./admin-analytics.component.css'],
})
export class AdminAnalyticsComponent implements OnInit {
  fullData: any = {};
  monthData: { [key: string]: any } = {};
  distinctyears: any[] = [];
  distinctmonth: any[] = [];
  year_month_key: any[] = [];
  distinctmonth3: any[] = [];

  months_name = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  year_name: any[] = [];
  // Getting all keys using the keys() method
  a = [
    '2032-7',
    '2026-5',
    '2026-4',
    '2026-7',
    '2026-2',
    '2026-8',
    '2026-9',
    '2026-10',
    '2022-5',
    '2022-7',
    '2022-1',
    '2022-2',
    '2022-8',
    '2022-3',
    '2022-6',
  ];
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

  //bookingsCount

  myChart: any;
  pie_chart1: any;
  bar_chart2: any;
  show_char1: any[] = [];
  selectedyear1: any;
  selectedmonth1: any = 'Choose month';

  flag_pie_chart1 = 0; //to destroy if it equals 1
  selectedyear2: any;
  selectedyear3: any;
  selectedmonth3: any = 'Choose month';
  label1 = '';
  label2 = '';
  chart3_choosen_keys: any[] = []; //to destroy if it equals
  selectedexam3: any;
  distinct_exam3: any;
  chart3: any;
  first_map_key_chart3: any;
  flag_type = true;

  
  constructor(private service: ServicService) {
    this.service.get_analytics().subscribe((entries: any) => {
      this.fullData = entries;
      entries.forEach((entry: any) => {
        const key = `${entry.year}-${entry.month}`;

        if (!this.monthData[key]) {
          this.monthData[key] = {
            bookingsCount: 0,
            retentionRate: 0,
            exams: {} as { [key: string]: any },
            marks: {} as { [key: string]: any },
          };
        }

        this.monthData[key].bookingsCount += entry.bookingsCount;
        this.monthData[key].retentionRate +=
          entry.retentionRate / entries.length;

        if (!this.monthData[key].exams[entry.exam]) {
          this.monthData[key].exams[entry.exam] = 0;
          this.monthData[key].marks[entry.exam] = entry.marks;
        }
        this.monthData[key].exams[entry.exam] += entry.bookingsCount;
      });

      console.log(this.monthData);
      // this is keys of data like 2023-7
      this.year_month_key = Object.keys(this.monthData);
      console.log(this.year_month_key);

      //this is kyes after splits to only years 2023
      this.distinctyears = Array.from(
        new Set(this.year_month_key.map((date) => date.split('-')[0]))
      ).sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
      this.flag_type = false;
    });
  }

  get_data_year(year: string, datesArray: string[]): any {
    return datesArray.filter((date) => date.includes(year));
  }

  sortStringsByMonth(strings: string[]): string[] {
    return strings.sort((a, b) => {
      const monthA = parseInt(a.split('-')[1], 10);
      const monthB = parseInt(b.split('-')[1], 10);
      return monthA - monthB;
    });
  }



  ngOnInit() {
    this.barChartDemo(0);
    this.retentionChartDemo(0);
    this.scoreChartDemo(0);
  }

  change_year_chart1(event: any) {
    this.distinctmonth = [];
    this.show_char1 = [];
    this.bar_chartData = [];
    this.bar_chartDatalabels = [];
    this.myChart.destroy();

    this.selectedyear1 = (event.target as HTMLSelectElement).value;

    if (this.selectedyear1 == 'Choose year') {
      this.selectedmonth1 = 'Choose month';
      this.barChartDemo(0);
      return;
    }
    //get the all string that contain this year like 2023-4 2023-5
    this.show_char1 = this.get_data_year(
      this.selectedyear1,
      this.year_month_key
    );

    //this is distinct months in this year like 4 5 6
    this.distinctmonth = Array.from(
      new Set(this.show_char1.map((date) => date.split('-')[1]))
    ).sort((a, b) => parseInt(a, 10) - parseInt(b, 10));

    this.barChartDemo(1);
  }

  change_month_chart1(event: any) {
    this.selectedmonth1 = (event.target as HTMLSelectElement).value;
    if (this.selectedmonth1 == 'Choose month') {
      return;
    }
  }

  open_piechart() {
    let x = this.selectedyear1 + '-' + this.selectedmonth1;
    this.pie_chartData = [];
    this.pie_chartDatalabels = [];
    if (this.flag_pie_chart1 != 0) {
      this.pie_chart1.destroy();
    }
    this.pieChartDemo(x);
  }

  barChartDemo(flag: number) {
    this.label1 = '';
    if (flag == 1) {
      // this is distinctmonth in selected year
      this.show_char1 = this.sortStringsByMonth(this.show_char1);
      this.label1 = this.selectedyear1;

      console.log(8);

      console.log(this.show_char1);
      console.log(this.distinctmonth);
      let j = 0;
      for (let i = 1; i <= 12; i++) {
        this.bar_chartDatalabels.push(this.months_name[i - 1]);
        if (this.distinctmonth[j] == i) {
          //put the value of it by key in show_chart1
          let s = this.monthData[this.show_char1[j]].bookingsCount;
          this.bar_chartData.push(s);

          j++;
        } else {
          this.bar_chartData.push(0);
        }
      }
    }

    this.bar_ctx = document.getElementById('barChart');
    this.bar_config = {
      type: 'bar',
      options: {
        transitions: {
          easing: 'easeInOutCubic', // Use a custom easing function or one of the built-in options like 'linear', 'easeInQuad', 'easeOutCubic', etc.
          duration: 1000, // Set the duration in milliseconds (2 seconds in this example)
        },
      },
      data: {
        labels: this.bar_chartDatalabels,
        datasets: [
          {
            label: this.label1 + ' Monthly Report',
            data: this.bar_chartData,
            borderWidth: 2,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
          },
        ],
      },
    };
    this.myChart = new Chart(this.bar_ctx, this.bar_config);
  }

  pieChartDemo(key: string) {
    let exname_and_value = this.monthData[key].exams;
    let exams_name = Object.keys(exname_and_value);
    for (let i = 0; i < exams_name.length; i++) {
      this.pie_chartData.push(exname_and_value[exams_name[i]]);
      this.pie_chartDatalabels.push(exams_name[i]);
    }

    this.pie_ctx = document.getElementById('myChart');
    this.pie_config = {
      type: 'pie',
      options: {
        transitions: {
          easing: 'easeInOutCubic', // Use a custom easing function or one of the built-in options like 'linear', 'easeInQuad', 'easeOutCubic', etc.
          duration: 3000, // Set the duration in milliseconds (2 seconds in this example)
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
              'rgba(200, 199, 132)',
              'rgba(200, 162, 235)',
              'rgba(255, 206, 155)',
            ],
          },
        ],
      },
    };

    this.flag_pie_chart1 = 1;
    this.pie_chart1 = new Chart(this.pie_ctx, this.pie_config);
  }

  change_year_chart2(event: any) {
    this.selectedyear2 = (event.target as HTMLSelectElement).value;
    this.ret_chartData = [];
    this.ret_chartDatalabels = [];
    this.label2 = '';
    this.bar_chart2.destroy();
    if (this.selectedyear2 == 'Choose year') {
      this.retentionChartDemo(0);
      return;
    }

    this.retentionChartDemo(1);
  }

  retentionChartDemo(flag: any) {
    this.label2 = '';
    if (flag == 1) {
      let keys_inthis_year: any[] = [];
      this.label2 = this.selectedyear2;

      //get keys contain this year
      keys_inthis_year = this.get_data_year(
        this.selectedyear2,
        this.year_month_key
      );
      //sort it with months
      keys_inthis_year = this.sortStringsByMonth(keys_inthis_year);

      // get monthes in this year
      let months = Array.from(
        new Set(keys_inthis_year.map((date) => date.split('-')[1]))
      ).sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
      let j = 0;

      for (let i = 1; i <= 12; i++) {
        this.ret_chartDatalabels.push(this.months_name[i - 1]);
        if (months[j] == i) {
          //put the value of it by key in keys_inthis_year
          let s = this.monthData[keys_inthis_year[j]].retentionRate;
          this.ret_chartData.push(s);
          j++;
        } else {
          //put it with zero
          this.ret_chartData.push(0);
        }
      }
    }
    this.ret_ctx = document.getElementById('barChart2');
    this.ret_config = {
      type: 'bar',
      options: {
        transitions: {
          easing: 'easeInOutCubic', // Use a custom easing function or one of the built-in options like 'linear', 'easeInQuad', 'easeOutCubic', etc.
          duration: 1000, // Set the duration in milliseconds (2 seconds in this example)
        },
      },
      data: {
        labels: this.ret_chartDatalabels,
        datasets: [
          {
            label: this.label2 + ' Monthly retention Report',
            data: this.ret_chartData,
            borderWidth: 2,
            borderColor: 'rgba(255, 145, 76,1)',
            backgroundColor: 'rgba(255, 145, 76,0.2)',
          },
        ],
      },
    };
    this.bar_chart2 = new Chart(this.ret_ctx, this.ret_config);
  }

  change_year_chart3(event: Event) {
    this.selectedyear3 = (event.target as HTMLSelectElement).value;
    this.chart3.destroy();
    this.scoreChartDemo(0);
    if (this.selectedyear3 == 'Choose year') {
      this.distinctmonth3 = [];
      this.distinct_exam3 = [];
      this.selectedmonth3 = 'Choose month';
      this.selectedexam3 = 'Choose exam';
      return;
    }

    this.chart3_choosen_keys = this.get_data_year(
      this.selectedyear3,
      this.year_month_key
    );
    this.distinctmonth3 = Array.from(
      new Set(this.chart3_choosen_keys.map((date) => date.split('-')[1]))
    ).sort((a, b) => parseInt(a, 10) - parseInt(b, 10));
  }
  change_month_chart3(event: Event) {
    this.selectedmonth3 = (event.target as HTMLSelectElement).value;
    this.chart3.destroy();
    this.scoreChartDemo(0);
    if (this.selectedmonth3 == 'Choose month') {
      this.distinct_exam3 = [];
      this.selectedexam3 = 'Choose exam';
      return;
    }

    this.first_map_key_chart3 = this.selectedyear3 + '-' + this.selectedmonth3;
    this.distinct_exam3 = Object.keys(
      this.monthData[this.first_map_key_chart3].marks
    );
  }

  change_exam_chart3(event: any) {
    this.selectedexam3 = (event.target as HTMLSelectElement).value;
    this.chart3.destroy();
    if (this.selectedexam3 == 'Choose exam') {
      this.scoreChartDemo(0);
      return;
    }

    this.scoreChartDemo(1);
  }

  scoreChartDemo(flag: any) {
    this.score_chartData = [];
    this.score_chartDatalabels = [];
    if (flag == 1) {
      let x =
        this.monthData[this.first_map_key_chart3].marks[this.selectedexam3];
      console.log(1);
      console.log(x);
      for (let i = 0; i < x.length; i++) {
        this.score_chartData.push(x[i].count);
        this.score_chartDatalabels.push(x[i].range);
      }
    }
    this.score_ctx = document.getElementById('pieChart2');
    this.score_config = {
      type: 'pie',
      options: {
        transitions: {
          easing: 'easeInOutCubic', // Use a custom easing function or one of the built-in options like 'linear', 'easeInQuad', 'easeOutCubic', etc.
          duration: 3000, // Set the duration in milliseconds (2 seconds in this example)
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
    this.chart3 = new Chart(this.score_ctx, this.score_config);
  }
}

import { Component, Input, OnChanges, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartEvent, ChartType } from 'chart.js';
import { FlatData } from '../flat-data';

@Component({
  selector: 'app-data-chart',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './data-chart.component.html',
  styleUrl: './data-chart.component.scss'
})
export class DataChartComponent implements OnChanges {
  private y_min:number = 0;
  private y_max:number = 100;

  @Input() chartData: any = [];
  @Input() chartLabels: string[] = [];
  @Input() chartTitle:string = "Values";

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  ngOnChanges(changes:SimpleChanges):void{
    if (changes['chartData'] || changes['chartXLabels'])
      this.updateChartView();
  }

  public lineChartData: ChartConfiguration['data'] = {
    labels: this.chartLabels,
    datasets: [
      {
        label: 'Cubic interpolation',
        data: this.chartData,
        borderColor: `rgb(146, 5, 235)`,
        fill: false,
        tension: 0.4
      },
    ],
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      title: {
        display: true,
        text: this.chartTitle
      },
    },
    interaction: {
      intersect: false,
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Variables'
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Value'
        },
        suggestedMin: this.y_min,
        suggestedMax: this.y_max
      }
    }
  };

  public lineChartType: ChartType = 'line';

  private updateChartView(): void{
    if (this.chartData instanceof Array){

    }
    else{
      this.displayFlatData();
    }
    // this.lineChartOptions!.plugins!.title = {
    //   display: true,
    //   text: this.chartTitle
    // }
    // this.lineChartData.datasets=[
    //   {
    //     label: 'Cubic interpolation',
    //     data: this.chartData,
    //     borderColor: `rgb(146, 5, 235)`,
    //     fill: false,
    //     tension: 0.4
    //   }
    // ]
    // this.lineChartData.labels = this.chartLabels;
    // this.y_min = Math.min(...this.chartData)
    // this.y_max = Math.max(...this.chartData)

    this.chart?.update();
  }

  private displayFlatData(){
    const data = this.chartData as FlatData;
    console.log(data);
    
    this.lineChartData.labels = Object.keys(data)
    this.lineChartData.datasets=[
      {
        label: 'All Submissions',
        data: Object.values(data),
        borderColor: `rgb(146, 5, 235)`,
        fill: false,
        tension: 0.4
      }
    ]

    this.y_min = Math.min(...Object.values(data));
    this.y_max = Math.max(...Object.values(data));
  }


  // events
  public chartClicked({
    event,
    active,
  }: {
    event?: ChartEvent;
    active?: object[];
  }): void {
    //console.log(event, active);
  }

  public chartHovered({
    event,
    active,
  }: {
    event?: ChartEvent;
    active?: object[];
  }): void {
    //console.log(event, active);
  }
}

import { Component, Input, OnChanges, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartDataset, ChartEvent, ChartType } from 'chart.js';
import { FlatData } from '../flat-data';
import { FilteredData } from '../filtered-data';

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
  @Input() chartTitle:string = "Submissions";

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
        text: this.chartTitle,
      },
      legend:{
        display: false
      },
      tooltip:{
        displayColors: false,
        callbacks:{
          title: function(context){
           return `Value: ${context[0].raw}`
          },
          label:function(context){
            const id = context.label
            return `Origin: ${id}`
          },
        }
      }
    },
    interaction: {
      intersect: false,
    },
    scales: {
      x: {
        ticks:{
          callback:
            function(value){
              return value;
            }
        },
        display: true,
        title: {
          display: true,
          text: 'Origin IDs'
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Value',
        },
      }
    }
  };

  public lineChartType: ChartType = 'line';

  private updateChartView(): void{
    this.displayData();
    this.chart?.update();
  }

  private getMaxValue(dataset: FilteredData[]){
    let max = 0;
    for(let i=0; i < dataset.length; i++ ){
      if (dataset[i].value > max){
        max = dataset[i].value;
      }
    }
    return max
  }

  private getValues(dataset:FilteredData[]){
    let data = []
    for(let i=0; i < dataset.length; i++ ){
      data.push(dataset[i].value);
    }
    return data;
  }

  private getIDs(dataset:FilteredData[]){
    let data = []
    for(let i=0; i < dataset.length; i++ ){
      data.push(dataset[i].originID);
    }
    return data;
  }

  // private async displayAllData(){
  //   const dataset: FilteredData[][] = this.chartData;

  //   let max: number[] = [];
  //   let values:number[][] = []
  //   this.lineChartData.datasets = [];

  //   console.log(this.lineChartOptions!.scales)

  //   dataset.forEach((set,index) => {
  //     let hidden = false;
  //     const max = this.getMaxValue(set);
  //     const values = this.getValues(set);
  //     console.log(values)
  //     this.lineChartData.labels = Object.keys(set)

  //     if(index == 0) {hidden = false}
  //     else {hidden = true}

  //     const newDataset: ChartDataset<'line'> = {
  //       label: set[0].field,
  //       data: values,
  //       borderColor: this.getColor(index),
  //       fill: false,
  //       tension: 0.4,
  //       yAxisID: `y${index}`,
  //       hidden: hidden,
  //     }
  //     this.lineChartData.datasets.push(newDataset);

  //     this.lineChartOptions!.scales![`y${index}`] = {
  //       display: !hidden,
  //       position: 'left',
  //       title:{
  //         display: !hidden,
  //         text: set[0].field,
  //       },
  //       ticks: {
  //         display: hidden,
  //       },
  //     }
  //   });

  //   console.log(this.lineChartOptions!.scales)

  // }

  private displayData(){
    const data = this.chartData as FilteredData[];

    //Cleanup laters
    const max = this.getMaxValue(data);
    const values = this.getValues(data);
    const ids = this.getIDs(data);

    this.lineChartData.labels = ids
    this.lineChartData.datasets=[
      {
        label: data[0].field,
        data: values,
        borderColor: `rgb(192, 134, 228)`,
        fill: false,
        tension: 0.4,
        borderWidth: 2
      }
    ]

  }

  //UPDATE LATER
  private getColor(index: number): string {
    const colors = [ 
      `rgb(188, 153, 210)`, 
      `rgb(235, 5, 51)`, 
      `rgb(235, 212, 5)`, 
      `rgb(5, 93, 235)`, 
      `rgb(235, 101, 5)`, 
      `rgb(5, 224, 235)`,
      `rgb(235, 5, 135)`];
    return colors[index % colors.length];
  }
  // events
  public chartClicked({
    event,
    active,
  }: {
    event?: ChartEvent;
    active?: object[];
  }): void {
    console.log(event, active);
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

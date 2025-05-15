import { Component, Input, OnChanges, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts'; //Angular's library for Chart.js
import { ChartConfiguration, ChartDataset, ChartEvent, ChartType } from 'chart.js';
import { FlatData } from '../interfaces/flat-data';
import { FilteredData } from '../interfaces/filtered-data';

@Component({
  selector: 'app-data-chart',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './data-chart.component.html',
  styleUrl: './data-chart.component.scss'
})
export class DataChartComponent implements OnChanges {
  private y_min: number = 0;
  private y_max: number = 100;

  //Input Variables, values set by parent component

  //Data to display on chart
  @Input() chartData: FilteredData[] = [];
  //Label to display on chart
  @Input() chartLabels: string[] = [];
  //Title to display on chart
  @Input() chartTitle: string = "Submissions";
  //Neccessary to dipslay Chart.js according to ng-2 charts documentation
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  //Trigger View Update when input variables receive new values
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chartData'] || changes['chartXLabels'])
      this.updateChartView();
  }

  //CHART.JS Configuration:
  //Configure Line Chart Display
  public lineChartData: ChartConfiguration['data'] = {
    //Label Config
    labels: this.chartLabels,
    //Dataset to Display
    datasets: [
      {
        label: 'Cubic interpolation',
        data: [],
        borderColor: `rgb(146, 5, 235)`,
        fill: false,
        tension: 0.4
      },
    ],
  };
  //Configure Linechart Options
  public lineChartOptions: ChartConfiguration['options'] = {
    //Set as responsive
    responsive: true,
    //maintains aspect ration
    maintainAspectRatio: true,
    //Configure Plugins
    plugins: {
      //Chart Title
      title: {
        display: true,
        text: this.chartTitle,
      },
      //Disable Chart Legend
      legend: {
        display: false
      },
      //Customize Tooltips
      tooltip: {
        //Disable display color
        displayColors: false,
        //Customize what to display on hover
        callbacks: {
          //Display value of points
          title: function (context) {
            return `Value: ${context[0].raw}`
          },
          //Display OriginID of point
          label: function (context) {
            const id = context.label
            return `Origin: ${id}`
          },
        }
      }
    },
    //Disable interaction
    interaction: {
      intersect: false,
    },
    //Set XY Scales
    scales: {
      //X Scale
      x: {
        //Customizes X Ticks
        ticks: {
          //Update to show last 4 of originID
          callback:
            function (value) {
              return value;
            }
        },
        //Sets X Label
        display: true,
        title: {
          display: true,
          text: 'Origin IDs'
        }
      },
      //Sets Y Label
      y: {
        display: true,
        title: {
          display: true,
          text: 'Value',
        },
      }
    }
  };

  //Sets Chart Type
  public lineChartType: ChartType = 'line';

  //Updates Chart View
  private updateChartView(): void {
    this.displayData();
    this.chart?.update();
  }

  //Get Max Value for X Ticks
  private getMaxValue(dataset: FilteredData[]) {
    let max = 0;
    for (let i = 0; i < dataset.length; i++) {
      if (dataset[i].value > max) {
        max = dataset[i].value;
      }
    }
    return max
  }
  //Extract value form dataset
  private getValues(dataset: FilteredData[]) {
    let data = []
    for (let i = 0; i < dataset.length; i++) {
      data.push(dataset[i].value);
    }
    return data;
  }
  //Extract Origin ID from dataset
  private getIDs(dataset: FilteredData[]) {
    let data = []
    for (let i = 0; i < dataset.length; i++) {
      data.push(dataset[i].originID);
    }
    return data;
  }
  //Display Data on Chart
  private displayData() {
    //Gets Chart Data Input Variable
    const data = this.chartData;
    //If values exist
    if (data.length > 0) {

      //Get Max value
      const max = this.getMaxValue(data);
      //Get Data Points
      const values = this.getValues(data);
      //Get OriginID's
      const ids = this.getIDs(data);
      //Set X ticks to ID's
      this.lineChartData.labels = ids
      //Updates Dataset
      this.lineChartData.datasets = [
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

  }

  //TODO: Add Click Functionality
  public chartClicked({
    event,
    active,
  }: {
    event?: ChartEvent;
    active?: object[];
  }): void {
  }

  public chartHovered({
    event,
    active,
  }: {
    event?: ChartEvent;
    active?: object[];
  }): void {
  }
}

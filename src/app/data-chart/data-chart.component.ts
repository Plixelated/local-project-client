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
  private y_min: number = 0;
  private y_max: number = 100;

  @Input() chartData: FilteredData[] = [];
  @Input() chartLabels: string[] = [];
  @Input() chartTitle: string = "Submissions";

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chartData'] || changes['chartXLabels'])
      this.updateChartView();
  }

  public lineChartData: ChartConfiguration['data'] = {
    labels: this.chartLabels,
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

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      title: {
        display: true,
        text: this.chartTitle,
      },
      legend: {
        display: false
      },
      tooltip: {
        displayColors: false,
        callbacks: {
          title: function (context) {
            return `Value: ${context[0].raw}`
          },
          label: function (context) {
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
        ticks: {
          callback:
            function (value) {
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

  private updateChartView(): void {
    this.displayData();
    this.chart?.update();
  }

  private getMaxValue(dataset: FilteredData[]) {
    let max = 0;
    for (let i = 0; i < dataset.length; i++) {
      if (dataset[i].value > max) {
        max = dataset[i].value;
      }
    }
    return max
  }

  private getValues(dataset: FilteredData[]) {
    let data = []
    for (let i = 0; i < dataset.length; i++) {
      data.push(dataset[i].value);
    }
    return data;
  }

  private getIDs(dataset: FilteredData[]) {
    let data = []
    for (let i = 0; i < dataset.length; i++) {
      data.push(dataset[i].originID);
    }
    return data;
  }

  private displayData() {
    const data = this.chartData;

    if (data.length > 0) {

      //Cleanup laters
      const max = this.getMaxValue(data);
      const values = this.getValues(data);
      const ids = this.getIDs(data);

      this.lineChartData.labels = ids
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

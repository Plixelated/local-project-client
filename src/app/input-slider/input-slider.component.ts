import { Component,computed,EventEmitter,Input,OnInit,Output,signal} from '@angular/core';

@Component({
  selector: 'app-input-slider',
  imports: [],
  templateUrl: './input-slider.component.html',
  styleUrl: './input-slider.component.scss'
})
export class InputSliderComponent implements OnInit {
    @Input() config!: {
      min:number; 
      max: number; 
      step:number;
      label:string;
      default?: number;
    };

    @Input() formatting!:{
      isPercent:boolean
    }

    @Input() labels!: {
      title:string;
      desc:string;
      prefix?:string;
      suffix?:string;
    }

    @Output() valueChange = new EventEmitter<{label:string,value:number}>();

    rangeValue = signal(50);
    label = computed(()=> `${this.rangeValue()}`);

    ngOnInit(): void {
      this.rangeValue.set(this.config?.default ?? (this.config?.max/2) ?? 50)
      this.valueChange.emit({label:this.config.label, value:this.rangeValue()});
    }
    

    onValueChange(event:Event){
      this.rangeValue.set(+(event.target as HTMLInputElement).value);
      this.valueChange.emit({label:this.config.label, value:this.rangeValue()});
      //console.log(`${this.config.label}: ${this.rangeValue()}`)
    }
}
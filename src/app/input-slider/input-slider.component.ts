import { Component,computed,EventEmitter,Input,OnInit,Output,signal} from '@angular/core';

@Component({
  selector: 'app-input-slider',
  imports: [],
  templateUrl: './input-slider.component.html',
  styleUrl: './input-slider.component.scss'
})
export class InputSliderComponent implements OnInit {
    //Configure Slider Setup
    @Input() config!: {
      min:number; 
      max: number; 
      step:number;
      label:string;
      default?: number;
    };
    //Toggles wether or not it is a percent
    @Input() formatting!:{
      isPercent:boolean
    }
    //Configure Display Labels
    //TODO: Add Formatting
    @Input() labels!: {
      title:string;
      desc:string;
      prefix?:string;
      suffix?:string;
    }
    //Create Output Emitter to communicate to Parent Object
    @Output() valueChange = new EventEmitter<{label:string,value:number}>();

    //Set Range Value Signal
    rangeValue = signal(50);
    //Calculates Signal's Input value
    label = computed(()=> `${this.rangeValue()}`);

    ngOnInit(): void {
      //Set it to either a preconfigured default value via the config object
      //Or default it to half the max value
      this.rangeValue.set(this.config?.default ?? (this.config?.max/2) ?? 50)
      //Emit the initial value
      //Update this to use a subject instead?
      this.valueChange.emit({label:this.config.label, value:this.rangeValue()});
    }
    
    //When Range Input Value Changes
    //Update this to use subscribe instead
    onValueChange(event:Event){
      
      this.rangeValue.set(+(event.target as HTMLInputElement).value);
      this.valueChange.emit({label:this.config.label, value:this.rangeValue()});
      //console.log(`${this.config.label}: ${this.rangeValue()}`)
    }
}
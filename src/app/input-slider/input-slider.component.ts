import { Component,computed,Input,signal} from '@angular/core';

@Component({
  selector: 'app-input-slider',
  imports: [],
  templateUrl: './input-slider.component.html',
  styleUrl: './input-slider.component.scss'
})
export class InputSliderComponent {


    @Input() config!: {
      min:number; 
      max: number; 
      step:number;
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

    value = signal(25);
    label = computed(()=> `${this.value()}`);
    
    updateValue(event:Event){
      this.value.set(+(event.target as HTMLInputElement).value);
    }
}
import { Component,computed,signal} from '@angular/core';

@Component({
  selector: 'app-input-slider',
  imports: [],
  templateUrl: './input-slider.component.html',
  styleUrl: './input-slider.component.scss'
})
export class InputSliderComponent {

    value = signal(50);
    label = computed(()=> `The input is ${this.value()}`);
    
    updateValue(event:Event){
      this.value.set(+(event.target as HTMLInputElement).value);
    }
}

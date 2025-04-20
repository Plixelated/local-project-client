import { Component, QueryList, ViewChildren } from '@angular/core';
import { InputSliderComponent } from "../input-slider/input-slider.component";
import { textData,configData } from "../data/data"

@Component({
  selector: 'app-input-wrapper',
  imports: [InputSliderComponent],
  templateUrl: './input-wrapper.component.html',
  styleUrl: './input-wrapper.component.scss'
})
export class InputWrapperComponent {

  //Gets Child Component
  @ViewChildren(InputSliderComponent) sliderInputs!: QueryList<InputSliderComponent>;

  //Import Data
  configData = configData;
  textData = textData;

  calculation = 1;
  reveal = false;


  getAllValues(){
    //Dict Value to store in JSON
    const result: Record<string,number>={}
    let total = 1;

    this.sliderInputs.forEach(input => {
      result[input.config.label] = input.rangeValue();
      total *= input.rangeValue();
  });

    this.calculation = total;
    this.reveal = this.calculation > 1;

    console.log(result);
    console.log(this.calculation)

    return result;
  }

}

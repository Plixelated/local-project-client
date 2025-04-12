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


  getAllValues(){
    //Dict Value to store in J
    const result: Record<string,number>={}

    this.sliderInputs.forEach(input => {
      result[input.config.label] = input.rangeValue();
  });

    console.log(result);
    return result;
  }

}

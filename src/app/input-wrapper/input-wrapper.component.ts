import { Component, QueryList, ViewChildren } from '@angular/core';
import { InputSliderComponent } from "../input-slider/input-slider.component";
import { textData,configData } from "../data/data"
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../environments/environment.development';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-input-wrapper',
  imports: [InputSliderComponent],
  templateUrl: './input-wrapper.component.html',
  styleUrl: './input-wrapper.component.scss'
})
export class InputWrapperComponent {

  constructor(private http: HttpClient, private activatedRoute: ActivatedRoute){}

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
    // console.log(this.calculation)

    this.submitValues(result);

    return result;
  }

  submitValues(results: Record<string,number>){
    
    let localToken = localStorage.getItem("DESubToken");
    if (!localToken) {
      localToken = uuidv4();
      localStorage.setItem("DESubToken", localToken);
    }

    const submission = {
      rateStars: results["r*"],
      frequencyPlanets: results["fp"],
      nearEarth: results["ne"],
      fractionLife: results["fl"],
      fractionIntelligence: results["fi"],
      fractionCommunication: results["fc"],
      length: results["L"],
      entryOrigin: localToken
    }
    console.log(submission);
    this.http.post(`${environment.baseURL}api/Submission/CreateSubmission/`, submission).subscribe({
      next:(res) =>{
        console.log(res)
      },
      error:(e) => console.error(e)
    })

  }

  // getValues(){
  //   this.http.get(`${environment.baseURL}api/Submission/GetAllValues`).subscribe({
  //     next:(res) =>{
  //       console.log(res)
  //     },
  //     error:(e) => console.error(e)
  //   })

  // }

}

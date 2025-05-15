import { Component, QueryList, ViewChildren } from '@angular/core';
import { InputSliderComponent } from "../input-slider/input-slider.component";
import { textData, configData, formatData } from "../data/data"
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Data } from '@angular/router';
import { environment } from '../../environments/environment';
import { v4 as uuidv4 } from 'uuid';
import { RawData } from '../interfaces/raw-data';

@Component({
  selector: 'app-input-wrapper',
  imports: [InputSliderComponent],
  templateUrl: './input-wrapper.component.html',
  styleUrl: './input-wrapper.component.scss'
})
export class InputWrapperComponent {
  //DI
  constructor(private http: HttpClient, private activatedRoute: ActivatedRoute) { }
  //Get Children Components
  @ViewChildren(InputSliderComponent) sliderInputs!: QueryList<InputSliderComponent>;

  //Import Data
  configData = configData;
  textData = textData;
  formatData = formatData;
  //Set Calculation Value
  calculation = 1;
  //Display Final Calculation UI Object
  reveal = false;

  //Retrieves Objects from children components
  getAllValues() {
    //Dict Value to store in JSON
    const result: Record<string, number> = {}
    let total = 1;
    //Loop through each input and grab the value
    this.sliderInputs.forEach(input => {
      //get value from emitted signal
      let value = input.rangeValue();
      //Sets display label to value
      result[input.config.label] = value;
      //If the value is a percent
      if (input.formatting.isPercent === true) {
        value /= 100;
      }
      //Calculate the total
      total *= value;
    });
    //Calculate total
    this.calculation = total;
    //Reveal UI Element
    this.reveal = this.calculation > 1;

    console.log(result);

    //Post Values to backend
    this.submitValues(result);

    return result;
  }

  submitValues(results: Record<string, number>) {
    //Create a unique Identifier if the user doesn't already have one
    //This helps to identify if a user has create mulitple submissions
    //Without the need to sign up for an account
    let localToken = localStorage.getItem("DESubToken");
    if (!localToken) {
      localToken = uuidv4();
      localStorage.setItem("DESubToken", localToken);
    }

    //Create a submission object of type RawData
    const submission: RawData = {
      rateStars: results["r*"],
      frequencyPlanets: results["fp"],
      nearEarth: results["ne"],
      fractionLife: results["fl"] / 100,
      fractionIntelligence: results["fi"] / 100,
      fractionCommunication: results["fc"] / 100,
      length: results["L"],
      entryOrigin: localToken
    }

    //Log Submission
    console.log(submission);

    //POST request
    this.http.post(`${environment.baseURL}api/Submission/CreateSubmission`, submission, { responseType: 'text' }).subscribe({
      next: (res) => {
        console.log(res + submission.entryOrigin)
      },
      error: (e) => console.error(e)
    })

  }
}

import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, FormArray, Validators, NgForm, Form } from '@angular/forms';
import { JsonApiService } from 'src/assets/api/json-api.service';

@Component({
  selector: 'app-request-summary-view',
  templateUrl: './request-summary-view.component.html',
  styleUrls: ['./request-summary-view.component.css']
})

export class RequestSummaryViewComponent implements OnInit {
  labels: any = {};/** LABEL CHANGES **/

  constructor(
    private jsonApiService: JsonApiService/** LABEL CHANGES **/) { }
    
  ngOnInit() {
    this.getLabelDetails();/** LABEL CHANGES **/
  }/**** LABEL CHNAGES ****/
  getLabelDetails() {
    let lang;
    if (localStorage.getItem('langCode') !== null) {
      lang = localStorage.getItem('langCode');
    } 
    this.jsonApiService.fetch('/' + lang + '.json').subscribe((data) => {
      this.labels = data;
    });
  }
}
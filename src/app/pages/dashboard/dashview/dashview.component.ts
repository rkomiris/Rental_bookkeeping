import { Component, OnInit } from '@angular/core';
import { JsonApiService } from 'src/assets/api/json-api.service';

@Component({
  selector: 'app-dashview',
  templateUrl: './dashview.component.html',
  // styleUrls: ['./dashview.component.css'],
  styleUrls: ['./dashview-srmav.component.css']
})
export class DashviewComponent implements OnInit {

  labels: any = {}; /** LABEL CHANGES **/

  constructor(private jsonApiService: JsonApiService/** LABEL CHANGES **/) { }

  ngOnInit() {
    this.getLabelDetails(); /** LABEL CHANGES **/
  }

   /** LABEL CHANGES **/
   getLabelDetails() {
    let lang;
    if(localStorage.getItem('langCode') !== null){
      lang = localStorage.getItem('langCode');
    }
    this.jsonApiService.fetch('/'+lang+'.json').subscribe((data) => {
        this.labels = data;
      });
  }
}


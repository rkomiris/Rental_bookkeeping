import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import { JsonApiService } from 'src/assets/api/json-api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(private router: Router,
    private jsonApiService: JsonApiService) { }
  labels: any = {};

  ngOnInit() {
  this.getLabelDetails();
  }

  /**** LABEL CHNAGES ****/
  getLabelDetails() {
    let lang;
    if (localStorage.getItem('langCode') !== null) {
      lang = localStorage.getItem('langCode');
    }else{
      lang = environment.defaultLocale;
    }
    this.jsonApiService.fetch('/' + lang + '.json').subscribe((data) => {
      this.labels = data;
    });
  }
}

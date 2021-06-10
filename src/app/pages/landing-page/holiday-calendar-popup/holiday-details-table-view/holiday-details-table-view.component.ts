import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { JsonApiService } from 'src/assets/api/json-api.service';

@Component({
  selector: 'app-holiday-details-table-view',
  templateUrl: './holiday-details-table-view.component.html',
  // styleUrls: ['./holiday-details-table-view.component.css']
  styleUrls: ['./holiday-details-table-view-srmav.component.css']
})
export class HolidayDetailsTableViewComponent implements OnInit {

  holidayList: any = [];
  labels: any = {};
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private jsonApiService: JsonApiService ) { }

  ngOnInit() {
   
    this.holidayList = this.data.holidayDetailsList;
    this.getLabelDetails();
  }
  getLabelDetails()
  {
    let lang;
    if(localStorage.getItem('langCode') !== null){
      lang = localStorage.getItem('langCode');
    }
    this.jsonApiService.fetch('/'+lang+'.json').subscribe((data) => {
        this.labels = data;
      });
  }

}

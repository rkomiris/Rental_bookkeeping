import { Component, OnInit, ViewChild, Input, Output, EventEmitter, Inject, OnDestroy, Renderer } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, VERSION, MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA, MatCheckboxChange } from '@angular/material';
import { FormControl, FormBuilder, FormGroup, FormArray, Validators, NgForm, Form } from '@angular/forms';
import { Router } from "@angular/router";
import { DOCUMENT } from '@angular/common';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { OptionsInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarComponent } from 'ng-fullcalendar';
import * as moment from 'moment';
import { APP_DATE_FORMATS, AppDateAdapter } from '../../../shared/data.format';
import { toDate } from '@angular/common/src/i18n/format_date';
import { ComponentLoaderService } from 'src/app/shared/component-loader.service';
import { LandingPageService } from '../landing-page.service';
import { HolidayDetailsTableViewComponent } from './holiday-details-table-view/holiday-details-table-view.component';
import { JsonApiService } from 'src/assets/api/json-api.service';
export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};


export interface roomBookListData {
  // hovered?: boolean;
  id: number;
}

const ELEMENT_DATA: roomBookListData[] = [];

@Component({
  selector: 'app-holiday-calendar-popup',
  templateUrl: './holiday-calendar-popup.component.html',
  // styleUrls: ['./holiday-calendar-popup.component.css'],
  styleUrls: ['./holiday-calendar-popup-srmav.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class HolidayCalendarPopupComponent implements OnInit {
  @ViewChild('fullcalendar') fullcalendar: CalendarComponent;
  calendarOptions: OptionsInput;
  eventsModel: any;
  loadData: any = [];
  public from_MinDate = new Date();
  today: Date = new Date();
  fullcalendar_ListData: any;
  labels: any = {};

  constructor(private componentLoaderService: ComponentLoaderService,
    @Inject(DOCUMENT) private document: Document,
    private formBuilder: FormBuilder,
    private router: Router, private dialog: MatDialog,
    private LandingPageService: LandingPageService,
    private jsonApiService: JsonApiService) { }

  ngOnInit() {
    this.componentLoaderService.display(true);
    this.fullcalendar_loadData();
    this.getLabelDetails();
  }
  /**** LABEL CHNAGES ****/
  getLabelDetails() {
    let lang;
    if(localStorage.getItem('langCode') !== null){
      lang = localStorage.getItem('langCode');
    }
    this.jsonApiService.fetch('/'+lang+'.json').subscribe((data) => {
        this.labels = data;
      });
  }
  fullcalendar_loadData() {
    this.LandingPageService.load_holiday_Details().subscribe(data => {
      this.componentLoaderService.display(false);
      let fullcalendar_data = JSON.parse(data['_body']);
      this.fullcalendar_ListData = fullcalendar_data.succesObject;
      let eventValue = [];
      for (let k = 0; k < this.fullcalendar_ListData.length; k++) {
        if (this.fullcalendar_ListData[k] !== undefined && this.fullcalendar_ListData[k] !== undefined) {
          let val =
          {
            title: this.fullcalendar_ListData[k].description,
            start: moment(this.fullcalendar_ListData[k].holidayDate).format('YYYY-MM-DD'),
            end: moment(this.fullcalendar_ListData[k].holidayDate).format('YYYY-MM-DD'),
            from: this.fullcalendar_ListData[k].holidayDate,
            to: this.fullcalendar_ListData[k].holidayDate,
            id: this.fullcalendar_ListData[k].id,
            locationName: this.fullcalendar_ListData[k].locationName,
            sublocationName: this.fullcalendar_ListData[k].sublocationName,
            departmentName: this.fullcalendar_ListData[k].departmentName,
            holidayDate: this.fullcalendar_ListData[k].holidayDate,
            leaveType: this.fullcalendar_ListData[k].leaveType,
          }
          eventValue.push(val);
        }
      }
      //  for(let j=0; j < eventValue.length; j++){
      //    if(eventValue[j].isRoomBookingRecursive === false){
      //      if(eventValue[j].start != eventValue[j].end){
      //       let endDate = new Date(eventValue[j].end);
      //       endDate.setDate(endDate.getDate() + 1);
      //       eventValue[j].end = new Date(endDate).toISOString().split('T')[0];
      //      }
      //    }
      //  }
      this.calendarOptions = {
        editable: true,
        selectable: false,
        eventLimit: true,
        header: {
          left: '',
          center: 'prev, title, next',
          right: ''
        },
        allDaySlot: false,
        views: {
          week: {
            eventLimit: 2,
          },
        },

        events: eventValue,
        defaultView: 'dayGridMonth',
        plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin]
      }
      this.componentLoaderService.display(false);
    });
  }
  eventClick(event) {

    this.LandingPageService.load_holidayDetails(event.event.id).subscribe(data => {
      let selectGetData = JSON.parse(data['_body']);
      this.loadData = selectGetData.succesObject;
    if(selectGetData.responseCode == 200){
    const dialogRef = this.dialog.open(HolidayDetailsTableViewComponent, {
      disableClose: false,
      panelClass: 'btnCenter',
      width: 'auto',
      data: this.loadData
    });
   }
   else{
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: false,
      panelClass: 'btnCenter',
      width: 'auto',
      data: {
        title: 'Alert',
        server: 'servermessage',
        message: selectGetData.responseMessage,
        btnYes: 'OK',
      }
    });
   }
    
   });
  }

}


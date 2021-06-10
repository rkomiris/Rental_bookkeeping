import { WidgetDetailComponent } from './widget-detail/widget-detail.component';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { LandingPageService } from './landing-page.service';
import { Component, OnInit, ViewChild, Output, EventEmitter, Inject, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import * as moment from 'moment';
import { OptionsInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarComponent } from 'ng-fullcalendar';
import { ApprovalService } from '../../pages/approval/approval.service';
import { HeaderService } from '../../shared/layout/app-layout/header/header.service';
import { ComponentLoaderService } from 'src/app/shared/component-loader.service';
import { environment } from '../../../environments/environment';
import { HolidayCalendarPopupComponent } from './holiday-calendar-popup/holiday-calendar-popup.component';
import { JsonApiService } from 'src/assets/api/json-api.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  // styleUrls: ['./landing-page.component.css']
  styleUrls: ['./landing-page-srmav.component.css']
})

export class LandingPageComponent implements OnInit {
  selectedDate: string;
  landingWidgetData: any;
  newWidget: any;
  AnounceMent: any;
  events: any;
  newData: any;
  lastData: any;
  options: OptionsInput;
  eventsModel: any;
  flashNewsType: any = {};
  flashNewsDescription: any = '';
  flasharr: any = [];
  fullurl = environment.API_HOST;
  url: string = this.fullurl.substring(0, this.fullurl.length - 3);
  commonWidgetPath: string;
  imageUrlArray = ['https://picsum.photos/id/789/200/300?grayscale', 'https://picsum.photos/200/300/?blur', 'https://picsum.photos/id/870/200/300?grayscale&blur=2'];
  title1: string;
  title2: string;
  title3: string;
  title4: string;
  title5: string;
  title1Data: string;
  title2Data: string;
  title3Data: string;
  title4Data: string;
  title5Data: string;
  labels:any={};

  widget1Title;
  widget1Picture;
  widget1PictureArray: any = [];
  widget2Title;
  widget2Picture;
  widget3Title;
  widget3Picture;
  widget4Title;
  widget4Picture;
  widget5Title;
  widget5Picture;

  @ViewChild('fullcalendar') fullcalendar: CalendarComponent;
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private landingService: LandingPageService,
    private dialogue: MatDialog,
    private approvalService: ApprovalService,
    private jsonApiService: JsonApiService,
    private headerService: HeaderService,
    private _sanitizer: DomSanitizer,
    private componentLoaderService: ComponentLoaderService) { }
    
  ngOnInit() {
    this.componentLoaderService.display(true);
    this.document.body.classList.remove('loginonly');
    let currentDate = new Date();
    this.selectedDate = currentDate.toISOString().split('T')[0];
    this.getLabelDetails();
    this.landingService.selectDate_WidgetData(this.selectedDate).subscribe(data => {
      let postedData = JSON.parse(data['_body']);
      try {
        this.landingWidgetData = postedData['succesObject'];
        if (this.landingWidgetData[0] != undefined && this.landingWidgetData[0].widgetIcon != null) {
          this.commonWidgetPath = this.landingWidgetData[0].widgetIcon.substr(0, this.landingWidgetData[0].widgetIcon.lastIndexOf("/")) + '/';
        }
        if (this.landingWidgetData[0] != undefined && this.landingWidgetData[0].widgetIndex == '1') {
          this.title1 = this.landingWidgetData[0].widgetTitle;
          this.widget1Title = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
          +  this.landingWidgetData[0].widgetIconImage);
          this.title1Data = this.landingWidgetData[0];

          this.newWidget = this.landingWidgetData[0]['widgetDetailVoList'];
          // this.widget1Title = this.landingWidgetData[0].widgetTitle;
          // for(let i = 0; i < this.newWidget.length; i++){
          //   for(let j = 0; j < this.newWidget[i].widgetDetailPicPathImageLoad.length; j++){
          //   this.widget1Picture = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
          //       +  this.newWidget[i].widgetDetailPicPathImageLoad[j]);
          //   this.widget1PictureArray.push(this.widget1Picture);            
          //   }
          //   this.newWidget[i].widget1Picture = this.widget1PictureArray
          // }

          this.widget1Picture = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
          +  this.newWidget[0].widgetDetailPicPathImageLoad[0]);

          // for(let i = 0; i < this.newWidget.length; i++){            
          //   this.widget1PictureArray.push(this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
          //     +  this.newWidget[i].widgetDetailPicPathImageLoad[i]));
          // }
          
          
          for (let j = 0; j < this.newWidget.length; j++) {
            let widgetDetailPicPath = this.newWidget[j].widgetDetailPicPath;
            if (this.newWidget[j].widgetDetailPicPath !== null) {
              if (this.newWidget[j].widgetDetailPicPath.includes(',')) {
                widgetDetailPicPath = this.newWidget[j].widgetDetailPicPath.split(",");
                this.newWidget[j].widgetDetailPicPath = widgetDetailPicPath;
              } else {
                this.newWidget[j].widgetDetailPicPath = [this.newWidget[j].widgetDetailPicPath];
              }
            }
            if (this.newWidget[j].widgetDetailPicPath != null) {
              for (let i = 0; i < this.newWidget[j].widgetDetailPicPath.length; i++) {
                this.newWidget[j].widgetDetailPicPath[i] = this.url + this.commonWidgetPath + this.newWidget[j].widgetDetailPicPath[i];
              }
            }
          }
        }
        // 1st Box ends
        /***************SECOND BOX CONDITION ********** */
        if (this.landingWidgetData[1] != undefined && this.landingWidgetData[1].widgetIndex == '2') {
          this.AnounceMent = this.landingWidgetData[1]['widgetDetailVoList'];
          this.title2 = this.landingWidgetData[1].widgetTitle;
          this.widget2Title = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
          +  this.landingWidgetData[1].widgetIconImage);
          this.title2Data = this.landingWidgetData[1];

          this.widget2Picture = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
          +  this.AnounceMent[0].widgetDetailPicPathImageLoad[0]);

          // for(let i = 0; i < this.AnounceMent.length; i++){            
          //   this.AnounceMent[i].widget2Picture = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
          //     +  this.AnounceMent[i].widgetDetailPicPathImageLoad[0]);
          // }

          for (let j = 0; j < this.AnounceMent.length; j++) {
            let widgetDetailPicPath = this.AnounceMent[j].widgetDetailPicPath;
            if (this.AnounceMent[j].widgetDetailPicPath !== null) {
              if (this.AnounceMent[j].widgetDetailPicPath.includes(',')) {
                widgetDetailPicPath = this.AnounceMent[j].widgetDetailPicPath.split(",");
                this.AnounceMent[j].widgetDetailPicPath = widgetDetailPicPath;
              } else {
                this.AnounceMent[j].widgetDetailPicPath = [this.AnounceMent[j].widgetDetailPicPath];
              }
            }
            if (this.AnounceMent[j].widgetDetailPicPath != null) {
              for (let i = 0; i < this.AnounceMent[j].widgetDetailPicPath.length; i++) {
                this.AnounceMent[j].widgetDetailPicPath[i] = this.url + this.commonWidgetPath + this.AnounceMent[j].widgetDetailPicPath[i];
              }
            }
          }
        }else if (this.landingWidgetData[0] != undefined && this.landingWidgetData[0].widgetIndex == '2') {
          this.title2 = this.landingWidgetData[0].widgetTitle;
          this.title2Data = this.landingWidgetData[0];
          this.widget2Title = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
          +  this.landingWidgetData[0].widgetIconImage);
          this.AnounceMent = this.landingWidgetData[0]['widgetDetailVoList'];
          
          this.widget2Picture = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
          +  this.AnounceMent[0].widgetDetailPicPathImageLoad[0]);

          // for(let i = 0; i < this.AnounceMent.length; i++){            
          //   this.AnounceMent[i].widget2Picture = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
          //     +  this.AnounceMent[i].widgetDetailPicPathImageLoad[0]);
          // }
         

          for (let j = 0; j < this.AnounceMent.length; j++) {
            let widgetDetailPicPath = this.AnounceMent[j].widgetDetailPicPath;
            if (this.AnounceMent[j].widgetDetailPicPath !== null) {
              if (this.AnounceMent[j].widgetDetailPicPath.includes(',')) {
                widgetDetailPicPath = this.AnounceMent[j].widgetDetailPicPath.split(",");
                this.AnounceMent[j].widgetDetailPicPath = widgetDetailPicPath;
              } else {
                this.AnounceMent[j].widgetDetailPicPath = [this.AnounceMent[j].widgetDetailPicPath];
              }
            }
            if (this.AnounceMent[j].widgetDetailPicPath != null) {
              for (let i = 0; i < this.AnounceMent[j].widgetDetailPicPath.length; i++) {
                this.AnounceMent[j].widgetDetailPicPath[i] = this.url + this.commonWidgetPath + this.AnounceMent[j].widgetDetailPicPath[i];
              }
            }
          }
        }
        // 2nd Box ends
        /********* THIRD BOX CONDITION ******************/
        if (this.landingWidgetData[2] != undefined && this.landingWidgetData[2].widgetIndex == '3') {
          this.title3 = this.landingWidgetData[2].widgetTitle;
          this.title3Data = this.landingWidgetData[2];
          this.widget3Title = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
          +  this.landingWidgetData[2].widgetIconImage);
          this.events = this.landingWidgetData[2]['widgetDetailVoList'];
          this.widget3Picture = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
          +  this.events[0].widgetDetailPicPathImageLoad[0]);
          // for(let i = 0; i < this.events.length; i++){            
          //   this.events[i].widget3Picture = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
          //     +  this.events[i].widgetDetailPicPathImageLoad[0]);
          // }
          for (let j = 0; j < this.events.length; j++) {
            let widgetDetailPicPath = this.events[j].widgetDetailPicPath;
            if (this.events[j].widgetDetailPicPath !== null) {
              if (this.events[j].widgetDetailPicPath.includes(',')) {
                widgetDetailPicPath = this.events[j].widgetDetailPicPath.split(",");
                this.events[j].widgetDetailPicPath = widgetDetailPicPath;
              } else {
                this.events[j].widgetDetailPicPath = [this.events[j].widgetDetailPicPath];
              }
            }
            if (this.events[j].widgetDetailPicPath != null) {
              for (let i = 0; i < this.events[j].widgetDetailPicPath.length; i++) {
                this.events[j].widgetDetailPicPath[i] = this.url + this.commonWidgetPath + this.events[j].widgetDetailPicPath[i];

              }
            }
          }
        } else if (this.landingWidgetData[1] != undefined && this.landingWidgetData[1].widgetIndex == '3') {
          this.title3 = this.landingWidgetData[1].widgetTitle;
          this.title3Data = this.landingWidgetData[1];
          this.widget3Title = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
          +  this.landingWidgetData[1].widgetIconImage);
          this.events = this.landingWidgetData[1]['widgetDetailVoList'];
          this.widget3Picture = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
          +  this.events[0].widgetDetailPicPathImageLoad[0]);
          // for(let i = 0; i < this.events.length; i++){            
          //   this.events[i].widget3Picture = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
          //     +  this.events[i].widgetDetailPicPathImageLoad[0]);
          // }
          for (let j = 0; j < this.events.length; j++) {
            let widgetDetailPicPath = this.events[j].widgetDetailPicPath;
            if (this.events[j].widgetDetailPicPath !== null) {
              if (this.events[j].widgetDetailPicPath.includes(',')) {
                widgetDetailPicPath = this.events[j].widgetDetailPicPath.split(",");
                this.events[j].widgetDetailPicPath = widgetDetailPicPath;
              } else {
                this.events[j].widgetDetailPicPath = [this.events[j].widgetDetailPicPath];
              }
            }
            if (this.events[j].widgetDetailPicPath != null) {
              for (let i = 0; i < this.events[j].widgetDetailPicPath.length; i++) {
                this.events[j].widgetDetailPicPath[i] = this.url + this.commonWidgetPath + this.events[j].widgetDetailPicPath[i];
              }
            }
          }
        } else if (this.landingWidgetData[0] != undefined && this.landingWidgetData[0].widgetIndex == '3') {
          this.title3 = this.landingWidgetData[0].widgetTitle;
          this.title3Data = this.landingWidgetData[0];
          this.widget3Title = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
          +  this.landingWidgetData[0].widgetIconImage);
          this.events = this.landingWidgetData[0]['widgetDetailVoList'];
          this.widget3Picture = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
          +  this.events[0].widgetDetailPicPathImageLoad[0]);
          // for(let i = 0; i < this.events.length; i++){            
          //   this.events[i].widget3Picture = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
          //     +  this.events[i].widgetDetailPicPathImageLoad[0]);
          // }
          for (let j = 0; j < this.events.length; j++) {
            let widgetDetailPicPath = this.events[j].widgetDetailPicPath;
            if (this.events[j].widgetDetailPicPath !== null) {
              if (this.events[j].widgetDetailPicPath.includes(',')) {
                widgetDetailPicPath = this.events[j].widgetDetailPicPath.split(",");
                this.events[j].widgetDetailPicPath = widgetDetailPicPath;
              } else {
                this.events[j].widgetDetailPicPath = [this.events[j].widgetDetailPicPath];
              }
            }
            if (this.events[j].widgetDetailPicPath != null) {
              for (let i = 0; i < this.events[j].widgetDetailPicPath.length; i++) {
                this.events[j].widgetDetailPicPath[i] = this.url + this.commonWidgetPath + this.events[j].widgetDetailPicPath[i];
              }
            }
          }
        }
        // 3rd Box ends
        /*************** FOURTH BOX CONDITION *******************/
        if (this.landingWidgetData[3] != undefined && this.landingWidgetData[3].widgetIndex == '4') {
          this.title4 = this.landingWidgetData[3].widgetTitle;
          this.title4Data = this.landingWidgetData[3];
          this.newData = this.landingWidgetData[3]['widgetDetailVoList'];
          this.widget4Title = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
          +  this.landingWidgetData[3].widgetIconImage);
          this.widget4Picture = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
          +  this.newData[0].widgetDetailPicPathImageLoad[0]);
          // for(let i = 0; i < this.newData.length; i++){            
          //   this.newData[i].widget4Picture = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
          //     +  this.newData[i].widgetDetailPicPathImageLoad[0]);
          // }
          for (let j = 0; j < this.newData.length; j++) {
            let widgetDetailPicPath = this.newData[j].widgetDetailPicPath;
            if (this.newData[j].widgetDetailPicPath !== null) {
              if (this.newData[j].widgetDetailPicPath.includes(',')) {
                widgetDetailPicPath = this.newData[j].widgetDetailPicPath.split(",");
                this.newData[j].widgetDetailPicPath = widgetDetailPicPath;
              } else {
                this.newData[j].widgetDetailPicPath = [this.newData[j].widgetDetailPicPath];
              }
            }
            if (this.newData[j].widgetDetailPicPath != null) {
              for (let i = 0; i < this.newData[j].widgetDetailPicPath.length; i++) {
                this.newData[j].widgetDetailPicPath[i] = this.url + this.commonWidgetPath + this.newData[j].widgetDetailPicPath[i];
              }
            }
          }
        } else if (this.landingWidgetData[2] != undefined && this.landingWidgetData[2].widgetIndex == '4') {
          this.title4 = this.landingWidgetData[2].widgetTitle;
          this.title4Data = this.landingWidgetData[2];
          this.widget4Title = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
          +  this.landingWidgetData[2].widgetIconImage);
          this.newData = this.landingWidgetData[2]['widgetDetailVoList'];
          this.widget4Picture = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
          +  this.newData[0].widgetDetailPicPathImageLoad[0]);
          // for(let i = 0; i < this.newData.length; i++){            
          //   this.newData[i].widget4Picture = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
          //     +  this.newData[i].widgetDetailPicPathImageLoad[0]);
          // }
          for (let j = 0; j < this.newData.length; j++) {
            let widgetDetailPicPath = this.newData[j].widgetDetailPicPath;
            if (this.newData[j].widgetDetailPicPath !== null) {
              if (this.newData[j].widgetDetailPicPath.includes(',')) {
                widgetDetailPicPath = this.newData[j].widgetDetailPicPath.split(",");
                this.newData[j].widgetDetailPicPath = widgetDetailPicPath;
              } else {
                this.newData[j].widgetDetailPicPath = [this.newData[j].widgetDetailPicPath];
              }
            }
            if (this.newData[j].widgetDetailPicPath != null) {
              for (let i = 0; i < this.newData[j].widgetDetailPicPath.length; i++) {
                this.newData[j].widgetDetailPicPath[i] = this.url + this.commonWidgetPath + this.newData[j].widgetDetailPicPath[i];
              }
            }
          }
        } else if (this.landingWidgetData[1] != undefined && this.landingWidgetData[1].widgetIndex == '4') {
          this.title4 = this.landingWidgetData[1].widgetTitle;
          this.title4Data = this.landingWidgetData[1];
          this.widget4Title = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
          +  this.landingWidgetData[1].widgetIconImage);
          this.newData = this.landingWidgetData[1]['widgetDetailVoList'];
          this.widget4Picture = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
          +  this.newData[0].widgetDetailPicPathImageLoad[0]);
          // for(let i = 0; i < this.newData.length; i++){            
          //   this.newData[i].widget4Picture = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
          //     +  this.newData[i].widgetDetailPicPathImageLoad[0]);
          // }
          for (let j = 0; j < this.newData.length; j++) {
            let widgetDetailPicPath = this.newData[j].widgetDetailPicPath;
            if (this.newData[j].widgetDetailPicPath !== null) {
              if (this.newData[j].widgetDetailPicPath.includes(',')) {
                widgetDetailPicPath = this.newData[j].widgetDetailPicPath.split(",");
                this.newData[j].widgetDetailPicPath = widgetDetailPicPath;
              } else {
                this.newData[j].widgetDetailPicPath = [this.newData[j].widgetDetailPicPath];
              }
            }
            if (this.newData[j].widgetDetailPicPath != null) {
              for (let i = 0; i < this.newData[j].widgetDetailPicPath.length; i++) {
                this.newData[j].widgetDetailPicPath[i] = this.url + this.commonWidgetPath + this.newData[j].widgetDetailPicPath[i];
              }
            }
          }
        } else if (this.landingWidgetData[0] != undefined && this.landingWidgetData[0].widgetIndex == '4') {
          this.title4 = this.landingWidgetData[0].widgetTitle;
          this.title4Data = this.landingWidgetData[0];
          this.widget4Title = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
          +  this.landingWidgetData[0].widgetIconImage);
          this.newData = this.landingWidgetData[0]['widgetDetailVoList'];
          this.widget4Picture = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
          +  this.newData[0].widgetDetailPicPathImageLoad[0]);
          // for(let i = 0; i < this.newData.length; i++){            
          //   this.newData[i].widget4Picture = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
          //     +  this.newData[i].widgetDetailPicPathImageLoad[0]);
          // }
          for (let j = 0; j < this.newData.length; j++) {
            let widgetDetailPicPath = this.newData[j].widgetDetailPicPath;
            if (this.newData[j].widgetDetailPicPath !== null) {
              if (this.newData[j].widgetDetailPicPath.includes(',')) {
                widgetDetailPicPath = this.newData[j].widgetDetailPicPath.split(",");
                this.newData[j].widgetDetailPicPath = widgetDetailPicPath;
              } else {
                this.newData[j].widgetDetailPicPath = [this.newData[j].widgetDetailPicPath];
              }
            }
            if (this.newData[j].widgetDetailPicPath != null) {
              for (let i = 0; i < this.newData[j].widgetDetailPicPath.length; i++) {
                this.newData[j].widgetDetailPicPath[i] = this.url + this.commonWidgetPath + this.newData[j].widgetDetailPicPath[i];
              }
            }
          }
        }// 4th box ends 

        /************** what's new Box ends *********/
        if (this.landingWidgetData[4] != undefined && this.landingWidgetData[4].widgetIndex == '5') {
          this.title5 = this.landingWidgetData[4].widgetTitle;
          this.title5Data = this.landingWidgetData[4];
          this.widget5Title = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
          +  this.landingWidgetData[4].widgetIconImage);
          this.lastData = this.landingWidgetData[4]['widgetDetailVoList'];
          this.widget5Picture =  this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
          +  this.lastData[0].widgetDetailPicPathImageLoad[0]);
          // for(let i = 0; i < this.lastData.length; i++){            
          //   this.lastData[i].widget5Picture = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
          //     +  this.lastData[i].widgetDetailPicPathImageLoad[0]);
          // }
          for (let j = 0; j < this.lastData.length; j++) {
            let widgetDetailPicPath = this.lastData[j].widgetDetailPicPath;
            if (this.lastData[j].widgetDetailPicPath !== null) {
              if (this.lastData[j].widgetDetailPicPath.includes(',')) {
                widgetDetailPicPath = this.lastData[j].widgetDetailPicPath.split(",");
                this.lastData[j].widgetDetailPicPath = widgetDetailPicPath;
              } else {
                this.lastData[j].widgetDetailPicPath = [this.lastData[j].widgetDetailPicPath];
              }
            }
            if (this.lastData[j].widgetDetailPicPath != null) {
              for (let i = 0; i < this.lastData[j].widgetDetailPicPath.length; i++) {
                this.lastData[j].widgetDetailPicPath[i] = this.url + this.commonWidgetPath + this.lastData[j].widgetDetailPicPath[i];
              }
            }
          }
        } else if (this.landingWidgetData[3] != undefined && this.landingWidgetData[3].widgetIndex == '5') {
          this.title5 = this.landingWidgetData[3].widgetTitle;
          this.title5Data = this.landingWidgetData[3];
          this.widget5Title = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
          +  this.landingWidgetData[3].widgetIconImage);
          this.lastData = this.landingWidgetData[3]['widgetDetailVoList'];          
          this.widget5Picture =  this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
          +  this.lastData[0].widgetDetailPicPathImageLoad[0]);
          // for(let i = 0; i < this.lastData.length; i++){            
          //   this.lastData[i].widget5Picture = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
          //     +  this.lastData[i].widgetDetailPicPathImageLoad[0]);
          // }
          for (let j = 0; j < this.lastData.length; j++) {
            let widgetDetailPicPath = this.lastData[j].widgetDetailPicPath;
            if (this.lastData[j].widgetDetailPicPath !== null) {
              if (this.lastData[j].widgetDetailPicPath.includes(',')) {
                widgetDetailPicPath = this.lastData[j].widgetDetailPicPath.split(",");
                this.lastData[j].widgetDetailPicPath = widgetDetailPicPath;
              } else {
                this.lastData[j].widgetDetailPicPath = [this.lastData[j].widgetDetailPicPath];
              }
            }
            if (this.lastData[j].widgetDetailPicPath != null) {
              for (let i = 0; i < this.lastData[j].widgetDetailPicPath.length; i++) {
                this.lastData[j].widgetDetailPicPath[i] = this.url + this.commonWidgetPath + this.lastData[j].widgetDetailPicPath[i];
              }
            }
          }
        } else if (this.landingWidgetData[2] != undefined && this.landingWidgetData[2].widgetIndex == '5') {
          this.title5 = this.landingWidgetData[2].widgetTitle;
          this.title5Data = this.landingWidgetData[2];
          this.widget5Title = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
          +  this.landingWidgetData[2].widgetIconImage);
          this.lastData = this.landingWidgetData[2]['widgetDetailVoList'];
          this.widget5Picture =  this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
          +  this.lastData[0].widgetDetailPicPathImageLoad[0]);
          // for(let i = 0; i < this.lastData.length; i++){            
          //   this.lastData[i].widget5Picture = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
          //     +  this.lastData[i].widgetDetailPicPathImageLoad[0]);
          // }
          for (let j = 0; j < this.lastData.length; j++) {
            let widgetDetailPicPath = this.lastData[j].widgetDetailPicPath;
            if (this.lastData[j].widgetDetailPicPath !== null) {
              if (this.lastData[j].widgetDetailPicPath.includes(',')) {
                widgetDetailPicPath = this.lastData[j].widgetDetailPicPath.split(",");
                this.lastData[j].widgetDetailPicPath = widgetDetailPicPath;
              } else {
                this.lastData[j].widgetDetailPicPath = [this.lastData[j].widgetDetailPicPath];
              }
            }
            if (this.lastData[j].widgetDetailPicPath != null) {
              for (let i = 0; i < this.lastData[j].widgetDetailPicPath.length; i++) {
                this.lastData[j].widgetDetailPicPath[i] = this.url + this.commonWidgetPath + this.lastData[j].widgetDetailPicPath[i];
              }
            }
          }
        } else if (this.landingWidgetData[1] != undefined && this.landingWidgetData[1].widgetIndex == '5') {
          this.title5 = this.landingWidgetData[1].widgetTitle;
          this.title5Data = this.landingWidgetData[1];
          this.widget5Title = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
          +  this.landingWidgetData[1].widgetIconImage);
          this.lastData = this.landingWidgetData[1]['widgetDetailVoList'];
          this.widget5Picture =  this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
          +  this.lastData[0].widgetDetailPicPathImageLoad[0]);
          // for(let i = 0; i < this.lastData.length; i++){            
          //   this.lastData[i].widget5Picture = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
          //     +  this.lastData[i].widgetDetailPicPathImageLoad[0]);
          // }
          for (let j = 0; j < this.lastData.length; j++) {
            let widgetDetailPicPath = this.lastData[j].widgetDetailPicPath;
            if (this.lastData[j].widgetDetailPicPath !== null) {
              if (this.lastData[j].widgetDetailPicPath.includes(',')) {
                widgetDetailPicPath = this.lastData[j].widgetDetailPicPath.split(",");
                this.lastData[j].widgetDetailPicPath = widgetDetailPicPath;
              } else {
                this.lastData[j].widgetDetailPicPath = [this.lastData[j].widgetDetailPicPath];
              }
            }
            if (this.lastData[j].widgetDetailPicPath != null) {
              for (let i = 0; i < this.lastData[j].widgetDetailPicPath.length; i++) {
                this.lastData[j].widgetDetailPicPath[i] = this.url + this.commonWidgetPath + this.lastData[j].widgetDetailPicPath[i];
              }
            }
          }
        } else if (this.landingWidgetData[0] != undefined && this.landingWidgetData[0].widgetIndex == '5') {
          this.title5 = this.landingWidgetData[0].widgetTitle;
          this.title5Data = this.landingWidgetData[0];
          this.widget5Title = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
          +  this.landingWidgetData[0].widgetIconImage);
          this.lastData = this.landingWidgetData[0]['widgetDetailVoList'];
          this.widget5Picture =  this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
          +  this.lastData[0].widgetDetailPicPathImageLoad[0]);
          // for(let i = 0; i < this.lastData.length; i++){            
          //   this.lastData[i].widget5Picture = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
          //     +  this.lastData[i].widgetDetailPicPathImageLoad[0]);
          // }
          for (let j = 0; j < this.lastData.length; j++) {
            let widgetDetailPicPath = this.lastData[j].widgetDetailPicPath;
            if (this.lastData[j].widgetDetailPicPath !== null) {
              if (this.lastData[j].widgetDetailPicPath.includes(',')) {
                widgetDetailPicPath = this.lastData[j].widgetDetailPicPath.split(",");
                this.lastData[j].widgetDetailPicPath = widgetDetailPicPath;
              } else {
                this.lastData[j].widgetDetailPicPath = [this.lastData[j].widgetDetailPicPath];
              }
            }
            if (this.lastData[j].widgetDetailPicPath != null) {
              for (let i = 0; i < this.lastData[j].widgetDetailPicPath.length; i++) {
                this.lastData[j].widgetDetailPicPath[i] = this.url + this.commonWidgetPath + this.lastData[j].widgetDetailPicPath[i];
              }
            }
          }
        }
        //last Box Ends
      } catch (e) {
        console.log('catched error', e);
      }
      this.componentLoaderService.display(false);
    }, error => { console.log(error); },
      () => {
        // on complete
      });




    // Fullcalendar section
    this.options = {
      // editable: true,
      selectable: true,
      contentHeight: () => {
        if (screen.width < 768) {
          return 500;
        } else {
          return 282;
        }
      },

      header: {
        // left: 'prev,next today myCustomButton',
        // right: 'dayGridMonth,timeGridWeek,timeGridDay'
        // right: 'month,agendaWeek,agendaDay'
        left: 'prev,next',
        center: 'title',
        right: 'today'
      },

      plugins: [dayGridPlugin, interactionPlugin]
    };
    // Fullcalendar section option

    let acc = localStorage.getItem('access_token');
    if (acc !== null) {
      //  this.call();
      let today = new Date();
      this.callflashnews(today);
    }

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
  call() {
    this.approvalService.approvallist().subscribe(
      data => {
        // console.log(1);
        let requestListGetData = JSON.parse(data['_body']);
        let requestListTableDate = requestListGetData.succesObject;
        this.headerService.approvallist = requestListTableDate;
        let count = 0;
        requestListTableDate.forEach(element => {

          if (element.currentStatusId === 2) {
            // arr.push()
            count++;
          }
          this.headerService.appcount = count;
        });
      },
      error => {
        if (error.status === 401) {
          console.log('Error');
        }
      }
    );
  }

  callflashnews(datearg) {
    this.flasharr = [];
    this.landingService.load_flashNewsData().subscribe(data => {
      let flash = JSON.parse(data['_body']);
      let flashlist = flash.succesObject;
      // this.requestObj.requestDate = new Date(Response.succesObject.request.requestDate).toISOString().split('T')[0];
      flashlist.forEach(element => {
        let flashfrom = new Date(element.flashNewsValidFrom);
        let flashfromMoment = moment(flashfrom).format('DD/MM/YYYY');
        let flashto = new Date(element.flashNewsValidTo);
        let flashToMoment = moment(flashto).format('DD/MM/YYYY');
        let date = moment(Date.now()).format('DD/MM/YYYY');
        

        let flashNewsDateMoment = moment(element.flashNewsDate).format('DD/MM/YYYY');
        let flashNewsDate = new Date(element.flashNewsDate);

        if ((date == flashNewsDateMoment && date == flashToMoment) || (date > flashNewsDateMoment && date < flashToMoment)
          || (date > flashNewsDateMoment && date == flashToMoment) || (date == flashNewsDateMoment && date < flashToMoment)
          || (datearg == flashNewsDate && datearg == flashto) || (datearg > flashNewsDate && datearg < flashto)
          || (datearg > flashNewsDate && datearg == flashto) || (datearg == flashNewsDate && datearg < flashto)) {
          
          if (element.isFlashNewsActive === true) {
            this.flasharr.push(element);
          }
          
        }

        
      });

    });
  }


  gotoURL(e) {
    window.open("https://" + e, '_blank');
  }

  createDialogue(news) {
    const dialogueConfig = new MatDialogConfig();
    dialogueConfig.autoFocus = true;
    dialogueConfig.width = '80%';
    dialogueConfig.data = news;
    dialogueConfig.data.single = 'yes';
    this.dialogue.open(WidgetDetailComponent, dialogueConfig);
  }
  
  eventDragStop(model) {
    this.landingService.selectFromToDate_WidgetData(model.startStr, model.endStr).subscribe(data => {
      let postedData = JSON.parse(data['_body']);
    },
      error => {
        if (error.status === 401) {
          console.log('Error');
        }
      }
    );
  }

  clickButton(model) {
    console.log(model);
  }


  model;
  date_selected: any;
  selected_date_news: any = {};
  selectNews_Date: any = [];

  dateClick(model) {
    this.selectedDate = model.dateStr;
    this.landingService.selectDate_WidgetData(model.dateStr).subscribe(data => {
      let postedData = JSON.parse(data['_body']);
      try {
        this.landingWidgetData = postedData['succesObject'];
        if (this.landingWidgetData.length > 0 && this.landingWidgetData[0].widgetIcon != undefined) {
          this.commonWidgetPath = this.landingWidgetData[0].widgetIcon.substr(0, this.landingWidgetData[0].widgetIcon.lastIndexOf("/")) + '/';
        }
        if (this.landingWidgetData[0] != undefined && this.landingWidgetData[0].widgetIndex == '1') {
          this.title1 = this.landingWidgetData[0].widgetTitle;
          this.title1Data = this.landingWidgetData[0];
          this.newWidget = this.landingWidgetData[0]['widgetDetailVoList'];
          for (let j = 0; j < this.newWidget.length; j++) {
            let widgetDetailPicPath = this.newWidget[j].widgetDetailPicPath;
            if (this.newWidget[j].widgetDetailPicPath.includes(',')) {
              widgetDetailPicPath = this.newWidget[j].widgetDetailPicPath.split(",");
              this.newWidget[j].widgetDetailPicPath = widgetDetailPicPath;
            } else {
              this.newWidget[j].widgetDetailPicPath = [this.newWidget[j].widgetDetailPicPath];
            }
            for (let i = 0; i < this.newWidget[j].widgetDetailPicPath.length; i++) {
              this.newWidget[j].widgetDetailPicPath[i] = this.url + this.commonWidgetPath + this.newWidget[j].widgetDetailPicPath[i];
            }
          }
        } else {
          this.title1 = undefined;
          this.title1Data = undefined;
          this.newWidget = undefined;
        }
        // 1st Box ends
        if (this.landingWidgetData[1] != undefined && this.landingWidgetData[1].widgetIndex == '2') {
          this.AnounceMent = this.landingWidgetData[1]['widgetDetailVoList'];
          this.title2 = this.landingWidgetData[1].widgetTitle;
          this.title2Data = this.landingWidgetData[1];
          for (let j = 0; j < this.AnounceMent.length; j++) {
            let widgetDetailPicPath = this.AnounceMent[j].widgetDetailPicPath;
            if (this.AnounceMent[j].widgetDetailPicPath.includes(',')) {
              widgetDetailPicPath = this.AnounceMent[j].widgetDetailPicPath.split(",");
              this.AnounceMent[j].widgetDetailPicPath = widgetDetailPicPath;
            } else {
              this.AnounceMent[j].widgetDetailPicPath = [this.AnounceMent[j].widgetDetailPicPath];
            }
            for (let i = 0; i < this.AnounceMent[j].widgetDetailPicPath.length; i++) {
              this.AnounceMent[j].widgetDetailPicPath[i] = this.url + this.commonWidgetPath + this.AnounceMent[j].widgetDetailPicPath[i];
            }
          }
        } else if (this.landingWidgetData[0] != undefined && this.landingWidgetData[0].widgetIndex != undefined && this.landingWidgetData[0].widgetIndex == '2') {
          this.title2 = this.landingWidgetData[0].widgetTitle;
          this.title2Data = this.landingWidgetData[0];
          this.AnounceMent = this.landingWidgetData[0]['widgetDetailVoList'];
          for (let j = 0; j < this.AnounceMent.length; j++) {
            let widgetDetailPicPath = this.AnounceMent[j].widgetDetailPicPath;
            if (this.AnounceMent[j].widgetDetailPicPath.includes(',')) {
              widgetDetailPicPath = this.AnounceMent[j].widgetDetailPicPath.split(",");
              this.AnounceMent[j].widgetDetailPicPath = widgetDetailPicPath;
            } else {
              this.AnounceMent[j].widgetDetailPicPath = [this.AnounceMent[j].widgetDetailPicPath];
            }
            for (let i = 0; i < this.AnounceMent[j].widgetDetailPicPath.length; i++) {
              this.AnounceMent[j].widgetDetailPicPath[i] = this.url + this.commonWidgetPath + this.AnounceMent[j].widgetDetailPicPath[i];
            }
          }
        } else {
          this.title2 = undefined;
          this.title2Data = undefined;
          this.AnounceMent = undefined;
        }
        // 2nd Box ends

        if (this.landingWidgetData[2] != undefined && this.landingWidgetData[2].widgetIndex == '3') {
          this.title3 = this.landingWidgetData[2].widgetTitle;
          this.title3Data = this.landingWidgetData[2];
          this.events = this.landingWidgetData[2]['widgetDetailVoList'];
          for (let j = 0; j < this.events.length; j++) {
            let widgetDetailPicPath = this.events[j].widgetDetailPicPath;
            if (this.events[j].widgetDetailPicPath.includes(',')) {
              widgetDetailPicPath = this.events[j].widgetDetailPicPath.split(",");
              this.events[j].widgetDetailPicPath = widgetDetailPicPath;
            } else {
              this.events[j].widgetDetailPicPath = [this.events[j].widgetDetailPicPath];
            }
            for (let i = 0; i < this.events[j].widgetDetailPicPath.length; i++) {
              this.events[j].widgetDetailPicPath[i] = this.url + this.commonWidgetPath + this.events[j].widgetDetailPicPath[i];
            }
          }
        } else if (this.landingWidgetData[1] != undefined && this.landingWidgetData[1].widgetIndex == '3') {
          this.title3 = this.landingWidgetData[1].widgetTitle;
          this.title3Data = this.landingWidgetData[1];
          this.events = this.landingWidgetData[1]['widgetDetailVoList'];
          for (let j = 0; j < this.events.length; j++) {
            let widgetDetailPicPath = this.events[j].widgetDetailPicPath;
            if (this.events[j].widgetDetailPicPath.includes(',')) {
              widgetDetailPicPath = this.events[j].widgetDetailPicPath.split(",");
              this.events[j].widgetDetailPicPath = widgetDetailPicPath;
            } else {
              this.events[j].widgetDetailPicPath = [this.events[j].widgetDetailPicPath];
            }
            for (let i = 0; i < this.events[j].widgetDetailPicPath.length; i++) {
              this.events[j].widgetDetailPicPath[i] = this.url + this.commonWidgetPath + this.events[j].widgetDetailPicPath[i];
            }
          }
        } else if (this.landingWidgetData[0] != undefined && this.landingWidgetData[0].widgetIndex == '3') {
          this.title3 = this.landingWidgetData[0].widgetTitle;
          this.title3Data = this.landingWidgetData[0];
          this.events = this.landingWidgetData[0]['widgetDetailVoList'];
          for (let j = 0; j < this.events.length; j++) {
            let widgetDetailPicPath = this.events[j].widgetDetailPicPath;
            if (this.events[j].widgetDetailPicPath.includes(',')) {
              widgetDetailPicPath = this.events[j].widgetDetailPicPath.split(",");
              this.events[j].widgetDetailPicPath = widgetDetailPicPath;
            } else {
              this.events[j].widgetDetailPicPath = [this.events[j].widgetDetailPicPath];
            }
            for (let i = 0; i < this.events[j].widgetDetailPicPath.length; i++) {
              this.events[j].widgetDetailPicPath[i] = this.url + this.commonWidgetPath + this.events[j].widgetDetailPicPath[i];
            }
          }
        } else {
          this.title3 = undefined;
          this.title3Data = undefined;
          this.events = undefined;
        }
        // 3rd Box ends
        if (this.landingWidgetData[3] != undefined && this.landingWidgetData[3].widgetIndex == '4') {
          this.title4 = this.landingWidgetData[3].widgetTitle;
          this.title4Data = this.landingWidgetData[3];
          this.newData = this.landingWidgetData[3]['widgetDetailVoList'];
          for (let j = 0; j < this.newData.length; j++) {
            let widgetDetailPicPath = this.newData[j].widgetDetailPicPath;
            if (this.newData[j].widgetDetailPicPath.includes(',')) {
              widgetDetailPicPath = this.newData[j].widgetDetailPicPath.split(",");
              this.newData[j].widgetDetailPicPath = widgetDetailPicPath;
            } else {
              this.newData[j].widgetDetailPicPath = [this.newData[j].widgetDetailPicPath];
            }
            for (let i = 0; i < this.newData[j].widgetDetailPicPath.length; i++) {
              this.newData[j].widgetDetailPicPath[i] = this.url + this.commonWidgetPath + this.newData[j].widgetDetailPicPath[i];
            }
          }
        } else if (this.landingWidgetData[2] != undefined && this.landingWidgetData[2].widgetIndex != undefined && this.landingWidgetData[2].widgetIndex == '4') {
          this.title4 = this.landingWidgetData[2].widgetTitle;
          this.title4Data = this.landingWidgetData[2];
          this.newData = this.landingWidgetData[2]['widgetDetailVoList'];
          for (let j = 0; j < this.newData.length; j++) {
            let widgetDetailPicPath = this.newData[j].widgetDetailPicPath;
            if (this.newData[j].widgetDetailPicPath.includes(',')) {
              widgetDetailPicPath = this.newData[j].widgetDetailPicPath.split(",");
              this.newData[j].widgetDetailPicPath = widgetDetailPicPath;
            } else {
              this.newData[j].widgetDetailPicPath = [this.newData[j].widgetDetailPicPath];
            }
            for (let i = 0; i < this.newData[j].widgetDetailPicPath.length; i++) {
              this.newData[j].widgetDetailPicPath[i] = this.url + this.commonWidgetPath + this.newData[j].widgetDetailPicPath[i];
            }
          }
        } else if (this.landingWidgetData[1] != undefined && this.landingWidgetData[1].widgetIndex != undefined && this.landingWidgetData[1].widgetIndex == '4') {
          this.title4 = this.landingWidgetData[4].widgetTitle;
          this.title4Data = this.landingWidgetData[4];
          this.newData = this.landingWidgetData[1]['widgetDetailVoList'];
          for (let j = 0; j < this.newData.length; j++) {
            let widgetDetailPicPath = this.newData[j].widgetDetailPicPath;
            if (this.newData[j].widgetDetailPicPath.includes(',')) {
              widgetDetailPicPath = this.newData[j].widgetDetailPicPath.split(",");
              this.newData[j].widgetDetailPicPath = widgetDetailPicPath;
            } else {
              this.newData[j].widgetDetailPicPath = [this.newData[j].widgetDetailPicPath];
            }
            for (let i = 0; i < this.newData[j].widgetDetailPicPath.length; i++) {
              this.newData[j].widgetDetailPicPath[i] = this.url + this.commonWidgetPath + this.newData[j].widgetDetailPicPath[i];
            }
          }
        } else if (this.landingWidgetData[0] != undefined && this.landingWidgetData[0].widgetIndex != undefined && this.landingWidgetData[0].widgetIndex == '4') {
          this.title4 = this.landingWidgetData[0].widgetTitle;
          this.title4Data = this.landingWidgetData[0];
          this.newData = this.landingWidgetData[0]['widgetDetailVoList'];
          for (let j = 0; j < this.newData.length; j++) {
            let widgetDetailPicPath = this.newData[j].widgetDetailPicPath;
            if (this.newData[j].widgetDetailPicPath.includes(',')) {
              widgetDetailPicPath = this.newData[j].widgetDetailPicPath.split(",");
              this.newData[j].widgetDetailPicPath = widgetDetailPicPath;
            } else {
              this.newData[j].widgetDetailPicPath = [this.newData[j].widgetDetailPicPath];
            }
            for (let i = 0; i < this.newData[j].widgetDetailPicPath.length; i++) {
              this.newData[j].widgetDetailPicPath[i] = this.url + this.commonWidgetPath + this.newData[j].widgetDetailPicPath[i];
            }
          }
        } else {
          this.title4 = undefined;
          this.title4Data = undefined;
          this.newData = undefined;
        }
        // what's new Box ends
        if (this.landingWidgetData[4] != undefined && this.landingWidgetData[4].widgetIndex == '5') {
          this.title5 = this.landingWidgetData[4].widgetTitle;
          this.title5Data = this.landingWidgetData[4];
          this.lastData = this.landingWidgetData[4]['widgetDetailVoList'];
          for (let j = 0; j < this.lastData.length; j++) {
            let widgetDetailPicPath = this.lastData[j].widgetDetailPicPath;
            if (this.lastData[j].widgetDetailPicPath.includes(',')) {
              widgetDetailPicPath = this.lastData[j].widgetDetailPicPath.split(",");
              this.lastData[j].widgetDetailPicPath = widgetDetailPicPath;
            } else {
              this.lastData[j].widgetDetailPicPath = [this.lastData[j].widgetDetailPicPath];
            }
            for (let i = 0; i < this.lastData[j].widgetDetailPicPath.length; i++) {
              this.lastData[j].widgetDetailPicPath[i] = this.url + this.commonWidgetPath + this.lastData[j].widgetDetailPicPath[i];
            }
          }
        } else if (this.landingWidgetData[3] != undefined && this.landingWidgetData[3].widgetIndex != undefined && this.landingWidgetData[3].widgetIndex == '5') {
          this.title5 = this.landingWidgetData[3].widgetTitle;
          this.title5Data = this.landingWidgetData[3];
          this.lastData = this.landingWidgetData[3]['widgetDetailVoList'];
          for (let j = 0; j < this.lastData.length; j++) {
            let widgetDetailPicPath = this.lastData[j].widgetDetailPicPath;
            if (this.lastData[j].widgetDetailPicPath.includes(',')) {
              widgetDetailPicPath = this.lastData[j].widgetDetailPicPath.split(",");
              this.lastData[j].widgetDetailPicPath = widgetDetailPicPath;
            } else {
              this.lastData[j].widgetDetailPicPath = [this.lastData[j].widgetDetailPicPath];
            }
            for (let i = 0; i < this.lastData[j].widgetDetailPicPath.length; i++) {
              this.lastData[j].widgetDetailPicPath[i] = this.url + this.commonWidgetPath + this.lastData[j].widgetDetailPicPath[i];
            }
          }
        } else if (this.landingWidgetData[2] != undefined && this.landingWidgetData[2].widgetIndex != undefined && this.landingWidgetData[2].widgetIndex == '5') {
          this.title5 = this.landingWidgetData[2].widgetTitle;
          this.title5Data = this.landingWidgetData[2];
          this.lastData = this.landingWidgetData[2]['widgetDetailVoList'];
          for (let j = 0; j < this.lastData.length; j++) {
            let widgetDetailPicPath = this.lastData[j].widgetDetailPicPath;
            if (this.lastData[j].widgetDetailPicPath.includes(',')) {
              widgetDetailPicPath = this.lastData[j].widgetDetailPicPath.split(",");
              this.lastData[j].widgetDetailPicPath = widgetDetailPicPath;
            } else {
              this.lastData[j].widgetDetailPicPath = [this.lastData[j].widgetDetailPicPath];
            }
            for (let i = 0; i < this.lastData[j].widgetDetailPicPath.length; i++) {
              this.lastData[j].widgetDetailPicPath[i] = this.url + this.commonWidgetPath + this.lastData[j].widgetDetailPicPath[i];
            }
          }
        } else if (this.landingWidgetData[1] != undefined && this.landingWidgetData[1].widgetIndex != undefined && this.landingWidgetData[1].widgetIndex == '5') {
          this.title5 = this.landingWidgetData[1].widgetTitle;
          this.title5Data = this.landingWidgetData[1];
          this.lastData = this.landingWidgetData[1]['widgetDetailVoList'];
          for (let j = 0; j < this.lastData.length; j++) {
            let widgetDetailPicPath = this.lastData[j].widgetDetailPicPath;
            if (this.lastData[j].widgetDetailPicPath.includes(',')) {
              widgetDetailPicPath = this.lastData[j].widgetDetailPicPath.split(",");
              this.lastData[j].widgetDetailPicPath = widgetDetailPicPath;
            } else {
              this.lastData[j].widgetDetailPicPath = [this.lastData[j].widgetDetailPicPath];
            }
            for (let i = 0; i < this.lastData[j].widgetDetailPicPath.length; i++) {
              this.lastData[j].widgetDetailPicPath[i] = this.url + this.commonWidgetPath + this.lastData[j].widgetDetailPicPath[i];
            }
          }
        } else if (this.landingWidgetData[0] != undefined && this.landingWidgetData[0].widgetIndex != undefined && this.landingWidgetData[0].widgetIndex == '5') {
          this.title5 = this.landingWidgetData[0].widgetTitle;
          this.title5Data = this.landingWidgetData[0];
          this.lastData = this.landingWidgetData[0]['widgetDetailVoList'];
          for (let j = 0; j < this.lastData.length; j++) {
            let widgetDetailPicPath = this.lastData[j].widgetDetailPicPath;
            if (this.lastData[j].widgetDetailPicPath.includes(',')) {
              widgetDetailPicPath = this.lastData[j].widgetDetailPicPath.split(",");
              this.lastData[j].widgetDetailPicPath = widgetDetailPicPath;
            } else {
              this.lastData[j].widgetDetailPicPath = [this.lastData[j].widgetDetailPicPath];
            }
            for (let i = 0; i < this.lastData[j].widgetDetailPicPath.length; i++) {
              this.lastData[j].widgetDetailPicPath[i] = this.url + this.commonWidgetPath + this.lastData[j].widgetDetailPicPath[i];
            }
          }
        } else {
          this.title5 = undefined;
          this.title5Data = undefined;
          this.lastData = undefined;
        }
        } catch (e) {
        console.log('catched error', e);
      }


    });
    this.callflashnews(model.date);
  }

  updateEvents() {
    this.eventsModel = [{
      title: 'Updaten Event',
      start: this.yearMonth + '-08',
      end: this.yearMonth + '-10'
    }];
  }

  get yearMonth(): string {
    const dateObj = new Date();
    return dateObj.getUTCFullYear() + '-' + (dateObj.getUTCMonth() + 1);
  }

  allEventsPopup(message) {
    const dialogueConfig = new MatDialogConfig();
    dialogueConfig.autoFocus = true;
    dialogueConfig.width = '80%';
    dialogueConfig.data = message.widgetDetailVoList;
    this.dialogue.open(WidgetDetailComponent, dialogueConfig);

  }

  holidayEvent() {
    const dialogRef = this.dialogue.open(HolidayCalendarPopupComponent, {
      disableClose: false,
      panelClass: 'btnCenter',
      width: 'auto',
      data: {
        title: 'Info',
        message: 'any',
      }
    });
  }
}


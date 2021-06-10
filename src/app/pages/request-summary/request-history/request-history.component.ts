import { Component, OnInit, OnDestroy } from '@angular/core';
import { RequestHistoryService } from './request-history.service';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatDialog } from '@angular/material';
import { PersonalSearchDialogComponent } from '../personal-request/personal-search-dialog/personal-search-dialog.component';
import { JsonApiService } from 'src/assets/api/json-api.service';

@Component({
  selector: 'app-request-history',
  templateUrl: './request-history.component.html',
  // styleUrls: ['./request-history.component.css'],
  styleUrls: ['./request-history-srmav.component.css'],

  animations: [
    trigger('expandPanel', [
      state('active', style({
        // height: '240px',
        opacity: 1,
        display: 'block'
      })),
      state('inactive', style({
        height: 0,
        opacity: 0,
        display: 'none'
      })),
      transition('active => inactive', animate('100ms ease-in')),
      transition('inactive => active', animate('200ms ease-in')),
    ])
  ]
})
export class RequestHistoryComponent implements OnInit {

  //Local Variable Declarations
  requestList: any = [];
  requestList1: any=[];
  page = 0;
  size = 4;
  requestAllList: any = [];
  countList : any [];
  appobjlength : number;
  term: any = '';
  dashboard: any = 'inactive';
  viewboard: any = 'inactive';
  RecordEnable: Boolean;
  RecordEnable2: Boolean;
  labels:any = {};
  displayUserName: string;
 

  constructor(private appService: RequestHistoryService,
    private router: Router,
    private dialog: MatDialog,
    private jsonApiService: JsonApiService) { }

  ngOnInit() {
    localStorage.removeItem('resolverActive');
   this.getList();
   this.getDashboardCount();
   this.dashboard = 'active';
    this.viewboard= 'inactive';
    this.getLabelDetails();
    this.displayUserName = localStorage.getItem('userName');
  }
  /**** LABEL CHNAGES ****/
  getLabelDetails() {
    let lang;
    if(localStorage.getItem('langCode') !== null){
      lang = localStorage.getItem('langCode');
    }
    this.jsonApiService
      .fetch('/'+lang+'.json')
      .subscribe((data) => {
        this.labels = data;
      });
  }
  getData(obj) {
    let index=0,
        startingIndex=obj.pageIndex * obj.pageSize,
        endingIndex=startingIndex + obj.pageSize;

    this.requestList1 = this.requestList.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
  }

  getList(){
    this.appService.reqList().subscribe(data => {
      let GetData = JSON.parse(data['_body']);
      this.requestList = GetData.succesObject;
      let index=0,
        startingIndex= 0 * 4,
        endingIndex=startingIndex + 4;        
      if(this.requestList.length > 0){
        for(let i = 0 ; i < this.requestList.length ; i++){
          if(this.requestList[i].requestPriority ==  "1" ){
            this.requestList[i].requestPriorityName = "low";
          }
          if(this.requestList[i].requestPriority ==  "2" ){
            this.requestList[i].requestPriorityName = "medium";
          }
          if(this.requestList[i].requestPriority ==  "3" ){
            this.requestList[i].requestPriorityName = "high";
          }
        }
      }
      this.requestList1 = this.requestList.filter(() => {
        index++;
        return (index > startingIndex && index <= endingIndex) ? true : false;
      });  
      if(this.requestList.length !== 0){
        this.RecordEnable = true;
        this.RecordEnable2 = false;
      }else{
        this.RecordEnable = false;
        this.RecordEnable2 = true;
      }

    },
      error => {
        console.log(error);
      });
  }

  getAllList(tt) {
    localStorage.removeItem('requestId');
    localStorage.removeItem('request-history');
    this.requestAllList = [];
    this.appService.reqAllList(tt.requestId).subscribe(data => {
      let GetAllData = JSON.parse(data['_body']);
      this.requestAllList.push(GetAllData.succesObject);
      localStorage.setItem('request-history', 'active');
      this.dashboard = 'inactive';
      this.viewboard= 'active';
      let requestId = GetAllData.succesObject.request.requestId;
      localStorage.setItem('requestId', requestId);
      localStorage.setItem('summaryUrl', this.router.url);
      //this.router.navigate(['/request/request-view']);
    },
      error => {
        console.log(error);
      });

  }

  getDashboardCount(){
    this.appService.count().subscribe(data => {
      let GetData = JSON.parse(data['_body']);
      this.countList = GetData.succesObject.statuswiseList;

    },
      error => {
        console.log(error);
      });
  }

  refresh(){   
    this.getList();
    this.getDashboardCount();
    this.viewboard = 'inactive';
    this.dashboard = 'active';
  }

  dialogOpen() {
    const dialogRef = this.dialog.open(PersonalSearchDialogComponent,
      {
        disableClose: false,
        panelClass: 'full-width-dialog',
        data: '1'
      });

    dialogRef.afterClosed().subscribe(result => {

      if(result !== true){
        let finalSearchData = {};
      let formValue = result;

      for (let i = 0; i < formValue.searchDatas.length; i++) {
        let key = formValue.searchDatas[i]['dropDownVal'];
        let value = formValue.searchDatas[i]['textVal'];
        let fullValue = {}
        if (key != '' && value != '') {
          fullValue[key] = value;
          Object.assign(finalSearchData, fullValue);
        }
      }

      this.appService.searchRequest(finalSearchData).subscribe(data => {
        let reqScrConfigSearchData = JSON.parse(data['_body']);
        this.requestList = reqScrConfigSearchData.succesObject;
        let index=0,
        startingIndex= 0 * 4,
        endingIndex=startingIndex + 4;         
      if(this.requestList.length > 0){
        for(let i = 0 ; i < this.requestList.length ; i++){
          if(this.requestList[i].requestPriority ==  "1" ){
            this.requestList[i].requestPriorityName = "low";
          }
          if(this.requestList[i].requestPriority ==  "2" ){
            this.requestList[i].requestPriorityName = "medium";
          }
          if(this.requestList[i].requestPriority ==  "3" ){
            this.requestList[i].requestPriorityName = "high";
          }
        }
      }
      this.requestList1 = this.requestList.filter(() => {
        index++;
        return (index > startingIndex && index <= endingIndex) ? true : false;
      });
        if(this.requestList.length !== 0){
          this.RecordEnable = true;
          this.RecordEnable2 = false;
        }else{
          this.RecordEnable = false;
          this.RecordEnable2 = true;
        }
      
      });
    }
    });
    
  }

  ngOnDestroy(){
    localStorage.removeItem('request-history');
    localStorage.removeItem('requestId');
    localStorage.removeItem('summaryUrl');
  }
 
}



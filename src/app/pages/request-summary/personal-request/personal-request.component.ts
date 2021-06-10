import { Component, OnInit, OnDestroy } from '@angular/core';
import { PersonalRequestService } from './personal-request.service';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ThirdPartyDraggable } from '@fullcalendar/interaction';
import { PersonalSearchDialogComponent } from './personal-search-dialog/personal-search-dialog.component';
import { MatPaginator, MatSort, MatTableDataSource, VERSION, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { JsonApiService } from 'src/assets/api/json-api.service';
import { ComponentLoaderService } from 'src/app/shared/component-loader.service';
// import { Chart } from 'chart.js';

@Component({
  selector: 'app-personal-request',
  templateUrl: './personal-request.component.html',
  // styleUrls: ['./personal-request.component.css'],
  styleUrls: ['./personal-request-srmav.component.css'],

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


export class PersonalRequestComponent implements OnInit {

  //Local Variable Declarations
  requestList: any = [];
  requestList1: any = [];
  requestAllList: any = [];
  countList: any[];
  appobjlength: number;
  dashboard: any = 'inactive';
  viewboard: any = 'inactive';
  term: any = '';
  donutChartData = [];
  formBuilder: any;
  RecordEnable: Boolean;
  RecordEnable2: Boolean;
  labels: any = {};

  page = 0;
  size =4;

  constructor(private appService: PersonalRequestService,
    private router: Router, private dialog: MatDialog, 
    private jsonApiService: JsonApiService,
    private componentLoaderService: ComponentLoaderService) { }

  ngOnInit() {
    this.componentLoaderService.display(false);
    this.dashboard = 'active';
    this.viewboard = 'inactive';
    this.getList();
    this.getDashboardCount();
    localStorage.removeItem('resolverActive');
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
  getData(obj) {
    let index=0,
        startingIndex=obj.pageIndex * obj.pageSize,
        endingIndex=startingIndex + obj.pageSize;

    this.requestList1 = this.requestList.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
  }

  getList() {
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

  applyFilter(filterValue: string) {
    this.requestList.filter = filterValue.trim().toLowerCase();
  }

  sequenceType() {
    return this.formBuilder.group({
      dropDownVal: [""],
      textVal: [""]
    });
  }

  getAllList(tt) {
    localStorage.removeItem('requestId');
    localStorage.removeItem('my-request');
    this.requestAllList = [];
    this.appService.reqAllList(tt.requestId).subscribe(data => {
      let GetAllData = JSON.parse(data['_body']);
      this.requestAllList.push(GetAllData.succesObject);
      this.dashboard = 'inactive';
      this.viewboard = 'active';
      let requestId = GetAllData.succesObject.request.requestId;
      localStorage.setItem('requestId', requestId);
      localStorage.setItem('my-request','active');
      localStorage.setItem('summaryUrl', this.router.url);
      //this.router.navigate(['/request/request-view']);
    },
      error => {
        console.log(error);
      });

  }

  getDashboardCount() {
    this.appService.count().subscribe(data => {
      let GetData = JSON.parse(data['_body']);
      this.countList = GetData.succesObject;
      // this.donutChartData = [];
      // for (let i in this.countList) {
      //   let jsonval: any = {};
      //   if (this.countList[i].subtypeCount !== undefined) {
      //     jsonval.label = this.countList[i].requestSubtypeName;
      //     jsonval.value = this.countList[i].subtypeCount;
      //     jsonval.color = 'red';
      //     this.donutChartData.push(jsonval);
      //   }
      // }

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

  back(){
    
    this.dashboard= 'inactive';
    this.viewboard = 'active';
    }

    ngOnDestroy(){
      localStorage.removeItem('my-request');
      localStorage.removeItem('summaryUrl');
      localStorage.removeItem('requestId');
    }
  }


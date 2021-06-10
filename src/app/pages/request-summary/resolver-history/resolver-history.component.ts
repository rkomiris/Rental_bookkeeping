import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { PersonalRequestService } from '../personal-request/personal-request.service';
import { Router } from '@angular/router';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ResolverHistoryService } from './resolver-history.service';
import { RequestResolverModifyService } from '../../request-resolver/request-resolver-modify/request-resolver-modify.service';
import { Subscription } from 'rxjs';
import { RequestScrconfigAddService } from '../../request-scrconfig/request-scrconfig-add/request-scrconfig-add.service';
import { id } from '@swimlane/ngx-charts/release/utils';
import { ComponentLoaderService } from 'src/app/shared/component-loader.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { PersonalSearchDialogComponent } from '../personal-request/personal-search-dialog/personal-search-dialog.component';
import { RequestService } from '../../request/request.service';
import { JsonApiService } from 'src/assets/api/json-api.service';
import { HeaderService } from 'src/app/shared/layout/app-layout/header/header.service';
import * as moment from 'moment';

@Component({
  selector: 'app-resolver-history',
  templateUrl: './resolver-history.component.html',
  // styleUrls: ['./resolver-history.component.css'],
  styleUrls: ['./resolver-history-srmav.component.css'],
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

export class ResolverHistoryComponent implements OnInit {

  //Local Variables
  requestList: any = [];
  requestAllList: any = [];
  countList: any[];
  appobjlength: number;
  dashboard: any = 'inactive';
  viewboard: any = 'inactive';
  term: any = '';
  formBuilder: any;
  RecordEnable: Boolean;
  RecordEnable2: Boolean;
  subscriptionlist: Subscription[] = [];
  screenActive: string = 'active';
  requestList1: any = [];
  page = 0;
  size = 4;

  requestTypeList: any = [];
  priorityCombo: any = [];
  locationList: any = [];
  userBaseFieldName: any = [];
  seqmodel: any = {};
  requestSubTypeList: any;
  display = true;
  seq = false;
  aftersubmit = false;
  subLocationList: any = [];
  requestBaseFieldName: any = [];
  dataSource: any = [];
  userDropDown: any = [];
  formDetails: any = [];
  viewboard2: Boolean;
  remarks: any = null;
  reassignUserId: any = '';
  labels: any = {};
  displayUserName;
  checkboxvalidation = false;
  checkboxvalidationfieldname = '';

  displayNoRecords: Boolean;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private appService: ResolverHistoryService,
    private router: Router, 
    private requestResolverService: RequestResolverModifyService,
    private requestScrconfigAddService: RequestScrconfigAddService,
    private requestModifyService: RequestService,
    private dialog: MatDialog,
    private componentLoaderService: ComponentLoaderService,
    private jsonApiService: JsonApiService,
    private headerService: HeaderService) { }

  ngOnInit() {
    localStorage.setItem("resolverActive", this.screenActive);
    this.dashboard = 'active';
    this.viewboard = 'inactive';
    this.viewboard2= false;
    this.getList();
    this.onloadDropdownData();
    this.getDashboardCount();
    this.getLabelDetails();
    // this.displayUserName = this.headerService.userName();
    this.displayUserName = localStorage.getItem('userFullName');
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
  isSelected(val, json) {
    if (json.objectList === null) {
      json.objectList = [];
    }
    if (json.requestScreenDetailConfigurationIsActive === true && json.objectList.length === 0) {
      this.checkboxvalidation = true;
    } else {
      this.checkboxvalidation = false;
    }
    return json.objectList.indexOf(val) >= 0;
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
      this.viewboard2= false;
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

  getDashboardCount(){
    this.appService.count().subscribe(data => {
      let GetData = JSON.parse(data['_body']);
      this.countList = GetData.succesObject;
    },
    error => {
      console.log(error);
    });
  }

  applyFilter(filterValue: string) {
    this.requestList.filter = filterValue.trim().toLowerCase();
  }

  onloadDropdownData() {
    this.requestResolverService.getDropdownData().subscribe(
      data => {
        let resp = JSON.parse(data['_body']);
        this.requestTypeList = resp.succesObject;
      },
      error => {
        if (error.status === 401) {
          console.log('Error');
        }
        console.log(error);
      }
    );

    this.priorityCombo = [
      { id: 3, Value: 'High' },
      { id: 2, Value: 'Medium' },
      { id: 1, Value: 'Low' }
    ];
    
    this.requestResolverService.load_selectBox_LocationData().subscribe(
      data => {
        let resp = JSON.parse(data['_body']);
        this.locationList = resp.succesObject;
      },
      error => {
        if (error.status === 401) {
          console.log('Error');
        }
      }
    );
  }

  getAllList(request){
    this.dashboard = 'inactive';
    this.viewboard = 'active';
    this.viewboard2=true;
    // this.requestBaseFieldName = ['userName', 'approvalExecuter', 'descisionType','approvedon', 'Sla', 'remarks' , 'forwardRedirectRemarks'];

    /****** ******/
    let requestDetailsSub = this.requestResolverService
      .loadRequestDetailsById(request.requestId)
      .subscribe(
        data => {
          let datalist = JSON.parse(data['_body']);

          let listData = datalist.succesObject;
          this.userBaseFieldName = datalist.authSuccesObject.screenFieldDisplayVoList.map(
            element => {
              return element;
            }
          );

          this.seqmodel = datalist.succesObject.request;
          this.seqmodel.requestDetailList = datalist.succesObject.requestDetailList;
          if (this.seqmodel.requestToDate !== null) {
          this.seqmodel.requestToDate = new Date(this.seqmodel.requestToDate);
          }
          if (this.seqmodel.requestFromDate !== null) {
            this.seqmodel.requestFromDate = new Date(this.seqmodel.requestFromDate);

          }
          if (this.seqmodel.createdDate !== null) {
            // this.seqmodel.createdDate = new Date(this.seqmodel.createdDate);
            this.seqmodel.createdDate = moment(this.seqmodel.createdDate).format('MMM,DD YYYY hh:mm a');

          }
          this.seqmodel.requestDate = new Date(this.seqmodel.requestDate);

          this.getSubTypeList(this.seqmodel.requestTypeId);
          this.display = false;
          // this.dataSource = new MatTableDataSource(datalist.succesObject.requestWorkFlowAuditVoList);
          // this.dataSource.paginator = this.paginator;
          // this.dataSource.sort = this.sort;
          debugger
          this.requestBaseFieldName = ['userName', 'approvalExecuter', 'Status', 'approvedon','Sla', 'remarks','forwardRedirectRemarks'];
          this.dataSource = new MatTableDataSource(datalist.succesObject.requestWorkFlowAuditVoList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.requestResolverService.load_selectBox_subLocationData(this.seqmodel.id).subscribe(data1 => {
            let subLoca = JSON.parse(data1['_body']);
            this.subLocationList = subLoca.succesObject;
          });
          this.seq = true;
          this.componentLoaderService.display(false);
        },
        error => {
          console.log(error);
        }
      );
    // let resolverList = this.appService.loadResolverList(request.requestId)
    //   .subscribe(
    //     data => {
    //       this.requestBaseFieldName = ['userName', 'approvalExecuter', 'descisionType', 'remarks' , 'approvedon', 'Sla'];
    //       let datalist = JSON.parse(data['_body']);
    //       if(datalist.succesObject !== null){
    //         this.dataSource = new MatTableDataSource(datalist.succesObject);
    //       this.dataSource.paginator = this.paginator;
    //       this.dataSource.sort = this.sort;
    //       this.displayNoRecords = true;
    //       }else{
    //         this.displayNoRecords = false;
    //       }
          
         
    //     },
    //     error => {
    //     });
    let resolversubmitDetails = this.requestResolverService
      .loadsubmitDetails(request.requestId).subscribe(
        data => {
          let datalist = JSON.parse(data['_body']);
         this.formDetails = datalist.succesObject[0].requestWorkFlowAuditVo;
          // this.remarks = this.formDetails.remarks;
        },
        error => {
        });
    let userDropdownList = this.requestResolverService
      .userDropdownData()
      .subscribe(
        data => {
          let datalist = JSON.parse(data['_body']);
          this.userDropDown = datalist.succesObject;
        },
        error => {
        });
    this.subscriptionlist.push(requestDetailsSub);
    
  }

  getSubTypeList(eve) {
    this.requestScrconfigAddService.getSubTypeList(eve).subscribe(
      data => {
        let resp = JSON.parse(data['_body']);
        this.requestSubTypeList = resp.succesObject;
      },
      error => {
        console.log(error);
      }
    );
  }

  completedAction() {
    this.formDetails.descisionType = "4";
    this.formDetails.remarks = this.remarks;
    this.componentLoaderService.display(true);

    this.formDetails.screenFieldDisplayVoList = this.userBaseFieldName;

    let completedAction = this.requestResolverService
      .updateResolverData(this.formDetails)
      .subscribe(
        data => {
          let datalist = JSON.parse(data['_body']);
          if(datalist.responseCode == '200'){
            const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
              disableClose: false,
              panelClass: 'btnCenter',
              width: 'auto',
              data: {
                message: datalist.responseMessage,
                btnYes: 'OK',
              }
            });
            dialogRef.afterClosed().subscribe( data => {
              //this.router.navigate(['/request-resolver']);
              this.refresh();
              this.getList();
            });
          }else{
            const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
              disableClose: false,
              panelClass: 'btnCenter',
              width: 'auto',
              data: {
                message: datalist.responseMessage,
                btnYes: 'OK',
              }
            });
          }
          this.componentLoaderService.display(false);
        },
        error => {
        });
  }



  inProgressAction() {
    this.formDetails.descisionType = "5";
    this.formDetails.remarks = this.remarks;
    this.componentLoaderService.display(true);

    this.formDetails.screenFieldDisplayVoList = this.userBaseFieldName;

    let completedAction = this.requestResolverService
      .updateResolverData(this.formDetails)
      .subscribe(
        data => {
          let datalist = JSON.parse(data['_body']);
          if(datalist.responseCode == '200'){
          const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            disableClose: false,
            panelClass: 'btnCenter',
            width: 'auto',
            data: {
              message: datalist.responseMessage,
              btnYes: 'OK',
            }
          });
          dialogRef.afterClosed().subscribe( data => {
            this.refresh();
            this.getList();
            //this.router.navigate(['/request-resolver']);
          });
        }else{
          const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            disableClose: false,
            panelClass: 'btnCenter',
            width: 'auto',
            data: {
              message: datalist.responseMessage,
              btnYes: 'OK',
            }
          });
        }
          this.componentLoaderService.display(false);
        },
        error => {
        });
  }




  reassignAction() {
    if (this.reassignUserId == '') {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        panelClass: 'btnCenter',
        width: 'auto',
        data: {
          title: 'Alert',
          message: 'reassignUser',
          btnYes: 'OK',
        }
      });
    } else {
      this.formDetails.descisionType = "6";
      this.formDetails.remarks = this.remarks;
      this.formDetails.reassignFlag = '1';
      this.formDetails.reassignUserId = this.reassignUserId;
      this.componentLoaderService.display(true);

      this.formDetails.screenFieldDisplayVoList = this.userBaseFieldName;

      let completedAction = this.requestResolverService
        .updateResolverData(this.formDetails)
        .subscribe(
          data => {
            let datalist = JSON.parse(data['_body']);
            if(datalist.responseCode == '200'){
              const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                disableClose: false,
                panelClass: 'btnCenter',
                width: 'auto',
                data: {
                  message: datalist.responseMessage,
                  btnYes: 'OK',
                }
              });
              dialogRef.afterClosed().subscribe( data => {
                this.refresh();
                this.getList();
               // this.router.navigate(['/request-resolver']);
              });
            }else{
              const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                disableClose: false,
                panelClass: 'btnCenter',
                width: 'auto',
                data: {
                  message: datalist.responseMessage,
                  btnYes: 'OK',
                }
              });
            }
            this.componentLoaderService.display(false);
          },
          error => {
          });
    }
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

  download(event){
    if(this.seqmodel.requestAttachment !== null){
      this.requestModifyService.picDownloadFn( event ).subscribe(
        data => {
          let headers = data.headers;
          let contentType =
            headers.get("Content-type") || "application/octet-stream";
          let fileHeaders = headers.get("Content-Disposition");
          // let startIndex = fileHeaders.indexOf("filename =") + 11; // Adjust '+ 10' if filename is not the right one.
          // let endIndex = fileHeaders.length - 1; // Check if '- 1' is necessary
          // let filename = fileHeaders.substring(startIndex, endIndex);
          let filename = this.seqmodel.requestAttachment;
          let urlCreator =
            window.URL ||
            (<any>window).webkitURL ||
            (<any>window).mozURL ||
            (<any>window).msURL;
          if (urlCreator) {
            let blob = new Blob([data["body"]], { type: contentType });
            let url = urlCreator.createObjectURL(blob);
            let a = document.createElement("a");
            document.body.appendChild(a);
            a.style.display = "none";
            a.href = url;
            a.download = filename; // you may assign this value from header as well
            a.click();
            window.URL.revokeObjectURL(url);
          }
        },
        error => {
          if (error.status === 401) {
          }
          console.log(error);
        });
    }else{
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        panelClass: 'btnCenter',
        width: 'auto',
        data: {
          title: 'Alert',
          message: 'No attachment Found',
          btnYes: 'OK',
        }
      });
    }
    
  
  }

  back(){
    this.dashboard = 'active';
    this.viewboard = 'inactive';
    this.getDashboardCount();
  }

  ngOnDestroy(){
    localStorage.removeItem('resolverActive');
  }

}

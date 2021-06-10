import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { RequestApprovalService } from './request-approval.service';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import {
  MatTableDataSource, MatPaginator,
  MatSort,
  MatDialog,
} from '@angular/material';

import { ApprovalService } from '../../approval/approval.service';
import { ComponentLoaderService } from 'src/app/shared/component-loader.service';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
//import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { PersonalSearchDialogComponent } from '../personal-request/personal-search-dialog/personal-search-dialog.component';
import { RequestService } from '../../request/request.service';
import { JsonApiService } from 'src/assets/api/json-api.service';
import * as moment from 'moment';
import { HeaderService } from 'src/app/shared/layout/app-layout/header/header.service';
@Component({
  selector: 'app-request-approval',
  templateUrl: './request-approval.component.html',
  // styleUrls: ['./request-approval.component.css'],
  styleUrls: ['./request-approval-srmav.component.css'],

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
export class RequestApprovalComponent implements OnInit {

  //Local Variable Declarations
  requestList: any = [];
  requestList1: any = [];
  requestAllList: any = [];
  countList: any[];
  appobjlength: number;
  dashboard: any = 'inactive';
  viewboard: any = 'inactive';
  requestObj: any = {};
  userBaseFieldName: any;
  dataSource1: any;
  dataSource: any = [];
  requestresSubmitBaseFieldName: any = [];
  reqViewDetailsField: string[];
  singleapproval: any = {};
  singleapprovalUpdate: any = {};
  //componentLoaderService: any;
  isDisabled: Boolean;
  RecordEnable: Boolean;
  RecordEnable2: Boolean;
  viewboard2: Boolean;
  labels: any = {};
  displayUserName;

  requestPriority = [
    { value: 1, name: 'low' },
    { value: 2, name: 'medium' },
    { value: 3, name: 'high' }
  ];

  page = 0;
  size = 4;

  term: any = '';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private appService: RequestApprovalService,
    private service: ApprovalService,
    private router: Router,
    private dialog: MatDialog,
    private requestModifyService: RequestService,
    private jsonApiService: JsonApiService,
    private headerService: HeaderService,
    private componentLoaderService: ComponentLoaderService) { }

  ngOnInit() {
    ///this.componentLoaderService.display(true);
    this.dashboard = 'active';
    this.viewboard = 'inactive';
    this.getList();
    this.getDashboardCount();
    this.isDisabled = false;
    this.viewboard2 = false;
    localStorage.removeItem('resolverActive');
    this.getLabelDetails();
    // this.displayUserName = this.headerService.userName();
    this.displayUserName = localStorage.getItem('userFullName');

  }
  /**** LABEL CHNAGES ****/
  getLabelDetails() {
    let lang;
    if (localStorage.getItem('langCode') !== null) {
      lang = localStorage.getItem('langCode');
    }
    this.jsonApiService.fetch('/' + lang + '.json').subscribe((data) => {
      this.labels = data;
    });
  }
  getData(obj) {
    let index = 0,
      startingIndex = obj.pageIndex * obj.pageSize,
      endingIndex = startingIndex + obj.pageSize;

    this.requestList1 = this.requestList.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
  }

  getList() {
    this.appService.reqList().subscribe(data => {
      let GetData = JSON.parse(data['_body']);
      if (GetData.succesObject == null) {
        this.RecordEnable2 = true;
      } else {
        this.isDisabled = false;
        this.dashboard = 'active';
        this.viewboard = 'inactive';
        this.viewboard2 = false;
        this.requestList = GetData.succesObject;
        let index = 0,
          startingIndex = 0 * 4,
          endingIndex = startingIndex + 4;
        if (this.requestList.length > 0) {
          for (let i = 0; i < this.requestList.length; i++) {
            if (this.requestList[i].requestPriority == "1") {
              this.requestList[i].requestPriorityName = "low";
            }
            if (this.requestList[i].requestPriority == "2") {
              this.requestList[i].requestPriorityName = "medium";
            }
            if (this.requestList[i].requestPriority == "3") {
              this.requestList[i].requestPriorityName = "high";
            }
          }
        }
        this.requestList1 = this.requestList.filter(() => {
          index++;
          return (index > startingIndex && index <= endingIndex) ? true : false;
        });
        if (this.requestList.length !== 0) {
          this.RecordEnable = true;
          this.RecordEnable2 = false;
        } else {
          this.RecordEnable = false;
          this.RecordEnable2 = true;
        }
      }
      localStorage.setItem('reqApprovalUrl', this.router.url);
    },
      error => {
        console.log(error);
      });
  }

  getDashboardCount() {
    this.appService.count().subscribe(data => {
      let GetData = JSON.parse(data['_body']);
      if (GetData.responseCode == 400) {
        this.RecordEnable2 = true;
      } else {
        this.countList = GetData.succesObject;
      }

    },
      error => {
        console.log(error);
      });
  }

  /************* Field Name Method ************/
  buttonValidation: any;
  call(id) {
    this.dashboard = 'inactive';
    this.viewboard = 'active';
    this.isDisabled = true;
    this.viewboard2 = true;
    this.service.approvalfinalgetsingle(id).subscribe(data => {
      let Response = JSON.parse(data['_body']);
      this.requestObj = Response.succesObject.request;
      this.userBaseFieldName = Response.authSuccesObject.screenFieldDisplayVoList.map(
        element => {
          return element;
        }
      );
      //this.requestObj.requestDate = new Date(Response.succesObject.request.requestDate).toISOString().split('T')[0];
      this.requestObj.requestDate = moment(Response.succesObject.request.requestDate).format('DD/MM/YYYY');
      this.requestObj.requestFromDate = moment(Response.succesObject.request.requestFromDate).format('DD/MM/YYYY');
      //  this.requestObj.createdDate = moment(Response.succesObject.request.createdDate).format('DD/MM/YYYY');
      this.requestObj.createdDate = moment(this.requestObj.createdDate).format('MMM,DD YYYY hh:mm a');
      this.requestObj.requestToDate = moment(Response.succesObject.request.requestToDate).format('DD/MM/YYYY');
      this.requestObj.requestDetailList = Response.succesObject.requestDetailList;
       this.requestresSubmitBaseFieldName.length == 0;
       if(Response.succesObject.reSubmitList != null && Response.succesObject.reSubmitList.length >= 1){
         this.dataSource1 = new MatTableDataSource(Response.succesObject.reSubmitList);
         this.requestresSubmitBaseFieldName = ['userName', 'approvalExecuter', 'descisionType' ,'forwardRedirectRemarks', 'remarks','approvedon', 'Sla'];
       }
    });


    //  this.service.approvalgetall(id).subscribe(data => {
    //    let Response = JSON.parse(data['_body']);
    //    this.dataSource = new MatTableDataSource<{}>([]);
    //    this.dataSource = new MatTableDataSource(Response.succesObject.requestWorkFlowAuditVoList);
    //    this.dataSource.paginator = this.paginator;
    //    this.dataSource.sort = this.sort;
    //    this.reqViewDetailsField = [
    //      'user',
    //      'approvalExecuter',
    //      'descision type',
    //      'approvalDate',
    //      'Sla',
    //      'remarks',
    //      'forwardRedirectRemarks'
    //    ];
    //  });

    this.service.approvalsingle(id).subscribe(data => {
      let Response = JSON.parse(data['_body']);
      this.dataSource = new MatTableDataSource(Response.succesObject.requestWorkFlowAuditVoList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      console.log(this.dataSource)
      this.reqViewDetailsField = ['user', 'approvalExecuter', 'descisionType', 'approvalDate', 'sla', 'remarks', 'forwardRedirectRemarks'];
      if (Response.succesObject.reSubmitList != null && Response.succesObject.reSubmitList.length >= 1) {
        this.dataSource1 = new MatTableDataSource(Response.succesObject.reSubmitList);
        this.dataSource1.paginator1 = this.paginator;
        this.dataSource1.sort1 = this.sort;
        this.requestresSubmitBaseFieldName = ['user', 'approvalExecuter', 'descisionType', 'approvalDate', 'sla', 'forwardRedirectRemarks', 'remarks'];
      }
      this.componentLoaderService.display(false);
      this.buttonValidation = Response.succesObject.button;
      this.singleapproval = Response.succesObject.requestWorkFlowAuditVoList[0];

    });
  }

  refresh() {

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

      if (result !== true) {
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
          let index = 0,
            startingIndex = 0 * 4,
            endingIndex = startingIndex + 4;
          if (this.requestList.length > 0) {
            for (let i = 0; i < this.requestList.length; i++) {
              if (this.requestList[i].requestPriority == "1") {
                this.requestList[i].requestPriorityName = "low";
              }
              if (this.requestList[i].requestPriority == "2") {
                this.requestList[i].requestPriorityName = "medium";
              }
              if (this.requestList[i].requestPriority == "3") {
                this.requestList[i].requestPriorityName = "high";
              }
            }
          }
          this.requestList1 = this.requestList.filter(() => {
            index++;
            return (index > startingIndex && index <= endingIndex) ? true : false;
          });
          if (this.requestList.length !== 0) {
            this.RecordEnable = true;
            this.RecordEnable2 = false;
          } else {
            this.RecordEnable = false;
            this.RecordEnable2 = true;
          }

        });
      }
    });

  }

  /** ************ Button Functionalities *********** */
  approval(type) {
    if (this.singleapproval.remarks === '' || this.singleapproval.remarks === undefined) {

      const dialogRef2 = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        width: 'auto',
        data: {
          message: 'remarks',
          btnYes: 'Ok'
        }
      });
    } else {

      let msg = '';
      if (type === 1 || type === 2 || type === 3) {
        if (type === 1) {
          msg = 'Approval';
        }
        if (type === 2) {
          msg = 'Reject';
        }
        if (type === 3) {
          msg = 'Resubmit';
        }
        const dialogRef2 = this.dialog.open(ConfirmationDialogComponent, {
          disableClose: false,
          width: 'auto',
          data: {
            message: msg,
            btnYes: 'Yes',
            btnNo: 'No'
          }
        });
        dialogRef2.afterClosed().subscribe(result => {
          if (result === true) {
            this.singleapprovalUpdate = this.singleapproval;
            //.requestWorkFlowAuditVoList[0];
            this.singleapprovalUpdate.screenFieldDisplayVoList = this.userBaseFieldName;
            this.singleapprovalUpdate.remarks = this.singleapproval.remarks;
            this.singleapproval.descisionType = type;
            if (this.singleapprovalUpdate.remarks == '' || this.singleapprovalUpdate.remarks === null) {
              const dialogRef = this.dialog.open(
                ConfirmationDialogComponent,
                {
                  disableClose: false,
                  panelClass: 'btnCenter',
                  width: 'auto',
                  data: {
                    title: 'alert',
                    message: 'remarks',
                    btnYes: 'OK'
                  }
                });
              return;
            } else {
              this.singleapprovalUpdate.descisionType = type;
              this.componentLoaderService.display(true);
            }
            this.service.updateapprovalDetails(this.singleapprovalUpdate).subscribe(
              data1 => {
                let Response = JSON.parse(data1['_body']);
                if (Response.responseCode === '200') {

                  const dialogRef = this.dialog.open(
                    ConfirmationDialogComponent,
                    {
                      disableClose: false,
                      panelClass: 'btnCenter',
                      width: 'auto',
                      data: {
                        message: Response.responseMessage,
                        btnYes: 'OK'
                      }
                    }
                  );
                  dialogRef.afterClosed().subscribe(data => {
                    this.refresh();
                    this.getList();
                    this.viewboard = 'inactive';
                    this.dashboard = 'active';
                  });
                } else if (Response.responseCode) {
                  const dialogRef = this.dialog.open(
                    ConfirmationDialogComponent,
                    {
                      disableClose: false,
                      panelClass: 'btnCenter',
                      width: 'auto',
                      data: {
                        message: Response.responseMessage,
                        // message: msg + ' Successfully',
                        btnYes: 'OK'
                      }
                    }
                  );
                }
                this.componentLoaderService.display(false);
              },
              error => {
                if (error.status === 401) {
                  console.log('Error');
                }
              }
            );
          } else {
            // data.descisionType=type;
          }
        });
      }
    }
  }

  download(event) {
    if (this.requestObj.requestAttachment !== null) {
      this.requestModifyService.picDownloadFn(event).subscribe(
        data => {
          let headers = data.headers;
          let contentType =
            headers.get("Content-type") || "application/octet-stream";
          let fileHeaders = headers.get("Content-Disposition");
          // let startIndex = fileHeaders.indexOf("filename =") + 11; // Adjust '+ 10' if filename is not the right one.
          // let endIndex = fileHeaders.length - 1; // Check if '- 1' is necessary
          // let filename = fileHeaders.substring(startIndex, endIndex);
          let filename = this.requestObj.requestAttachment;
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
    } else {
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

  ngOnDestroy() {
    localStorage.removeItem('reqApprovalUrl');
  }
}
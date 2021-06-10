import { ApprovalService } from '../approval.service';
import { Component, OnInit, ViewChild, Output, Inject } from '@angular/core';
import {
  MatPaginator,
  MatSort,
  MatTableDataSource,
  VERSION,
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  NgForm,
  Form
} from '@angular/forms';
import { RequestScrconfigAddService } from '../../request-scrconfig/request-scrconfig-add/request-scrconfig-add.service';
import { DOCUMENT } from '@angular/common';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { ComponentLoaderService } from '../../../shared/component-loader.service';
import { RequestService } from '../../request/request.service';
import { JsonApiService } from 'src/assets/api/json-api.service';
import { id } from '@swimlane/ngx-charts/release/utils';
import { HeaderService } from 'src/app/shared/layout/app-layout/header/header.service';


@Component({
  selector: 'app-approvalpage',
  templateUrl: './approvalpage.component.html',
  styleUrls: ['./approvalpage-srmav.component.css']
})
export class ApprovalpageComponent implements OnInit {
  requestObj: any = {};
  dataSource: any = [];
  dataSource1: any = [];
  reqViewDetailsField: any = [];
  userBaseFieldName: any = [];
  requestresSubmitBaseFieldName: any = [];
  displayNoRecords = true;
  approve: boolean = false;
  reject: boolean = false;
  resubmit: boolean = false;
  display = false;
  labels: any = {};
  // requestPriority = [
  //   { value: 1, name: 'Low' },
  //   { value: 2, name: 'Medium' },
  //   { value: 3, name: 'High' }
  // ];
  requestPriority: any = [];
  singleapproval: any = {};
  audioVoList: any = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  buttonValidation: any;
  displayUserName;
  requestBaseFieldName: string[];
  remarkApprove;

  @ViewChild('paginator1') paginator1: MatPaginator;
  @ViewChild('sort1') sort1: MatSort;

  constructor(
    private activatedRoute: ActivatedRoute,
    private service: ApprovalService,
    private router: Router,
    private dialog: MatDialog,
    private requestModifyService: RequestService,
    private componentLoaderService: ComponentLoaderService,
    private jsonApiService: JsonApiService,
    private headerService: HeaderService
  ) { }

  approval(type) {
    console.log(this.remarkApprove);
    if (this.remarkApprove === '' || this.remarkApprove === undefined) {

      const dialogRef2 = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        width: 'auto',
        data: {
          title: 'alert',
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
            title: 'Confirmation',
            message: msg,
            btnYes: 'Yes',
            btnNo: 'No'
          }
        });
        dialogRef2.afterClosed().subscribe(result => {
          if (result === true) {
            let tempUserId = Number(localStorage.getItem('userId'));
            let tempBoolean : Boolean;
            if(this.audioVoList.length > 0){
              for(let i = 0; i < this.audioVoList.length; i++){
                if(this.audioVoList[i].userId == tempUserId){
                  tempBoolean = true;
                  break;
                }
              }
              if(tempBoolean == true){
                for(let i = 0; i < this.audioVoList.length; i++){
                  if(tempUserId == this.audioVoList[i].userId &&
                    this.audioVoList[i].approvalExecuter == 1){
                    this.singleapproval = this.audioVoList[i];
                    break;
                  }else{
                    this.singleapproval.workFlowId =  this.audioVoList[0].workFlowId;
                    this.singleapproval.requestId =   this.requestObj.requestId;
                  }
                }
              }else{
                this.singleapproval.workFlowId =  this.audioVoList[0].workFlowId;
                this.singleapproval.requestId =   this.requestObj.requestId;
              }
            }
            this.singleapproval.descisionType = type;
            this.singleapproval.screenFieldDisplayVoList = this.userBaseFieldName;
            console.log(this.remarkApprove);
            if (this.remarkApprove == '' || this.remarkApprove == null || this.remarkApprove.trim() == '') {
              const dialogRef = this.dialog.open(
                ConfirmationDialogComponent,
                {
                  disableClose: false,
                  panelClass: 'btnCenter',
                  width: 'auto',
                  data: {
                    title: 'Alert',
                    message: 'remarks',
                    btnYes: 'OK'
                  }
                });
            }else{
              this.singleapproval.remarks = this.remarkApprove;
            // this.singleapproval.remarkApprove = undefined;
            this.service.updateapprovalDetails(this.singleapproval).subscribe(
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
                        title: 'Info',
                        server: 'servermessage',
                        message: Response.responseMessage,
                        btnYes: 'OK'
                      }
                    }
                  );
                  dialogRef.afterClosed().subscribe(data => {
                    this.router.navigateByUrl('/approvallist');
                  });
                } else if (Response.responseCode) {
                  const dialogRef = this.dialog.open(ConfirmationDialogComponent,
                    {
                      disableClose: false,
                      panelClass: 'btnCenter',
                      width: 'auto',
                      data: {
                        title: 'Alert',
                        server: 'servermessage',
                        message: Response.responseMessage,
                        btnYes: 'OK'
                      }
                    }
                  );

                }
                this.componentLoaderService.display(false);

              },
              error => {
                if (error.status === 401) {
                }
              }
            );
            }
            
          } else {
          }
        });
      }

    }
  }

  ngOnInit() {
    this.componentLoaderService.display(true);
    this.getLabelDetails();
    this.displayUserName = localStorage.getItem('userFullName');
    this.activatedRoute.params.subscribe(
      params => {
        const id = +params['id'];
        this.viewMethod(id);

      }
    );
    if(localStorage.getItem('langCode') == 'en'){
      this.requestPriority = [
        { name: 'Low', value: '1' },
        { name: 'Medium', value: '2' },
        { name: 'High', value: '3' }];
    }else if(localStorage.getItem('langCode') == 'jp'){
      this. requestPriority = [
        { name: '低い', value: '1' },
        { name: '中', value: '2' },
        { name: '高い', value: '3' }];
    }
  }


  getLabelDetails() {
    let lang;
    if (localStorage.getItem('langCode') !== null) {
      lang = localStorage.getItem('langCode');
    }
    this.jsonApiService.fetch('/' + lang + '.json').subscribe((data) => {
      this.labels = data;
    });
  }
  request_list_details() {
    let loadRequestList = this.service.load_requestGrid().subscribe(
      data => {
        let requestListGetData = JSON.parse(data['_body']);
        let requestListTableDate = requestListGetData.succesObject;
        this.dataSource = [];
        if (requestListTableDate !== null) {
          this.dataSource = new MatTableDataSource(requestListTableDate);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.displayNoRecords = true;
        } else {
          this.displayNoRecords = false;
        }

        this.requestBaseFieldName = [
          'select',
          'requestCode',
          'requestDate',
          'requestTypeName',
          'requestSubTypeName',
          'currentStatusName',
          'descisionType'
        ];
      },
      error => {
        if (error.status === 401) {
          console.log('Error');
        }
      }
    );
  }
  /***** New Method */

  viewMethod(id) {
    this.service.approvalfinalgetsingle(id).subscribe(data => {
      let Response = JSON.parse(data['_body']);
      if (Response.responseCode == '200') {
        this.requestObj = Response.succesObject.request;
        this.userBaseFieldName = Response.authSuccesObject.screenFieldDisplayVoList.map(
          element => {
            return element;
          });

        let screenFunctionDisplayList = Response.authSuccesObject.screenFunctionDisplayList;
        for (let k in screenFunctionDisplayList) {
          if (screenFunctionDisplayList[k] === 'APPROVE') {
            this.approve = true;
          }
          if (screenFunctionDisplayList[k] === 'RESUBMIT') {
            this.resubmit = true;
          }
          if (screenFunctionDisplayList[k] === 'REJECT') {
            this.reject = true;
          }
        }

        this.requestObj.forwardRedirectRemarks = Response.succesObject.request.forwardRedirectRemarks;
        this.requestObj.requestDate = moment(Response.succesObject.request.requestDate).format('DD/MM/YYYY');
        this.requestObj.requestFromDate = moment(Response.succesObject.request.requestFromDate).format('DD/MM/YYYY');
        this.requestObj.requestToDate = moment(Response.succesObject.request.requestToDate).format('DD/MM/YYYY');
        this.requestObj.createdDate = moment(this.requestObj.createdDate).format('MMM, DD YYYY hh:mm a');
        this.requestObj.requestDetailList = Response.succesObject.requestDetailList;
        this.requestObj.screenFieldDisplayVoList = this.userBaseFieldName

      }
    })

    this.service.approvalsingle(id).subscribe(data => {
      let Response = JSON.parse(data['_body']);
      this.dataSource = new MatTableDataSource(Response.succesObject.requestWorkFlowAuditVoList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.display = false;
      this.reqViewDetailsField = ['user', 'approvalExecuter', 'descisionType', 'approvalDate', 'sla', 'remarks', 'forwardRedirectRemarks'];

      if (Response.succesObject.reSubmitList != null && Response.succesObject.reSubmitList.length >= 1) {
        this.dataSource1 = new MatTableDataSource(Response.succesObject.reSubmitList);
        this.dataSource1.paginator1 = this.paginator1;
        this.dataSource1.sort1 = this.sort1;
        this.requestresSubmitBaseFieldName = ['user', 'approvalExecuter', 'descisionType', 'approvalDate', 'sla', 'forwardRedirectRemarks', 'remarks'];


      }
      this.componentLoaderService.display(false);
      if (Response.responseCode == '200') {
        this.buttonValidation = Response.succesObject.button;
        this.audioVoList = Response.succesObject.requestWorkFlowAuditVoList;
        // this.singleapproval = Response.succesObject.requestWorkFlowAuditVoList[0];
        this.singleapproval.screenFieldDisplayVoList = this.userBaseFieldName;
        this.componentLoaderService.display(false);
      }
    })
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
          message: 'attachment',
          btnYes: 'OK',
        }
      });
    }


  }
}


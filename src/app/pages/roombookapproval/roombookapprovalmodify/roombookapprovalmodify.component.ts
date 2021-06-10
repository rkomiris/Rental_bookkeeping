import { RoombookapprovalService } from '../roombookapproval.service';
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
@Component({
  selector: 'app-roombookapprovalmodify',
  templateUrl: './roombookapprovalmodify.component.html',
  // styleUrls: ['./roombookapprovalmodify.component.css']
  styleUrls: ['./roombookapprovalmodify-srmav.component.css']
})
export class RoombookapprovalmodifyComponent implements OnInit {
  requestObj: any = {};
  dataSource: any = [];
  reqViewDetailsField: any = [];
  userBaseFieldName: any = [];
  requestPriority = [
    { value: 1, name: 'Low' },
    { value: 2, name: 'Medium' },
    { value: 3, name: 'High' }
  ];
checklist = [
    { id: 1, value: 'SUN', isSelected: false },
    { id: 2, value: 'MON', isSelected: true },
    { id: 3, value: 'TUE', isSelected: true },
    { id: 4, value: 'WED', isSelected: false },
    { id: 5, value: 'THU', isSelected: false },
    { id: 6, value: 'FRI', isSelected: false },
    { id: 7, value: 'SAT', isSelected: false },
  ];
  singleapproval: any = {};
  buttonValidation : any;
  // @ViewChild('saveForm') saveForm:NgForm;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private activatedRoute: ActivatedRoute,
    private roombookapprovalService: RoombookapprovalService,
    private router: Router,
    private dialog: MatDialog,
    private componentLoaderService: ComponentLoaderService
  ) { }
  approval(type) {
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
          message: 'Are you sure want to ' + msg,
          btnYes: 'Yes',
          btnNo: 'No'
        }
      });
      dialogRef2.afterClosed().subscribe(result => {
        console.log(result);
        if (result === true) {
          this.componentLoaderService.display(true);
          this.singleapproval.roomBookingWorkFlowAuditDescisionType = type;
          console.log("single approval list", this.singleapproval);
          this.roombookapprovalService.updateapprovalDetails(this.singleapproval).subscribe(
            data1 => {
              let Response = JSON.parse(data1['_body']);
              if (Response.responseCode === '200') {
          this.singleapproval.roomBookingWorkFlowAuditDescisionType = type;
          if (this.singleapproval.roomBookingWorkFlowAuditRemarks === '') {
            this.singleapproval.roomBookingWorkFlowAuditRemarks = null;
           }
           this.singleapproval.screenFieldDisplayVoList = this.userBaseFieldName;
                const dialogRef = this.dialog.open(
                  ConfirmationDialogComponent,
                  {
                    disableClose: false,
                    panelClass: 'btnCenter',
                    width: 'auto',
                    data: {
                      title: 'Info',
                      message: Response.responseMessage,
                      btnYes: 'OK'
                    }
                  }
                );
                dialogRef.afterClosed().subscribe(data => {
                  this.router.navigateByUrl('/roombookapproval');
                });
              }else if(Response.responseCode)
              {
                const dialogRef = this.dialog.open(
                  ConfirmationDialogComponent,
                  {
                    disableClose: false,
                    panelClass: 'btnCenter',
                    width: 'auto',
                    data: {
                      title: 'Alert',
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
                // alert('Error');
              }
            }
          );
        } else {
          // data.descisionType=type;
        }
      
      // console.log(data);
    });
  }
}
  ngOnInit() {
    this.componentLoaderService.display(true);
    this.loadview();
  }
  loadview() {
    if (localStorage.getItem('roomBookingId') !== null) {
      let id = localStorage.getItem('roomBookingId');
     // id = parseInt(id);
      console.log(typeof(id));
      this.loadviewall(id);
    }
  }
  loadviewall(id) {
    this.roombookapprovalService.approvalgetsingle(id).subscribe(data => {
      let Response = JSON.parse(data['_body']);
      this.requestObj = Response.succesObject;


      let listData = Response.succesObject;
      this.userBaseFieldName = Response.succesObject.screenFieldDisplayVoList.map(
        element => {
          console.log(element);
          return element;
        });
      console.log("user base field",this.userBaseFieldName );


      console.log(this.requestObj);
     // let reqDate = new Date(Response.succesObject.requestDate);
     // let reqfromDate = new Date(Response.succesObject.requestFromDate);
    //  let reqtoDate = new Date(Response.succesObject.requestToDate);
      console.log(Response.succesObject.requestDate);
    //  this.requestObj.requestDate = new Date(Response.succesObject.request.requestDate).toISOString().split('T')[0];
      this.requestObj.roomBookingFromDate = new Date(Response.succesObject.roomBookingFromDate).toISOString().split('T')[0];
      this.requestObj.roomBookingToDate = new Date(Response.succesObject.roomBookingToDate).toISOString().split('T')[0];
     // this.requestObj.requestDetailList = Response.succesObject.requestDetailList;
     // console.log(this.requestObj.requestDate);
     /* this.requestObj.requestFromDate =
        reqfromDate.getFullYear() +
        '-' +
        ('0' + (reqfromDate.getMonth() + 1)).slice(-2) +
        '-' +
        ('0' + reqfromDate.getDate()).slice(-2);
      this.requestObj.requestToDate =
        reqtoDate.getFullYear() +
        '-' +
        ('0' + (reqtoDate.getMonth() + 1)).slice(-2) +
        '-' +
        ('0' + reqtoDate.getDate()).slice(-2);*/
     // console.log(this.requestObj.requestWorkFlowAuditVoList);

     /* this.dataSource = new MatTableDataSource<{}>([]);
      this.dataSource = new MatTableDataSource(
        Response.succesObject['requestWorkFlowAuditVoList']
      );
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.reqViewDetailsField = [
        'user',
        'approvalExecuter',
        'remarks',
        'descision type'
      ]; /*'sequance',*/
     // console.log(this.dataSource);
     // console.log(this.requestObj);
    });
    this.roombookapprovalService.approvalgetall(id).subscribe(data => {
      let Response = JSON.parse(data['_body']);
      console.log(Response);
     // Response.succesObject;
      this.dataSource = new MatTableDataSource<{}>([]);
      this.dataSource = new MatTableDataSource(Response.succesObject.roomBookingAuditVoList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.reqViewDetailsField = [
        'userName',
        'workFlowAuditApprovalExecuter',
        'roomBookingWorkFlowAuditDescisionType',
        'approvedDate',
        'roomBookingWorkFlowAuditRemarks',
        'sla'
      ];
    });
    this.roombookapprovalService.approvalsingle(id).subscribe(data => {
      let Response = JSON.parse(data['_body']);
      console.log(Response.succesObject);
      if (Response.succesObject.roomBookingAuditVoList !== undefined) {
        this.singleapproval = Response.succesObject.roomBookingAuditVoList[0];
      this.buttonValidation = Response.succesObject.roomBookingAuditVoList[0].button;
        console.log(this.singleapproval);
      }

    });
    this.componentLoaderService.display(false);

  }

}

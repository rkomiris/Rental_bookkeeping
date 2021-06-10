import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, VERSION, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import { FormControl, FormBuilder, FormGroup, FormArray, Validators, NgForm, Form } from '@angular/forms';
import { RequestScrconfigAddService } from '../../request-scrconfig/request-scrconfig-add/request-scrconfig-add.service';
import { RequestService } from '../../request/request.service';
import { Subscription } from 'rxjs';
import { RequestResolverModifyService } from './request-resolver-modify.service';
import { ComponentLoaderService } from '../../../shared/component-loader.service';
import { ForwardRequestAddComponent } from '../forward-request-add/forward-request-add.component';
import { JsonApiService } from 'src/assets/api/json-api.service';
import { HeaderService } from 'src/app/shared/layout/app-layout/header/header.service';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';

@Component({
  selector: 'app-request-resolver-modify',
  templateUrl: './request-resolver-modify.component.html',
  // styleUrls: ['./request-resolver-modify.component.css']
  styleUrls: ['./request-resolver-modify-srmav.component.css']
})
export class RequestResolverModifyComponent implements OnInit, OnDestroy {
  saveForm: FormGroup;
  dropdownDatas: any;
  requestSubTypeList: any;
  reqDetailList: any;
  requestPriority: any;
  status = false;
  reqDate: any;
  mobno: any;
  requestExtn: any;
  userDepartment: any;
  public from_mindate = new Date();
  requestAddGetData: any = {};
  subscriptionlist: Subscription[] = [];
  requestObj: any = {};
  tempRequestObjDetailList: any;
  formDetails: any = {};
  dataSource: any = [];
  reqViewDetailsField: any = [];
  requestTypeList: any = [];
  seqmodel: any = {};
  fromListData: any = [];
  club = [];
  requestBaseFieldName: any = [];
  rowindex: any;
  displayNoRecords = true;
  display = true;
  seq = false;
  aftersubmit = false;
  locationList: any = [];
  subLocationList: any = [];
  userBaseFieldName: any = [];
  priorityCombo: any = [];
  checkboxvalidation = false;
  checkboxvalidationfieldname = '';
  userDropDown: any = [];
  reassignUserId: any = '';
  remarks: any = null;
  remarkValue: any;

  /* Forward and redirect */
  formList: any = [];
  inprogressEnable: boolean = false;
  forwardEnable: boolean;
  redirectEnable: boolean;

  labels: any = {};
  displayUserName;


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  date: Date;
  constructor(
    public datepipe: DatePipe,
    private requestScrconfigAddService: RequestScrconfigAddService,
    private router: Router,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private requestModifyService: RequestService,
    private requestResolverService: RequestResolverModifyService,
    private componentLoaderService: ComponentLoaderService,
    private jsonApiService: JsonApiService,
    private headerService: HeaderService
  ) { }

  ngOnInit() {
    this.componentLoaderService.display(true);
    this.reqViewDetailsField = ['sequance', 'user', 'group', 'descision type'];
    this.dataSource = new MatTableDataSource<{}>([]);
    this.onloadDropdownData();
    this.getLabelDetails();
    // this.displayUserName = this.headerService.userName();
    this.displayUserName = localStorage.getItem('userFullName');

    
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

  onloadDropdownData() {
    this.requestResolverService.getDropdownData().subscribe(
      data => {
        let resp = JSON.parse(data['_body']);
        this.requestTypeList = resp.succesObject;
        this.loadRequestDetailsById();
      },
      error => {
        if (error.status === 401) {
        }
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
        }
      });
  }

  loadRequestDetailsById() {
    if (localStorage.getItem('requestId') !== null) {
      let id = localStorage.getItem('requestId');
      this.loadRequestDetails(id);
    }
  }
  
  myFunction(date1){
    this.date = date1;
    this.date=new Date();
    let latest_date =this.datepipe.transform(this.date, 'dd/MM/yyyy');
   }
  
   originalRequestAttachment;
   datalist: any;
  loadRequestDetails(id) {    
    this.componentLoaderService.display(false);
    /** reqLoad */

    let requestDetailsSub = this.requestResolverService.loadRequestDetailsById(id).subscribe(data => {
      let datalist = JSON.parse(data['_body']);
      this.requestBaseFieldName = ['userName', 'approvalExecuter', 'descisionType', 'approvedon', 'Sla', 'remarks','forwardRedirectRemarks'];
      let listData = datalist.succesObject;
      this.formList = datalist.succesObject;
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
      if(this.seqmodel.currentStatusId == 8){
        this.inprogressEnable = true;
      }
      if (this.seqmodel.requestFromDate !== null) {
        this.seqmodel.requestFromDate = new Date(this.seqmodel.requestFromDate);
        // this.datepipe.transform(this.seqmodel.requestFromDate, 'dd/MM/yyyy');
      }
      if (this.seqmodel.createdDate !== null) {
        // this.seqmodel.createdDate = new Date(this.seqmodel.createdDate);
        // this.datepipe.transform(this.seqmodel.createdDate, 'MMM,dd YYYY hh:mm a');
        this.seqmodel.createdDate = moment(this.seqmodel.createdDate).format('MMM, DD YYYY hh:mm a');
      }
      this.originalRequestAttachment = this.seqmodel.requestAttachment;
      this.seqmodel.requestDate = new Date(this.seqmodel.requestDate);
      if(this.seqmodel.forwardRequestId != null && this.seqmodel.forwardRequestId != '' && this.seqmodel.forwardRequestId != undefined){
        this.forwardEnable = true;
        // this.redirectEnable = true;
      }
      if(this.seqmodel.subrequestId != null && this.seqmodel.subrequestId != '' && this.seqmodel.subrequestId != undefined){
        // this.forwardEnable = true;
        this.redirectEnable = true;
      }

      this.getSubTypeList(this.seqmodel.requestTypeId);
      this.display = false;
      this.dataSource = new MatTableDataSource(datalist.succesObject.requestWorkFlowAuditVoList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.requestResolverService.load_selectBox_subLocationData(this.seqmodel.id).subscribe(data1 => {
        let subLoca = JSON.parse(data1['_body']);
        this.subLocationList = subLoca.succesObject;
      });
      this.seq = true;
    },
      error => {
      });
    /** viewAllResolver */
    // let resolverList = this.requestResolverService.loadResolverList(id).subscribe(data => {
    //   this.requestBaseFieldName = ['userName', 'approvalExecuter', 'descisionType', 'remarks', 'approvedon', 'Sla'];
    //   let datalist = JSON.parse(data['_body']);
    //   this.dataSource = new MatTableDataSource(datalist.succesObject);
    //   this.dataSource.paginator = this.paginator;
    //   this.dataSource.sort = this.sort;
    // },
    //   error => {
    //   });
    /** viewResolver */
    let resolversubmitDetails = this.requestResolverService.loadsubmitDetails(id).subscribe(data => {
      this.datalist = JSON.parse(data['_body']);
      
      this.formList.request.requestWorkFlowAuditVo = this.datalist.succesObject[0].requestWorkFlowAuditVo;
    },
      error => {
      });
    /** reassignUser */
    let userDropdownList = this.requestResolverService.resolveruserDropdownData().subscribe(data => {
      let datalist = JSON.parse(data['_body']);
      this.userDropDown = datalist.succesObject;
    },
      error => {
      });
    this.subscriptionlist.push(requestDetailsSub);
  }

  getCheckboxes(withmodel, val, gg) {
    if (val.checked === true) {
      gg.objectList.push(withmodel);
    } else {
      let index = gg.objectList.indexOf(withmodel);
      if (index > -1) {
        gg.objectList.splice(index, 1);
      }
    }
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

  getSubTypeList(eve) {
    this.requestScrconfigAddService.getSubTypeList(eve).subscribe(
      data => {
        let resp = JSON.parse(data['_body']);
        this.requestSubTypeList = resp.succesObject;
      },
      error => {
      }
    );
  }

  getremark(event) {
    this.getremark = event.srcElement.value;
  }

  completedAction() {

    let tempUserId = Number(localStorage.getItem('userId'));
      let tempBoolean =  false;
      if(this.datalist.succesObject.length > 0){
        for(let i = 0; i < this.datalist.succesObject.length; i++){
          if(this.datalist.succesObject[i].requestWorkFlowAuditVo.userId == tempUserId){
            tempBoolean = true;
            break;
          }
        }
        if(tempBoolean == true){
          for(let i = 0; i < this.datalist.succesObject.length; i++){
            if(tempUserId == this.datalist.succesObject[i].requestWorkFlowAuditVo.userId &&
              this.datalist.succesObject[i].requestWorkFlowAuditVo.approvalExecuter == 2 &&
              (this.datalist.succesObject[i].requestWorkFlowAuditVo.descisionType == 0 ||
                this.datalist.succesObject[i].requestWorkFlowAuditVo.descisionType == 5 ||
                this.datalist.succesObject[i].requestWorkFlowAuditVo.descisionType == 14)){
              this.formDetails = this.datalist.succesObject[i].requestWorkFlowAuditVo;
              break;
            }else{
              this.formDetails.workFlowId =  this.datalist.succesObject[0].requestWorkFlowAuditVo['workFlowId'];
              this.formDetails.requestId =   this.seqmodel.requestId;
            }
          }
        }else{
          this.formDetails.workFlowId =  this.datalist.succesObject[0].requestWorkFlowAuditVo.workFlowId;
          this.formDetails.requestId =   this.seqmodel.requestId;
        }
      }
    this.formDetails.descisionType = "4";
    if (this.remarks === null || this.remarks == "") {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        panelClass: 'btnCenter',
        width: 'auto',
        data: {
          title: 'Alert',
          message: 'remarks',
          btnYes: 'OK',
        }
      });
      return;
    }

    this.formDetails.remarks = this.remarks.trim();

    if (this.formDetails.remarks == "") {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        panelClass: 'btnCenter',
        width: 'auto',
        data: {
          title: 'Alert',
          message: 'remarks',
          btnYes: 'OK',
        }
      });
    } else {
      this.formDetails.remarks = this.remarks;
      this.componentLoaderService.display(true);
      this.formDetails.screenFieldDisplayVoList = this.userBaseFieldName;
      let completedAction = this.requestResolverService.updateResolverData(this.formDetails)
        .subscribe(
          data => {
            let datalist = JSON.parse(data['_body']);
            if (datalist.responseCode == '200') {
              const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                disableClose: false,
                panelClass: 'btnCenter',
                width: 'auto',
                data: {
                  title: 'Info',
                  server: 'servermessage',
                  message: datalist.responseMessage,
                  btnYes: 'OK',
                }
              });
              dialogRef.afterClosed().subscribe(data => {
                this.router.navigate(['/request-resolver']);
              });
            } else {
              const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                disableClose: false,
                panelClass: 'btnCenter',
                width: 'auto',
                data: {
                  title: 'Alert',
                  server: 'servermessage',
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

  inProgressAction() {

    /** Addon COnditions **/
    
      // if(this.datalist.succesObject.requestWorkFlowAuditVo.length > 0){
      //   for(let i = 0; i < this.datalist.succesObject.length; i++){
      //     if(tempUserId == this.datalist.succesObject[i].requestWorkFlowAuditVo.userId &&
      //       this.datalist.succesObject[i].requestWorkFlowAuditVo.approvalExecuter == 2 &&
      //       this.datalist.succesObject[i].requestWorkFlowAuditVo.descisionType == 0){
      //       this.formDetails = this.datalist.succesObject[i].requestWorkFlowAuditVo;
      //     }
      //   }
      // }else{
      //   this.formDetails.workFlowId =  this.datalist.succesObject[0].requestWorkFlowAuditVo['workFlowId'];
      //   this.formDetails.requestId =   this.seqmodel.requestId;
      // }
      let tempUserId = Number(localStorage.getItem('userId'));
      let tempBoolean =  false;
      if(this.datalist.succesObject.length > 0){
        for(let i = 0; i < this.datalist.succesObject.length; i++){
          if(this.datalist.succesObject[i].requestWorkFlowAuditVo.userId == tempUserId){
            tempBoolean = true;
            break;
          }
        }
        if(tempBoolean == true){
          for(let i = 0; i < this.datalist.succesObject.length; i++){
            if(tempUserId == this.datalist.succesObject[i].requestWorkFlowAuditVo.userId &&
              this.datalist.succesObject[i].requestWorkFlowAuditVo.approvalExecuter == 2 &&
              (this.datalist.succesObject[i].requestWorkFlowAuditVo.descisionType == 0 ||
                this.datalist.succesObject[i].requestWorkFlowAuditVo.descisionType == 14)){
              this.formDetails = this.datalist.succesObject[i].requestWorkFlowAuditVo;
              break;
            }else{
              this.formDetails.workFlowId =  this.datalist.succesObject[0].requestWorkFlowAuditVo['workFlowId'];
              this.formDetails.requestId =   this.seqmodel.requestId;
            }
          }
        }else{
          this.formDetails.workFlowId =  this.datalist.succesObject[0].requestWorkFlowAuditVo['workFlowId'];
          this.formDetails.requestId =   this.seqmodel.requestId;
        }
      }

    if (this.remarks === null || this.remarks == "") {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        panelClass: 'btnCenter',
        width: 'auto',
        data: {
          title: 'Alert',
          message: 'remarks',
          btnYes: 'OK',
        }
      });
      return;
    }

    this.formDetails.remarks = this.remarks.trim();

    if (this.formDetails.remarks == "") {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        panelClass: 'btnCenter',
        width: 'auto',
        data: {
          title: 'Alert',
          message: 'remarks',
          btnYes: 'OK',
        }
      });
    } else {
      this.formDetails.remarks = this.remarks;
      this.componentLoaderService.display(true);
      this.formDetails.descisionType = "5";

      this.formDetails.screenFieldDisplayVoList = this.userBaseFieldName;

      let completedAction = this.requestResolverService.updateResolverData(this.formDetails)
        .subscribe(
          data => {
            let datalist = JSON.parse(data['_body']);
            if (datalist.responseCode == '200') {
              const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                disableClose: false,
                panelClass: 'btnCenter',
                width: 'auto',
                data: {
                  title: 'Info',
                  server: 'servermessage',
                  message: datalist.responseMessage,
                  btnYes: 'OK',
                }
              });
              dialogRef.afterClosed().subscribe(data => {
                this.router.navigate(['/request-resolver']);
              });
            } else {
              const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                disableClose: false,
                panelClass: 'btnCenter',
                width: 'auto',
                data: {
                  title: 'Alert',
                  server: 'servermessage',
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


  reassignAction() {
    let tempUserId = Number(localStorage.getItem('userId'));
    let tempBoolean =  false;
    if(this.datalist.succesObject.length > 0){
      for(let i = 0; i < this.datalist.succesObject.length; i++){
        if(this.datalist.succesObject[i].requestWorkFlowAuditVo.userId == tempUserId){
          tempBoolean = true;
          break;
        }
      }
      if(tempBoolean == true){
        for(let i = 0; i < this.datalist.succesObject.length; i++){
          if(tempUserId == this.datalist.succesObject[i].requestWorkFlowAuditVo.userId &&
            this.datalist.succesObject[i].requestWorkFlowAuditVo.approvalExecuter == 2 &&
            (this.datalist.succesObject[i].requestWorkFlowAuditVo.descisionType == 0 ||
              this.datalist.succesObject[i].requestWorkFlowAuditVo.descisionType == 14)){
            this.formDetails = this.datalist.succesObject[i].requestWorkFlowAuditVo;
            break;
          }else{
            this.formDetails.workFlowId =  this.datalist.succesObject[0].requestWorkFlowAuditVo['workFlowId'];
            this.formDetails.requestId =   this.seqmodel.requestId;
          }
        }
      }else{
        this.formDetails.workFlowId =  this.datalist.succesObject[0].requestWorkFlowAuditVo['workFlowId'];
        this.formDetails.requestId =   this.seqmodel.requestId;
      }
    }
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
      if (this.remarks === null || this.remarks == "") {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          disableClose: false,
          panelClass: 'btnCenter',
          width: 'auto',
          data: {
            title: 'Alert',
            message: 'remarks',
            btnYes: 'OK',
          }
        });
        return;
      }

      this.formDetails.remarks = this.remarks.trim();

      if (this.formDetails.remarks == "") {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          disableClose: false,
          panelClass: 'btnCenter',
          width: 'auto',
          data: {
            title: 'Alert',
            message: 'remarks',
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
              if (datalist.responseCode == '200') {
                const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                  disableClose: false,
                  panelClass: 'btnCenter',
                  width: 'auto',
                  data: {
                    title: 'Info',
                    server: 'servermessage',
                    message: datalist.responseMessage,
                    btnYes: 'OK',
                  }
                });
                dialogRef.afterClosed().subscribe(data => {
                  this.router.navigate(['/request-resolver']);
                });
              } else {
                const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                  disableClose: false,
                  panelClass: 'btnCenter',
                  width: 'auto',
                  data: {
                    title: 'Alert',
                    server: 'servermessage',
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
  }

  download(event) {
    if (this.seqmodel.requestAttachment !== null) {
      this.requestModifyService.picDownloadFn(event).subscribe(
        data => {
          let headers = data.headers;
          let contentType =
            headers.get("Content-type") || "application/octet-stream";
          let fileHeaders = headers.get("Content-Disposition");
          // let startIndex = fileHeaders.indexOf("filename =") + 11; // Adjust '+ 10' if filename is not the right one.
          // let endIndex = fileHeaders.length - 1; // Check if '- 1' is necessary
          // let filename = fileHeaders.substring(startIndex, endIndex);
        let filename =  this.seqmodel.requestAttachment;
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

  projectForward() {
    this.formList.request.requestDetailList = this.seqmodel.requestDetailList;
    const dialogRef = this.dialog.open(ForwardRequestAddComponent, {
      disableClose: false,
      panelClass: 'btnCenter',
      width: '1000px',
      data: {
        title: "Forward Request",
        data: this.formList.request,
        url: "/fr/create",
      }
    });
  }

  projectRedirect() {
    const dialogRef = this.dialog.open(ForwardRequestAddComponent, {
      disableClose: false,
      panelClass: 'btnCenter',
      width: '75%',
      data: {
        title: "Redirect Request",
        data: this.formList.request,
        url: "/resolver/subrequestcreate",
      }
    });
  }

  selection(event){
    if(this.seqmodel.requestAttachment !== this.originalRequestAttachment){
      this.originalRequestAttachment  = "";
    }

  }

  ngOnDestroy() {
    localStorage.removeItem('requestId');
    localStorage.removeItem('requesterId');
            
  }
}

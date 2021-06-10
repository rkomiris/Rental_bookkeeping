// import { Component, OnInit } from '@angular/core';
import { ApprovalService } from '../approval.service';
import {
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
  Inject,
  OnDestroy
} from '@angular/core';
import {
  MatPaginator,
  MatSort,
  MatTableDataSource,
  VERSION,
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material';
import * as moment from 'moment';
import { DOCUMENT } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ComponentLoaderService } from '../../../shared/component-loader.service';
import { JsonApiService } from 'src/assets/api/json-api.service';
import { RequestService } from '../../request/request.service';
export interface requestListData {
  delegatedUserId: any;
  highlighted?: boolean;
  hovered?: boolean;
  requestId: number;
}
@Component({
  selector: 'app-approvallist',
  templateUrl: './approvallist.component.html',
  styleUrls: ['./approvallist-srmav.component.css']
})
export class ApprovallistComponent implements OnInit, OnDestroy {
  dataSource: any = [];
  requestBaseFieldName: any = [];
  displayNoRecords = true;
  rowindex: any;
  count = 1;
  searchForm: FormGroup;
  searchboj: any = [];
  qtd: any = [];
  qtm: any = '';
  approve:boolean = false;
  reject:boolean = false;
  resubmit:boolean = false;
  singleapproval: any = {};
  audioVoList : any = [];
  modify: boolean = false;
  view:boolean = false;
  userRoleFieldName: any = [];
  labels: any = {};
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  selection = new SelectionModel<requestListData>(true, []);
  searchCombo: any = [];
  // desicionarr = [
  //   { name: 'Choose Field' },
  // { name: 'Pending', id: 0 }, 
  // { name: 'Approved', id: 1 }, 
  // { name: 'Rejected', id: 2 }, 
  // { name: 'Re-submit', id: 3 }
  // ];
  desicionarr: any = [];
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  changefield(val, ind, form) {
    form.controls.searchDatas.controls[ind].controls.textVal.reset();
    let kk = this.hasNoDuplicates(this.qtd);
    if (kk === true) {

    } else {
      this.qtd[ind] = {};
      form.controls.searchDatas.controls[ind].controls.dropDownVal.reset();
      form.controls.searchDatas.controls[ind].controls.textVal.reset();
    }
  }
  hasNoDuplicates(arr) {
    return arr.every(num => arr.indexOf(num) === arr.lastIndexOf(num));
  }
  onRowModify(row) {
    row.projectModify = true;
    this.rowindex = row.requestId;
  }
  highlight(element: requestListData) {
    element.highlighted = !element.highlighted;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    if (
      this.dataSource.filteredData.length > 0 ||
      this.selection.selected.length > 0
    ) {
      this.displayNoRecords = true;
      this.selection.clear();
    } else {
      this.displayNoRecords = false;
    }
  }
  removeFilter(filterValue: string): void {
    this.displayNoRecords = true;
    if (filterValue.length === 0) {
      this.request_list_details();
    }
  }
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }
  constructor(
    private formBuilder: FormBuilder,
    private service: ApprovalService,
    private dialog: MatDialog,
    private router: Router,
    private componentLoaderService: ComponentLoaderService,
    private jsonApiService: JsonApiService,
    private requestService:RequestService
  ) { }

  ngOnInit() {
    this.componentLoaderService.display(true);
    this.getLabelDetails();
    if(localStorage.getItem('langCode') == 'en'){
      this.desicionarr =[
      { name: 'Pending', id: 0 }, 
      { name: 'Approved', id: 1 }, 
      { name: 'Rejected', id: 2 }, 
      { name: 'Re-submit', id: 3 }]
    }if(localStorage.getItem('langCode') == 'jp'){
      this.desicionarr =[
      { name: '保留中', id: 0 }, 
      { name: '承認', id: 1 }, 
      { name: '拒否', id: 2 }, 
      { name: '再送信', id: 3 }]
    }
    this.searchForm = this.formBuilder.group({
      flag: [1, Validators.required],
      searchDatas: this.formBuilder.array([this.sequenceType()])
    });
    this.getAll();
  }

  getAll(){
    this.service.approvallist().subscribe(
      data => {
        let requestListGetData = JSON.parse(data['_body']);
        let requestListTableDate = requestListGetData.succesObject;
        this.dataSource = [];
        if (requestListGetData.succesObject.length > 0) {
          this.dataSource = new MatTableDataSource(requestListGetData.succesObject);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.displayNoRecords = true;
        } else {
          this.displayNoRecords = false;
        }
        this.userRoleFieldName = requestListGetData.authSuccesObject.screenFieldDisplayVoList;
        this.searchCombo = [];
        let search;
        if (localStorage.getItem('langCode') == 'en') {
          search = [
            { name: 'Request Code', value: 'requestCode' },
            { name: 'Request ', value: 'requestTypeName' },
            { name: 'Sub Request', value: 'requestSubTypeName' },
            { name: 'Request Date', value: 'requestDate' },
            { name: 'Location', value: 'locationName' },
            { name: 'Sub Location', value: 'sublocationName' },
            { name: 'User Department', value: 'userDepartmentName' },
            { name: 'Current Status', value: 'currentStatusName' },
            { name: 'User Name', value: 'userName' },
            { name: 'Decision', value: 'descisionType' }
          ];
        }else if(localStorage.getItem('langCode') == 'jp'){
          search = [
            { name: 'コードを要求する', value: 'requestCode' },
            { name: '要求する ', value: 'requestTypeName' },
            { name: 'サブタイプのリクエスト', value: 'requestSubTypeName' },
            { name: '日を要求する', value: 'requestDate' },
            { name: '場所の名前', value: 'locationName' },
            { name: 'サブロケーション名', value: 'sublocationName' },
            { name: 'ユーザー部門名', value: 'userDepartmentName' },
            { name: '状態', value: 'currentStatusName' },
            { name: 'ユーザー名', value: 'userName' },
            { name: '決定タイプ', value: 'descisionType' }
          ];
        }
        for (let k in search) {
          if (search[k].value !== undefined) {
            let ll = this.userRoleFieldName.includes(search[k].value);
            if (ll === true) {
              this.searchCombo.push(search[k]);
            }
          }
        }
        let screenFunctionDisplayList = requestListGetData.authSuccesObject.screenFunctionDisplayList;
        for (let k in screenFunctionDisplayList) {
          if (screenFunctionDisplayList[k] === 'APPROVE') {
            this.approve = true;
          }
          if (screenFunctionDisplayList[k] === 'MODIFY') {
            this.modify = true;
          }
          if (screenFunctionDisplayList[k] === 'RESUBMIT') {
            this.resubmit = true;
          }
          if (screenFunctionDisplayList[k] === 'REJECT') {
            this.reject = true;
          }
          if (screenFunctionDisplayList[k] === 'VIEW') {
            this.view = true;
          }
        }
        this.componentLoaderService.display(false);
      },
      error => {
        if (error.status === 401) {
          console.log('Error');
        }
      }
    );
  }

/** ngOnit life cycle ends here */

  getLabelDetails() {
    let lang;
    if (localStorage.getItem('langCode') !== null) {
      lang = localStorage.getItem('langCode');
    }
    this.jsonApiService.fetch('/' + lang + '.json').subscribe((data) => {
      this.labels = data;
    });
  }
  /** multilingual methods ends here */

  exportAsXLSX(): void {
    if (this.dataSource.length !== 0) {
      this.requestService.exportAsExcelFile(this.dataSource.data, 'ApprovalReport');
    }
  }

  request_list_details() {
    let loadRequestList = this.service.load_requestGrid().subscribe(
      data => {
        let requestListGetData = JSON.parse(data['_body']);
        let requestListTableDate = requestListGetData.succesObject;
        this.dataSource = [];
        if (requestListTableDate.length > 0) {
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
  requestObj;
  userBaseFieldName: any = [];
  buttonValidation;
  viewMethod(id) {
    this.service.approvalfinalgetsingle(id).subscribe(data => {
      let Response = JSON.parse(data['_body']);
      if (Response.responseCode == '200') {
        this.requestObj = Response.succesObject.request;
        this.userBaseFieldName = Response.authSuccesObject.screenFieldDisplayVoList.map(
          element => {
            return element;
          });
        this.requestObj.requestDate = new Date(Response.succesObject.request.requestDate).toISOString().split('T')[0];
        this.requestObj.requestFromDate = moment(Response.succesObject.request.requestFromDate).format('DD/MM/YYYY');
        this.requestObj.requestToDate = moment(Response.succesObject.request.requestToDate).format('DD/MM/YYYY');
        // this.requestObj.requestDetailList = Response.succesObject.requestDetailList;
        this.requestObj.screenFieldDisplayVoList = this.userBaseFieldName

      }
    })

    this.service.approvalsingle(id).subscribe(data => {
      let Response = JSON.parse(data['_body']);
      if (Response.responseCode == '200') {
        this.buttonValidation = Response.succesObject.button;
        // this.singleapproval = Response.succesObject.requestWorkFlowAuditVoList[0];
        this.audioVoList = Response.succesObject.requestWorkFlowAuditVoList;
        this.singleapproval.screenFieldDisplayVoList = this.userBaseFieldName;
        this.componentLoaderService.display(false);
      } 
    })
  }

  approval(type) {
    // this.singleapproval = type;
    if (this.selection.selected.length !== 1) {
      const dialogRef1 = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        width: 'auto',
        data: {
          title: 'Alert',
          message: 'selection',
          btnYes: 'Ok',
          btnNo: 'Cancel'
        }
      });
      if (this.selection.selected.length > 1) {
        const dialogRef2 = this.dialog.open(ConfirmationDialogComponent, {
          disableClose: false,
          width: 'auto',
          data: {
            title: 'Alert',
            message: 'singleSelection',
            btnYes: 'Ok',
            btnNo: 'Cancel'
          }
        });
      }
    }

    else {

      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        width: 'auto',
        data: {
          title: 'Confirmation',
          message: 'Approval',
          btnYes: 'Yes',
          btnNo: 'No'
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
          this.viewMethod(this.selection.selected[0].requestId);
          this.selection.selected.forEach(item => {
            const dialogRemarks = this.dialog.open(ConfirmationDialogComponent, {
              disableClose: false,
              width: 'auto',
              data: {
                title: 'Remarks',
                message: null,
                mess: 1,
                reopen: item
              }
            });
            dialogRemarks.afterClosed().subscribe(result1 => {
              if(result1 === true){
                let jval: any = item;
              let remark = jval.remarks;
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
              this.singleapproval.remarks = remark;
              this.singleapproval.descisionType = type;
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
                      this.selection.clear();
                      this.ngOnInit();
                    });
                  }
                  else{
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
                      this.selection.clear();
                    });
                  }
                })
              }              
            })
          })
        }else{

        }
      })
    }
  }

  rejectal(type) {
    // this.singleapproval = type;
    if (this.selection.selected.length !== 1) {
      const dialogRef1 = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        width: 'auto',
        data: {
          title: 'Alert',
          message: 'selection',
          btnYes: 'Ok',
          btnNo: 'Cancel'
        }
      });
      if (this.selection.selected.length > 1) {
        const dialogRef2 = this.dialog.open(ConfirmationDialogComponent, {
          disableClose: false,
          width: 'auto',
          data: {
            title: 'Alert',
            message: 'singleSelection',
            btnYes: 'Ok',
            btnNo: 'Cancel'
          }
        });
      }
    }

    else {

      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        width: 'auto',
        data: {
          title: 'Confirmation',
          message: 'Reject',
          btnYes: 'Yes',
          btnNo: 'No'
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
          this.viewMethod(this.selection.selected[0].requestId);
          this.selection.selected.forEach(item => {
            const dialogRemarks = this.dialog.open(ConfirmationDialogComponent, {
              disableClose: false,
              width: 'auto',
              data: {
                title: 'remarks',
                message: null,
                mess: 1,
                reopen: item
              }
            });
            dialogRemarks.afterClosed().subscribe(result1 => {
              if(result1 === true){
                let jval: any = item;
              let remark = jval.remarks;let tempUserId = Number(localStorage.getItem('userId'));
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
              this.singleapproval.remarks = remark;
              this.singleapproval.descisionType = type;
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
                      this.selection.clear();
                      this.ngOnInit();
                      
                    });
                  }
                  else{
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
                      this.selection.clear();
                    });
                  }
                })
              
              }
              })
            
          })
        }
      })
    }
  }
  
  resubmital(type) {
    // this.singleapproval = type;
    if (this.selection.selected.length !== 1) {
      const dialogRef1 = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        width: 'auto',
        data: {
          title: 'Alert',
          message: 'selection',
          btnYes: 'Ok',
          btnNo: 'Cancel'
        }
      });
      if (this.selection.selected.length > 1) {
        const dialogRef2 = this.dialog.open(ConfirmationDialogComponent, {
          disableClose: false,
          width: 'auto',
          data: {
            title: 'Alert',
            message: 'singleSelection',
            btnYes: 'Ok',
            btnNo: 'Cancel'
          }
        });
      }
    }

    else {

      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        width: 'auto',
        data: {
          title: 'Confirmation',
          message: 'Resubmit',
          btnYes: 'Yes',
          btnNo: 'No'
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
          this.viewMethod(this.selection.selected[0].requestId);
          this.selection.selected.forEach(item => {
            const dialogRemarks = this.dialog.open(ConfirmationDialogComponent, {
              disableClose: false,
              width: 'auto',
              data: {
                title: 'remarks',
                message: null,
                mess: 1,
                reopen: item
              }
            });
            dialogRemarks.afterClosed().subscribe(result1 => {
              if(result1){
                let jval: any = item;
              let remark = jval.remarks;
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
              this.singleapproval.remarks = remark;
              this.singleapproval.descisionType = type;
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
                      this.selection.clear();
                      this.ngOnInit();
                      
                    });
                  }
                  else{
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
                      this.selection.clear();
                    });
                  }
                })
              }
              
            })
          })
        }
      })
    }
  }

  projectModify() {
    if (this.selection.selected.length > 0) {
      if (this.selection.selected.length !== 1) {
        const dialogRef1 = this.dialog.open(ConfirmationDialogComponent, {
          disableClose: false,
          width: 'auto',
          data: {
            title: 'Alert',
            message: 'singleSelection',
            btnYes: 'Ok',
            btnNo: 'Cancel'
          }
        });
      } else {
        const dialogRef2 = this.dialog.open(ConfirmationDialogComponent, {
          disableClose: false,
          width: 'auto',
          data: {
            title: 'Confirmation',
            message: 'modify',
            btnYes: 'Yes',
            btnNo: 'No'
          }
        });
        dialogRef2.afterClosed().subscribe(result => {
          if (result) {
            //this.viewMethod(this.selection.selected[0].requestId);
            this.selection.selected.forEach(row => {
              this.componentLoaderService.display(true);
              this.router.navigateByUrl('/approvalpage/' + row.requestId);
            });
          }
        });
      }
    } else {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        width: 'auto',
        panelClass: 'btnCenter',
        data: {
          title: 'Alert',
          message: 'selection',
          btnYes: 'Ok',
        }
      });
    }
  }

  sequenceType() {
    return this.formBuilder.group({
      dropDownVal: [''],
      textVal: ['']
    });
  }
  addSequence(form) {
    let j = form.controls.searchDatas.controls.length;
    let i = j - 1;
    let dropvalue = form.controls.searchDatas.controls[i].controls.dropDownVal.value;
    let textVal = form.controls.searchDatas.controls[i].controls.textVal.value;
    if (this.count <= 9 && dropvalue !== null && textVal != null) {
      (
        this.searchForm.controls['searchDatas'] as FormArray).push(this.sequenceType());
      this.count++;
    }
  }
  deleteSequence() {
    if (this.count > 1) {
      (this.searchForm.controls['searchDatas'] as FormArray).removeAt(-1);
      this.count--;
      this.qtd.pop();
    }
  }
  onSubmitSearch(val) {
      let finalSearchData = {};
    let formValue = val;
    for (let i = 0; i < formValue.searchDatas.length; i++) {
      let key = formValue.searchDatas[i]['dropDownVal'];
      let value = formValue.searchDatas[i]['textVal'];
      let fullValue = {};
      if (key != '' && value != '') {
        fullValue[key] = value;
        Object.assign(finalSearchData, fullValue);
      }
    }

    finalSearchData['flag'] = this.searchForm.value.flag;

    if(finalSearchData['null'] == null){
      finalSearchData['null'] = undefined
    }
    this.service.search_list(finalSearchData).subscribe(data => {
      let reqScrConfigSearchData = JSON.parse(data['_body']);
      this.dataSource = [];
      if (reqScrConfigSearchData.succesObject !== null) {
        this.dataSource = new MatTableDataSource(reqScrConfigSearchData.succesObject);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.displayNoRecords = true;
      } else {
        this.displayNoRecords = false;
      }
    });
    setTimeout(() => {
      if (this.dataSource.filteredData.length > 0 || this.selection.selected.length > 0) {
        this.displayNoRecords = true;
        this.selection.clear();
      } else {
        this.displayNoRecords = false;
      }
    }, 100);
    
  }

  searchClear() {
    for (let i = 0; i < this.searchForm.value.searchDatas.length; i++) {
      this.deleteSequence();
    }
    this.displayNoRecords = true;
    this.searchForm.reset();
    this.searchForm.controls['flag'].patchValue(1);
    this.getAll();
  }

  projectView() {
    if (this.selection.selected.length > 0) {
      if (this.selection.selected.length !== 1) {
        const dialogRef1 = this.dialog.open(ConfirmationDialogComponent, {
          disableClose: false,
          width: 'auto',
          data: {
            title: 'Alert',
            message: 'singleSelection',
            btnYes: 'Ok',
            btnNo: 'Cancel'
          }
        });
      } else {
        const dialogRef2 = this.dialog.open(ConfirmationDialogComponent, {
          disableClose: false,
          width: 'auto',
          data: {
            title: 'Confirmation',
            message: 'view',
            btnYes: 'Yes',
            btnNo: 'No'
          }
        });
        dialogRef2.afterClosed().subscribe(result => {
          if (result) {
            //this.viewMethod(this.selection.selected[0].requestId);
            this.selection.selected.forEach(row => {
              this.componentLoaderService.display(true);
              this.router.navigateByUrl('/approvalView/' + row.requestId);
            });
          }
        });
      }
    } else {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        width: 'auto',
        panelClass: 'btnCenter',
        data: {
          title: 'Alert',
          message: 'selection',
          btnYes: 'Ok',
        }
      });
    }
  }

  ngOnDestroy() {
    localStorage.removeItem('fromMytask');
  }

}


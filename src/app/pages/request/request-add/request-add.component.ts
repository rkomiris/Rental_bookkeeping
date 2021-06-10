import { Component, OnInit, ViewChild } from '@angular/core';
// import { MatDialog } from '@angular/material';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RequestAddService } from './request-add.service';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import { DatePipe } from '@angular/common';
import {
  MatPaginator,
  MatSort,
  MatTableDataSource,
  VERSION,
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { ComponentLoaderService } from '../../../shared/component-loader.service';
import { JsonApiService } from 'src/assets/api/json-api.service';
import * as moment from 'moment';

export interface requestListData {
  highlighted?: boolean;
  hovered?: boolean;
  requestId: number;
}

const ELEMENT_DATA: requestListData[] = [];
@Component({
  selector: 'app-request-add',
  templateUrl: './request-add.component.html',
  // styleUrls: ['./request-add.component.css']
  styleUrls: ['./request-add-srmav.component.css']
})
export class RequestAddComponent implements OnInit {
  f: FormGroup;
  count: number = 1;
  requestTypeList: any;
  requestSubTypeList: any;
  staticFieldComobo: any;
  fieldValidationCombo: any;
  locationList: any;
  subLocationList: any;
  priorityCombo: any;
  seqmodel: any = {};
  fromListData: any = [];
  club = [];
  requestBaseFieldName: any = [];
  dataSource: any = [];
  rowindex: any;
  displayNoRecords = true;
  display = true;
  seq = false;
  seq2 = true;
  reqLocationId: any;
  aftersubmit = false;
  reqplaceholder: any = {};
  reqsubplaceholder: any = {};
  finalplaceholer: any = {};
  setdashval = false;
  userBaseFieldName: any = [];
  readonly: Boolean;
  isReadonlyPriority: boolean = false;
  requestsubLocationList: any = [];
  labels: any = {};
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  selection = new SelectionModel<requestListData>(true, []);
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private requestAddService: RequestAddService,
    private datePipe: DatePipe,
    private jsonApiService: JsonApiService,
    private componentLoaderService: ComponentLoaderService
  ) {
    this.seqmodel.requestDate = new Date();
    this.seqmodel.requestFromDate = new Date();
    this.seqmodel.requestIsCancel = false;
  }
  ngOnInit() {
    this.componentLoaderService.display(true);
    this.onloadReqType();
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
  subname1(name) {
    this.reqplaceholder = name;
    this.seqmodel.requestSubject = this.reqplaceholder + '-' + this.reqsubplaceholder + ' - Request';
  }
  subname2(name, row) {
    if (row.requestSubtypePriorty != '0' && row.requestSubtypePriorty != null) {
      this.isReadonlyPriority = true;
      this.seqmodel.requestPriority = row.requestSubtypePriorty
    }
    this.reqsubplaceholder = name;
    this.seqmodel.requestSubject = this.reqplaceholder + '-' + this.reqsubplaceholder + ' - Request';
  }
  highlight(element: requestListData) {
    element.highlighted = !element.highlighted;
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }
  sequenceType() {
    return this.formBuilder.group({
      requestScreenConfigId: ['', Validators.required],
      requestScreenDetailConfigId: ['', Validators.required],
      requestScreenDetailConfigurationFieldType: ['', Validators.required],
      requestScreenDetailConfigurationFieldValue: ['', Validators.required],
      requestScreenDetailConfigurationIsActive: ['', Validators.required]
    });
  }
  onloadReqType() {
    this.requestAddService.addscreen().subscribe(data => {
      let selectGetData = JSON.parse(data['_body']);
      if(selectGetData.responseCode == '200'){
        this.userBaseFieldName = selectGetData.authSuccesObject.screenFieldDisplayVoList.map(
          element => {
            return element;
          }
        );
      } 
      else if(selectGetData.responseCode == '301'){
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
        dialogRef.afterClosed().subscribe(data => {
          this.router.navigate(['/request']);
        })
      }else{
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          disableClose: false,
          panelClass: 'btnCenter',
          width: 'auto',
          data: {
            title: 'Alert',
            server: 'servermessage',
            message: selectGetData.responseMessage,
            btnYes: 'Ok',
          }
        });
      }
      
      this.componentLoaderService.display(false);
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
    this.requestAddService.deptId().subscribe(
      data => {
        let resp = JSON.parse(data['_body']);
        if(resp.responseCode == '200'){
            let requestdefaultList = resp.succesObject;
          this.seqmodel.requestMobileNo = requestdefaultList.requestMobileNo;
          this.seqmodel.userDepartmentName = requestdefaultList.userDepartmentName;
          this.seqmodel.departmentId = requestdefaultList.departmentId;
          this.seqmodel.requestAttachment = requestdefaultList.requestAttachment;
          this.seqmodel.locationName = requestdefaultList.locationName;
          this.seqmodel.id = requestdefaultList.id;
          // this.requestTypeList = requestdefaultList.requestTypeVoList;
          this.seqmodel.sublocationId = requestdefaultList.sublocationId;
          this.seqmodel.sublocationName = requestdefaultList.sublocationName;
          this.seqmodel.reqLocationId = requestdefaultList.id;
          this.reqLocationId = this.seqmodel.reqLocationId ;
          this.seqmodel.reqSublocationId = requestdefaultList.sublocationId;
          this.getSubLocationList(this.seqmodel.id);
          let reqfordashboard = localStorage.getItem('requestTypeId');
          let requestTypeNamedashboard = localStorage.getItem('requestTypeName');
          if (reqfordashboard !== null) {
            let kk = Number(reqfordashboard);
            this.seqmodel.requestTypeId = kk;
            this.setdashval = true;
            this.getSubTypeList(this.seqmodel.requestTypeId);
            this.subname1(requestTypeNamedashboard);
          }
        }else{
          const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            disableClose: false,
            panelClass: 'btnCenter',
            width: 'auto',
            data: {
              title: 'Alert',
              server: 'servermessage',
              message: resp.responseMessage,
              btnYes: 'Ok',
            }
          });
        }
        
      },
      error => {
        if (error.status === 401) {
          console.log('Error');
        }
      }
    );
    /**/
    this.requestAddService.load_selectBox_LocationData().subscribe(
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
    /* Request Type List */
    this.requestAddService.load_reqtypeList().subscribe(
      data => {
        let resp = JSON.parse(data['_body']);
        this.requestTypeList = resp.succesObject;
      },
      error => {
        if (error.status === 401) {
          console.log('Error');
        }
      }
    );
    this.staticFieldComobo = [
      { Type: 'text', Value: 'textBox' },
      { Type: 'dropdown', Value: 'comboBox' }
    ];
    this.fieldValidationCombo = [
      { Name: 'Yes', Value: true },
      { Name: 'No', Value: false }
    ];
    if(localStorage.getItem('langCode') == 'en'){
      this.priorityCombo = [
      { id: 1, Value: 'Low' },
      { id: 2, Value: 'Medium' },
      { id: 3, Value: 'High' }
    ];
    }else if(localStorage.getItem('langCode') == 'jp'){
      this.priorityCombo = [
        { name: '低い', id: 1 },
        { name: '中', id: 2 },
        { name: '高い', id: 3 }
      ];
    }
    
  }
  getSubTypeList(eve) {
    this.requestAddService.getSubTypeList(eve).subscribe(
      data => {
        let resp = JSON.parse(data['_body']);
        this.requestSubTypeList = resp.succesObject;
      },
      error => {
        console.log(error);
      }
    );
  }
  getDeptLocation(val, locationId){
    this.requestAddService.load_selectBox_departmentData({locationId: locationId, sublocationId:val}).subscribe(
      data => {
        let resp = JSON.parse(data['_body']);
        this.subLocationList = resp.succesObject;
      },
      error => {
        console.log(error);
      }
    );
  }
  getSubLocationList(eve) {
    this.requestAddService.load_selectBox_subLocationData(eve).subscribe(
      data => {
        let resp = JSON.parse(data['_body']);
        this.subLocationList = resp.succesObject;
        this.requestsubLocationList = resp.succesObject;
      },
      error => {
        console.log(error);
      }
    );
  }
  getrequestSubLocation(eve) {
    this.requestAddService.load_selectBox_subLocationData(eve.value).subscribe(
      data => {
        let resp = JSON.parse(data['_body']);
        this.requestsubLocationList = resp.succesObject;
      },
      error => {
        console.log(error);
      }
    );
  }
  getCheckboxes(withmodel, val, gg, f1, g) {
    if (withmodel === true) {
      this.club.push(val);
    } else if (withmodel === false) {
      let index = this.club.indexOf(val);
      if (index > -1) {
        this.club.splice(index, 1);
      }
    }
    if (this.club.length > 0) {
      f1.errors = { required: false };
    } else {
      f1.errors = { required: true };
    }
    gg.objectList = this.club;
  }
  cancel() {
    this.ngOnInit();
    this.onloadReqType();
    this.seq = false;
    this.seq2 = true;
    this.seqmodel.requestDetailList = [];
    this.seqmodel.requestExtension = '';
    this.seqmodel.requestIsCancel = false;
    this.seqmodel.requestSubtypeId = '';
    this.seqmodel.requestAttachment = '',
      this.seqmodel.requestToDate = null;
    this.seqmodel.requestTypeId = '';
    this.dataSource = [];
    this.display = true;
    this.aftersubmit = false;

  }
  mycall(reqtype, reqsubtype, location, sublocation) {
    if (reqsubtype == null || reqsubtype == undefined) {
      this.seq = false;
      this.seq2 = true;
      this.seqmodel.requestDetailList = [];
      this.seqmodel.requestExtension = '';
      this.seqmodel.requestIsCancel = false;
      this.seqmodel.requestAttachment = '',
        this.seqmodel.requestToDate = null;
      this.dataSource = [];
      this.display = true;
      this.aftersubmit = false;
    }
    let ch: any = {};
    ch.requestTypeId = reqtype;
    ch.requestSubtypeId = reqsubtype;
    ch.id = location;
    ch.sublocationId = sublocation;
    ch.departmentId = this.seqmodel.departmentId;
    ch.reqLocationId = this.seqmodel.reqLocationId;
    ch.reqSublocationId = this.seqmodel.reqSublocationId;
    if (reqtype !== undefined && reqsubtype !== undefined && location !== undefined && sublocation !== undefined) {
      this.requestAddService.checkworkflow(ch).subscribe(
        data => {
          let resp = JSON.parse(data['_body']);
          if (resp.responseCode === '200') {
            this.getsequenceList(reqtype, reqsubtype);
          } 
          else if (resp.responseCode == '301') {
            const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
              disableClose: false,
              panelClass: 'btnCenter',
              width: 'auto',
              data: {
                title: 'Alert',
                message: 'anotherRequest',
                btnYes: 'Yes',
                btnNo: 'No'
              }
            });
            dialogRef.afterClosed().subscribe(data => {
              if (data == true) {
                this.getsequenceList(reqtype, reqsubtype);
              }
              else {
                this.router.navigate(['/request']);
              }
            });

          } else {
            this.seq = false;
            this.seq2 = true;
            this.seqmodel.requestSubtypeId = '';
            const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
              disableClose: false,
              panelClass: 'btnCenter',
              width: 'auto',
              data: {
                title: 'Info',
                server: 'servermessage',
                message: resp.responseMessage,
                btnYes: 'OK'
              }
            });

          }
        });
    }
  }

  getsequenceList(types, sub) {
    let tt: any = {};
    tt.requestTypeId = types;
    tt.requestSubtypeId = sub;
    this.requestAddService.reqDeatailList(tt).subscribe(
      data => {
        let resp = JSON.parse(data['_body']);
        this.seqmodel.requestDetailList = resp.succesObject;
        if (resp.responseCode == '200' && this.seqmodel.requestDetailList != null) {
          this.seq = true;
          this.seq2 = false;
        } else {
          this.seq = false;
          this.seq2 = true;
          const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            disableClose: false,
            panelClass: 'btnCenter',
            width: 'auto',
            data: {
              title: 'Info',
              server: 'servermessage',
              message: resp.responseMessage,
              btnYes: 'OK'
            }
          });
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  locationTemp;
  departmentTemp;
  onSubmit(f) {    
    this.seqmodel.screenFieldDisplayVoList = this.userBaseFieldName;
    let attachment = this.seqmodel.requestAttachment;
    let department = this.seqmodel.userDepartmentName;
    let location = this.seqmodel.locationName;
    this.locationTemp = this.seqmodel.locationName;
    this.departmentTemp = this.seqmodel.userDepartmentName;

    for(let i = 0; i < this.seqmodel.requestDetailList.length; i++){
      if(this.seqmodel.requestDetailList[i].requestScreenDetailConfigurationFieldType == 'D'){
        if(this.seqmodel.requestDetailList[i].requestScreenDetailConfigurationFieldValue != ""){
          this.seqmodel.requestDetailList[i].requestScreenDetailConfigurationFieldValue
        = moment(this.seqmodel.requestDetailList[i].requestScreenDetailConfigurationFieldValue).format('YYYY-MM-DD');
        }else{
          this.seqmodel.requestDetailList[i].requestScreenDetailConfigurationFieldValue = "";
        }
        
      }
    }
    

    let file = null;
    if (this.seqmodel.requestAttachment != null && this.seqmodel.requestAttachment != '') {
      file = this.seqmodel.requestAttachment.files[0];
    }
    if(this.seqmodel.requestExtension != null){

      let value = this.seqmodel.requestExtension;
      let integer = Number(value)
      this.seqmodel.requestExtension = integer;
    }
    
    
    this.seqmodel.requestAttachment = undefined;
    // this.seqmodel.userDepartmentName = undefined;
    // this.seqmodel.locationName = undefined;

    let formData = new FormData();
    let action = JSON.stringify(this.seqmodel);
    
    this.seqmodel.requestAttachment = attachment;
    formData.append('action', action);
    // formData['action'] = action;
    if (file != null) {
      // formData['file'] = file;
      formData.append('file',file);
    }

    this.componentLoaderService.display(true);

    this.requestAddService.addProjectList(formData).subscribe(
      data => {
        this.componentLoaderService.display(false);
        let resp = JSON.parse(data['_body']);
        if (resp.responseCode === '200') {
          this.seqmodel.requestAttachment = attachment;
          this.seqmodel.locationName = location;
          this.seqmodel.userDepartmentName = department;
          const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            disableClose: false,
            panelClass: 'btnCenter',
            width: 'auto',
            data: {
              title: 'Info',
              server: 'servermessage',
              message: resp.responseMessage,
              btnYes: 'OK'
            }
          });
          dialogRef.afterClosed().subscribe(data => {
            this.router.navigate(['/request']);
            let requestListTableDate = resp.succesObject;
            this.dataSource = new MatTableDataSource(requestListTableDate.requestWorkFlowAuditVoList);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.requestBaseFieldName = ['userName', 'approvalExecuter', 'descisionType', 'remarks', 'approvedon', 'Sla'];
            this.display = false;
            this.aftersubmit = true;
            this.readonly = true;
          });
        } else {
          this.seqmodel.locationName = this.locationTemp;
          this.seqmodel.userDepartmentName = this.departmentTemp;
          const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            disableClose: false,
            panelClass: 'btnCenter',
            width: 'auto',
            data: {
              title: 'Alert',
              server: 'servermessage',
              message: resp.responseMessage,
              btnYes: 'OK'
            }
          });
        }
      },
      error => {
        console.log(error);
      }
    );
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  event(event): boolean {
    let sample = event.srcElement.value;
    if (sample == "") {
      return false;
    }
  }
}

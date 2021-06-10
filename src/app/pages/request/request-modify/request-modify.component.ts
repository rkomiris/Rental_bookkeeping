import { Component, OnInit, ViewChild, Output, Inject } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, VERSION, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import { FormControl, FormBuilder, FormGroup, FormArray, Validators, NgForm, Form } from '@angular/forms';
import { RequestScrconfigAddService } from '../../request-scrconfig/request-scrconfig-add/request-scrconfig-add.service';
import { RequestService } from '../request.service';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { ComponentLoaderService } from '../../../shared/component-loader.service';
import { JsonApiService } from 'src/assets/api/json-api.service';
@Component({
  selector: 'app-request-modify',
  templateUrl: './request-modify.component.html',
  // styleUrls: ['./request-modify.component.css']
  styleUrls: ['./request-modify-srmav.component.css']
})

export class RequestModifyComponent implements OnInit {
  // saveForm: FormGroup;
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
  tempRequestObjDetailList: any = [];
  requestObj: any = {};
  @ViewChild('saveForm') saveForm: NgForm;
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
  priorityCombo: any = [];
  finalplaceholer: any = {};
  userBaseFieldName: any = [];
  attachment: Boolean = true;
  requestsubLocationList: any = [];
  labels: any = {};/** LABEL CHANGES **/  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private requestScrconfigAddService: RequestScrconfigAddService,
    private router: Router,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private requestModifyService: RequestService,
    private jsonApiService: JsonApiService,
    private componentLoaderService: ComponentLoaderService
  ) { }

  ngOnInit() {
    this.componentLoaderService.display(true);
    this.onloadDropdownData();
    this.reqViewDetailsField = ['sequance', 'user', 'group', 'descision type'];
    this.dataSource = new MatTableDataSource<{}>([]);
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
  onloadDropdownData() {
    this.requestModifyService.getDropdownData().subscribe(
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
      { id: 1, Value: 'Low' },
      { id: 2, Value: 'Medium' },
      { id: 3, Value: 'High' }
    ];
    this.requestModifyService.load_selectBox_LocationData().subscribe(
      data => {
        let resp = JSON.parse(data['_body']);
        this.locationList = resp.succesObject;
      },
      error => {
        if (error.status === 401) {
        }
      }
    );
  }
  loadRequestDetailsById() {
    if (localStorage.getItem('requestId') !== null) {
      let id = localStorage.getItem('requestId');
      this.loadRequestDetails(id);
    }
  }
  loadRequestDetails(id) {
    let requestDetailsSub = this.requestModifyService
      .loadRequestDetailsById(id)
      .subscribe(
        data => {
          let datalist = JSON.parse(data['_body']);
          this.seqmodel = datalist.succesObject.request;
          this.userBaseFieldName = datalist.authSuccesObject.screenFieldDisplayVoList.map(
            element => {
              return element;
            }
          );
          if (datalist.succesObject.requestDetailList[0].requestScreenConfigId === 0 || datalist.succesObject.requestDetailList[0].requestScreenDetailConfigId === 0) {
            this.seqmodel.requestDetailList = null;
          } else {
            this.seqmodel.requestDetailList = datalist.succesObject.requestDetailList;
          }
          this.seqmodel.requestSubject = this.seqmodel.requestSubject;
          if (this.seqmodel.requestToDate !== null) {
            this.seqmodel.requestToDate = new Date(this.seqmodel.requestToDate);
          }else{
            this.seqmodel.requestToDate = null;
          }
          if (this.seqmodel.requestFromDate !== null) {
            this.seqmodel.requestFromDate = new Date(this.seqmodel.requestFromDate);
          }
          
          if (this.seqmodel.createdDate !== null) {
            this.seqmodel.createdDate = moment(this.seqmodel.createdDate).format('MMM, DD YYYY hh:mm a');
          }
          this.seqmodel.requestDate = new Date(this.seqmodel.requestDate);
          this.getSubTypeList(this.seqmodel.requestTypeId);
          this.dataSource = new MatTableDataSource(datalist.succesObject.requestWorkFlowAuditVoList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.display = false;
          this.requestBaseFieldName = ['userName', 'approvalExecuter', 'descisionType', 'approvedon', 'Sla', 'remarks','forwardRedirectRemarks'];
          this.requestModifyService.load_selectBox_subLocationData(this.seqmodel.id).subscribe(data1 => {
            let subLoca = JSON.parse(data1['_body']);
            this.subLocationList = subLoca.succesObject;
            this.requestsubLocationList = subLoca.succesObject;
          });
          this.seq = true;
          this.componentLoaderService.display(false);
        },
        error => {
        }
      );
    this.subscriptionlist.push(requestDetailsSub);
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

  onSubmit(f, value) {

    this.seqmodel.screenFieldDisplayVoList = this.userBaseFieldName;
    value.requestDetailList = [];
    this.seqmodel.requestDetailList[0] = this.seqmodel.requestDetailList[0];
    
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

    this.seqmodel.requestId = localStorage.getItem('requestId');
    this.seqmodel.id = this.seqmodel.id;
    this.seqmodel.currentStatusCode = "RS";

    let attachment = this.seqmodel.requestAttachment;
    let department = this.seqmodel.userDepartmentName;
    let location = this.seqmodel.locationName;

    let formData = new FormData();

    this.seqmodel.requestAttachment = undefined;
    // this.seqmodel.userDepartmentName = undefined;
    // this.seqmodel.locationName = undefined;

    this.seqmodel.createdDate = new Date(this.seqmodel.createdDate);
    this.seqmodel['Screen Changes'] = undefined;
    let action = JSON.stringify(this.seqmodel);
    formData.append('action', action);
    this.seqmodel.requestAttachment = attachment;

    if (value.requestAttachment == null) {
      let file = value.requestAttachment;
      formData.append('file', file);
    }
    else if (attachment.files !== undefined) {
      let file = attachment.files[0];
      formData.append('file', file);
    }
    delete value["Screen Changes"];
    delete value["requestAttachment"];
    delete value["userDepartmentName"];
    delete value["locationName"];

    this.requestModifyService.updateProjectList(formData).subscribe(
      data => {
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

            let requestListTableDate = resp.succesObject;
            this.dataSource = new MatTableDataSource(requestListTableDate.requestWorkFlowAuditVoList);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.requestBaseFieldName = ['userName', 'approvalExecuter', 'remarks','forwardRedirectRemarks', 'descisionType'];
            this.display = false;
            this.aftersubmit = true;
            this.router.navigate(['/request']);
          });
        } else {
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
        this.componentLoaderService.display(false);
      },
      error => {
      }
    );
  }
  isSelected(val, json, jj) {
    return json.objectList.indexOf(val) >= 0;
  }
  updateCheckedOptions(chBox, event, data) {
    let cbIdx = data.objectList.indexOf(chBox);
    if (event.checked === true) {
      data.objectList.push(chBox);
    } else {
      let index = data.objectList.indexOf(chBox);
      if (index > -1) {
        data.objectList.splice(index, 1);
      }
    }
  }

  download(event) {
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

  }

  clear() {
    this.attachment = false;
  }

  getrequestSubLocation(eve) {
    this.requestModifyService.load_selectBox_subLocationData(eve.value).subscribe(
      data => {
        let resp = JSON.parse(data['_body']);
        this.requestsubLocationList = resp.succesObject;
      },
      error => {
      }
    );
  }
}

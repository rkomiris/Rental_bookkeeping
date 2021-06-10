import { Component, OnInit, ViewChild, OnDestroy, Output, Inject } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, VERSION, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import { FormControl, FormBuilder, FormGroup, FormArray, Validators, NgForm, Form } from '@angular/forms';
import { RequestScrconfigAddService } from '../../request-scrconfig/request-scrconfig-add/request-scrconfig-add.service';
import { RequestService } from '../request.service';
import { Subscription, from } from 'rxjs';
import { ComponentLoaderService } from '../../../shared/component-loader.service';
import { RequestHistoryService } from '../../request-summary/request-history/request-history.service';
import { JsonApiService } from 'src/assets/api/json-api.service';
import * as moment from 'moment';

@Component({
  selector: 'app-request-view',
  templateUrl: './request-view.component.html',
  // styleUrls: ['./request-view.component.css']
  styleUrls: ['./request-view-srmav.component.css']
})

export class RequestViewComponent implements OnInit {
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
  userBaseFieldName: any = [];
  dataSource: any = [];
  dataSource1: any = [];
  reqViewDetailsField: any = [];
  requestTypeList: any = [];
  seqmodel: any = {};
  fromListData: any = [];
  club = [];
  requestBaseFieldName: any = [];
  requestresSubmitBaseFieldName: any = [];
  rowindex: any;
  displayNoRecords = true;
  display = true;
  seq = false;
  aftersubmit = false;
  locationList: any = [];
  subLocationList: any = [];
  priorityCombo: any = [];
  checkboxvalidation = false;
  checkboxvalidationfieldname = '';
  backEnable: Boolean;
  backSummaryEnable: Boolean;
  reqView: Boolean;
  seqmodel2: any = [];
  seqmodel3: any = [];
  labels: any = {};

  finalplaceholer: any = {};
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('sort') sort: MatSort;
  @ViewChild('paginator1') paginator1: MatPaginator;
  @ViewChild('sort1') sort1: MatSort;


  constructor(
    private requestScrconfigAddService: RequestScrconfigAddService,
    private router: Router,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private requestModifyService: RequestService,
    private componentLoaderService: ComponentLoaderService,
    private appService: RequestHistoryService,
    private jsonApiService: JsonApiService
  ) { }

  ngOnInit() {
    this.componentLoaderService.display(true);
    this.reqViewDetailsField = ['sequance', 'user', 'group', 'descision type'];
    this.dataSource = new MatTableDataSource<{}>([]);
    this.onloadDropdownData();
    this.getLabelDetails();

  }
  /**** LABEL CHNAGES ****/
  getLabelDetails() {
    let lang;
    if (localStorage.getItem('langCode') !== null) {
      lang = localStorage.getItem('langCode');
    }
    this.jsonApiService
      .fetch('/' + lang + '.json')
      .subscribe((data) => {
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

      // if (localStorage.getItem('request-history') == 'active') {
      //   this.loadRequestHistoryDetails(id);
      // }
      // else if (localStorage.getItem('my-request') == 'active') {
      //   this.loadMyRequestDetails(id);
      // } else {
      this.loadRequestDetails(id);
      // }
    }
  }

  loadRequestDetails(id) {
    let requestDetailsSub = this.requestModifyService.loadRequestDetailsById(id).subscribe(data => {
      let datalist = JSON.parse(data['_body']);
      this.seqmodel = datalist.succesObject.request;
      this.userBaseFieldName = datalist.authSuccesObject.screenFieldDisplayVoList.map(
        element => {
          return element;
        }
      );
      this.seqmodel.requestDetailList = datalist.succesObject.requestDetailList;
      this.seqmodel.requestSubject = this.seqmodel.requestSubject;
      this.seqmodel.requestAttachment = this.seqmodel.requestAttachment;
      if (this.seqmodel.requestToDate !== null) {
        this.seqmodel.requestToDate = new Date(this.seqmodel.requestToDate);
      }

      if (this.seqmodel.requestFromDate !== null) {
        this.seqmodel.requestFromDate = new Date(this.seqmodel.requestFromDate);
      }
      if (this.seqmodel.createdDate !== null) {
        // this.seqmodel.createdDate = new Date(this.seqmodel.createdDate);
        this.seqmodel.createdDate = moment(this.seqmodel.createdDate).format('MMM, DD YYYY hh:mm a');
      }

      //this.seqmodel.requestDate = new Date(this.seqmodel.requestDate);
      this.seqmodel.requestDate = new Date(datalist.succesObject.request.requestDate).toISOString().split('T')[0];

      this.getSubTypeList(this.seqmodel.requestTypeId);

      this.dataSource = new MatTableDataSource(datalist.succesObject.requestWorkFlowAuditVoList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.display = false;
      this.requestBaseFieldName = ['userName', 'approvalExecuter', 'descisionType', 'approvedon', 'Sla', 'remarks', 'forwardRedirectRemarks'];
      if (datalist.succesObject.reSubmitList != null && datalist.succesObject.reSubmitList.length >= 1) {
        this.dataSource1 = new MatTableDataSource(datalist.succesObject.reSubmitList);
        this.dataSource1.paginator1 = this.paginator1;
        this.dataSource1.sort1 = this.sort1;
        this.requestresSubmitBaseFieldName = ['userName', 'approvalExecuter', 'descisionType', 'approvedon', 'Sla', 'remarks', 'forwardRedirectRemarks'];
      }
      this.requestModifyService.load_selectBox_subLocationData(this.seqmodel.reqLocationId).subscribe(data1 => {
        let subLoca = JSON.parse(data1['_body']);
        this.subLocationList = subLoca.succesObject;
      });
      this.seq = true;
      this.componentLoaderService.display(false);
      if (this.router.url != localStorage.getItem('summaryUrl')) {
        this.backEnable = true;
        this.reqView = false;

      } else {
        this.backEnable = false;
        this.reqView = true;
      }
    },
      error => {
      }
    );
    this.subscriptionlist.push(requestDetailsSub);
  }

  /**** Request History ***************/
  loadRequestHistoryDetails(id) {
    let request = this.requestModifyService.loadRequestDetailsById(id).subscribe(data => {
      let datalist = JSON.parse(data['_body']);
      this.seqmodel2 = datalist.succesObject.request;
      this.userBaseFieldName = datalist.authSuccesObject.screenFieldDisplayVoList.map(
        element => {
          return element;
        }
      );

    });

    let requestDetailsSub = this.appService.reqAllList(id)
      .subscribe(
        data => {
          let datalist = JSON.parse(data['_body']);
          this.seqmodel = datalist.succesObject.request;
          this.seqmodel.requestDetailList = datalist.succesObject.requestDetailList;
          this.seqmodel.requestSubject = this.seqmodel.requestSubject;
          this.seqmodel.requestAttachment = this.seqmodel.requestAttachment;
          if (this.seqmodel.requestToDate !== null) {
            this.seqmodel.requestToDate = new Date(this.seqmodel.requestToDate);
          }
          if (this.seqmodel.requestFromDate !== null) {
            this.seqmodel.requestFromDate = new Date(this.seqmodel.requestFromDate);
          }
          if (this.seqmodel.createdDate !== null) {
            // this.seqmodel.createdDate = new Date(this.seqmodel.createdDate);
            this.seqmodel.createdDate = moment(this.seqmodel.createdDate).format('MMM, DD YYYY hh:mm a');
          }
          this.seqmodel.requestDate = new Date(this.seqmodel.requestDate);
          this.getSubTypeList(this.seqmodel.requestTypeId);

          this.dataSource = new MatTableDataSource(datalist.succesObject.requestWorkFlowAuditVoList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.display = false;
          this.requestBaseFieldName = ['userName', 'approvalExecuter', 'descisionType', 'approvedon', 'Sla', 'remarks', 'forwardRedirectRemarks'];
          if (datalist.succesObject.reSubmitList != null && datalist.succesObject.reSubmitList.length >= 1) {
            this.dataSource1 = new MatTableDataSource(datalist.succesObject.reSubmitList);
            this.dataSource1.paginator1 = this.paginator1;
            this.dataSource1.sort1 = this.sort1;
            this.requestresSubmitBaseFieldName = ['userName', 'approvalExecuter', 'descisionType', 'approvedon', 'Sla', 'remarks', 'forwardRedirectRemarks'];
          }
          this.requestModifyService.load_selectBox_subLocationData(this.seqmodel.id).subscribe(data1 => {
            let subLoca = JSON.parse(data1['_body']);
            this.subLocationList = subLoca.succesObject;
          });
          this.seq = true;
          this.componentLoaderService.display(false);
          if (this.router.url != localStorage.getItem('summaryUrl')) {
            this.backEnable = true;
            this.reqView = false;

          } else {
            this.backEnable = false;
            this.reqView = true;
          }
        },
        error => {
        }
      );
    this.subscriptionlist.push(requestDetailsSub);
  }

  /*********** My Request ****************/
  loadMyRequestDetails(id) {
    let request = this.requestModifyService.loadRequestDetailsById(id).subscribe(data => {
      let datalist = JSON.parse(data['_body']);
      this.seqmodel2 = datalist.succesObject.request;
      this.userBaseFieldName = datalist.authSuccesObject.screenFieldDisplayVoList.map(
        element => {
          return element;
        }
      );
    });

    let requestDetailsSub = this.appService.myRequestAllList(id)
      .subscribe(
        data => {
          let datalist = JSON.parse(data['_body']);
          this.seqmodel = datalist.succesObject.request;
          this.seqmodel.requestDetailList = datalist.succesObject.requestDetailList;
          this.seqmodel.requestSubject = this.seqmodel.requestSubject;
          this.seqmodel.requestAttachment = this.seqmodel.requestAttachment;
          if (this.seqmodel.requestToDate !== null) {
            this.seqmodel.requestToDate = new Date(this.seqmodel.requestToDate);
          }

          if (this.seqmodel.requestFromDate !== null) {
            this.seqmodel.requestFromDate = new Date(this.seqmodel.requestFromDate);
          }
          if (this.seqmodel.createdDate !== null) {
            // this.seqmodel.createdDate = new Date(this.seqmodel.createdDate);
            this.seqmodel.createdDate = moment(this.seqmodel.createdDate).format('MMM, DD YYYY hh:mm a');
          }
          this.seqmodel.requestDate = new Date(this.seqmodel.requestDate);
          this.getSubTypeList(this.seqmodel.requestTypeId);

          // this.dataSource = new MatTableDataSource(datalist.succesObject.requestWorkFlowAuditVoList);
          // this.dataSource.paginator = this.paginator;
          // this.dataSource.sort = this.sort;
          // this.display = false;
          // this.requestBaseFieldName = ['userName', 'approvalExecuter', 'descisionType', 'approvedon', 'Sla', 'remarks', 'forwardRedirectRemarks'];
          // if (datalist.succesObject.reSubmitList != null && datalist.succesObject.reSubmitList.length >= 1) {
          //   this.dataSource1 = new MatTableDataSource(datalist.succesObject.reSubmitList);
          //   this.dataSource1.paginator1 = this.paginator1;
          //   this.dataSource1.sort1 = this.sort1;
          //   this.requestresSubmitBaseFieldName = ['userName', 'approvalExecuter', 'descisionType', 'approvedon', 'Sla', 'remarks', 'forwardRedirectRemarks'];
          // }

          this.dataSource = new MatTableDataSource(datalist.succesObject.requestWorkFlowAuditVoList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.display = false;
          this.requestBaseFieldName = ['userName', 'approvalExecuter', 'descisionType', 'approvedon', 'Sla', 'remarks', 'forwardRedirectRemarks'];
          if (datalist.succesObject.reSubmitList != null && datalist.succesObject.reSubmitList.length >= 1) {
            this.dataSource1 = new MatTableDataSource(datalist.succesObject.reSubmitList);
            this.dataSource1.paginator1 = this.paginator1;
            this.dataSource1.sort1 = this.sort1;
            this.requestresSubmitBaseFieldName = ['userName', 'approvalExecuter', 'descisionType', 'approvedon', 'Sla', 'remarks', 'forwardRedirectRemarks'];
          }

          this.requestModifyService.load_selectBox_subLocationData(this.seqmodel.id).subscribe(data1 => {
            let subLoca = JSON.parse(data1['_body']);
            this.subLocationList = subLoca.succesObject;
          });
          this.seq = true;
          this.componentLoaderService.display(false);
          if (this.router.url != localStorage.getItem('summaryUrl')) {
            this.backEnable = true;
            this.reqView = false;

          } else {
            this.backEnable = false;
            this.reqView = true;
          }
        },
        error => {
        }
      );
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

  download(event) {
    if (this.seqmodel.requestAttachment == null) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        width: 'auto',
        data: {
          title: 'Alert',
          message: 'attachment',
          btnYes: 'OK',
        }
      });
    }
    else {
      this.requestModifyService.picDownloadFn(event).subscribe(
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
        });
    }
  }

  ngOnDestroy() {
    localStorage.removeItem('requestId');
    localStorage.removeItem('request-history');
    localStorage.removeItem('my-request');
    localStorage.removeItem('summaryUrl');
  }
}

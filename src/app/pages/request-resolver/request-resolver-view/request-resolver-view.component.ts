import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RequestScrconfigAddService } from '../../request-scrconfig/request-scrconfig-add/request-scrconfig-add.service';
import { RequestService } from '../../request/request.service';
import { Subscription } from 'rxjs';
import { RequestResolverViewService } from './request-resolver-view.service';
import { ComponentLoaderService } from '../../../shared/component-loader.service';
import { JsonApiService } from 'src/assets/api/json-api.service';
import { HeaderService } from 'src/app/shared/layout/app-layout/header/header.service';
import * as moment from 'moment';
import { RequestResolverModifyService } from '../request-resolver-modify/request-resolver-modify.service';
@Component({
  selector: 'app-request-resolver-view',
  templateUrl: './request-resolver-view.component.html',
  // styleUrls: ['./request-resolver-view.component.css']
  styleUrls: ['./request-resolver-view-srmav.component.css']
})
export class RequestResolverViewComponent implements OnInit, OnDestroy {
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
  formDetails: any;
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
  checkboxvalidation = false;
  checkboxvalidationfieldname = '';
  userDropDown: any = [];
  reassignUserId: any = '';
  remarks: any = null;
  labels: any = {};
  displayUserName;
  userBaseFieldName: any = [];
  
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private requestScrconfigAddService: RequestScrconfigAddService,
    private router: Router,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private requestModifyService: RequestService,
    private requestResolverViewService: RequestResolverViewService,
    private requestResolverService: RequestResolverModifyService,
    private componentLoaderService: ComponentLoaderService,
    private jsonApiService: JsonApiService,    
    private headerService: HeaderService) { }

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
    this.requestModifyService.getDropdownData().subscribe(
      data => {
        let resp = JSON.parse(data['_body']);
        this.requestTypeList = resp.succesObject;
        this.loadRequestDetailsById();
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
    this.requestModifyService.load_selectBox_LocationData().subscribe(
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

  loadRequestDetailsById() {
    if (localStorage.getItem('requestId') !== null) {
      let id = localStorage.getItem('requestId');
      this.loadRequestDetails(id);
    }
  }
  loadRequestDetails(id) {
    let requestDetailsSub = this.requestResolverViewService
      .loadRequestDetailsById(id)
      .subscribe(
        data => {
          let datalist = JSON.parse(data['_body']);
          this.seqmodel = datalist.succesObject.request;
          this.seqmodel.requestDetailList = datalist.succesObject.requestDetailList;
          this.userBaseFieldName = datalist.authSuccesObject.screenFieldDisplayVoList.map(
            element => {
              return element;
            }
          );
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
          this.display = false;
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
    // let resolverList = this.requestModifyService
    //   .loadResolverList(id)
    //   .subscribe(
    //     data => {
    //       this.requestBaseFieldName = ['userName', 'approvalExecuter', 'Status', 'remarks', 'approvedon'];
    //       let datalist = JSON.parse(data['_body']);
    //       this.dataSource = new MatTableDataSource(datalist.succesObject);
    //       this.dataSource.paginator = this.paginator;
    //       this.dataSource.sort = this.sort;
    //     },
    //     error => {
    //     });

    let resolversubmitDetails = this.requestResolverService.loadsubmitDetails(id).subscribe(data => {
          let datalist = JSON.parse(data['_body']);
          this.formDetails = datalist.succesObject[0].requestWorkFlowAuditVo;
        },
        error => {
        });
    let userDropdownList = this.requestResolverViewService
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
        console.log(error);
      }
    );
  }

  completedAction() {
    this.formDetails.descisionType = "4";
    this.formDetails.remarks = this.remarks;
    let completedAction = this.requestResolverViewService
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
                title: "Info",
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
                title: "Alert",
                server: 'servermessage',
                message: datalist.responseMessage,
                btnYes: 'OK',
              }
            });
          }
        },
        error => {
        });
  }

  inProgressAction() {
    this.formDetails.descisionType = "5";
    this.formDetails.remarks = this.remarks;
    let completedAction = this.requestResolverViewService
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
                title: "Info",
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
                title: "Alert",
                server: 'servermessage',
                message: datalist.responseMessage,
                btnYes: 'OK',
              }
            });
          }
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
          title: "Alert",
          message: 'reassignUser',
          btnYes: 'OK',
        }
      });
    } else {
      this.formDetails.descisionType = "6";
      this.formDetails.remarks = this.remarks;
      this.formDetails.reassignFlag = '1';
      this.formDetails.reassignUserId = this.reassignUserId;
      let completedAction = this.requestResolverViewService
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
                  title: "Info",
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
                  title: "Alert",
                  server: 'servermessage',
                  message: datalist.responseMessage,
                  btnYes: 'OK',
                }
              });
            }
          },
          error => {
          });
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
  ngOnDestroy() {
    localStorage.removeItem('requestId');
  }
}


import {
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
  Inject,
  OnDestroy
} from "@angular/core";
import {
  MatPaginator,
  MatSort,
  MatTableDataSource,
  VERSION,
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from "@angular/material";
import { Router } from "@angular/router";
import { DOCUMENT } from "@angular/common";
import { SelectionModel } from "@angular/cdk/collections";
import { RequestService } from "./request.service";
import { ConfirmationDialogComponent } from "../../shared/confirmation-dialog/confirmation-dialog.component";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { ComponentLoaderService } from '../../shared/component-loader.service';
import { CdkObserveContent } from '@angular/cdk/observers';
import { JsonApiService } from 'src/assets/api/json-api.service';
import { RequestResolverService } from '../request-resolver/request-resolver.service';
export interface requestListData {
  highlighted?: boolean;
  hovered?: boolean;
  requestId: number;
}
const ELEMENT_DATA: requestListData[] = [];
@Component({
  selector: "app-request",
  templateUrl: "./request.component.html",
  // styleUrls: ["./request.component.css"]
  styleUrls: ["./request-srmav.component.css"]
})
export class RequestComponent implements OnInit, OnDestroy {
  displayNoRecords = true;
  today: Date = new Date();
  requestBaseFieldName: any = [];
  dataSource: any = [];
  rowindex: any;
  searchRowscount: number = 0;
  row1 = true;
  row2 = true;
  row3 = true;
  row4 = true;
  searchForm: FormGroup;
  count: number = 1;
  requestListGetData: any;
  obj: any;
  qtd: any = [];
  qtm: any = '';
  add = false;
  modify = false;
  view = false;
  delete = false;
  cancel = false;
  reopen = false;
  close = false;
  userRoleFieldName: any = [];
  selection = new SelectionModel<requestListData>(true, []);
  searchCombo: any = [];
  code: String;

  labels: any = {};
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  highlight(element: requestListData) {
    element.highlighted = !element.highlighted;
  }

  masterToggle() {

    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  removeFilter(filterValue: string): void {
    this.displayNoRecords = true;
    if (filterValue.length == 0) {
      this.request_list_details();
    }
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

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    if (this.dataSource.filteredData.length > 0 || this.selection.selected.length > 0) {
      this.displayNoRecords = true;
      this.selection.clear();
    } else {
      this.displayNoRecords = false;
    }
  }

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private formBuilder: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private requestService: RequestService,
    private componentLoaderService: ComponentLoaderService,
    private jsonApiService: JsonApiService,
    private requestResolverService: RequestResolverService
  ) { }

  ngOnInit() {
    this.componentLoaderService.display(true);
    this.document.body.classList.remove("loginonly");
    this.getLabelDetails();
    localStorage.removeItem('requestTypeId');
    localStorage.removeItem('requestTypeName');
    let acc = localStorage.getItem('currentStatusId');
    if (acc !== null) {
      this.loadRequestDetailsfromdashboard(acc);
    } else {
      this.request_list_details();
    }
    this.searchForm = this.formBuilder.group({
      flag: [1, Validators.required],
      searchDatas: this.formBuilder.array([this.sequenceType()]),
      listFromDate: [null],
      listToDate: [null]
    });
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
  sequenceType() {
    return this.formBuilder.group({
      dropDownVal: [""],
      textVal: [""]
    });
  }


  request_list_details() {
    let loadRequestList = this.requestService.load_requestGrid().subscribe(
      data => {
        let requestListGetData = JSON.parse(data["_body"]);
        let requestGetAllResponse = requestListGetData.authSuccesObject;
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
        this.userRoleFieldName = requestGetAllResponse.screenFieldDisplayVoList;
        this.searchCombo = [];
        let search;
        if(localStorage.getItem('langCode') == 'en'){
          search = [
            { name: 'Request Code', value: 'requestCode' },
            { name: 'Request Date', value: 'requestDate' },
            { name: 'Request', value: 'requestTypeName' },
            { name: 'Sub Request', value: 'requestSubTypeName' },
            { name: 'Location', value: 'reqLocationName' },
            { name: 'SubLocation', value: 'reqSublocationName' },
            { name: 'Department', value: 'userDepartmentName' },
            { name: 'Current Status', value: 'currentStatusName' }
          ];
        }else if(localStorage.getItem('langCode') == 'jp'){
          search = [
            { name: 'コードを要求する', value: 'requestCode' },
            { name: '日を要求する', value: 'requestDate' },
            { name: '要求する', value: 'requestTypeName' },
            { name: 'サブタイプのリクエスト', value: 'requestSubTypeName' },
            { name: '場所の名前', value: 'reqLocationName' },
            { name: 'サブロケーション', value: 'reqSublocationName' },
            { name: 'ユーザー部門', value: 'userDepartmentName' },
            { name: '現在の状態名', value: 'currentStatusName' }
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
        let screenFunctionDisplayList = requestGetAllResponse.screenFunctionDisplayList;
        for (let k in screenFunctionDisplayList) {
          if (screenFunctionDisplayList[k] === 'ADD') {
            this.add = true;
          }
          if (screenFunctionDisplayList[k] === 'MODIFY') {
            this.modify = true;
          }
          if (screenFunctionDisplayList[k] === 'VIEW') {
            this.view = true;
          }
          if (screenFunctionDisplayList[k] === 'CANCEL') {
            this.cancel = true;
          }
          if (screenFunctionDisplayList[k] === 'REOPEN') {
            this.reopen = true;
          }
          if (screenFunctionDisplayList[k] === 'CLOSE') {
            this.close = true;
          }
        }
        this.componentLoaderService.display(false);

      },
      error => {
        if (error.status === 401) {
          console.log("Error");
        }
      }
    );
  }
  loadRequestDetailsfromdashboard(curid) {
    let loadRequestList = this.requestService.loadRequestDetailsfromdashboard(curid).subscribe(
      data => {
        let requestListGetData = JSON.parse(data["_body"]);
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

        this.userRoleFieldName = requestListGetData.authSuccesObject.screenFieldDisplayVoList;
        this.searchCombo = [];
        let search;
        if(localStorage.getItem('langCode') == 'en'){
          search = [
            { name: 'Request Code', value: 'requestCode' },
            { name: 'Request Date', value: 'requestDate' },
            { name: 'Request', value: 'requestTypeName' },
            { name: 'Sub Request', value: 'requestSubTypeName' },
            { name: 'Location', value: 'reqLocationName' },
            { name: 'Sub Location', value: 'reqSublocationName' },
            { name: 'User Department', value: 'userDepartmentName' },
            { name: 'Current Status', value: 'currentStatusName' }
          ];
        }else if(localStorage.getItem('langCode') == 'jp'){
          search = [
            { name: 'コードを要求する', value: 'requestCode' },
            { name: '日を要求する', value: 'requestDate' },
            { name: '要求する', value: 'requestTypeName' },
            { name: 'サブタイプのリクエスト', value: 'requestSubTypeName' },
            { name: '場所の名前', value: 'reqLocationName' },
            { name: 'サブロケーション', value: 'reqSublocationName' },
            { name: 'ユーザー部門', value: 'userDepartmentName' },
            { name: '現在の状態名', value: 'currentStatusName' }
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
          if (screenFunctionDisplayList[k] === 'ADD') {
            this.add = true;
          }
          if (screenFunctionDisplayList[k] === 'MODIFY') {
            this.modify = true;
          }
          if (screenFunctionDisplayList[k] === 'VIEW') {
            this.view = true;
          }
          if (screenFunctionDisplayList[k] === 'CANCEL') {
            this.cancel = true;
          }
          if (screenFunctionDisplayList[k] === 'REOPEN') {
            this.reopen = true;
          }
          if (screenFunctionDisplayList[k] === 'CLOSE') {
            this.close = true;
          }
        }
        this.componentLoaderService.display(false);
      },
      error => {
        if (error.status === 401) {
          console.log("Error");
        }
      }
    );
  }
  removeSelectedRows() {
    let hashObject1 = {};
    if (this.selection.selected.length === 1) {


      if (this.selection.selected[0]['currentStatusCode'] == 'HOLD') {
        this.requestService.holdStatus(this.selection.selected[0]['requestId']).subscribe(data => {
          let getData = JSON.parse(data['_body']);
          if (getData.responseCode == '200') {
            const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
              disableClose: false,
              width: 'auto',
              data: {
                title: 'Confirmation',
                message: 'cancel',
                btnYes: 'Yes',
                btnNo: 'No'
              }
            });
            dialogRef.afterClosed().subscribe(result => {
              if (result == true) {
                // let requestList: any = {};
                this.selection.selected.forEach(item => {
                  const dialogRef3 = this.dialog.open(ConfirmationDialogComponent, {
                    disableClose: false,
                    width: "auto",
                    data: {
                      title: 'requestCancel',
                      message: null,
                      mess: 1,
                      reopen: item
                    }
                  });
                  dialogRef3.afterClosed().subscribe(result1 => {
                    if (result1 === true) {
                      let jval: any = item;
                      let str = jval.requestId;
                      let remark = jval.remarks;
                      hashObject1[str] = jval.currentStatusCode;
                      this.requestService.deleteProjectList(hashObject1, remark).subscribe(data => {
                        let resp = JSON.parse(data['_body']);
                        if (resp.responseCode === '200') {
                          const dialogRefDia = this.dialog.open(ConfirmationDialogComponent, {
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
                          dialogRefDia.afterClosed().subscribe(data => {
                            let acc = localStorage.getItem('currentStatusId');
                            if (acc !== null) {
                              this.loadRequestDetailsfromdashboard(acc);
                            } else {
                              this.request_list_details();
                            }
                          })

                        }
                        else{const dialogRef1 = this.dialog.open(ConfirmationDialogComponent, {
                          disableClose: false,
                          panelClass: 'btnCenter',
                          width: 'auto',
                          data: {
                            title: 'Info',
                            server: 'servermessage',
                            message: resp.responseMessage,
                            btnYes: 'OK'
                          }
                        });}
                      });
                    }
                    else{
                      this.selection.clear();
                    }
                  });
                });
                this.selection = new SelectionModel<requestListData>(true, []);
              }
              else{
                this.selection.clear();
              }
            });

          } else {
            const dialogRefDia = this.dialog.open(ConfirmationDialogComponent, {
              disableClose: false,
              panelClass: 'btnCenter',
              width: 'auto',
              data: {
                title: 'Alert',
                server: 'servermessage',
                message: getData.responseMessage,
                btnYes: 'Ok',
              }
            });
            dialogRefDia.afterClosed().subscribe(data => {
              this.selection.clear();
            })

          }
        })
      }

      else if (this.selection.selected[0]['currentStatusCode'] !== 'REJ'
        && this.selection.selected[0]['currentStatusCode'] !== 'CAN'
        && this.selection.selected[0]['currentStatusCode'] !== 'COM'
        && this.selection.selected[0]['currentStatusCode'] !== 'CLO'
        && this.selection.selected[0]['currentStatusCode'] !== 'RO') {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          disableClose: false,
          width: 'auto',
          data: {
            title: 'Confirmation',
            message: 'cancel',
            btnYes: 'Yes',
            btnNo: 'No'
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            // let requestList: any = {};
            this.selection.selected.forEach(item => {
              const dialogRef3 = this.dialog.open(ConfirmationDialogComponent, {
                disableClose: false,
                width: "auto",
                data: {
                  title: 'requestCancel',
                  message: null,
                  mess: 1,
                  reopen: item
                }
              });
              dialogRef3.afterClosed().subscribe(result1 => {
                if (result1 === true) {
                  let jval: any = item;
                  let str = jval.requestId;
                  let remark = jval.remarks;
                  hashObject1[str] = jval.currentStatusCode;
                  this.requestService.deleteProjectList(hashObject1, remark).subscribe(data => {
                    let resp = JSON.parse(data['_body']);
                    if (resp.responseCode === '200') {
                      const dialogRefDia = this.dialog.open(ConfirmationDialogComponent, {
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
                      dialogRefDia.afterClosed().subscribe(data => {
                        let acc = localStorage.getItem('currentStatusId');
                        if (acc !== null) {
                          this.loadRequestDetailsfromdashboard(acc);
                        } else {
                          this.request_list_details();
                        }
                      })
                    }
                    else{const dialogRef1 = this.dialog.open(ConfirmationDialogComponent, {
                      disableClose: false,
                      panelClass: 'btnCenter',
                      width: 'auto',
                      data: {
                        title: 'Info',
                        server: 'servermessage',
                        message: resp.responseMessage,
                        btnYes: 'OK'
                      }
                    });}
                  });
                }
              });
            });
            this.selection = new SelectionModel<requestListData>(true, []);
          }
        });
      }
      else {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          disableClose: false,
          panelClass: 'btnCenter',
          width: 'auto',
          data: {
            title: 'Alert',
            message: 'cancelAlert',
            btnYes: 'OK'
          }
        });
      }
    } else if (this.selection.selected.length > 0) {
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
    } else if (this.selection.selected.length === 0) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        panelClass: 'btnCenter',
        width: 'auto',
        data: {
          title: 'Alert',
          message: 'selection',
          btnYes: 'Ok',
          // btnNo: 'Cancel'
        }
      });
    }
  }

  requestModify() {
    if (this.selection.selected.length > 0) {
      if (this.selection.selected.length !== 1) {
        const dialogRef1 = this.dialog.open(ConfirmationDialogComponent, {
          disableClose: false,
          width: "auto",
          data: {
            title: 'Alert',
            message: "singleSelection",
            btnYes: "Ok",
            btnNo: "Cancel"
          }
        });
      } else if (this.selection.selected.length === 1 && this.selection.selected[0]['currentStatusId'] == '7') {
        const dialogRef2 = this.dialog.open(ConfirmationDialogComponent, {
          disableClose: false,
          width: "auto",
          data: {
            title: 'Confirmation',
            message: "modify",
            btnYes: "Yes",
            btnNo: "No"
          }
        });
        dialogRef2.afterClosed().subscribe(result => {
          if (result) {
            this.selection.selected.forEach(row => {
              let index: any = this.dataSource.data.findIndex(d => d === row);
              this.onRowModify(row);
              this.componentLoaderService.display(true);
              if (localStorage.getItem("requestId") !== null) {
                localStorage.removeItem("requestId");
                localStorage.setItem("requestId", row.requestId.toString());
              } else {
                localStorage.setItem("requestId", row.requestId.toString());
              }
              this.router.navigate(["/request/request-modify"]);
            });
          }
        });
      } else {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          disableClose: false,
          width: "auto",
          data: {
            title: 'Alert',
            message: "resubmitModify",
            btnYes: "Ok"
          }
        });
      }
    } else {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        panelClass: 'btnCenter',
        width: "auto",
        data: {
          title: 'Alert',
          message: "selection",
          btnYes: "Ok",
        }
      });
    }
  }
  requestView() {
    if (this.selection.selected.length > 0) {
      if (this.selection.selected.length !== 1) {
        const dialogRef1 = this.dialog.open(ConfirmationDialogComponent, {
          disableClose: false,
          width: "auto",
          data: {
            title: 'Alert',
            message: "singleSelection",
            btnYes: "Ok",
            btnNo: "Cancel"
          }
        });
      } else {
        this.componentLoaderService.display(true);
        this.selection.selected.forEach(row => {
          let index: any = this.dataSource.data.findIndex(d => d === row);
          this.onRowModify(row);
          if (localStorage.getItem("requestId") !== null) {
            localStorage.removeItem("requestId");
            localStorage.setItem("requestId", row.requestId.toString());
          } else {
            localStorage.setItem("requestId", row.requestId.toString());
          }
          this.router.navigate(["/request/request-view"]);
        });
      }
    } else {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        width: "auto",
        panelClass: 'btnCenter',
        data: {
          title: 'Alert',
          message: "selection",
          btnYes: "Ok"
        }
      });
    }
  }
  requestreopen() {
    if (this.selection.selected.length > 0) {
      if (this.selection.selected.length !== 1) {
        const dialogRef1 = this.dialog.open(ConfirmationDialogComponent, {
          disableClose: false,
          width: "auto",
          data: {
            title: 'Alert',
            message: "singleSelection",
            btnYes: "Ok",
            btnNo: "Cancel"
          }
        });
      } else if (this.selection.selected[0]['currentStatusCode'] !== 'COM') {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          disableClose: false,
          panelClass: 'btnCenter',
          width: 'auto',
          data: {
            title: 'Alert',
            message: 'requestCantReopen',
            btnYes: 'OK'
          }
        });
        this.selection.clear();
      }
      else if (
        this.selection.selected.length === 1 && (this.selection.selected[0]['currentStatusId'] == '10' || this.selection.selected[0]['currentStatusId'] == '11')) {
        const dialogRef2 = this.dialog.open(ConfirmationDialogComponent, {
          disableClose: false,
          width: "auto",
          data: {
            title: 'Alert',
            message: "reopenAgain",
            btnYes: "Ok",

          }
        });
      } else {
        const dialogRef2 = this.dialog.open(ConfirmationDialogComponent, {
          disableClose: false,
          width: "auto",
          data: {
            title: 'Confirmation',
            message: "reopen",
            btnYes: "Yes",
            btnNo: "No"
          }
        });
        dialogRef2.afterClosed().subscribe(result => {
          if (result) {
            this.selection.selected.forEach(row => {
              const dialogRef3 = this.dialog.open(ConfirmationDialogComponent, {
                disableClose: false,
                width: "auto",
                data: {
                  title: 'requestReopen',
                  message: null,
                  mess: 1,
                  reopen: row
                }
              });
              dialogRef3.afterClosed().subscribe(result1 => {
                if (result1 === true) {
                  let index: any = this.dataSource.data.findIndex(d => d === row);
                  let kkb: any = {};
                  kkb = row;
                  if (kkb.remarks !== null) {
                    if (kkb.currentStatusCode === 'COM') {
                      let kk: any = {};
                      kk.requestId = kkb.requestId;
                      kk.currentStatusId = 7;
                      kk.remarks = kkb.remarks;
                      this.requestService.loadapprovalreopen(kk).subscribe(
                        data => {
                          let requestListGetData = JSON.parse(data['_body']);
                          if (requestListGetData.responseCode === '200') {
                            const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                              disableClose: false,
                              panelClass: 'btnCenter',
                              width: 'auto',
                              data: {
                                title: 'Info',
                                server: 'servermessage',
                                message: requestListGetData.responseMessage,
                                btnYes: 'OK'
                              }
                            });
                            let acc = localStorage.getItem('currentStatusId');
                            if (acc !== null) {
                              this.loadRequestDetailsfromdashboard(acc);
                            } else {
                              this.request_list_details();
                            }
                          }

                        },
                        error => {
                          if (error.status === 401) {
                          }
                        }
                      );
                      this.selection.clear();
                    } else {
                      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                        disableClose: false,
                        panelClass: 'btnCenter',
                        width: 'auto',
                        data: {
                          title: 'Alert',
                          message: 'requestCantReopen',
                          btnYes: 'OK'
                        }
                      });

                    }
                  }
                }
                else {
                  this.dialog.closeAll();
                  row['remarks'] = null;

                }
              });
            });
          }
        });
      }
    } else {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        panelClass: 'btnCenter',
        width: "auto",
        data: {
          title: 'Alert',
          message: "selection",
          btnYes: "Ok",
        }
      });
    }
  }
  requestclose() {
    if (this.selection.selected.length > 0) {
      if (this.selection.selected.length !== 1) {
        const dialogRef1 = this.dialog.open(ConfirmationDialogComponent, {
          disableClose: false,
          width: "auto",
          data: {
            title: 'Alert',
            message: "singleSelection",
            btnYes: "Ok",
            btnNo: "Cancel"
          }
        });
      } else if (this.selection.selected[0]['currentStatusCode'] !== 'COM') {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          disableClose: false,
          panelClass: 'btnCenter',
          width: 'auto',
          data: {
            title: 'Alert',
            message: 'requestCantClose',
            btnYes: 'OK'
          }
        });
        this.selection.clear();
      } else if (this.selection.selected.length === 1 && (this.selection.selected[0]['currentStatusId'] == '10' || this.selection.selected[0]['currentStatusId'] == '11')) {
        const dialogRef2 = this.dialog.open(ConfirmationDialogComponent, {
          disableClose: false,
          width: "auto",
          data: {
            title: 'Alert',
            message: "requestCloseAgain",
            btnYes: "Ok",

          }
        });
      } else {
        const dialogRef2 = this.dialog.open(ConfirmationDialogComponent, {
          disableClose: false,
          width: "auto",
          data: {
            title: 'Confirmation',
            message: "close",
            btnYes: "Yes",
            btnNo: "No"
          }
        });
        dialogRef2.afterClosed().subscribe(result => {
          if (result) {
            this.selection.selected.forEach(row => {
              const dialogRef3 = this.dialog.open(ConfirmationDialogComponent, {
                disableClose: false,
                width: "auto",
                data: {
                  title: 'requestClose',
                  message: null,
                  mess: 1,
                  reopen: row
                }
              });
              dialogRef3.afterClosed().subscribe(result1 => {
                if (result1 === true) {
                  let index: any = this.dataSource.data.findIndex(d => d === row);
                  let kkb: any = {};
                  kkb = row;
                  if (kkb.remarks !== null) {
                    if (kkb.currentStatusCode === 'COM') {
                      let kk: any = {};
                      kk.requestId = kkb.requestId;
                      kk.currentStatusId = 8;
                      kk.remarks = kkb.remarks;
                      this.requestService.loadapprovalreopen(kk).subscribe(
                        data => {
                          let requestListGetData = JSON.parse(data['_body']);
                          if (requestListGetData.responseCode === '200') {
                            const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                              disableClose: false,
                              panelClass: 'btnCenter',
                              width: 'auto',
                              data: {
                                title: 'Info',
                                server: 'servermessage',
                                message: requestListGetData.responseMessage,
                                btnYes: 'OK'
                              }
                            });
                            let acc = localStorage.getItem('currentStatusId');
                            if (acc !== null) {
                              this.loadRequestDetailsfromdashboard(acc);
                            } else {
                              this.request_list_details();
                            }
                          }
                        },
                        error => {
                          if (error.status === 401) {
                          }
                        }
                      );
                      this.selection.clear();
                    }
                  }
                }
                else {
                  this.dialog.closeAll();
                  row['remarks'] = null;
                  this.router.navigateByUrl('/request');
                }
              });
            });
          }
        });

      }
    } else {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        panelClass: 'btnCenter',
        width: "auto",
        data: {
          title: 'Alert',
          message: "selection",
          btnYes: "Ok",
        }
      });
    }
  }

  onRowModify(row) {
    row.projectModify = true;
    this.rowindex = row.requestId;
  }

  addSequence(form) {
    let j = form.controls.searchDatas.controls.length;
    let i = j - 1;
    let dropvalue = form.controls.searchDatas.controls[i].controls.dropDownVal.value;
    let textVal = form.controls.searchDatas.controls[i].controls.textVal.value;
    if (this.count <= this.userRoleFieldName.length - 2 && dropvalue !== null && textVal != null) {
      (
        this.searchForm.controls['searchDatas'] as FormArray).push(this.sequenceType());
      this.count++;
    }
  }

  deleteSequence() {
    if (this.count > 1) {
      (this.searchForm.controls["searchDatas"] as FormArray).removeAt(-1);
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
      let fullValue = {}
      if (key != '' && value != '') {
        fullValue[key] = value;
        Object.assign(finalSearchData, fullValue);
      }
    }
    if (finalSearchData['null'] == null) {
      finalSearchData['null'] = undefined
    }
    finalSearchData['flag'] = this.searchForm.value.flag;
    this.requestService.search_list(finalSearchData).subscribe(data => {
      let reqScrConfigSearchData = JSON.parse(data['_body']);
      this.dataSource = [];
      if (reqScrConfigSearchData.succesObject.length > 0) {
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
  ngOnDestroy() {
    localStorage.removeItem('currentStatusId');
    localStorage.removeItem('request-history');
  }

  dateFormat(event) {
  }

  recordview(row) {
    this.code = row.currentStatusCode;
  }
  searchClear() {
    for (let i = 0; i < this.searchForm.value.searchDatas.length; i++) {
      this.deleteSequence();
    }
    this.displayNoRecords = true;
    this.request_list_details();
    this.searchForm.controls['searchDatas'].reset();
    this.searchForm.controls['flag'].patchValue(1);
  }

  exportAsXLSX(): void {
    if (this.dataSource.length !== 0) {
      this.requestService.exportAsExcelFile(this.dataSource.data, 'RequestReport');
    }
  }
}

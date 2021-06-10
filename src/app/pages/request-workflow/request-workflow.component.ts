
import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Inject, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, VERSION, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormBuilder, FormGroup, FormArray, Validators, NgForm, Form } from '@angular/forms';
import { Router } from "@angular/router";
import { DOCUMENT } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';
import { RequestWorkflowService } from './request-workflow.service';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { ComponentLoaderService } from '../../shared/component-loader.service';
import { JsonApiService } from 'src/assets/api/json-api.service';

export interface aminiteListData {
  highlighted?: boolean;
  hovered?: boolean;
  reqWorkFlowId: number;
}

const ELEMENT_DATA: aminiteListData[] = [];
@Component({
  selector: 'app-request-workflow',
  templateUrl: './request-workflow.component.html',
  // styleUrls: ['./request-workflow-srmav.css']
  styleUrls: ['./request-workflow.component.css']
})
export class RequestWorkflowComponent implements OnInit {
  labels: any = {}; /** LABEL CHANGES **/
  searchForm: FormGroup;
  displayNoRecords = true;
  reqWorkFlowBaseFieldName: any = [];
  dataSource: any = [];
  rowindex: any;
  count: number = 1;
  searchCombo: any;;
  qtd: any = [];
  qtm: any = '';
  userRoleFieldName: any = [];
  add = false;
  modify = false;
  view = false;
  delete = false;
  statuslist: any = [];
  selection = new SelectionModel<aminiteListData>(true, []);

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  highlight(element: aminiteListData) {
    element.highlighted = !element.highlighted;
  }


  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));

  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
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
    private jsonApiService: JsonApiService/** LABEL CHANGES **/,
    @Inject(DOCUMENT) private document: Document,
    private formBuilder: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private requestWorkflowService: RequestWorkflowService,
    private componentLoaderService: ComponentLoaderService) { }

  ngOnInit() {
    this.getLabelDetails(); /** LABEL CHANGES **/
    this.componentLoaderService.display(true);
    this.document.body.classList.remove('loginonly');

    this.searchForm = this.formBuilder.group({
      searchDatas: this.formBuilder.array([this.sequenceType()]),
    });
    if(localStorage.getItem('langCode') == 'en' ){
      this.statuslist = [
        {name: 'Active', value: "Active"}, 
        {name: 'InActive', value: "InActive"}
        ]
    }else if(localStorage.getItem('langCode') == 'jp'){
      this.statuslist = [
          {name: '能動', value: "Active"}, 
          {name: '無効', value: "InActive"}
        ]
    }
    this.RWF_list_details();
  }

  sequenceType() {
    return this.formBuilder.group({
      dropDownVal: [""],
      textVal: [""],
    })
  }
  addSequence(form) {
    let j = form.controls.searchDatas.controls.length;
    let i = j - 1;
    let dropvalue = form.controls.searchDatas.controls[i].controls.dropDownVal.value;
    let textVal = form.controls.searchDatas.controls[i].controls.textVal.value;
    if (this.count <= 8 && dropvalue !== null && textVal != null) {
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
    this.requestWorkflowService.search_list(finalSearchData).subscribe(data => {
      let reqScrConfigSearchData = JSON.parse(data['_body']);
      this.dataSource = [];
      if (reqScrConfigSearchData.succesObject.length > 0) {
        this.dataSource = new MatTableDataSource(reqScrConfigSearchData.succesObject);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.displayNoRecords = true;
      }else{
        this.displayNoRecords = false;
      }
    })

    setTimeout(() => {
      if (this.dataSource.filteredData.length > 0 || this.selection.selected.length > 0) {
        this.displayNoRecords = true;
        this.selection.clear();
      } else {
        this.displayNoRecords = false;
      }
    }, 100);
  }
  removeFilter(filterValue: string): void {
    this.displayNoRecords = true;
    if (filterValue.length == 0) {
      this.RWF_list_details();
    }
  }
  RWF_list_details() {

    let loadRWFList = this.requestWorkflowService.load_RWF_Data().subscribe(data => {
      let RWF_ListData = JSON.parse(data['_body']);
      let RWF_ListTableDate = RWF_ListData.succesObject;
      this.dataSource = [];
      if (RWF_ListTableDate.length > 0) {
        this.dataSource = new MatTableDataSource(RWF_ListTableDate);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.displayNoRecords = true;
      }else{
        this.displayNoRecords = false;
      }
      this.userRoleFieldName = RWF_ListData.authSuccesObject.screenFieldDisplayVoList;
      this.searchCombo = [];
      let search; 
      if(localStorage.getItem('langCode') == 'en'){
        search = [
          { Name: "Code", Value: 'requestWorkFlowCode' },
          { Name: "Request Type", Value: 'requestTypeName' },
          { Name: "Request SubType", Value: 'requestSubTypeName' },
          { Name: "Location", Value: 'workFlowLocationName' },
          { Name: "Location", Value: 'workFlowSublocationName' },
          { Name: "Department", Value: 'workFlowDepartmentName' },
          { Name: "Description", Value: 'reqWorkFlowDescription' },
          { Name: "Status", Value: 'status' },
        ];
      }
      else if(localStorage.getItem('langCode') == 'jp'){
        search = [
          { Name: "記号", Value: 'requestWorkFlowCode' },
          { Name: "リクエストの種類", Value: 'requestTypeName' },
          { Name: "サブタイプのリクエスト", Value: 'requestSubTypeName' },
          { Name: "場所の名前", Value: 'workFlowLocationName' },
          { Name: "サブロケーション名", Value: 'workFlowSublocationName' },
          { Name: "ユーザー部門名", Value: 'workFlowDepartmentName' },
          { Name: "説明", Value: 'reqWorkFlowDescription' },
          { Name: "状態", Value: 'status' },
        ];
      }
      for (let k in search) {
        if (search[k].Value !== undefined) {
          let ll = this.userRoleFieldName.includes(search[k].Value);
          if (ll === true) {
            this.searchCombo.push(search[k]);
          }
        }
      }
      let screenFunctionDisplayList = RWF_ListData.authSuccesObject.screenFunctionDisplayList;
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
        if (screenFunctionDisplayList[k] === 'DELETE') {
          this.delete = true;
        }
      }
      this.componentLoaderService.display(false);
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    })
  }

  removeSelectedRows() {
    if (this.selection.selected.length === 1) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        width: 'auto',
        data: {
          title: 'Confirmation',
          message: 'delete',
          btnYes: 'Yes',
          btnNo: 'No',
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.selection.selected.forEach(item => {
            let reqWorkFlow = [item.reqWorkFlowId];
            this.requestWorkflowService.deleteProjectList(reqWorkFlow).subscribe(data => {
              let resp = JSON.parse(data['_body']);
              if (resp.responseCode == '200') {
                const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                  disableClose: false,
                  width: 'auto',
                  data: {
                    title: 'Info',
                    server: 'servermessage',
                    message: resp.responseMessage,
                    btnYes: 'Ok',
                  }
                });
              } else {
                const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                  disableClose: false,
                  width: 'auto',
                  data: {
                    title: 'Alert',
                    server: 'servermessage',
                    message: resp.responseMessage,
                    btnYes: 'Ok',
                  }
                });
              }
              this.RWF_list_details();
            })
          });
          this.selection = new SelectionModel<aminiteListData>(true, []);
        }

      });
    }
    else if (this.selection.selected.length > 0) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        width: 'auto',
        data: {
          title: 'Confirmation',
          message: 'delete',
          btnYes: 'Yes',
          btnNo: 'No',
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          let reqWorkFlow = [];
          for (let i = 0; i < this.selection.selected.length; i++) {
            reqWorkFlow.push(this.selection.selected[i].reqWorkFlowId)
          }
          this.requestWorkflowService.deleteProjectList(reqWorkFlow).subscribe(data => {
            let resp = JSON.parse(data['_body']);
            if (resp.responseCode == '200') {
              const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                disableClose: false,
                width: 'auto',
                data: {
                  title: 'Info',
                  server: 'servermessage',
                  message: resp.responseMessage,
                  btnYes: 'Ok',
                }
              });
              this.RWF_list_details();
            } else {
              const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                disableClose: false,
                width: 'auto',
                data: {
                  title: 'Alert',
                  server: 'servermessage',
                  message: resp.responseMessage,
                  btnYes: 'Ok',
                }
              });
            }
          });
          this.selection = new SelectionModel<aminiteListData>(true, []);
        }

      });
    } else if (this.selection.selected.length === 0) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        width: 'auto',
        panelClass: 'btnCenter',
        data: {
          title: 'Alert',
          message: "selection",
          btnYes: 'Ok',
        }
      });
    }
  }

  projectModify() {
    if (this.selection.selected.length === 1) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        panelClass: 'btnCenter',
        width: 'auto',
        data: {
          title: 'Confirmation',
          message: 'modify',
          btnPrjYes: 'Yes',
          btnPrjNo: 'No',
        }
      });
      dialogRef.afterClosed().subscribe(data => {
        if (localStorage.getItem('isCancelled') === 'No') {
          this.router.navigate(['/request-configuration/request-configuration-modify']);
          let rowId = String(this.selection.selected[0]['reqWorkFlowId']);
          localStorage.setItem('reqWorkFlowId', rowId)

        } else if (localStorage.getItem('isCancelled') === 'Yes') {
          return
        }
      });
    } else if (this.selection.selected.length > 1) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        panelClass: 'btnCenter',
        width: 'auto',
        data: {
          title: 'Alert',
          message: 'singleSelection',
          btnYes: 'OK',
        }
      });
    }
    else if (this.selection.selected.length < 1) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        panelClass: 'btnCenter',
        width: 'auto',
        data: {
          title: 'Alert',
          message: 'selection',
          btnYes: 'OK',
        }
      });
    }
    localStorage.removeItem('isCancelled');
  }

  projectView() {
    if (this.selection.selected.length === 1) {
      let rowId = String(this.selection.selected[0]['reqWorkFlowId']);
      localStorage.setItem('reqWorkFlowId', rowId)
      this.router.navigate(['/request-configuration/request-configuration-view']);
    } else if (this.selection.selected.length > 1) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        panelClass: 'btnCenter',
        width: 'auto',
        data: {
          title: 'Alert',
          message: 'singleSelection',
          btnYes: 'OK',
        }
      });
    }
    else if (this.selection.selected.length < 1) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        panelClass: 'btnCenter',
        width: 'auto',
        data: {
          title: 'Alert',
          message: 'selection',
          btnYes: 'OK',
        }
      });
    }
    localStorage.removeItem('isCancelled');
  }

  searchClear() {
    for (let i = 0; i < this.searchForm.value.searchDatas.length; i++) {
      this.deleteSequence();
    }
    this.displayNoRecords = true;
    this.ngOnInit();
  }
 /** LABEL CHANGES **/
 getLabelDetails() {
  let lang;
  if(localStorage.getItem('langCode') !== null){
    lang = localStorage.getItem('langCode');
  }
  this.jsonApiService.fetch('/'+lang+'.json').subscribe((data) => {
      this.labels = data;
    });
}

}

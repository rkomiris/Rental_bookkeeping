
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, FormArray, Validators, NgForm, Form } from '@angular/forms';
import {
  MatTableDataSource,
  MatPaginator,
  MatSort,
  MatDialog
} from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { Router } from '@angular/router';
import { WidgetsAdminService } from './widgets-admin.service';
import { JsonApiService } from 'src/assets/api/json-api.service';
// import { FormGroup, FormBuilder, Validators } from '@angular/forms';

export interface widgetListData {
  highlighted?: boolean;
  hovered?: boolean;
  widgetId: number;
}

const ELEMENT_DATA: widgetListData[] = [];

@Component({
  selector: 'app-widgets-admin',
  templateUrl: './widgets-admin.component.html',
  styleUrls: ['./widgets-admin.component.css']
})
export class WidgetsAdminComponent implements OnInit {
  labels: any = {}; /** LABEL CHANGES **/
  displayNoRecords = true;
  widgetBaseFieldName: any;
  dataSource: any = [];
  rowindex: any;
  searchRows: number[] = [];
  searchRowscount: number = 0;
  filtervalue: any;
  filtervalue1: any;
  filtervalue2: any;
  requestcode1: any;
  requestcode2: any;
  successobject: any;
  obj: any;
  qtd: any = [];
  qtm: any = '';
  count: number = 1;
  add = false;
  modify = false;
  view = false;
  delete = false;
  statuslist: any = [];
  selection = new SelectionModel<widgetListData>(true, []);
  widgetListGetData: any;
  searchCombo: any;
  searchForm: FormGroup;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private jsonApiService: JsonApiService/** LABEL CHANGES **/,
    private router: Router,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private widgetService: WidgetsAdminService) {
    this.widgetBaseFieldName = [];
  }

  ngOnInit() {
    this.getLabelDetails(); /** LABEL CHANGES **/
    this.searchForm = this.formBuilder.group({
      searchDatas: this.formBuilder.array([this.sequenceType()])
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
    this.widget_list_details();
  }
  sequenceType() {
    return this.formBuilder.group({
      dropDownVal: [''],
      textVal: ['']
    });
  }
  addSequence() {
    if (this.count <= 1) {
      (this.searchForm.controls['searchDatas'] as FormArray).push(this.sequenceType());
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

  widget_list_details() {
    let loadWidgetList = this.widgetService.load_widgetsData().subscribe(
      data => {
        let widgetListGetData = JSON.parse(data['_body']);
        let widgetListTableDate = widgetListGetData.succesObject;
        this.dataSource = [];
        if (widgetListTableDate.length > 0) {
          this.dataSource = new MatTableDataSource(widgetListTableDate);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.displayNoRecords = true;
        }else{
          this.displayNoRecords = false;
        }
        this.widgetBaseFieldName = widgetListGetData.authSuccesObject.screenFieldDisplayVoList;
        this.searchCombo = [];
        let search; 
        if(localStorage.getItem('langCode') == 'en'){
          search = [
            { Name: "Widget Code", Value: 'widgetCode' },
            { Name: "Widget Index", Value: 'widgetIndex' },
            { Name: "Widget Title", Value: 'widgetTitle' },
            { Name: "Widget Sequence", Value: 'widgetSeq' },
            { Name: "Status", Value: 'status' },
          ];
        }
        else if(localStorage.getItem('langCode') == 'jp'){
          search = [
            { Name: "記号", Value: 'widgetCode' },
            { Name: "索引", Value: 'widgetIndex' },
            { Name: "題名", Value: 'widgetTitle' },
            { Name: "順番", Value: 'widgetSeq' },
            { Name: "状態", Value: 'status' },
          ];
        }
 
        for (let k in search) {
          let ll = this.widgetBaseFieldName.includes(search[k].Value);
          if (ll === true) {
            this.searchCombo.push(search[k]);
          }
        }
        let screenFunctionDisplayList = widgetListGetData.authSuccesObject.screenFunctionDisplayList;
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
      },
      error => {
        if (error.status === 401) {
          console.log('Error');
        }
      }
    );
  }
  addSearch(value: string): void {
    this.searchRowscount++;
    if (this.searchRowscount <= 1) {
      this.searchRows.push(this.searchRowscount);
    }
  }
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  highlight(element: widgetListData) {
    element.highlighted = !element.highlighted;
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
    this.widgetService.search_widget(finalSearchData).subscribe(data => {
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
      this.widget_list_details();
    }
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

  projectModify(): void {
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
            this.selection.selected.forEach((row) => {
              let index: any = this.dataSource.data.findIndex(d => d === row);
              this.onRowModify(row);
              if (localStorage.getItem('widgetId') !== null) {
                localStorage.removeItem('widgetId');
                localStorage.setItem('widgetId', row['widgetId'].toString());
              } else {
                localStorage.setItem('widgetId', row['widgetId'].toString());
              }
              this.router.navigate(['/widgets-admin/widgets-admin-modify']);
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
          btnNo: 'Cancel'
        }
      });
    }
  }

  projectView(): void {
    if (this.selection.selected.length > 0) {
      if (this.selection.selected.length != 1) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
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
        this.selection.selected.forEach(row => {
          let index: number = this.dataSource.data.findIndex(d => d === row);
          this.onRowModify(row);
          if (localStorage.getItem('widgetId') !== null) {
            localStorage.removeItem('widgetId');
            localStorage.setItem('widgetId', row['widgetId'].toString());
          } else {
            localStorage.setItem('widgetId', row['widgetId'].toString());
          }
          this.router.navigate(['/widgets-admin/widgets-admin-view']);
        });
      }
    } else {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        width: 'auto',
        data: {
          title: 'Alert',
          message: 'selection',
          btnYes: 'Ok',
          btnNo: 'Cancel'
        }
      });
    }
  }

  onRowModify(row) {
    row.projectModify = true;
    this.rowindex = row.id;
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
          btnNo: 'No'
        }
      });
      dialogRef.afterClosed().subscribe(data => {
        if (data) {
          this.widgetService.deleteProjectList([this.selection.selected[0].widgetId]).subscribe(data => {
            let resp = JSON.parse(data['_body']);
            if (resp.responseCode == '200') {
              const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                disableClose: false,
                panelClass: 'btnCenter',
                width: 'auto',
                data: {
                  title: 'Info',
                  server: 'servermessage',
                  message: resp.responseMessage,
                  btnYes: 'Ok'
                }
              });
              this.widget_list_details();
              this.selection.clear();
            } else {
              const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                disableClose: false,
                panelClass: 'btnCenter',
                width: 'auto',
                data: {
                  title: 'Alert',
                  server: 'servermessage',
                  message: resp.responseMessage,
                  btnYes: 'Ok'
                }
              });
            }
          });
        }
      });
    } else if (this.selection.selected.length > 0) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        width: 'auto',
        data: {
          title: 'Confirmation',
          message: 'delete',
          btnYes: 'Yes',
          btnNo: 'No'
        }
      });
      dialogRef.afterClosed().subscribe(data => {
        if (data) {
          let widgetList = [];
          for (let i = 0; i < this.selection.selected.length; i++) {
            widgetList.push(this.selection.selected[i].widgetId);
          }
          this.widgetService.deleteProjectList(widgetList).subscribe(data => {
            let resp = JSON.parse(data['_body']);
            if (resp.responseCode == '200') {
              const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                disableClose: false,
                panelClass: 'btnCenter',
                width: 'auto',
                data: {
                  title: 'Info',
                  server: 'servermessage',
                  message: resp.responseMessage,
                  btnYes: 'Ok',
                }
              });
              this.widget_list_details();
              this.selection.clear();
            } else {
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
          });
        }
      })
    } else if (this.selection.selected.length === 0) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        width: 'auto',
        data: {
          title: 'Alert',
          message: 'selection',
          btnYes: 'Ok',
          btnNo: 'Cancel'
        }
      });
    }
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

import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, VERSION, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormBuilder, FormGroup, FormArray, Validators, NgForm, Form } from '@angular/forms';
import { Router } from "@angular/router";
import { DOCUMENT } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';
import { HolidayDetailsService } from './holiday-details.service';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { ComponentLoaderService } from '../../shared/component-loader.service';
import { JsonApiService } from 'src/assets/api/json-api.service';
export interface holidayDetailsListData {

  highlighted?: boolean;
  hovered?: boolean;
  id: number;
}

const ELEMENT_DATA: holidayDetailsListData[] = [];
@Component({
  selector: 'app-holiday-details',
  templateUrl: './holiday-details.component.html',
  styleUrls: ['./holiday-details.component.css']
})
export class HolidayDetailsComponent implements OnInit {
  labels: any = {}; /** LABEL CHANGES **/
  searchForm: FormGroup;
  rowindex: any;
  count: number = 1;
  searchCombo: any;
  qtd: any = [];
  qtm: any = '';
  add = false;
  modify = false;
  view = false;
  delete = false;
  userRoleFieldName: any = [];
  statuslist = [];
  dataSource: any = [];
  displayNoRecords = true;
  selection = new SelectionModel<holidayDetailsListData>(true, []);
  leaveTypeList: any = [];
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  highlight(element: holidayDetailsListData) {
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
  constructor(@Inject(DOCUMENT) private document: Document,
  private jsonApiService: JsonApiService/** LABEL CHANGES **/,
   private formBuilder: FormBuilder, private router: Router, private dialog: MatDialog, private holidayDetailsService: HolidayDetailsService, private componentLoaderService: ComponentLoaderService) { }
  ngOnInit() {
    this.getLabelDetails(); /** LABEL CHANGES **/
    this.componentLoaderService.display(true);
    this.document.body.classList.remove('loginonly');
    this.searchForm = this.formBuilder.group({
      searchDatas: this.formBuilder.array([this.sequenceType()]),
    });
    if(localStorage.getItem('langCode') == 'en'){
      this.leaveTypeList = [{name: 'National', id: 2}, {name: 'Local', id: 1}]
      this.statuslist = [{name: 'Active', value: "Active"}, {name: 'InActive', value: "InActive"}]
    }else if(localStorage.getItem('langCode') == 'jp'){
      this.leaveTypeList = [{name: '国民', id: 2}, {name: '地元', id: 1}]
      this.statuslist = [{name: '能動', value: "Active"}, {name: '無効', value: "InActive"}]
    }
    this.holiday_list_details();
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
  
  sequenceType() {
    return this.formBuilder.group({
      dropDownVal: [""],
      textVal: [""],
    })
  }
  holiday_list_details() {
    let loadSublocationList = this.holidayDetailsService.load_holidayDetails().subscribe(data => {
      let holidayList = JSON.parse(data['_body']);
      let holidayListTableData = holidayList.succesObject;
      this.dataSource = [];

      if(holidayListTableData.length > 0){
        for(let i = 0 ; i < holidayListTableData.length ; i++){
          if(holidayListTableData[i].leaveType ==  "1" ){
            holidayListTableData[i].leaveTypeName = "Local";
          }
          else if(holidayListTableData[i].leaveType ==  "2" ){
            holidayListTableData[i].leaveTypeName = "National";
          }
        }
      }
      if (holidayListTableData.length > 0) {
        this.dataSource = new MatTableDataSource(holidayListTableData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.displayNoRecords = true;
      }else{
        this.displayNoRecords = false;
      }

      this.userRoleFieldName = holidayList.authSuccesObject.screenFieldDisplayVoList.map(
        element => {
          return element;
        }
      );
      this.searchCombo = [];
      let search;
      if(localStorage.getItem("langCode") == 'en'){
        search = [
          { Name: "Location", Value: 'locationName' },
          { Name: "Sub Location", Value: 'sublocationName' },
          { Name: "Deparment", Value: 'departmentName' },
          { Name: "Holiday Date", Value: 'holidayDate' },
          { Name: "Leave Type", Value: 'leaveType' },
          { Name: "Description", Value: 'description' }
        ];
      }else if(localStorage.getItem('langCode') == 'jp'){
        search = [
          { Name: "場所の名前", Value: 'locationName' },
          { Name: "サブロケーション名", Value: 'sublocationName' },
          { Name: "ユーザー部門名", Value: 'departmentName' },
          { Name: "祝日", Value: 'holidayDate' },
          { Name: "休日型", Value: 'leaveType' },
          { Name: "説明", Value: 'description' }
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
      let screenFunctionDisplayList = holidayList.authSuccesObject.screenFunctionDisplayList;
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
    });
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
    this.holidayDetailsService.search_list(finalSearchData).subscribe(data => {
      let holidayDetailsSearchData = JSON.parse(data['_body']);
      this.dataSource = [];
      if (holidayDetailsSearchData.succesObject.length > 0) {
        this.dataSource = new MatTableDataSource(holidayDetailsSearchData.succesObject);
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
      let holidayId = [this.selection.selected[0].id];
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.holidayDetailsService.deleteProjectList(holidayId).subscribe(data => {
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
              dialogRef.afterClosed().subscribe(data => {
                this.holiday_list_details();
                this.selection.clear();
              });
            } else {
              const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                disableClose: false,
                width: 'auto',
                panelClass: 'btnCenter',
                data: {
                  title: 'Alert',
                  server: 'servermessage',
                  message: resp.responseMessage,
                  btnYes: 'Ok',
                }
              });
            }
          }, error => {
            if (error.status === 401) {
              console.log("Error");
            }
          });
        }
      });
    } else if (this.selection.selected.length > 1) {
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
      let locationId = [];
      for (let i = 0; i < this.selection.selected.length; i++) {
        locationId.push(this.selection.selected[i].id);
      }
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.holidayDetailsService.deleteProjectList(locationId).subscribe(data => {
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

              dialogRef.afterClosed().subscribe(data => {
                this.holiday_list_details();
                this.selection.clear();
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
                  btnYes: 'Ok',
                }
              });
            }

          }, error => {
            if (error.status === 401) {
              console.log("Error");
            }
          });
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
        if (data) {
          this.router.navigate(['/holiday-details/holiday-details-modify']);
          console.log('data')
          let rowId = String(this.selection.selected[0]['id']);
          localStorage.setItem('holidayId', rowId);
          this.componentLoaderService.display(true);
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
  }
  projectView() {
    if (this.selection.selected.length === 1) {
      this.componentLoaderService.display(true);
      this.router.navigate(['/holiday-details/holiday-details-view']);
      let rowId = String(this.selection.selected[0]['id']);
      localStorage.setItem('holidayId', rowId);
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
  }

  searchClear() {
    for (let i = 0; i < this.searchForm.value.searchDatas.length; i++) {
      this.deleteSequence();
    }
    this.displayNoRecords = true;
    this.ngOnInit();
  }
}

import { Component, OnInit, ViewChild, Output, EventEmitter, Inject, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, VERSION, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormBuilder, FormGroup, FormArray, Validators, NgForm, Form } from '@angular/forms';
import { Router } from "@angular/router";
import { DOCUMENT } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';
import { DeparmentService } from './deparment.service';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { ComponentLoaderService } from '../../shared/component-loader.service';
import { JsonApiService } from 'src/assets/api/json-api.service';

export interface useRoleListData {

  highlighted?: boolean;
  hovered?: boolean;
  id: number;
}
const ELEMENT_DATA: useRoleListData[] = [];

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  // styleUrls: ['./department.component.css']
  styleUrls: ['./department-srmav.component.css']
})
export class DepartmentComponent implements OnInit {
  dataSource: any;
  rowindex: any;
  count: number;
  searchCombo: any;
  searchForm: FormGroup;
  displayNoRecords = true;
  userRoleFieldName: any;
  qtd: any = [];
  qtm: any = '';
  add = false;
  modify = false;
  view = false;
  delete = false;
  // statuslist = [{name: 'Active'}, {name: 'InActive'} ];
  statuslist: any = [];
  selection = new SelectionModel<useRoleListData>(true, []);
  labels: any = {}; /** LABEL CHANGES **/

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private formBuilder: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private deparmentService: DeparmentService,
    private componentLoaderService: ComponentLoaderService,
    private jsonApiService: JsonApiService/** LABEL CHANGES **/) {
    this.dataSource = [];
    this.count = 1;
    this.displayNoRecords = true;
    this.userRoleFieldName = [];
  }
  
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  highlight(element: useRoleListData) {
    element.highlighted = !element.highlighted;
  }
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));

  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    if (this.dataSource.filteredData.length > 0 || this.selection.selected.length > 0) {
      this.displayNoRecords = true;
      this.selection.clear();
      //this.rowindex.length = [];
    } else {
      this.displayNoRecords = false;
    }
  }
  ngOnInit() {
    this.componentLoaderService.display(true);
    this.getLabelDetails(); /** LABEL CHANGES **/
    this.searchForm = this.formBuilder.group({
      searchDatas: this.formBuilder.array([this.sequenceType()]),
    });
    if(localStorage.getItem('langCode') == 'en'){
      this.statuslist = [{name: 'Active'}, {name: 'InActive'}]
    }else if(localStorage.getItem('langCode') == 'jp'){
      this.statuslist = [{name: '能動'}, {name: '無効'}]
    }
    this.onLoadDepartmentRoleList();
  }
  getLabelDetails()
  {
    let lang;
    if(localStorage.getItem('langCode') !== null){
      lang = localStorage.getItem('langCode');
    }
    this.jsonApiService.fetch('/'+lang+'.json').subscribe((data) => {
        this.labels = data;
      });
  }
  onLoadDepartmentRoleList() {
    let loadUserRoleList = this.deparmentService.userRoleList().subscribe(data => {
      let loadUserRoleListGetData = JSON.parse(data['_body']);
      let loadUserRoleTableData = loadUserRoleListGetData.succesObject;
      this.dataSource =[];
      if(loadUserRoleTableData.length > 0){
        this.dataSource = new MatTableDataSource(loadUserRoleTableData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.displayNoRecords = true;
      } else {
        this.displayNoRecords = false;
      }
      this.userRoleFieldName = loadUserRoleListGetData.authSuccesObject.screenFieldDisplayVoList;
      this.searchCombo = [];
      let search;
      if(localStorage.getItem('langCode') == 'en'){
        search = [
          { Name: "Department" , Value: 'userDepartmentName' },
          { Name: "Location", Value: 'userLocationName' },
          { Name: "SubLocation", Value: 'sublocationName' },
          { Name: "Description", Value: 'description' },
        ];
      }else if(localStorage.getItem('langCode') == 'jp'){
        search = [
          { Name: "ユーザー部門名", Value: 'userDepartmentName' },
          { Name: "ユーザーの場所名", Value: 'userLocationName' },
          { Name: "サブロケーション名", Value: 'sublocationName' },
          { Name: "説明", Value: 'description' },
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
        let screenFunctionDisplayList = loadUserRoleListGetData.authSuccesObject.screenFunctionDisplayList;
        for (let k in screenFunctionDisplayList) {
         if(screenFunctionDisplayList[k] === 'ADD') {
           this.add = true;
         }
         if(screenFunctionDisplayList[k] === 'MODIFY') {
           this.modify = true;
         }
         if(screenFunctionDisplayList[k] === 'VIEW') {
           this.view = true;
        }
        if(screenFunctionDisplayList[k] === 'DELETE') {
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
  sequenceType() {
    return this.formBuilder.group({
      dropDownVal: [""],
      textVal: [""],
    })
  }
  addSequence(form) {
    let j = form.controls.searchDatas.controls.length;
   let i = j-1; 
 
   let dropvalue = form.controls.searchDatas.controls[i].controls.dropDownVal.value;
   let textVal = form.controls.searchDatas.controls[i].controls.textVal.value;
   
   if (this.count <= 3 && dropvalue !== null && textVal != null) {
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

    } else { this.qtd[ind] = {};
    form.controls.searchDatas.controls[ind].controls.dropDownVal.reset();
    form.controls.searchDatas.controls[ind].controls.textVal.reset(); }


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
    this.deparmentService.search_list(finalSearchData).subscribe(data => {
      let reqScrConfigSearchData = JSON.parse(data['_body']);
      this.dataSource = [];
      if(reqScrConfigSearchData.succesObject.length > 0){
        this.dataSource = new MatTableDataSource(reqScrConfigSearchData.succesObject);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.displayNoRecords = true;
      } else {
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
      this.onLoadDepartmentRoleList();
    }
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
      let userRoleId = [this.selection.selected[0].id];
      dialogRef.afterClosed().subscribe(result => {
        if(result){
        this.deparmentService.deleteUserRoleList(userRoleId).subscribe(data => {
          let resp = JSON.parse(data['_body']);
          if (resp.responseCode == '200') {
            const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
              disableClose: false,
              width: 'auto',
              panelClass: 'btnCenter',
              data: {
                title: 'Alert',
                server:'servermessage',
                message: resp.responseMessage,
                btnYes: 'Ok',
              }
            });
          dialogRef.afterClosed().subscribe(data => {
            this.onLoadDepartmentRoleList();
            this.selection.clear();
          });
          }else{
            const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
              disableClose: false,
              panelClass: 'btnCenter',
              width: 'auto',
              data: {
                title: 'Alert',
                server:'servermessage',
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
      let userRoleId = [];
      for (let i = 0; i < this.selection.selected.length; i++) {
        userRoleId.push(this.selection.selected[i].id);
      }
      dialogRef.afterClosed().subscribe(result => {
        if(result){
        this.deparmentService.deleteUserRoleList(userRoleId).subscribe(data => {
          let resp = JSON.parse(data['_body']);
          if (resp.responseCode == '200') {
            const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
              disableClose: false,
              panelClass: 'btnCenter',
              width: 'auto',
              data: {
                title: 'Info',
                server:'servermessage',
                message: resp.responseMessage,
                btnYes: 'Ok',
              }
            });

          dialogRef.afterClosed().subscribe(data => {
            this.onLoadDepartmentRoleList();
            this.selection.clear();
          });
          }else{
            const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
              disableClose: false,
              width: 'auto',
              panelClass: 'btnCenter',
              data: {
                title: 'Alert',
                server:'servermessage',
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
          let locId = this.selection.selected[0]['userLocation'];
          this.router.navigate(['/department/department-modify']);
          let rowId = String(this.selection.selected[0]['id']);
          localStorage.setItem('departmentId', rowId);
          localStorage.setItem('locationId', locId);
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
      this.router.navigate(['/department/department-view']);
      let locId = this.selection.selected[0]['userLocation'];
      let rowId = String(this.selection.selected[0]['id']);
      localStorage.setItem('departmentId', rowId);
      localStorage.setItem('locationId', locId);
    /*  const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        panelClass: 'btnCenter',
        width: 'auto',
        data: {
          message: 'Are you sure you want to view this Record?',
          btnPrjYes: 'Yes',
          btnPrjNo: 'No',
        }
      });
      dialogRef.afterClosed().subscribe(data => {
        if (data) {
          this.router.navigate(['/department/department-view']);
          let rowId = String(this.selection.selected[0]['id']);
          localStorage.setItem('departmentId', rowId)

        }
      });*/
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

  searchClear(){
    for(let i=0; i < this.searchForm.value.searchDatas.length; i++){
      this.deleteSequence();
    }
    this.displayNoRecords = true;
    this.ngOnInit();
	}
}


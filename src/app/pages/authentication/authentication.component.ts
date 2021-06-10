import { Component, OnInit, ViewChild, Output, EventEmitter, Inject, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, VERSION, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormBuilder, FormGroup, FormArray, Validators, NgForm, Form } from '@angular/forms';
import { Router } from "@angular/router";
import { DOCUMENT } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';
import { AuthenticationServiceService } from './authentication-service.service';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { ComponentLoaderService } from '../../shared/component-loader.service';
import { JsonApiService } from 'src/assets/api/json-api.service';
export interface useRoleListData {

  highlighted?: boolean;
  hovered?: boolean;
  authenticationId: number;
}
const ELEMENT_DATA: useRoleListData[] = [];
@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  // styleUrls: ['./authentication.component.css'],
  styleUrls: ['./authentication-srmav.component.css']
})
export class AuthenticationComponent implements OnInit {
  labels: any = {}; /** LABEL CHANGES **/
  dataSource: any;
  rowindex: any;
  count: number;
  searchCombo: any;
  searchForm: FormGroup;
  displayNoRecords;
  userFieldName: any;
  userBaseFieldName: any;
  add = false;
  view = false;
  modify = false;
  delete = false;
  selection = new SelectionModel<useRoleListData>(false, []);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private jsonApiService: JsonApiService/** LABEL CHANGES **/,
    private formBuilder: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private authenticationService: AuthenticationServiceService,
    private componentLoaderService: ComponentLoaderService) {
    this.dataSource = [];
    this.count = 1;
    this.displayNoRecords = true;
    this.userFieldName = [];
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
    } else {
      this.displayNoRecords = false;
    }
  }
  ngOnInit() {
    this.getLabelDetails(); /** LABEL CHANGES **/
    this.componentLoaderService.display(true);
    this.searchForm = this.formBuilder.group({
      searchDatas: this.formBuilder.array([this.sequenceType()]),
    });
    this.onLoaduserList();
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
  addConfiguration(id, roleName) {
   
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: false,
      width: "auto",
      data: {
        title: 'Confirmation',
        mess: 3,
        firstName: roleName,
        message: "entityConfig",
        btnYes: "Yes",
        btnNo: "No"
      }
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        localStorage.setItem('roleId', id);
        this.router.navigateByUrl("/authentication/authentication-add");
      }
    })
  }
  viewConfiguration(id, roleName) {
    localStorage.setItem('roleId', id);
    this.router.navigateByUrl("/authentication/authentication-view");
  }
  onLoaduserList() {
    let loaduserList = this.authenticationService.authenticationList().subscribe(data => {
      let loaduserListGetData = JSON.parse(data['_body']);
      this.dataSource = [];
      if (loaduserListGetData.succesObject.userRoleList.length > 0) {
        this.dataSource = new MatTableDataSource(loaduserListGetData.succesObject.userRoleList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.displayNoRecords = true;
      } else {
        this.displayNoRecords = false;
      }
      this.userBaseFieldName = ['User Role Name', 'Functions'];
      this.userBaseFieldName.unshift("select");
      let screenFunctionDisplayList = loaduserListGetData.succesObject.screenFunctionDisplayList;
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
      this.searchCombo = [
        { Name: "User Role", Value: 'roleName' },
      ];

    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
    this.componentLoaderService.display(false);
  }
  sequenceType() {
    return this.formBuilder.group({
      dropDownVal: ["", Validators.required],
      textVal: ["", Validators.required],
    })
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
    this.authenticationService.search_list(finalSearchData).subscribe(data => {
      let reqScrConfigSearchData = JSON.parse(data['_body']);
      this.dataSource = [];
      if (reqScrConfigSearchData.succesObject.userRoleList !== null) {
        this.dataSource = new MatTableDataSource(reqScrConfigSearchData.succesObject.userRoleList);
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
      this.onLoaduserList();
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
          this.componentLoaderService.display(true);
          this.router.navigate(['/authentication/authentication-modify']);
          let rowId = String(this.selection.selected[0]['authenticationId']);
          localStorage.setItem('authenticationId', rowId);

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
      this.router.navigate(['/authentication/authentication-view']);
      let rowId = String(this.selection.selected[0]['authenticationId']);
      localStorage.setItem('authenticationId', rowId);
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
            let tt: any = {};
            tt = item;
            let reqWorkFlow = tt.id;
            this.authenticationService.deleteUserList(reqWorkFlow).subscribe(data => {
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
              } else {
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
              this.onLoaduserList();
            });
          });
          this.selection = new SelectionModel<useRoleListData>(true, []);
        }
      });
    } else if (this.selection.selected.length > 0) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        panelClass: 'btnCenter',
        width: 'auto',
        data: {
          title: 'Alert',
          message: "singleSelection",
          btnYes: 'Ok',
        }
      });
    } else if (this.selection.selected.length === 0) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        panelClass: 'btnCenter',
        width: 'auto',
        data: {
          title: 'Alert',
          message: "selection",
          btnYes: 'Ok',
        }
      });
    }
  }
  reset() {
    this.onLoaduserList();
  }
}

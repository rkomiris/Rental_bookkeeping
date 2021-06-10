import { Component, OnInit, ViewChild, Output, EventEmitter, Inject, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, VERSION, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormBuilder, FormGroup, FormArray, Validators, NgForm, Form } from '@angular/forms';
import { Router } from "@angular/router";
import { DOCUMENT } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';
import { AminiteService } from '../../pages/aminite/aminite.service';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { ComponentLoaderService } from '../../shared/component-loader.service';

export interface aminiteListData {
  highlighted?: boolean;
  hovered?: boolean;
  amenityId: number;
}
const ELEMENT_DATA: aminiteListData[] = [];
@Component({
  selector: 'app-aminite',
  templateUrl: './aminite.component.html',
  styleUrls: ['./aminite-srmav.component.css']
})
export class AminiteComponent implements OnInit {
  searchForm: FormGroup;
  displayNoRecords = true;
  aminiteBaseFieldName: any = [];
  dataSource: any = [];
  rowindex: any;
  count: number = 1;
  searchCombo: any;;
  qtd: any = [];
  qtm: any = '';
  add = false;
  modify = false;
  view = false;
  delete = false;
  userRoleFieldName: any = [];
  statuslist = [{ name: 'Active' }, { name: 'InActive' }];
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
    @Inject(DOCUMENT) private document: Document,
    private formBuilder: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private aminiteService: AminiteService,
    private componentLoaderService: ComponentLoaderService) { }

  ngOnInit() {
    this.componentLoaderService.display(true);
    this.document.body.classList.remove('loginonly');
    this.searchForm = this.formBuilder.group({
      searchDatas: this.formBuilder.array([this.sequenceType()]),
    });
    this.aminite_list_details();
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
    if (this.count <= 2 && dropvalue !== null && textVal != null) {
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
    this.aminiteService.search_list(finalSearchData).subscribe(data => {
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
      setTimeout(() => {
        if (this.dataSource.filteredData.length > 0 || this.selection.selected.length > 0) {
          this.displayNoRecords = true;
          this.selection.clear();
        } else {
          this.displayNoRecords = false;
        }
      }, 100);
    });
  }
  aminiteListGetData: any;

  aminite_list_details() {
    let loadAminiteList = this.aminiteService.load_aminiteData().subscribe(data => {
      let aminiteListGetData = JSON.parse(data['_body']);
      let aminiteListTableDate = aminiteListGetData.succesObject;
      this.dataSource = [];
      if (aminiteListGetData.succesObject.length > 0) {
        this.dataSource = new MatTableDataSource(aminiteListGetData.succesObject.amenityVoList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.displayNoRecords = true;
      } else {
        this.displayNoRecords = false;
      }
      this.userRoleFieldName = aminiteListGetData.succesObject.screenFieldDisplayVoList;
      this.searchCombo = [{ name: 'Choose Field' }];
      let search = [
        { name: 'Code', value: 'amenityCode' },
        { name: 'Amenity Name', value: 'amenityName' },
        { name: 'Status', value: 'status' }
      ];
      for (let k in search) {
        let ll = this.userRoleFieldName.includes(search[k].value);
        if (ll === true) {
          this.searchCombo.push(search[k]);
        }
      }
      let screenFunctionDisplayList = aminiteListGetData.succesObject.screenFunctionDisplayList;
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
  removeFilter(filterValue: string): void {
    this.displayNoRecords = true;
    if (filterValue.length == 0) {
      this.aminite_list_details();
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
          let aminiteType = this.selection.selected[0].amenityId;
          this.aminiteService.deleteProjectList([aminiteType]).subscribe(data => {
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
                this.aminite_list_details();
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
          let aminiteType = [];
          for (let i = 0; i < this.selection.selected.length; i++) {
            aminiteType.push(this.selection.selected[i].amenityId);
          }
          this.aminiteService.deleteProjectList(aminiteType).subscribe(data => {
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
                this.aminite_list_details();
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
          });
          this.selection = new SelectionModel<aminiteListData>(true, []);
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
          this.componentLoaderService.display(true);
          this.router.navigate(['/amenity/amenity-modify']);
          let rowId = String(this.selection.selected[0]['amenityId']);
          localStorage.setItem('aminiteId', rowId);

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
      this.componentLoaderService.display(true);
      this.router.navigate(['amenity/amenity-view']);
      let rowId = String(this.selection.selected[0]['amenityId']);
      localStorage.setItem('aminiteId', rowId);
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
}


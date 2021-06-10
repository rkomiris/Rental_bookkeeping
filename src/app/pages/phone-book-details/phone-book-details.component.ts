import { Component, OnInit, ViewChild, Output, EventEmitter, Inject, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, VERSION, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormBuilder, FormGroup, FormArray, Validators, NgForm, Form } from '@angular/forms';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';
import { PhoneBookDetailsService } from './phone-book-details.service';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { ComponentLoaderService } from '../../shared/component-loader.service';
import { JsonApiService } from 'src/assets/api/json-api.service';

export interface flashNewsListData {
  highlighted?: boolean;
  hovered?: boolean;
  id: number;
}

const ELEMENT_DATA: flashNewsListData[] = [];
@Component({
  selector: 'app-phone-book-details',
  templateUrl: './phone-book-details.component.html',
  // styleUrls: ['./phone-book-details.component.css']
  styleUrls: ['./phone-book-details-srmav.component.css']
})

export class PhoneBookDetailsComponent implements OnInit {
  labels: any = {}; /** LABEL CHANGES **/
  searchForm: FormGroup;
  displayNoRecords = true;
  flashNewsBaseFieldName: any = [];
  dataSource: any = [];
  rowindex: any;
  count = 1;
  searchCombo: any;
  qtd: any = [];
  qtm: any = '';
  add = false;
  modify = false;
  view = false;
  delete = false;
  statuslist: any = [];
  flashNewsListGetData: any;
  selection = new SelectionModel<flashNewsListData>(true, []);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  highlight(element: flashNewsListData) {
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

  constructor(
    private jsonApiService: JsonApiService/** LABEL CHANGES **/,
    @Inject(DOCUMENT) private document: Document,
    private formBuilder: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private phoneBookDetailsService: PhoneBookDetailsService,
    private componentLoaderService: ComponentLoaderService) { }

  ngOnInit() {
    this.getLabelDetails(); /** LABEL CHANGES **/
    this.document.body.classList.remove('loginonly');
    this.componentLoaderService.display(true);
    this.searchForm = this.formBuilder.group({
      searchDatas: this.formBuilder.array([this.sequenceType()]),
    });
    if(localStorage.getItem('langCode') == 'en'){
      this.statuslist = [{name: 'Active', value: "Active"}, {name: 'InActive', value: "InActive"}]
    }else if(localStorage.getItem('langCode') == 'jp'){
      this.statuslist = [{name: '能動',value: "Active"}, {name: '無効',  value: "InActive"}]
    }
    this.flashNews_list_details();
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
      dropDownVal: [''],
      textVal: [''],
    });
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

  addSequence(form) {
    let j = form.controls.searchDatas.controls.length;
    let i = j - 1;
    let dropvalue = form.controls.searchDatas.controls[i].controls.dropDownVal.value;
    let textVal = form.controls.searchDatas.controls[i].controls.textVal.value;
    if (this.count <= 7 && dropvalue !== null && textVal != null) {
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
      let fullValue = {};
      if (key !== '' && value !== '') {
        fullValue[key] = value;
        Object.assign(finalSearchData, fullValue);
      }
    }
    this.phoneBookDetailsService.search_list(finalSearchData).subscribe(data => {
      let reqScrConfigSearchData = JSON.parse(data['_body']);
      this.dataSource = [];
      if (reqScrConfigSearchData.succesObject.length > 0){
        this.dataSource = new MatTableDataSource(reqScrConfigSearchData.succesObject);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.displayNoRecords = true;
      }else{
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

  removeFilter(filterValue: string): void {
    this.displayNoRecords = true;
    if (filterValue.length === 0) {
      this.flashNews_list_details();
    }
  }

  flashNews_list_details() {
    
    let loadFlashNewsList = this.phoneBookDetailsService.load_flashNewsData().subscribe(data => {
      let flashNewsListGetData = JSON.parse(data['_body']);
      let flashNewsListTableDate = flashNewsListGetData.succesObject;
      this.dataSource = [];
      if (flashNewsListTableDate.length > 0) {
        this.dataSource = new MatTableDataSource(flashNewsListTableDate);
        this.dataSource.paginator = this.paginator;
        this.displayNoRecords = true;
      }else{
        this.displayNoRecords = false;
      }
      this.flashNewsBaseFieldName = flashNewsListGetData.authSuccesObject.screenFieldDisplayVoList;
      
      this.searchCombo = [];
      let search;
      if(localStorage.getItem('langCode') == 'en'){
        search = [
          { name: 'Emp Id', value: 'employeeId' },
          { name: 'Employee Name', value: 'employeeName' },
          { name: 'Department', value: 'userDepartment' },
          { name: 'Location', value: 'location' },
          { name: 'SubLocation', value: 'subLocation' },
          { name: 'Email', value: 'emailId' },
          { name: 'Mobile Number', value: 'phoneNumber' },
          { name: 'Status', value: 'status' }
        ];
      }
      else if(localStorage.getItem('langCode') == 'jp'){
        search = [
          { name: '従業員ID', value: 'employeeId' },
          { name: '従業員名', value: 'employeeName' },
          { name: 'ユーザー部門名', value: 'userDepartment' },
          { name: '場所の名前', value: 'location' },
          { name: 'ユーザーのサブロケーション', value: 'subLocation' },
          { name: '電子メール', value: 'emailId' },
          { name: '携帯電話番号', value: 'phoneNumber' },
          { name: '状態', value: 'status' }
        ];
      }
      for (let k in search) {
        let ll = this.flashNewsBaseFieldName.includes(search[k].value);
        if (ll === true) {
          this.searchCombo.push(search[k]);
        }
      }
      let screenFunctionDisplayList = flashNewsListGetData.authSuccesObject.screenFunctionDisplayList;
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
    }, error => {
      if (error.status === 401) {
        console.log('Error');
      }
    });
    this.componentLoaderService.display(false);
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
          let flashNewsType = [];
          this.selection.selected.forEach(item => {
            let kk: any = {};
            kk = item;
            flashNewsType.push(kk.phoneBookId);
            this.phoneBookDetailsService.deleteProjectList(flashNewsType).subscribe(data => {
              let resp = JSON.parse(data['_body']);
              if (resp.responseCode == '200') {
                const dialogRef1 = this.dialog.open(ConfirmationDialogComponent, {
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
              } else {
                const dialogRef1 = this.dialog.open(ConfirmationDialogComponent, {
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
              this.flashNews_list_details();
            });
          });
          this.selection = new SelectionModel<flashNewsListData>(true, []);
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
          btnNo: 'No',
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          let flashNewsType = [];
          this.selection.selected.forEach(item => {
            let kk: any = {};
            kk = item;
            flashNewsType.push(kk.phoneBookId);
          });
          this.phoneBookDetailsService.deleteProjectList(flashNewsType).subscribe(data => {
            let resp = JSON.parse(data['_body']);
            if (resp.responseCode == '200') {
              const dialogRef1 = this.dialog.open(ConfirmationDialogComponent, {
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
            } else {
              const dialogRef1 = this.dialog.open(ConfirmationDialogComponent, {
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
            this.flashNews_list_details();
          });
          this.selection = new SelectionModel<flashNewsListData>(true, []);
        }
      });
    } else if (this.selection.selected.length === 0) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        width: 'auto',
        panelClass: 'btnCenter',
        data: {
          title: 'Alert',
          message: 'selection',
          btnYes: 'Ok',
          btnNo: 'Cancel',
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
          this.router.navigate(['/phonedetails/phone-modify']);
          let rowId = String(this.selection.selected[0]['phoneBookId']);
          localStorage.setItem('phoneBookId', rowId);
          this.componentLoaderService.display(true);
        } else if (localStorage.getItem('isCancelled') === 'Yes') {
          return;
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
    } else if (this.selection.selected.length < 1) {
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
      this.router.navigate(['/phonedetails/phone-view']);
      let rowId = String(this.selection.selected[0]['phoneBookId']);
      localStorage.setItem('phoneBookId', rowId);
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
    } else if (this.selection.selected.length < 1) {
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

import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, VERSION, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormBuilder, FormGroup, FormArray, Validators, NgForm, Form } from '@angular/forms';
import { Router } from "@angular/router";
import { DOCUMENT } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';
import { LocationService } from './location.service';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { ComponentLoaderService } from '../../shared/component-loader.service';
import { JsonApiService } from 'src/assets/api/json-api.service';

export interface subLocationListData {

  highlighted?: boolean;
  hovered?: boolean;
  id: number;
}

const ELEMENT_DATA: subLocationListData[] = [];

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  // styleUrls: ['./location.component.css']
  styleUrls: ['./location-srmav.component.css']
})
export class LocationComponent implements OnInit {
  searchForm: FormGroup;
  displayNoRecords = true;
  subLocationBaseFieldName: any = [];
  dataSource: any = [];
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
  statuslist: any = [];
  selection = new SelectionModel<subLocationListData>(true, []);
  labels: any = {}; /** LABEL CHANGES **/

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  highlight(element: subLocationListData) {
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
    private formBuilder: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private locationService: LocationService,
    private componentLoaderService: ComponentLoaderService,
    private jsonApiService: JsonApiService /** LABEL CHANGES **/) { }
  
    ngOnInit() {
    this.componentLoaderService.display(true);
    this.document.body.classList.remove('loginonly');
    this.searchForm = this.formBuilder.group({
      searchDatas: this.formBuilder.array([this.sequenceType()]),
    });
    this.location_list_details();
    if(localStorage.getItem('langCode') == 'en'){
      this.statuslist = [{name: 'Active', value: "Active"}, {name: 'InActive', value: "InActive"}]
    }else if(localStorage.getItem('langCode') == 'jp'){
      this.statuslist = [{name: '能動',value: "Active"}, {name: '無効',  value: "InActive"}]
    }
    this.getLabelDetails();
  }
  sequenceType() {
    return this.formBuilder.group({
      dropDownVal: [""],
      textVal: [""],
    })
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
    this.locationService.search_list(finalSearchData).subscribe(data => {
      let reqScrConfigSearchData = JSON.parse(data['_body']);
      this.dataSource = [];
      if(reqScrConfigSearchData.succesObject.length > 0){
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
  location_list_details() {
    let loadSublocationList = this.locationService.load_sublocation().subscribe(data => {
      let sublocationListGetData = JSON.parse(data['_body']);
      let sublocationListTableDate = sublocationListGetData.succesObject;
      this.dataSource = [];
      if (sublocationListTableDate.length > 0) {
        this.dataSource = new MatTableDataSource(sublocationListTableDate);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.displayNoRecords = true;
      }else{
        this.displayNoRecords = false;
      }

      this.userRoleFieldName = sublocationListGetData.authSuccesObject.screenFieldDisplayVoList;
      
      this.searchCombo = [];
      let search;
      if(localStorage.getItem('langCode') == 'en'){
        search = [
          { Name: "Location", Value: 'userLocationName' },
          { Name: "Location Details", Value: 'userLocationDetails' },
          { Name: "Zip", Value: 'zip' },
          { Name: "Phone", Value: 'phone' },
          { Name: "Fax", Value: 'fax' },
          { Name: "Email", Value: 'email' },
          { Name: "Contact Name", Value: 'contactName' },
          { Name: "City", Value: 'city' },
          { Name: "State", Value: 'state' },
          { Name: "Country", Value: 'country' }
        ];
      }
      else if(localStorage.getItem('langCode') == 'jp'){
        search = [
          { Name: "場所", Value: 'userLocationName' },
          { Name: "場所の詳細", Value: 'userLocationDetails' },
          { Name: "郵便番号", Value: 'zip' },
          { Name: "電話番号", Value: 'phone' },
          { Name: "ファクス番号", Value: 'fax' },
          { Name: "電子メールアドレス", Value: 'email' },
          { Name: "連絡先", Value: 'contactName' },
          { Name: "市", Value: 'city' },
          { Name: "状態", Value: 'state' },
          { Name: "国", Value: 'country' }
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
      let screenFunctionDisplayList = sublocationListGetData.authSuccesObject.screenFunctionDisplayList;
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
      let locationId = [this.selection.selected[0].id];
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.locationService.deleteProjectList(locationId).subscribe(data => {
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
                this.location_list_details();
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
          this.locationService.deleteProjectList(locationId).subscribe(data => {
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
                this.location_list_details();
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
          this.router.navigate(['/location/location-modify']);
          let rowId = String(this.selection.selected[0]['id']);
          localStorage.setItem('locationId', rowId);
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
      this.router.navigate(['/location/location-view']);
      let rowId = String(this.selection.selected[0]['id']);
      localStorage.setItem('locationId', rowId);
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

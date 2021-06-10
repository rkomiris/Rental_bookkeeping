import { Component, OnInit, ViewChild, Output, EventEmitter, Inject, OnDestroy, inject } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, VERSION, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormBuilder, FormGroup, FormArray, Validators, NgForm, Form } from '@angular/forms';
import { Router } from "@angular/router";
import { DOCUMENT } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';
import { EntityService } from './entity.service';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { ComponentLoaderService } from '../../shared/component-loader.service';
import { JsonApiService } from 'src/assets/api/json-api.service';

export interface entityListData {

  highlighted?: boolean;
  hovered?: boolean;
  id: number;
}
const ELEMENT_DATA: entityListData[] = [];


@Component({
  selector: 'app-entity',
  templateUrl: './entity.component.html',
  styleUrls: ['./entity.component.css']
})
export class EntityComponent implements OnInit {
  dataSource: any;
  rowindex: any;
  count: number;
  searchCombo: any;
  searchForm: FormGroup;
  displayNoRecords = true;
  userRoleFieldName: any;
  qtd: any = [];
  qtm: any = '';
  add: boolean;
  modify: boolean;
  renewal: boolean;
  view: boolean;
  delete: boolean;
  activate: boolean;
  deactivate: boolean;
  labels: any = {}; /** LABEL CHANGES **/
  // statuslist = [{ name: 'Active', id: "1" }, { name: 'InActive', id: "0" }];
  statuslist: any = [];
  selection = new SelectionModel<entityListData>(true, []);
  activeCombo = [
    { Name: "Active", Value: 1 },
    { Name: "In-active", Value: 0 }
  ]

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  highlight(element: entityListData) {
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

  constructor
    (
      @Inject(DOCUMENT) private document: Document,
      private formBuilder: FormBuilder,
      private router: Router,
      private dialog: MatDialog,
      private entityService: EntityService,
      private componentLoaderService: ComponentLoaderService,
      private jsonApiService: JsonApiService, /** LABEL CHANGES **/
  ) {
    this.dataSource = [];
    this.count = 1;
    this.displayNoRecords = true;
    this.userRoleFieldName = [];
  }

  ngOnInit() {
    this.componentLoaderService.display(true);
    this.getLabelDetails(); /** LABEL CHANGES **/
    this.searchForm = this.formBuilder.group({
      searchDatas: this.formBuilder.array([this.sequenceType()]),
    });
    if(localStorage.getItem('langCode') == 'en'){
      this.statuslist = [{name: 'Active', id: "1"}, {name: 'InActive', id: "0"}]
    }else if(localStorage.getItem('langCode') == 'jp'){
      this.statuslist = [{name: '能動', id: "1"}, {name: '無効', id: "0"}]
    }
    if (localStorage.getItem('userId') == '1') {
      this.onLoadEntityListSingle();
    } else {
      this.onLoadEntityListData();
    }

  }
  /** Method for grouping search Form Data */
  sequenceType() {
    return this.formBuilder.group({
      dropDownVal: [""],
      textVal: [""],
    })
  }
  /** Method call for Language Translation */
  getLabelDetails() {
    let lang;
    if (localStorage.getItem('langCode') !== null) {
      lang = localStorage.getItem('langCode');
    }
    this.jsonApiService.fetch('/' + lang + '.json').subscribe((data) => {
      this.labels = data;
    });
  }

  /** Method for getting data from service and displaying it in list table */
  onLoadEntityListData() {
    let loadUserRoleList = this.entityService.entityList().subscribe(data => {
      let loadUserRoleListGetData = JSON.parse(data['_body']);
      let loadUserRoleTableData = loadUserRoleListGetData.succesObject;
      this.dataSource = [];
      if (loadUserRoleTableData.length > 0) {
        this.dataSource = new MatTableDataSource(loadUserRoleTableData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.displayNoRecords = true;
      } else {
        this.displayNoRecords = false;
      }
      //this.userRoleFieldName = loadUserRoleListGetData.authSuccesObject.screenFieldDisplayVoList;
      this.userRoleFieldName = ['select', 'entityName', 'location', 'subLocation', 'statusValue', 'planName'];
      this.searchCombo = [];
      let search;
      if (localStorage.getItem('langCode') == 'en') {
        search = [
          { Name: "Entity Name", Value: 'entityName' },
          { Name: "Location", Value: 'location' },
          { Name: "SubLocation", Value: 'subLocation' },
          { Name: "Plan Name", Value: 'planName' },
          { Name: "Status", Value: 'statusValue' },
        ];
      }
      else if (localStorage.getItem('langCode') == 'jp') {
        search = [
          { Name: "エンティティ名", Value: 'entityName' },
          { Name: "場所", Value: 'location' },
          { Name: "サブロケーション", Value: 'subLocation' },
          { Name: "プラン名", Value: 'planName' },
          { Name: "状態", Value: 'statusValue' },
        ];
      }
      for (let k in search) {
        if (search[k].Value !== undefined) {
          // let ll = this.userRoleFieldName.includes(search[k].Value);
          // if (ll === true) {
          this.searchCombo.push(search[k]);
          // }
        }
      }
      let screenFunctionDisplayList = loadUserRoleListGetData.authSuccesObject.screenFunctionDisplayList;
      for (let k in screenFunctionDisplayList) {
        if (screenFunctionDisplayList[k] === 'CREATE') {
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
        if (screenFunctionDisplayList[k] === 'RENEWAL') {
          this.renewal = true;
        }
        if (screenFunctionDisplayList[k] === 'ACTIVE') {
          this.activate = true;
        }
        if (screenFunctionDisplayList[k] === 'INACTIVE') {
          this.deactivate = true;
        }
      }
      this.componentLoaderService.display(false);
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
  }

  onLoadEntityListSingle() {
    let loadUserRoleList = this.entityService.entityListSingle().subscribe(data => {
      let loadUserRoleListGetData = JSON.parse(data['_body']);
      let loadUserRoleTableData = loadUserRoleListGetData.succesObject;
      this.dataSource = [];
      if (loadUserRoleTableData.length > 0) {
        this.dataSource = new MatTableDataSource(loadUserRoleTableData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.displayNoRecords = true;
      } else {
        this.displayNoRecords = false;
      }
      //this.userRoleFieldName = loadUserRoleListGetData.authSuccesObject.screenFieldDisplayVoList;
      this.userRoleFieldName = ['select', 'entityName', 'planName', 'location', 'subLocation', 'statusValue'];
      this.searchCombo = [];
      let search;
      if (localStorage.getItem('langCode') == 'en') {
        search = [
          { Name: "Entity Name", Value: 'entityName' },
          { Name: "Location", Value: 'location' },
          { Name: "SubLocation", Value: 'subLocation' },
          { Name: "Plan Name", Value: 'planName' },
          { Name: "Status", Value: 'statusValue' },
        ];
      }
      else if (localStorage.getItem('langCode') == 'jp') {
        search = [
          { Name: "エンティティ名", Value: 'entityName' },
          { Name: "場所", Value: 'location' },
          { Name: "サブロケーション", Value: 'subLocation' },
          { Name: "プラン名", Value: 'planName' },
          { Name: "状態", Value: 'statusValue' },
        ];
      }
      for (let k in search) {
        if (search[k].Value !== undefined) {
          //     let ll = this.userRoleFieldName.includes(search[k].Value);
          //     if (ll === true) {
          this.searchCombo.push(search[k]);
          //   }
        }
      }
      let screenFunctionDisplayList = loadUserRoleListGetData.authSuccesObject.screenFunctionDisplayList;

      this.add = true;
      this.modify = true;
      this.view = true;
      this.delete = true;
      this.renewal = true;
      this.activate = true;
      this.deactivate = true;

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
    if (this.count <= 6 && dropvalue !== null && textVal != null) {
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

  /** Method call for searching data in the list table */
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
    this.entityService.search_list(finalSearchData).subscribe(data => {
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
      this.onLoadEntityListData();
    }
  }

  projectModify() {
    if (this.selection.selected.length > 1) {
      const dialogRef1 = this.dialog.open(ConfirmationDialogComponent, {
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
    else if (this.selection.selected.length == 0) {
      const dialogRef2 = this.dialog.open(ConfirmationDialogComponent, {
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
    else if (this.selection.selected.length == 1) {
      let rowId = String(this.selection.selected[0]['entityId']);
      this.router.navigate(['/entity/entity-renewal']);
      localStorage.setItem('entityId', rowId);
      this.componentLoaderService.display(true);

    }
  }

  projectView() {
    if (this.selection.selected.length > 1) {
      const dialogRef1 = this.dialog.open(ConfirmationDialogComponent, {
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
    else if (this.selection.selected.length == 0) {
      const dialogRef2 = this.dialog.open(ConfirmationDialogComponent, {
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
    else if (this.selection.selected.length == 1) {
      let rowId = String(this.selection.selected[0]['entityId']);
      this.router.navigate(['/entity/entity-view']);
      localStorage.setItem('entityId', rowId);
      this.componentLoaderService.display(true);

    }
  }

  removeSelectedRows() {

  }

  searchClear() {
    for (let i = 0; i < this.searchForm.value.searchDatas.length; i++) {
      this.deleteSequence();
    }
    this.displayNoRecords = true;
    this.ngOnInit();
  }

  projectActivate(data) {

    if (this.selection.selected.length > 1) {
      {
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
    }
    else if (this.selection.selected.length == 0) {
      {
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
    else if (this.selection.selected.length == 1) {
      let value = {};
      value['entityId'] = this.selection.selected[0]['entityId']
      value['entityName'] = this.selection.selected[0]['entityName'];
      value['status'] = data;
      if ((data == true) && (this.selection.selected[0]['statusValue'] == 'Active')) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          disableClose: false,
          panelClass: 'btnCenter',
          width: 'auto',
          data: {
            title: 'Alert',
            message: 'entityActive',
            btnYes: 'OK',
          }
        });
        dialogRef.afterClosed().subscribe( data => {
          this.selection.clear();
        })
      }
      else if ((data == false) && (this.selection.selected[0]['statusValue'] == 'InActive')) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          disableClose: false,
          panelClass: 'btnCenter',
          width: 'auto',
          data: {
            title: 'Alert',
            message: 'entityInactive',
            btnYes: 'OK',
          }
        });
        dialogRef.afterClosed().subscribe( data => {
          this.selection.clear();
        })
      }
      else {
        this.entityService.update(value).subscribe(data => {
          let datalist = JSON.parse(data['_body']);
          if (datalist.responseCode == '200') {
            const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
              disableClose: false,
              panelClass: 'btnCenter',
              width: 'auto',
              data: {
                title: 'Info',
                server: 'servermessage',
                message: datalist.responseMessage,
                btnYes: 'Ok',
              }
            });
            dialogRef.afterClosed().subscribe(data => {
              if (data) {
                this.selection.clear();
                this.ngOnInit();
              }
            })
          } else {
            const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
              disableClose: false,
              panelClass: 'btnCenter',
              width: 'auto',
              data: {
                title: 'Alert',
                server: 'servermessage',
                message: datalist.responseMessage,
                btnYes: 'Ok',
              }
            });
          }
        })
      }
    }
  }
}

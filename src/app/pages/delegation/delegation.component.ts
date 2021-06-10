import { Component, OnInit, ViewChild, Inject, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { requestListData } from '../approval/approvallist/approvallist.component';
import { MatPaginator, MatSort, MatDialog, MatTableDataSource } from '@angular/material';
import { DOCUMENT } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { DelegationService } from './delegation.service';
import { ComponentLoaderService } from 'src/app/shared/component-loader.service';
import { JsonApiService } from 'src/assets/api/json-api.service';


@Component({
  selector: 'app-delegation',
  templateUrl: './delegation.component.html',
  styleUrls: ['./delegation.component.css']
})
export class DelegationComponent implements OnInit {
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
  userRoleFieldName: any = [];
  selection = new SelectionModel<requestListData>(true, []);
  searchCombo: any = [];
  code: String;
  getAllDataList: any = [];
  userAvail: Boolean;
  searchRespList: any = [];
  labels: any = {};
  types: any = [];
  // types: any[] = [
  //   { value: 'assigned', viewValue: 'Assigned' },
  //   { value: 'unassigned', viewValue: 'Un-Assigned' },
  // ];

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
      //this.request_list_details();
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

  constructor(@Inject(DOCUMENT) private document: Document,
    private formBuilder: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private componentLoaderService: ComponentLoaderService,
    private delegationService: DelegationService,
    private jsonApiService: JsonApiService) { }

  ngOnInit() {
    this.componentLoaderService.display(true);
    this.getAll();
    this.getLabelDetails();
    this.searchForm = this.formBuilder.group({
      searchDatas: this.formBuilder.array([this.sequenceType()]),
      listFromDate: [null],
      listToDate: [null]
    });
    if(localStorage.getItem('langCode') == 'en'){
      this.types = [{ value: 1, viewValue: 'Approver' },
      { value: 2, viewValue: 'Resolver' }]
    }else if(localStorage.getItem('langCode') == 'jp'){
      this.types = [{ value: 1, viewValue: '承認者' },
      { value: 2, viewValue: 'リゾルバ' }]
    }
    this.componentLoaderService.display(false);
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
      textVal: [""]
    });
  }

  getAll() {
    let loadRequestList = this.delegationService.getAllList().subscribe(
      data => {
        let getAllData = JSON.parse(data["_body"]);

        this.getAllDataList = getAllData.succesObject;
        this.userRoleFieldName = getAllData.authSuccesObject.screenFieldDisplayVoList;
        this.dataSource = [];
        if (this.getAllDataList.length > 0) {
          this.dataSource = new MatTableDataSource(this.getAllDataList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.displayNoRecords = true;
        } else {
          this.displayNoRecords = false;
        }

        this.searchCombo = [];
        let search;
        if(localStorage.getItem('langCode') == 'en'){
          search = [
            { name: 'User', value: 'user' },
            { name: 'Status', value: 'status' },
          ];
        }
        else if(localStorage.getItem('langCode') == 'jp'){
         search = [
          { name: 'ユーザー', value: 'user' },
          { name: '状態', value: 'status' },
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
        let screenFunctionDisplayList = getAllData.authSuccesObject.screenFunctionDisplayList;
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
          console.log("Error");
        }
      }
    );
    // this.componentLoaderService.display(false);
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
      let fullValue = {};
      if (key !== '' && value !== '') {
        fullValue[key] = value;
        Object.assign(finalSearchData, fullValue);
      }
    }
    let loadRequestList = this.delegationService.search(finalSearchData).subscribe(
      data => {
        let searchResp = JSON.parse(data["_body"]);
        this.searchRespList = searchResp.succesObject;
        this.dataSource = [];
        if (this.searchRespList.length > 0) {
          this.dataSource = new MatTableDataSource(this.searchRespList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.displayNoRecords = true;
        } else {
          this.displayNoRecords = false;
        }

      })

  }

  dateFormat(event) {
  }

  recordview(row) {
    let userId = localStorage.getItem('userId');
    localStorage.setItem('delegationId', row.delegationId);
    localStorage.setItem('delegationUserId', userId);

  }
  searchClear() {
    for (let i = 0; i < this.searchForm.value.searchDatas.length; i++) {
      this.deleteSequence();
    }
    this.displayNoRecords = true;
    this.ngOnInit();
  }
  enable: boolean = false;

  projectAdd() {
    let userId = localStorage.getItem('userId');

    if (this.getAllDataList.length !== 0) {
      for (let i = 0; i < this.getAllDataList.length; i++) {
        if (this.getAllDataList[i].delegationUserId == userId) {
          this.enable = true
        }
      }
    }

    if (this.enable == true) {
      localStorage.setItem('userDelegationId', userId);
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        panelClass: 'btnCenter',
        width: 'auto',
        data: {
          title: 'Alert',
          message: 'delegationHistory',
          btnPrjYes: 'Yes',
          btnPrjNo: 'No',
        }
      });
      dialogRef.afterClosed().subscribe(data => {
        if (data !== false) {
          this.router.navigate(['/delegation/delegation-modify']);
        }
      })
    }
    else {
      this.router.navigate(['/delegation/delegation-add']);
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
          this.router.navigate(['/delegation/delegation-modify']);
          let rowId = String(this.selection.selected[0]['delegationUserId']);
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
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        panelClass: 'btnCenter',
        width: 'auto',
        data: {
          title: 'Confirmation',
          message: 'view',
          btnPrjYes: 'Yes',
          btnPrjNo: 'No',
        }
      });
      dialogRef.afterClosed().subscribe(data => {
        if (data) {
          this.componentLoaderService.display(true);
          this.router.navigate(['/delegation/delegation-view']);
          let rowId = String(this.selection.selected[0]['delegationUserId']);
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


}

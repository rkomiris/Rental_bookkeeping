import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatDialog, MatTableDataSource } from '@angular/material';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { JsonApiService } from 'src/assets/api/json-api.service';
import { ComponentLoaderService } from 'src/app/shared/component-loader.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { PlanMasterService } from './plan-master.service';

@Component({
  selector: 'app-plan-master',
  templateUrl: './plan-master.component.html',
  styleUrls: ['./plan-master.component.css']
})
export class PlanMasterComponent implements OnInit {

  dataSource: any = [];
  displayNoRecords: boolean;
  searchForm: FormGroup;
  add: boolean = false;
  modify: boolean = false;
  view: boolean = false;
  delete: boolean = false;
  userFieldName: any = [];
  userRoleFieldName: any = [];
  labels: any = {};
  searchCombo: any;
  qtd: any = [];
  qtm: any = '';
  count: number = 1;
  

  statuslist: any = []

  selection = new SelectionModel<any[]>(true, []);

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
    private formBuilder: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private componentLoaderService: ComponentLoaderService,
    private jsonApiService:JsonApiService,
    private planMasterService: PlanMasterService) { }

    isAllSelected() {
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource.data.length;
      return numSelected === numRows;
    }
    masterToggle() {
      this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
    }

  ngOnInit() {
    this.componentLoaderService.display(true);
    this.getLabelDetails(); /** LABEL CHANGES **/
    this.searchForm = this.formBuilder.group({
      searchDatas: this.formBuilder.array([this.sequenceType()]),
    });
    if(localStorage.getItem('langCode') == 'en'){
      this.statuslist = [{name: 'Active', id: true,}, {name: 'InActive', id: false,}]
    }else if(localStorage.getItem('langCode') == 'jp'){
      this.statuslist = [{name: '能動',id: true,}, {name: '無効', id: false,}]
    }
    if(localStorage.getItem('userId') == '1'){
      this.onLoadListSingle();
    }else{
      this.onLoadList();
    }
    
  }

  /** LABEL CHANGES **/
  getLabelDetails() {
    let lang;
    if (localStorage.getItem('langCode') !== null) {
      lang = localStorage.getItem('langCode');
    }
    this.jsonApiService.fetch('/' + lang + '.json').subscribe((data) => {
      this.labels = data;
    });
  }

  sequenceType() {
    return this.formBuilder.group({
      dropDownVal: [""],
      textVal: [""],
    })
  }

  onLoadList(){
    let loaduserList = this.planMasterService.planList().subscribe(data => {
      let loaduserListGetData = JSON.parse(data['_body']);
      let loaduserTableData = loaduserListGetData.succesObject;
      this.dataSource = [];
      if (loaduserTableData.length > 0) {
        this.dataSource = new MatTableDataSource(loaduserTableData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.displayNoRecords = true;
      }else{
        this.displayNoRecords = false;
      }
      this.userRoleFieldName = loaduserListGetData.authSuccesObject.screenFieldDisplayVoList;
      this.searchCombo = [];
      let search;
      if(localStorage.getItem('langCode') == 'en') {
         search = [
        { name: "Plan Name", Value: 'planName'},
        { name: "Duration", Value: 'duration' },
        { name: "User Count", Value: 'userCount'},
        { name: "Transaction Count", Value: 'transactionCount' },
        { name: "Original Amount", Value: 'amount'},
        { name: "Offer Amount", Value: 'offerAmount'},
        { name: "Currency Name", Value: 'currencyName'},
        { name: "Active", Value: 'activeFlag' }
      ];
    }
      else if(localStorage.getItem('langCode') == 'jp') {
        search = [
          { name: "プラン名", Value: 'planName'},
          { name: "期間", Value: 'duration' },
          { name: "現在のユーザー数", Value: 'userCount'},
          { name: "現在の取引数", Value: 'transactionCount' },
          { name: "Original Amount", Value: 'amount'},
          { name: "Offer Amount", Value: 'offerAmount'},
          { name: "Currency Name", Value: 'currencyName'},
          { name: "能動", Value: 'activeFlag' }
     ];}

      for (let k in search) {
        let ll = this.userRoleFieldName.includes(search[k].Value);
        if (ll === true) {
          this.searchCombo.push(search[k]);
        }
      }
      let screenFunctionDisplayList = loaduserListGetData.authSuccesObject.screenFunctionDisplayList;
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

  onLoadListSingle(){
    let loaduserList = this.planMasterService.planList().subscribe(data => {
      let loaduserListGetData = JSON.parse(data['_body']);
      let loaduserTableData = loaduserListGetData.succesObject;
      this.dataSource = [];
      if (loaduserTableData.length > 0) {
        this.dataSource = new MatTableDataSource(loaduserTableData);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.displayNoRecords = true;
      }else{
        this.displayNoRecords = false;
      }
      this.userRoleFieldName = ['select','planName','duration','userCount','transactionCount','amount',
        'offerAmount','offerRemarks','currencyName','activeFlag'];
      this.searchCombo = [];
      let search;
      if(localStorage.getItem('langCode') == 'en') {
         search = [
        { name: "Plan Name", Value: 'planName'},
        { name: "Duration", Value: 'duration' },
        { name: "User Count", Value: 'userCount'},
        { name: "Transaction Count", Value: 'transactionCount' },
        { name: "Original Amount", Value: 'amount'},
        { name: "Offer Amount", Value: 'offerAmount'},
        { name: "Currency Name", Value: 'currencyName'},
        { name: "Active", Value: 'activeFlag' }
      ];
    }
      else if(localStorage.getItem('langCode') == 'jp') {
        search = [
          { name: "プラン名", Value: 'planName'},
          { name: "期間", Value: 'duration' },
          { name: "現在のユーザー数", Value: 'userCount'},
          { name: "現在の取引数", Value: 'transactionCount' },
          { name: "元の金額", Value: 'amount'},
          { name: "提供量金額", Value: 'offerAmount'},
          { name: "通貨名", Value: 'currencyName'},
          { name: "能動", Value: 'activeFlag' }
     ];}

      for (let k in search) {
        // let ll = this.userRoleFieldName.includes(search[k].Value);
        // if (ll === true) {
          this.searchCombo.push(search[k]);
        // }
      }
          this.add = true;
        this.modify = true;
        this.view = true;
        this.delete = true;
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
    this.planMasterService.search(finalSearchData).subscribe(data => {
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
      this.ngOnInit();
    }
  }
  
  projectView() {
    if (this.selection.selected.length === 1) {
      this.componentLoaderService.display(true);
      this.router.navigate(['/plan-master/plan-master-view']);
      let rowId = String(this.selection.selected[0]['planId']);
      localStorage.setItem('planId', rowId);
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


  projectModify(){
    if (this.selection.selected.length === 1) {
      this.componentLoaderService.display(true);
      this.router.navigate(['/plan-master/plan-master-modify']);
      let rowId = String(this.selection.selected[0]['planId']);
      localStorage.setItem('planId', rowId);
    } 
    else if (this.selection.selected.length > 1) {
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
      let planId = [this.selection.selected[0]['planId']];
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.planMasterService.delete(planId).subscribe(data => {
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
                this.selection.clear();
                this.ngOnInit();
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
      let planId = [];
      for (let i = 0; i < this.selection.selected.length; i++) {
        planId.push(this.selection.selected[i]['planId']);
      }
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.planMasterService.delete(planId).subscribe(data => {
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
                this.ngOnInit();
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

  searchClear() {
    for (let i = 0; i < this.searchForm.value.searchDatas.length; i++) {
      this.deleteSequence();
    }
    this.displayNoRecords = true;
    this.ngOnInit();
  }
}

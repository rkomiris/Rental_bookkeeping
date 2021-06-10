
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { Router } from "@angular/router";
import { DOCUMENT } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';
import { RequestScrconfigService } from './request-scrconfig.service';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ComponentLoaderService } from '../../shared/component-loader.service';
import { JsonApiService } from 'src/assets/api/json-api.service';
export interface reqScrConfigListData {
  highlighted?: boolean;
  hovered?: boolean;
  requestScreenConfigurationId: number;
}
const ELEMENT_DATA: reqScrConfigListData[] = [];
@Component({
  selector: 'app-request-scrconfig',
  templateUrl: './request-scrconfig.component.html',
  styleUrls: ['./request-scrconfig-srmav.component.css']
})
export class RequestScrconfigComponent implements OnInit {
  labels: any = {}; /** LABEL CHANGES **/
  searchForm: FormGroup;
  displayNoRecords = true;
  count: number = 1;
  reqScrConfigBaseFieldName: any = [];
  dataSource: any = [];
  rowindex: any;
  searchCombo: any;
  qtd: any = [];
  qtm: any = '';
  add = false;
  modify = false;
  view = false;
  delete = false;
  userRoleFieldName: any = [];
  statuslist: any = [];
  selection = new SelectionModel<reqScrConfigListData>(true, []);

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  highlight(element: reqScrConfigListData) {
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
    private router: Router,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private requestScrconfigService: RequestScrconfigService,
    private componentLoaderService: ComponentLoaderService,
    private jsonApiService: JsonApiService/** LABEL CHANGES **/) { }

  ngOnInit() {
    this.getLabelDetails(); /** LABEL CHANGES **/
    this.componentLoaderService.display(true);
    this.searchForm = this.formBuilder.group({
      searchDatas: this.formBuilder.array([this.sequenceType()]),
    });
    this.document.body.classList.remove('loginonly');
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
    this.reqScrConfig_list_details();
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
  
  addSequence(form) {
    let j = form.controls.searchDatas.controls.length;
   let i = j-1; 
   let dropvalue = form.controls.searchDatas.controls[i].controls.dropDownVal.value;
   let textVal = form.controls.searchDatas.controls[i].controls.textVal.value;   
   if (this.count <= 4 && dropvalue !== null && textVal != null) {
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
    form.controls.searchDatas.controls[ind].controls.textVal.reset(); 
  }
  }

 hasNoDuplicates(arr) {
    return arr.every(num => arr.indexOf(num) === arr.lastIndexOf(num));
}

  deleteScreenConfig() {
    let rowId = [];
    for (let i = 0; i < this.selection.selected.length; i++) {
      rowId.push(this.selection.selected[i]['requestScreenConfigId']);
    }
    if (this.selection.selected.length >= 1) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        panelClass: 'btnCenter',
        width: 'auto',
        data: {
          title: 'Alert',
          message: 'delete',
          btnPrjYes: 'Yes',
          btnPrjNo: 'No',
        }
      });
      dialogRef.afterClosed().subscribe(data => {
        if (localStorage.getItem('isCancelled') === 'No') {
          let loadReqScrConfigList = this.requestScrconfigService.delete_reqScrConfigData(rowId).subscribe(data => {
            let reqScrConfigListData = JSON.parse(data['_body']);
            if (reqScrConfigListData.responseCode === '200') {
              const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                disableClose: false,
                panelClass: 'btnCenter',
                width: 'auto',
                data: {
                  title: 'Info',
                  server:'servermessage',
                  message: reqScrConfigListData.responseMessage,
                  btnYes: 'OK',
                }
              });
              dialogRef.afterClosed().subscribe(data => {
                this.reqScrConfig_list_details();
                this.selection.clear();
              })
            }
          });
        } else if (localStorage.getItem('isCancelled') === 'Yes') {
          return
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
  viewScreenConfig() {
    if (this.selection.selected.length === 1) {
      this.componentLoaderService.display(true);
      this.router.navigate(['/request-scrconfig/request-scrconfig-view']);
      let rowId = String(this.selection.selected[0]['requestScreenConfigId']);
      localStorage.setItem('requestScreenConfigId', rowId);
    } else if (this.selection.selected.length > 1) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        panelClass: 'btnCenter',
        width: 'auto',
        data: {
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
  modifyScreenConfig() {
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
          this.router.navigate(['/request-scrconfig/request-scrconfig-modify']);
          let rowId = String(this.selection.selected[0]['requestScreenConfigId']);
          localStorage.setItem('requestScreenConfigId', rowId);

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

  reqScrConfig_list_details() {
    let loadReqScrConfigList = this.requestScrconfigService.load_reqScrConfigData().subscribe(data => {
      let reqScrConfigListData = JSON.parse(data['_body']);
      let reqScrConfigListTableDate = reqScrConfigListData.succesObject;
      this.dataSource = [];
      if(reqScrConfigListTableDate.length > 0){
        this.dataSource = new MatTableDataSource(reqScrConfigListTableDate);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.displayNoRecords = true;
      }else{
        this.displayNoRecords = false;
      }
    
      this.userRoleFieldName = reqScrConfigListData.authSuccesObject.screenFieldDisplayVoList;
      this.searchCombo = [];
      let search;
      if (localStorage.getItem('langCode') == 'en') {
        search = [
          { Name: "Screen Configuration Code", Value: 'requestScreenConfigurationCode' },
          { Name: "Screen Configuration", Value: 'requestScreenConfigurationName' },
          { Name: "Request Type", Value: 'requestTypeName' },
          { Name: "Request Sub Type", Value: 'requestSubTypeName' },
          { Name: "Status", Value: 'status' },
        ];
      }
      else  if (localStorage.getItem('langCode') == 'jp') {
        search = [
          { Name: "リクエスト画面構成コード", Value: 'requestScreenConfigurationCode' },
          { Name: "画面構成の要求", Value: 'requestScreenConfigurationName' },
          { Name: "リクエストの種類", Value: 'requestTypeName' },
          { Name: "サブタイプのリクエスト", Value: 'requestSubTypeName' },
          { Name: "状態", Value: 'status' },
        ];
      }
      for (let k in search) {
        let ll = this.userRoleFieldName.includes(search[k].Value);
        if(ll===true) {
         this.searchCombo.push(search[k]);
        }
       }
       let screenFunctionDisplayList = reqScrConfigListData.authSuccesObject.screenFunctionDisplayList;
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
    this.componentLoaderService.display(false);
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
    this.requestScrconfigService.search_reqScrConfigData(finalSearchData).subscribe(data => {
      let reqScrConfigSearchData = JSON.parse(data['_body']);
      this.dataSource=[];
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
  removeFilter(filterValue: string): void {
    this.displayNoRecords = true;
    if (filterValue.length == 0) {
      this.reqScrConfig_list_details();
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

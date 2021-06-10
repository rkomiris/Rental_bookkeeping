import { Component, OnInit, ViewChild, Inject, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, VERSION, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormBuilder, FormGroup, FormArray, Validators, NgForm, Form } from '@angular/forms';
import { Router } from "@angular/router";
import { DOCUMENT } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';
import { RequestResolverService } from './request-resolver.service';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { ComponentLoaderService } from '../../shared/component-loader.service';
import { ForwardRequestAddComponent } from './forward-request-add/forward-request-add.component';
import { JsonApiService } from 'src/assets/api/json-api.service';
import { RequestService } from '../request/request.service';
export interface resolverListData {

  highlighted?: boolean;
  hovered?: boolean;
  id: number;
  requestId: number;
}
const ELEMENT_DATA: resolverListData[] = [];
@Component({
  selector: 'app-request-resolver',
  templateUrl: './request-resolver.component.html',
  // styleUrls: ['./request-resolver.component.css']
  styleUrls: ['./request-resolver-srmav.component.css']
})
export class RequestResolverComponent implements OnInit, OnDestroy {
  searchForm: FormGroup;
  today: Date = new Date();
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
  statuslist: any = [];
  labels: any = {};
  selection = new SelectionModel<resolverListData>(true, []);
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  highlight(element: resolverListData) {
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
    private componentLoaderService: ComponentLoaderService,
    @Inject(DOCUMENT) private document: Document,
    private formBuilder: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private jsonApiService: JsonApiService,
    private requestResolverService: RequestResolverService,
    private requestService: RequestService) { }
  ngOnInit() {
    this.getLabelDetails();
    this.componentLoaderService.display(true);
    this.document.body.classList.remove('loginonly');
    this.searchForm = this.formBuilder.group({
      flag: [1, Validators.required],
      searchDatas: this.formBuilder.array([this.sequenceType()]),
      listFromDate: [null],
      listToDate: [null]
    });
    this.resolver_list_details();
    this.displayNoRecords = true;
    this.selection.clear();
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
  }
  getLabelDetails() {
    let lang;
    if(localStorage.getItem('langCode') !== null){
      lang = localStorage.getItem('langCode');
    }
    this.jsonApiService.fetch('/'+lang+'.json').subscribe((data) => {
        this.labels = data;
      });
  }
  exportAsXLSX(): void {
    if (this.dataSource.length !== 0) {
      this.requestService.exportAsExcelFile(this.dataSource.data, 'ResolverReport');
    }
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
    if(finalSearchData['null'] == null){
      finalSearchData['null'] = undefined
    }
    finalSearchData['flag'] = this.searchForm.value.flag;
    this.requestResolverService.search_list(finalSearchData).subscribe(data => {
      let reqScrConfigSearchData = JSON.parse(data['_body']);
      this.dataSource = [];
      if (reqScrConfigSearchData.succesObject !== null) {
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
      this.resolver_list_details();
    }
  }
  resolver_list_details() {
   
    let api: string;
    if (localStorage.getItem('fromMytask') == '1') {
      api = "/awaiting/resolverList";
    } else {
      api = "/resolver/loadResolver";
    }
    let loadSublocationList = this.requestResolverService.load_resolverList(api).subscribe(data => {
      let sublocationListGetData = JSON.parse(data['_body']);
      let sublocationListTableDate = sublocationListGetData.succesObject;
      this.dataSource = [];
      if (sublocationListTableDate.length > 0) {
        this.dataSource = new MatTableDataSource(sublocationListTableDate);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.displayNoRecords = true;
      } else {
        this.displayNoRecords = false;
      }

      this.subLocationBaseFieldName = sublocationListGetData.authSuccesObject.screenFieldDisplayVoList;
      this.searchCombo = [];
      let search;
      if (localStorage.getItem('langCode') == 'en') {
        search = [
          { name: 'Request Code', value: 'requestCode' },
          { name: 'Request Date', value: 'requestDate' },
          { name: 'Request', value: 'requestTypeName' },
          { name: 'Sub Request', value: 'requestSubTypeName' },
          { name: 'CurrentStatus', value: 'currentStatusName' },
          { name: 'Location', value: 'locationName' },
          { name: 'SubLocation', value: 'sublocationName' },
          { name: 'Department', value: 'userDepartmentName' },
          { name: 'user', value: 'userName' }
        ];
      } else if (localStorage.getItem('langCode') == 'jp') {
        search = [
          { name: 'コードを要求する', value: 'requestCode' },
          { name: '日を要求する', value: 'requestDate' },
          { name: '要求する', value: 'requestTypeName' },
          { name: 'サブタイプのリクエスト', value: 'requestSubTypeName' },
          { name: '現在の状態名', value: 'currentStatusName' },
          { name: '場所の名前', value: 'locationName' },
          { name: 'サブロケーション', value: 'sublocationName' },
          { name: 'ユーザー部門', value: 'userDepartmentName' },
          { name: 'ユーザー名', value: 'userName' }
        ];
      }

      for (let k in search) {
        let ll = this.subLocationBaseFieldName.includes(search[k].value);
        if (ll === true) {
          this.searchCombo.push(search[k]);
        }
      }
      let screenFunctionDisplayList = sublocationListGetData.authSuccesObject.screenFunctionDisplayList;
      for (let k in screenFunctionDisplayList) {
        if (screenFunctionDisplayList[k] === 'MODIFY') {
          this.modify = true;
        }
        if (screenFunctionDisplayList[k] === 'VIEW') {
          this.view = true;
        }
      }
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
    this.componentLoaderService.display(false);
  }
  projectModify() {
    if (this.selection.selected.length === 1) {
      if (this.selection.selected[0]['currentStatusName'] == 'Completed') {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          disableClose: false,
          panelClass: 'btnCenter',
          width: 'auto',
          data: {
            title: 'Alert',
            message: "cantModify",
            btnPrjYes: 'Ok',
          }
        });
      } else if (this.selection.selected[0]['currentStatusName'] == 'Hold') {
        this.requestResolverService.holdStatus(this.selection.selected[0]['requestId']).subscribe(data => {
          let getData = JSON.parse(data['_body']);
          if(getData.responseCode =='200'){
            this.componentLoaderService.display(true);
            let rowId = String(this.selection.selected[0]['requestId']);
            localStorage.setItem('requestId', rowId);                       
            localStorage.setItem('requesterId', String(this.selection.selected[0]['requesterId']));
            this.router.navigate(['/request-resolver/request-resolver-modify']);
          }else{
            const dialogRefDia = this.dialog.open(ConfirmationDialogComponent, {
              disableClose: false,
              panelClass: 'btnCenter',
              width: 'auto',
              data: {
                title: 'Alert',                
                server: 'servermessage',
                message: getData.responseMessage,
                btnYes: 'Ok',
              }
            });
            dialogRefDia.afterClosed().subscribe(data => {
              this.selection.clear();
            })
            
          }
        })
      } else {
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
          if (data != false) {
            this.componentLoaderService.display(true);
            let rowId = String(this.selection.selected[0]['requestId']);
            localStorage.setItem('requestId', rowId);                       
            localStorage.setItem('requesterId', String(this.selection.selected[0]['requesterId']));
            this.router.navigate(['/request-resolver/request-resolver-modify']);
          }
        });
      }
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
      this.router.navigate(['/request-resolver/request-resolver-view']);
      let rowId = String(this.selection.selected[0]['requestId']);
      localStorage.setItem('requesterId', String(this.selection.selected[0]['requesterId']));
      localStorage.setItem('requestId', rowId);
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
    this.resolver_list_details();
    this.searchForm.controls['searchDatas'].reset();
    this.searchForm.controls['flag'].patchValue(1);
  }

  projectForward() {
    if (this.selection.selected.length === 1) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        panelClass: 'btnCenter',
        width: 'auto',
        data: {
          title: 'Confirmation',
          message: 'forward',
          btnPrjYes: 'Yes',
          btnPrjNo: 'No',
        }
      });
      dialogRef.afterClosed().subscribe(data => {
        if (data) {
          const dialogRef = this.dialog.open(ForwardRequestAddComponent, {
            disableClose: false,
            panelClass: 'btnCenter',
            width: '75%',
            data: {
              title: "Forward Request",
              data: this.selection.selected,
              url: "/fr/create"
            }
          });
          dialogRef.afterClosed().subscribe(data => {
            this.ngOnInit();
          })
        }
      })
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
  projectRedirect() {
    if (this.selection.selected.length === 1) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        panelClass: 'btnCenter',
        width: 'auto',
        data: {
          title: 'Confirmation',
          message: 'redirect',
          btnPrjYes: 'Yes',
          btnPrjNo: 'No',
        }
      });
      dialogRef.afterClosed().subscribe(data => {
        if (data) {
          const dialogRef = this.dialog.open(ForwardRequestAddComponent, {
            disableClose: false,
            panelClass: 'btnCenter',
            width: '75%',
            data: {
              title: "Redirect Request",
              data: this.selection.selected,
              url: "/resolver/subrequestcreate",
            }
          });
          dialogRef.afterClosed().subscribe(data => {
            this.ngOnInit();
          })
        }
      })
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
  
  ngOnDestroy() {
    localStorage.removeItem('fromMytask');
  }
}

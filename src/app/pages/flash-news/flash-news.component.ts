import { Component, OnInit, ViewChild, Output, EventEmitter, Inject, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, VERSION, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormBuilder, FormGroup, FormArray, Validators, NgForm, Form } from '@angular/forms';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';
import { FlashNewsService } from './flash-news.service';
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
  selector: 'app-flash-news',
  templateUrl: './flash-news.component.html',
  // styleUrls: ['./flash-news.component.css']
  styleUrls: ['./flash-news-srmav.component.css']
})

export class FlashNewsComponent implements OnInit {

  searchForm: FormGroup;
  displayNoRecords = true;
  flashNewsBaseFieldName: any = [];
  dataSource: any = [];
  rowindex: any;
  count = 1;
  searchCombo: any;
  flashNewsListGetData: any;
  add = false;
  modify = false;
  view = false;
  delete = false;
  userRoleFieldName: any = [];
  qtd: any = [];
  qtm: any = '';
  statuslist = [];
  newstype: any = [];
  selection = new SelectionModel<flashNewsListData>(true, []);
  labels: any = {}; /** LABEL CHANGES **/


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
    @Inject(DOCUMENT) private document: Document,
    private formBuilder: FormBuilder,
    private router: Router,
    private jsonApiService: JsonApiService/** LABEL CHANGES **/,
    private dialog: MatDialog,
    private flashNewsService: FlashNewsService,
    private componentLoaderService: ComponentLoaderService) { }

  ngOnInit() {
    this.componentLoaderService.display(true);
    this.getLabelDetails(); /** LABEL CHANGES **/
    this.document.body.classList.remove('loginonly');
    this.searchForm = this.formBuilder.group({
      searchDatas: this.formBuilder.array([this.sequenceType()]),
    });
    if(localStorage.getItem('langCode') == 'en'){
      this.newstype=[
        {id: 1, name: 'Flash News'},
        {id: 2, name: 'Thought for the Day'},
      ];
      this.statuslist = [
        {name: 'Active', value: "Active"}, 
        {name: 'InActive', value: "InActive"}
      ]
    }else if(localStorage.getItem('langCode') == 'jp'){
      this.newstype=[
        {id: 1, name: 'フラッシュニュー'},
        {id: 2, name: '毎日の思想'},
      ];
      this.statuslist = [
        {name: '能動', value: "Active"}, 
        {name: '無効', value: "InActive"}
      ]
    }
    this.flashNews_list_details();
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

  sequenceType() {
    return this.formBuilder.group({
      dropDownVal: [''],
      textVal: [''],
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
    this.flashNewsService.search_list(finalSearchData).subscribe(data => {
      let reqScrConfigSearchData = JSON.parse(data['_body']);
      this.dataSource = [];
      if(reqScrConfigSearchData.succesObject.length > 0){
        for(let i = 0 ; i < reqScrConfigSearchData.succesObject.length ; i++){
          if(reqScrConfigSearchData.succesObject[i].leaveType ==  "1" ){
            reqScrConfigSearchData.succesObject[i].leaveTypeName = "Flash News";
          }
          else if(reqScrConfigSearchData.succesObject[i].leaveType ==  "2" ){
            reqScrConfigSearchData.succesObject[i].leaveTypeName = "Thought for the Day";
          }
        }
      }
      if (reqScrConfigSearchData.succesObject.length > 0) {
        this.dataSource = new MatTableDataSource(reqScrConfigSearchData.succesObject);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.displayNoRecords = true;
      } else {
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
    let loadFlashNewsList = this.flashNewsService.load_flashNewsData().subscribe(data => {
      let flashNewsListGetData = JSON.parse(data['_body']);
      let flashNewsListTableDate = flashNewsListGetData.succesObject;
      this.dataSource = [];
      if(flashNewsListTableDate.length > 0){
        for(let i = 0 ; i < flashNewsListTableDate.length ; i++){
          if(flashNewsListTableDate[i].flashNewsType ==  "1" ){
            flashNewsListTableDate[i].leaveTypeName = "Flash News";
          }
          else if(flashNewsListTableDate[i].flashNewsType ==  "2" ){
            flashNewsListTableDate[i].leaveTypeName = "Thought for the Day";
          }
        }
      }
      if (flashNewsListTableDate.length > 0) {
        this.dataSource = new MatTableDataSource(flashNewsListTableDate);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.displayNoRecords = true;
      } else {
        this.displayNoRecords = false;
      }
      this.userRoleFieldName = flashNewsListGetData.authSuccesObject.screenFieldDisplayVoList;
      this.searchCombo = [];
      let search;
      if(localStorage.getItem('langCode') == 'en'){
         search = [
          { Name: 'Code', Value: 'flashNewsCode' },
          { Name: 'News Type', Value: 'flashNewsType' },
          { Name: 'News Date', Value: 'flashNewsDate' },
          { Name: 'News Valid From', Value: 'flashNewsValidFrom' },
          { Name: 'News Valid To', Value: 'flashNewsValidTo' },
          { Name: 'Description', Value: 'flashNewsDescription' },
          { Name: 'Status', Value: 'status' },
        ];
      }else if(localStorage.getItem('langCode') == 'jp'){
         search = [
          { Name: '記号', Value: 'flashNewsCode' },
          { Name: 'ニュースの種類', Value: 'flashNewsType' },
          { Name: 'ニュース日', Value: 'flashNewsDate' },
          { Name: 'フラッシュニュースの有効な開始日', Value: 'flashNewsValidFrom' },
          { Name: 'フラッシュニュースの有効な終了', Value: 'flashNewsValidTo' },
          { Name: '説明', Value: 'flashNewsDescription' },
          { Name: '状態', Value: 'status' },
        ];
      }
      for (let k in search) {
        let ll = this.userRoleFieldName.includes(search[k].Value);
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
      this.componentLoaderService.display(false);
    }, error => {
      if (error.status === 401) {
        console.log('Error');
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
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.selection.selected.forEach(item => {
            let flashNewsType = [item.id];
            this.flashNewsService.deleteProjectList(flashNewsType).subscribe(data => {
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
                dialogRef1.afterClosed().subscribe(data => {
                  this.flashNews_list_details();
                  this.selection.clear();
                });
              } else {
                const dialogRef1 = this.dialog.open(ConfirmationDialogComponent, {
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
          });
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
      let requestTypeId = [];
      for (let i = 0; i < this.selection.selected.length; i++) {
        requestTypeId.push(this.selection.selected[i].id);
      }
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.flashNewsService.deleteProjectList(requestTypeId).subscribe(data => {
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

              dialogRef1.afterClosed().subscribe(data => {
                this.flashNews_list_details();
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
          message: 'selection',
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
          this.router.navigate(['/flash-news/flash-news-modify']);
          let rowId = String(this.selection.selected[0]['id']);
          localStorage.setItem('id', rowId);
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
      this.router.navigate(['/flash-news/flash-news-view']);
      let rowId = String(this.selection.selected[0]['id']);
      localStorage.setItem('id', rowId);
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

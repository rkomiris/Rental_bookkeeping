import { Component, OnInit, ViewChild, Inject} from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog } from '@angular/material';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Router } from "@angular/router";
import { DOCUMENT } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';
import { UserService } from './user.service';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { ComponentLoaderService } from '../../shared/component-loader.service';
import { JsonApiService } from 'src/assets/api/json-api.service';

export interface useRoleListData {

  highlighted?: boolean;
  hovered?: boolean;
  usercurid: number;
  
}
const ELEMENT_DATA: useRoleListData[] = [];

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user-srmav.component.css']
})
export class UserComponent implements OnInit {

  dataSource: any = [];
  rowindex: any;
  count: number = 1;
  searchCombo: any;
  searchForm: FormGroup;
  displayNoRecords;
  userFieldName: any = [];
  qtd: any = [];
  qtm: any = '';
  add = false;
  modify = false;
  view = false;
  delete = false;
  userRoleFieldName: any = [];
  statuslist: any = [];
  selection = new SelectionModel<useRoleListData>(true, []);
  labels: any = {}; /** LABEL CHANGES **/

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
    private userService: UserService,
    private componentLoaderService: ComponentLoaderService,
    private jsonApiService: JsonApiService/** LABEL CHANGES **/
    ) 
    {
    this.dataSource = [];
    this.count = 1;
    this.displayNoRecords = true;
    this.userFieldName = [];
  }
  
  ngOnInit() {
    this.componentLoaderService.display(true);
    this.getLabelDetails(); /** LABEL CHANGES **/
    this.searchForm = this.formBuilder.group({
      searchDatas: this.formBuilder.array([this.sequenceType()]),
    });
    this.onLoaduserList();
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

  onLoaduserList() {
    let loaduserList = this.userService.userList().subscribe(data => {
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
      if(localStorage.getItem('langCode') == 'en'){search = [
        { name: "User Login Id", Value: 'userLoginId'},
        { name: "Employee Id", value: 'userEmployeeId' },
        { name: "First Name", value: 'firstName' },
        { name: "Middle Name", value: 'middleName' },
        { name: "Last Name", value: 'lastName' },
        { name: "Location ", value: 'userLocationName' },
        { name: "SubLocation ", value: 'subLocationName' },
        { name: "Role", value: 'userRoleName' },
        { name: "Department", value: 'userDepartmentName' },
        { name: "Email Id", value: 'emailId' },
        { name: "Phone Number", value: 'phoneNumber' },
        { name: "Mobile", value: 'mobile' },
        { name: "Password", value: 'password' },
        { name: "Status", value: 'status' }
      ];}
      else if(localStorage.getItem('langCode') == 'jp'){
        search = [
          { name: "ユーザーログインID", Value: 'userLoginId'},
          { name: "従業員ID", value: 'userEmployeeId' },
          { name: "名前", value: 'firstName' },
          { name: "ミドルネーム", value: 'middleName' },
          { name: "名字", value: 'lastName' },
          { name: "場所", value: 'userLocationName' },
          { name: "サブロケーション", value: 'subLocationName' },
          { name: "ロール", value: 'userRoleName' },
          { name: "部門", value: 'userDepartmentName' },
          { name: "電子メールID", value: 'emailId' },
          { name: "電話番号", value: 'phoneNumber' },
          { name: "携帯電話番号", value: 'mobile' },
          { name: "パスワード", value: 'password' },
          { name: "状態", value: 'status' }
        ];
      }
      for (let k in search) {
        let ll = this.userRoleFieldName.includes(search[k].value);
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
  removeSelectedOptions(value) {
    if(localStorage.getItem('langCode') == 'en'){
        this.searchCombo = [
        { name: "User Login Id", Value: 'userLoginId'},
        { name: "Employee Id", value: 'userEmployeeId' },
        { name: "First Name", value: 'firstName' },
        { name: "Middle Name", value: 'middleName' },
        { name: "Last Name", value: 'lastName' },
        { name: "Location ", value: 'userLocationName' },
        { name: "SubLocation ", value: 'subLocationName' },
        { name: "Role", value: 'userRoleName' },
        { name: "Department", value: 'userDepartmentName' },
        { name: "Email Id", value: 'emailId' },
        { name: "Phone Number", value: 'phoneNumber' },
        { name: "Mobile", value: 'mobile' },
        { name: "Password", value: 'password' },
        { name: "Status", value: 'status' }
      ];}
      else if(localStorage.getItem('langCode') == 'jp'){
        this.searchCombo = [
          { name: "ユーザーログインID", value: 'userLoginId'},
          { name: "従業員ID", value: 'userEmployeeId' },
          { name: "名前", value: 'firstName' },
          { name: "ミドルネーム", value: 'middleName' },
          { name: "名字", value: 'lastName' },
          { name: "場所", value: 'userLocationName' },
          { name: "サブロケーション", value: 'subLocationName' },
          { name: "ロール", value: 'userRoleName' },
          { name: "部門", value: 'userDepartmentName' },
          { name: "電子メールID", value: 'emailId' },
          { name: "電話番号", value: 'phoneNumber' },
          { name: "携帯電話番号", value: 'mobile' },
          { name: "パスワード", value: 'password' },
          { name: "状態", value: 'status' }
        ];
      }
  }
  sequenceType() {
    return this.formBuilder.group({
      dropDownVal: [""],
      textVal: [""],
    })
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

    if (this.count <= 11 && dropvalue !== null && textVal != null) {
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
    this.userService.search_list(finalSearchData).subscribe(data => {
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
      this.onLoaduserList();
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
      let usercurid = [this.selection.selected[0]['id']];
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.userService.deleteUserList(usercurid).subscribe(data => {
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
                this.onLoaduserList();
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
      let usercurid = [];

      for (let i = 0; i < this.selection.selected.length; i++) {
        usercurid.push(this.selection.selected[i]['id']);
      }
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.userService.deleteUserList(usercurid).subscribe(data => {
            let resp = JSON.parse(data['_body']);
            if (resp.responseCode == '200') {
              const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                disableClose: false,
                width: 'auto',
                panelClass: 'btnCenter',
                data: {
                  title: 'Info',
                  server: 'servermessage',
                  message: resp.responseMessage,
                  btnYes: 'Ok',
                }
              });

              dialogRef.afterClosed().subscribe(data => {
                this.onLoaduserList();
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
  checkboxLabel(row?: useRoleListData): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.usercurid + 1}`;
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
          this.router.navigate(['/user/user-modify']);
          let rowId = String(this.selection.selected[0]['id']);
          localStorage.setItem('usercurid', rowId);

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
      this.router.navigate(['/user/user-view']);
      let rowId = String(this.selection.selected[0]['id']);
      localStorage.setItem('usercurid', rowId);
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

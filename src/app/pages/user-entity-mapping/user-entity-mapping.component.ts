import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatSort, MatDialog, MatTableDataSource } from '@angular/material';
import { DOCUMENT } from '@angular/platform-browser';
import { JsonApiService } from 'src/assets/api/json-api.service';
import { Router } from '@angular/router';
import { ComponentLoaderService } from 'src/app/shared/component-loader.service';
import { UserEntityMappingService } from './user-entity-mapping.service';
import { load } from '@angular/core/src/render3';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';

export interface useRoleListData {
  highlighted?: boolean;
  hovered?: boolean;
  authenticationId: number;
}
const ELEMENT_DATA: useRoleListData[] = [];

@Component({
  selector: 'app-user-entity-mapping',
  templateUrl: './user-entity-mapping.component.html',
  styleUrls: ['./user-entity-mapping.component.css']
})
export class UserEntityMappingComponent implements OnInit {

  labels: any = {}; /** LABEL CHANGES **/
  dataSource: any;
  displayNoRecords;
  userFieldName: any;
  userBaseFieldName: any;
  add: boolean;
  view : boolean;
  modify: boolean;
  delete: boolean;
  selection = new SelectionModel<[useRoleListData]>(false, []);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor( @Inject(DOCUMENT) private document: Document,
  private jsonApiService: JsonApiService/** LABEL CHANGES **/,
  private formBuilder: FormBuilder,
  private router: Router,
  private dialog: MatDialog,
  private componentLoaderService: ComponentLoaderService,
  private userEntityMappingService: UserEntityMappingService,) {
  this.dataSource = [];
  this.displayNoRecords = true;
  this.userFieldName = []; }

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

  ngOnInit() {
    this.getLabelDetails(); /** LABEL CHANGES **/
    this.componentLoaderService.display(true);
    this.userBaseFieldName = ['select','User Role Name','Functions'];
    this.onLoadData();
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

  onLoadData(){
    let loaduserList = this.userEntityMappingService.load().subscribe(data => {
      let loadData = JSON.parse(data['_body']);
      let listTableDate = loadData.succesObject;
      this.dataSource = [];
      if (listTableDate.length > 0) {
        this.dataSource = new MatTableDataSource(listTableDate);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.displayNoRecords = true;
      }else{
        this.displayNoRecords = false;
      }
      let screenFunctionDisplayList = loadData.authSuccesObject.screenFunctionDisplayList;
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

  configure(row){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: false,
      width: "auto",
      data: {
        title: 'Confirmation',
        mess: 3,
        firstName: row.firstName,
        message: "entityConfig",
        btnYes: "Yes",
        btnNo: "No"
      }
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        localStorage.setItem('userEntityId', row.id);
        localStorage.setItem('userEntityName', row.firstName);
        this.router.navigateByUrl("/user-entity-mapping/user-entity-mapping-add");
      }
    })
  }

  viewDetails(row){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: false,
      width: "auto",
      data: {
        title: 'Confirmation',
        mess: 3,
        firstName: row.firstName,
        message: "entityView",
        btnYes: "Yes",
        btnNo: "No"
      }
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        localStorage.setItem('userEntityId', row.id);
        localStorage.setItem('userEntityName', row.firstName);
        this.router.navigateByUrl("/user-entity-mapping/user-entity-mapping-view");
      }
    })
  }

  removeSelectedRows(){
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
            // this.selection.selected.forEach(item => {
            //   let tt: any = {};
            //   tt = item;
            //   let reqWorkFlow = tt.id;
              this.userEntityMappingService.deleteUserList(this.selection.selected[0]['id']).subscribe(data => {
                let resp = JSON.parse(data['_body']);
                if (resp.responseCode == '200') {
                  const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                    disableClose: false,
                    panelClass: 'btnCenter',
                    width: 'auto',
                    data: {
                      title: 'Info',
                      server:'servermessage',
                      message: resp.responseMessage,
                      btnYes: 'Ok',
                    }
                  });
                } else {
                  const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                    disableClose: false,
                    panelClass: 'btnCenter',
                    width: 'auto',
                    data: {
                      title: 'Alert',
                      server:'servermessage',
                      message: resp.responseMessage,
                      btnYes: 'Ok',
                    }
                  });
                }
                this.onLoadData();
              });
            // this.selection = new SelectionModel<useRoleListData>(true, []);
          }
        });
      } else if (this.selection.selected.length > 0) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          disableClose: false,
          panelClass: 'btnCenter',
          width: 'auto',
          data: {
            title: 'Alert',
            message: "singleSelection",
            btnYes: 'Ok',
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

}

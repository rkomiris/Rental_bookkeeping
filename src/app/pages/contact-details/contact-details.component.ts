import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatSort, MatDialog, MatTableDataSource } from '@angular/material';
import { ComponentLoaderService } from 'src/app/shared/component-loader.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ContactDetailsService } from './contact-details.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { JsonApiService } from 'src/assets/api/json-api.service';


export interface useRoleListData {

  highlighted?: boolean;
  hovered?: boolean;
  emergencyContactPathId: number;
}
const ELEMENT_DATA: useRoleListData[] = [];
@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.component.html',
  styleUrls: ['./contact-details.component.css']
})
export class ContactDetailsComponent implements OnInit {
  labels: any = {}; /** LABEL CHANGES **/
  dataSource: any;
  searchForm: FormGroup;
  displayNoRecords = true;
  userRoleFieldName: any = [];
  add = false;
  modify = false;
  view = false;
  delete = false;

  selection = new SelectionModel<useRoleListData>(true, []);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor( private jsonApiService: JsonApiService/** LABEL CHANGES **/,
    private componentLoaderService: ComponentLoaderService,
    private formBuilder: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private contactDetailsService: ContactDetailsService) { }

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
    this.searchForm = this.formBuilder.group({
      searchDatas: this.formBuilder.array([this.sequenceType()]),
    });
    this.onLoaduserList();

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

  onLoaduserList() {
    let loaduserList = this.contactDetailsService.getAll().subscribe(data => {
      let loaduserListGetData = JSON.parse(data['_body']);
      this.dataSource = [];
      if (loaduserListGetData.succesObject.length > 0) {
        this.dataSource = new MatTableDataSource(loaduserListGetData.succesObject);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.displayNoRecords = true;
      } else {
        this.displayNoRecords = false;
      }

      this.userRoleFieldName = loaduserListGetData.authSuccesObject.screenFieldDisplayVoList;
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
    this.componentLoaderService.display(false);
  }

  // ********** DELETE *******************
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
      let userId = [this.selection.selected[0].emergencyContactPathId];
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.contactDetailsService.delete(userId).subscribe(data => {
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
                  server:'servermessage',
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
      let userId = [];
      for (let i = 0; i < this.selection.selected.length; i++) {
        userId.push(this.selection.selected[i].emergencyContactPathId);
      }
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.contactDetailsService.delete(userId).subscribe(data => {
            let resp = JSON.parse(data['_body']);
            if (resp.responseCode == '200') {
              const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                disableClose: false,
                width: 'auto',
                panelClass: 'btnCenter',
                data: {
                  title: 'Info',
                  server:'servermessage',
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
                  server:'servermessage',
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

  projectView() {
    if (this.selection.selected.length === 1) {
      this.componentLoaderService.display(true);
      let rowId = String(this.selection.selected[0]['emergencyContactPathId']);
      localStorage.setItem('emergencyId', rowId);
      this.router.navigate(['/contact-details/contact-details-view']);
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
          this.router.navigate(['/contact-details/contact-details-modify']);
          let rowId = String(this.selection.selected[0]['emergencyContactPathId']);
          localStorage.setItem('emergencyId', rowId);

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

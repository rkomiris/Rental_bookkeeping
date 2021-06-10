import { Component, OnInit, ViewChild, Output, EventEmitter, Inject, OnDestroy, inject } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, VERSION, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormBuilder, FormGroup, FormArray, Validators, NgForm, Form } from '@angular/forms';
import { Router } from "@angular/router";
import { DOCUMENT } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';
import { ConfirmationDialogComponent } from '../../../../confirmation-dialog/confirmation-dialog.component';
import { ComponentLoaderService } from '../../../../component-loader.service';
import { HeaderService } from '../header.service';
import { JsonApiService } from 'src/assets/api/json-api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-entity-home',
  templateUrl: './entity-home.component.html',
  styleUrls: ['./entity-home.component.css']
})
export class EntityHomeComponent implements OnInit {

  labels: any = {}; /** LABEL CHANGES **/
  displayNoRecords = true;
  requestTypeFilter: any;
  userRoleFieldName: any;
  dataSource: any;
  saveForm: FormGroup;
  dropDown: any = [];
  entityId;
  earlierEntityName;
  currentEntityName;
  url: any;
  selection = new SelectionModel<any>(false, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private dialogRefOwn: MatDialogRef<EntityHomeComponent>,
    private headerService: HeaderService,
    private formBuilder: FormBuilder,
    private componentLoaderService: ComponentLoaderService,
    private dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    private router: Router, private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private jsonApiService: JsonApiService,) { }

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
    this.entityId = Number(localStorage.getItem('entityId'));
    this.userRoleFieldName = ['select', 'entityName']
    this.saveForm = this.formBuilder.group({
      entityId: [this.entityId]
    })
    this.earlierEntityName = localStorage.getItem("entityName");
    this.loadData();
    this.getLabelDetails();
    this.url = this.router.url;
  }

  /**** LABEL CHNAGES ****/
  getLabelDetails() {
    let lang;
    if (localStorage.getItem('langCode') !== null) {
      lang = localStorage.getItem('langCode');
    } else {
      lang = environment.defaultLocale;
    }
    this.jsonApiService.fetch('/' + lang + '.json').subscribe((data) => {
      this.labels = data;
    });
  }

  loadData() {
    this.headerService.load().subscribe(data => {
      let requestListGetData = JSON.parse(data['_body']);
      let entityDropDown = requestListGetData.succesObject;
      entityDropDown.forEach(element => {
        if (element['id'] == this.entityId) {
          element['result'] = true;
        } else {
          element['result'] = false;
        }
      });

      this.dataSource = [];
      if (entityDropDown.length > 0) {
        this.dataSource = new MatTableDataSource(entityDropDown);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.displayNoRecords = true;
      } else {
        this.displayNoRecords = false;
      }
    })
  }

  callEntity() {
    if (this.selection.selected.length == 0) {
      const dialogRefError = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: true,
        panelClass: 'btnCenter',
        width: 'auto',
        data:
        {
          title: 'Alert',
          message: "selection",
          btnYes: 'Ok',
        }
      });
      dialogRefError.afterClosed().subscribe(data => {
        const entity = this.dialog.open(EntityHomeComponent, {
          disableClose: false,
          panelClass: 'btnCenter',
          width: '35%',
          data:
          {
            title: "entityChange",
            message: 'entity',
          }
        });
      })
    }
    else {
      this.currentEntityName = this.selection.selected[0].entityName;
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        panelClass: 'btnCenter',
        width: 'auto',
        data:
        {
          title: 'Confirmation',
          mess: 2,
          fromDate: this.earlierEntityName,
          toDate: this.currentEntityName,
          message: "Validation",
          btnYes: 'Yes',
          btnNo: 'No'
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result == true) {
          localStorage.setItem('entityId', this.selection.selected[0].id)
          localStorage.setItem('entityName', this.currentEntityName)
          this.headerService.changeEntity(this.selection.selected[0].id).subscribe(data => {
            let changeEntitySelection = JSON.parse(data['_body']);
            const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
              disableClose: false,
              panelClass: 'btnCenter',
              width: 'auto',
              data:
              {
                title: 'Info',
                server: 'servermessage',
                message: changeEntitySelection.responseMessage,
                btnYes: 'Ok',
              }
            });
          })
        }
        else {
          dialogRef.close();
        }
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => this.router.navigate(['/landing-page']));
      });
    }
  }

  closeDialog() {
    this.dialogRefOwn.close();
  }

  value(event) {
    this.currentEntityName = event.source.selected.viewValue;
  }

  change(row) {
    this.dataSource.data.forEach(element => {
      if (element['id'] == row['id']) {
        element['result'] = true;
      } else {
        element['result'] = false;
      }
    });
  }

}

import { Component, OnInit, ViewChild, Output, EventEmitter, Inject, OnDestroy, inject } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, VERSION, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormBuilder, FormGroup, FormArray, Validators, NgForm, Form } from '@angular/forms';
import { Router } from "@angular/router";
import { DOCUMENT } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';
import { EntityService } from '../entity.service';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import { ComponentLoaderService } from '../../../shared/component-loader.service';
import { JsonApiService } from 'src/assets/api/json-api.service';
import { moment } from 'ngx-bootstrap/chronos/test/chain';

@Component({
  selector: 'app-entity-view',
  templateUrl: './entity-view.component.html',
  styleUrls: ['./entity-view.component.css']
})
export class EntityViewComponent implements OnInit {

  viewForm: FormGroup;
  userBaseFieldName: any = [];
  userRoleFieldName: any = [];
  dataSource: any = [];
  seqmodel: any = {};
  seq = false;
  val: any;
  display = false;
  displayNoRecords = false;
  languageList: any = [];
  labels: any = {}; /** LABEL CHANGES **/

  /** Variable declaration ends above */

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('sort') sort: MatSort;
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private entityService: EntityService,
    private componentLoaderService: ComponentLoaderService,
    private jsonApiService: JsonApiService/** LABEL CHANGES **/
  ) { }

  /** Method call for LifeCycle */
  ngOnInit() {
    this.componentLoaderService.display(true);
    this.getLabelDetails(); /** LABEL CHANGES **/
    this.viewForm = this.formBuilder.group({
      entityId: [''],
      planName: [''],
      entityName: ['', Validators.required],
      entityAddress: ['', Validators.required],
      email: ['', Validators.required],
      status: ['', Validators.required],
      location: ['', Validators.required],
      subLocation: ['', Validators.required],
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      licenseUserCount: ['', Validators.required],
      licenseTransactionCount: ['', Validators.required],
      entityLang: ['',Validators.required]

    });
    this.onLoadEntityView();
  }

/** Method call for Language Translation */
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

  onLoadEntityView()
  {
    let languageCombo = this.entityService.languageLoad().subscribe(data => {
      let language_selectGetData = JSON.parse(data['_body']);
      this.languageList = language_selectGetData.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });

    this.entityService.entityView().subscribe(data => {
      let datalist = JSON.parse(data['_body']);
      let entityViewListTableData = datalist.succesObject;
      this.seqmodel = datalist.succesObject.entityLicenseDetailsVoList;
      this.dataSource =[];
        if(this.seqmodel !== null){
          this.dataSource = new MatTableDataSource(datalist.succesObject.entityLicenseDetailsVoList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.display = true;
        } else {
          this.displayNoRecords = true;
        }
        this.userRoleFieldName = [
        
          'fromDate',
          'toDate',
          'userLicense',
          'transactionLicense',
          'licenseUserCount',
          'licenseTransactionCount',         
  
        ];

    //  this.userBaseFieldName = datalist.authSuccesObject.screenFieldDisplayVoList.map(
    //     element => {
    //       return element;
    //     }
    //   );

    if (localStorage.getItem('userId') == '1') {
      this.userBaseFieldName = ["fromDate","toDate","userCount","transactionCount","entityName","location"
      ,"subLocation","statusValue","entityAddress","email","userLicense","transactionLicense",'planName',
    'entityLang', 'status']
    } else {
      this.userBaseFieldName =  datalist.authSuccesObject.screenFieldDisplayVoList.map(
        element => {
          return element;
        }
      );
    }

      this.viewForm.patchValue({
        entityId: datalist.succesObject.id,
        entityName: datalist.succesObject.entityName,
        entityAddress: datalist.succesObject.entityAddress,
        email: datalist.succesObject.email,
        location: datalist.succesObject.location,
        subLocation: datalist.succesObject.subLocation,
        status: datalist.succesObject.status,
        planName: datalist.succesObject.planName,
        entityLang: datalist.succesObject.entityLang
      });
      this.componentLoaderService.display(false);
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
  }
   ngOnDestroy()
  {
    localStorage.removeItem('');
  }
}

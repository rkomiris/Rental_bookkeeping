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
  selector: 'app-entity-renewal',
  templateUrl: './entity-renewal.component.html',
  styleUrls: ['./entity-renewal.component.css']
})
export class EntityRenewalComponent implements OnInit {

  viewForm: FormGroup;
  userBaseFieldName: any = [];
  userRoleFieldName: any = [];
  dataSource: any = [];
  seqmodel: any = {};
  seq = false;
  val: any;
  display = false;
  displayNoRecords = false;
  labels: any = {}; /** LABEL CHANGES **/
  entityViewListTableData: any;
  minDate;
  toDate: any;
  transactionLicense: any;
  userLicense: any;
  languageList: any = [];

  
  minFromDate;
  minToDate;
  today;
  enable: boolean = true;

  /** Variable declaration ends above */
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

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
      entityName: ['', Validators.required],
      entityAddress: ['', Validators.required],
      email: ['', Validators.required],
      location: ['', Validators.required],
      subLocation: ['', Validators.required],
      status: ['',Validators.required],
      planName: ['', Validators.required],
      entityLang: ['', Validators.required],
      entityLicenseDetailsVoList: this.formBuilder.array([this.sequenceType()]),

    });
    this.onLoadEntityView();
  }

  sequenceType() {
    return this.formBuilder.group({
      userCount:[''],
      fromDate:[''],
      toDate:[''],
      transactionCount:[''],
      userLicense: [''],
      transactionLicense: ['']
    })
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

      // this.today = new Date();
      // let from = new Date(datalist.succesObject.entityLicenseDetailsVoList[0].fromDate);
      // let to =new Date(datalist.succesObject.entityLicenseDetailsVoList[0].toDate);

      // if(this.today < to ){
      //   to.setDate(to.getDate() + 1);        
      //   this.minFromDate = new Date(to);
      // }else{
      //   this.minFromDate = new Date();
      // }

      // d.setMonth(d.getMonth() - 1);

      this.entityViewListTableData = datalist.succesObject;
      let logList = datalist.succesObject.entityLicenseLogVoList;

      // datalist.succesObject.entityLicenseDetailsVoList[0].fromDate = new Date(datalist.succesObject.entityLicenseDetailsVoList[0].fromDate);
      // datalist.succesObject.entityLicenseDetailsVoList[0].toDate = new Date(datalist.succesObject.entityLicenseDetailsVoList[0].toDate);
      
      this.viewForm.patchValue({
        entityId: datalist.succesObject.id,
        entityName: datalist.succesObject.entityName,
        entityAddress: datalist.succesObject.entityAddress,
        email: datalist.succesObject.email,
        location: datalist.succesObject.location,
        subLocation: datalist.succesObject.subLocation,
        status: datalist.succesObject.status,
        planName: datalist.succesObject.planName,
        entityLang: datalist.succesObject.entityLang,
      });
      


      // this.viewForm.patchValue({fromDate: new Date(datalist.succesObject.entityLicenseDetailsVoList[0].fromDate)});
      // this.viewForm.patchValue({toDate: new Date(datalist.succesObject.entityLicenseDetailsVoList[0].toDate)});
      // this.seqmodel = datalist.succesObject.entityLicenseDetailsVoList;
      // this.dataSource =[];
      //   if(this.seqmodel !== null){
      //     this.minDate = datalist.succesObject.entityLicenseDetailsVoList[0].toDate;
      //     datalist.succesObject.entityLicenseDetailsVoList[0].toDate = new Date(datalist.succesObject.entityLicenseDetailsVoList[0].toDate);
      //     this.dataSource = new MatTableDataSource(datalist.succesObject.entityLicenseDetailsVoList);
      //     this.dataSource.paginator = this.paginator;
      //     this.dataSource.sort = this.sort;
      //     this.display = true;
      //   } else {
      //     this.displayNoRecords = true;
      //   }
        this.userRoleFieldName = [ 'renewalFromDate','renewalToDate', 'transactionCount','userCount','usedTransactionCount'
        ,'usedUserCount','createdDate','renewalBy'
        ];

      this.dataSource = [];
      if(datalist.succesObject.entityLicenseLogVoList.length > 0){
        this.dataSource = new MatTableDataSource(datalist.succesObject.entityLicenseLogVoList);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.displayNoRecords = true;
      } else {
        this.displayNoRecords = false;
        
      }

    //  this.userBaseFieldName = datalist.authSuccesObject.screenFieldDisplayVoList.map(
    //     element => {
    //       return element;
    //     }
    //   );  

    if (localStorage.getItem('userId') == '1') {

        this.userBaseFieldName = ["location","subLocation","statusValue","entityAddress","email","userLicense",
      "transactionLicense","fromDate","toDate","userCount","transactionCount","entityName", 'planName','status',
    'entityLang']
    } else {
      this.userBaseFieldName =  datalist.authSuccesObject.screenFieldDisplayVoList.map(
        element => {
          return element;
        }
      );
    }

      this.componentLoaderService.display(false);
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
  }

  renewal(value){
    // value['entityId'] = this.entityViewListTableData['id']
    // value['entityLicenseDetailsVo'] = data.data;
    value['entityLicenseDetailsVo'] = value['entityLicenseDetailsVoList'][0];
    // value['entityLicenseDetailsVo'].todate = value['entityLicenseDetailsVo'].toDate;
    // value['entityLicenseDetailsVo'].fromDate = value['entityLicenseDetailsVo'].fromDate;
    value['entityLicenseDetailsVo'].userLicense = Number(value['entityLicenseDetailsVo'].userLicense);
    value['entityLicenseDetailsVo'].transactionLicense = Number(value['entityLicenseDetailsVo'].transactionLicense);    
    value['entityLicenseDetailsVoList'] = undefined;
  

    this.entityService.renewal(value).subscribe(data => {
      let datalist =  JSON.parse(data['_body']);
      if(datalist.responseCode == '200'){
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          disableClose: false,
          panelClass: 'btnCenter',
          width: 'auto',
          data: {
            title: 'Info',
            server:'servermessage',
            message: datalist.responseMessage,
            btnYes: 'Ok',
          }
        });
        dialogRef.afterClosed().subscribe(data => {
          if(data){
            this.router.navigateByUrl('/entity');
          }
        })
      }else{
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          disableClose: false,
          panelClass: 'btnCenter',
          width: 'auto',
          data: {
            title: 'Alert',
            server:'servermessage',
            message: datalist.responseMessage,
            btnYes: 'Ok',
          }
        });
      }
    })

  }

  modify(value){
    value['modifyFlag'] = 1;
    this.entityService.update(value).subscribe(data => {
      let datalist =  JSON.parse(data['_body']);
      if(datalist.responseCode == '200'){
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          disableClose: false,
          panelClass: 'btnCenter',
          width: 'auto',
          data: {
            title: 'Info',
            server:'servermessage',
            message: datalist.responseMessage,
            btnYes: 'Ok',
          }
        });
        dialogRef.afterClosed().subscribe(data => {
          if(data){
            this.router.navigateByUrl('/entity');
          }
        })
      }else{
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          disableClose: false,
          panelClass: 'btnCenter',
          width: 'auto',
          data: {
            title: 'Alert',
            server:'servermessage',
            message: datalist.responseMessage,
            btnYes: 'Ok',
          }
        });
      }
    })
  }



  dateChange(form){
   form.controls.entityLicenseDetailsVoList.controls[0].controls.toDate.reset();
   this.minToDate = new Date(form.value.entityLicenseDetailsVoList[0].fromDate);
   this.enable = false;
  }

  todateChange(form){
    // form.controls.entityLicenseDetailsVoList.controls[0].controls.toDate.reset();
    if(form.controls.entityLicenseDetailsVoList.controls[0].controls.toDate != null){
    this.enable = false;
    }
   }

   valid(form){
    if(form.controls.entityLicenseDetailsVoList.value[0].userLicense != ""){
      this.enable = false;
      }
      else if((form.controls.entityLicenseDetailsVoList.value[0].userLicense == "") &&
        (form.controls.entityLicenseDetailsVoList.value[0].fromDate != "" ||
          form.controls.entityLicenseDetailsVoList.value[0].toDate != "" ||
          form.controls.entityLicenseDetailsVoList.value[0].transactionLicense != "")){
        this.enable = false;
        }
      else if((form.controls.entityLicenseDetailsVoList.value[0].userLicense == "") &&
        (form.controls.entityLicenseDetailsVoList.value[0].fromDate == "" ||
          form.controls.entityLicenseDetailsVoList.value[0].toDate == "" ||
          form.controls.entityLicenseDetailsVoList.value[0].transactionLicense == "")){
        this.enable = true;
        }
   }

   valid1(form){
    if(form.controls.entityLicenseDetailsVoList.value[0].transactionLicense != ""){
      this.enable = false;
      }
      else if((form.controls.entityLicenseDetailsVoList.value[0].transactionLicense == "") &&
        (form.controls.entityLicenseDetailsVoList.value[0].fromDate != "" ||
          form.controls.entityLicenseDetailsVoList.value[0].toDate != "" ||
          form.controls.entityLicenseDetailsVoList.value[0].userLicense != "")){
        this.enable = false;
        }
      else if((form.controls.entityLicenseDetailsVoList.value[0].transactionLicense == "") &&
        (form.controls.entityLicenseDetailsVoList.value[0].fromDate == "" ||
          form.controls.entityLicenseDetailsVoList.value[0].toDate == "" ||
          form.controls.entityLicenseDetailsVoList.value[0].userLicense == "")){
        this.enable = true;
        }
   }

   ngOnDestroy()
  {
    localStorage.removeItem('');
  }
}

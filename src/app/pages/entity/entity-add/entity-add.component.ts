import { Component, OnInit, Inject, } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { ComponentLoaderService } from 'src/app/shared/component-loader.service';
import { EntityService } from '../entity.service';
import { JsonApiService } from 'src/assets/api/json-api.service';

@Component({
  selector: 'app-entity-add',
  templateUrl: './entity-add.component.html',
  styleUrls: ['./entity-add.component.css']
})
export class EntityAddComponent implements OnInit {

  saveForm: FormGroup;
  count: number = 1;
  userRoleFieldName: any;
  today;
  enable: boolean;
  labels: any = {};
  userBaseFieldName: any = {};
  planList: any = [];
  languageList: any = [];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private componentLoaderService: ComponentLoaderService,
    private entityService: EntityService,
    private jsonApiService: JsonApiService) { }

  ngOnInit() {
    this.today = new Date();
    this.saveForm = this.formBuilder.group({
      entityName: ['', Validators.required],
      userLoginId: ['', Validators.required],
      entityAddress: [''],
      email: ['', Validators.required],
      passwordLength: [''],
      passwordSpecialChar: [''],
      passwordNumeric: [''],
      passwordAlphanumericCaps: [''],
      expiryDays: [''],
      mobile: ['', Validators.required],
      location: ['', Validators.required],
      subLocation: ['', Validators.required],
      status: [true],
      planId: ['', Validators.required],
      entityLang: ['en',  Validators.required],
      entityLicenseDetailsVoList: this.formBuilder.array([this.sequenceType()]),
    });
    this.getLabelDetails();
    this.addLoad();
    this.componentLoaderService.display(false);

  }


  sequenceType() {
    return this.formBuilder.group({
      userCount: [''],
      fromDate: [''],
      toDate: [''],
      transactionCount: [''],
      planId: ['']
    })
  }
  addSequence() {
    (this.saveForm.controls['entityLicenseDetailsVoList'] as FormArray).push(this.sequenceType());
    this.count++;
  }
  deleteSequence(i) {
    if (this.count > 1) {
      (this.saveForm.controls['entityLicenseDetailsVoList'] as FormArray).removeAt(-1);
      this.count--;
    }
  }
  /** Method call for Language Translation */
  getLabelDetails() {
    let lang;
    if (localStorage.getItem('langCode') !== null) {
      lang = localStorage.getItem('langCode');
    }
    this.jsonApiService.fetch('/' + lang + '.json').subscribe((data) => {
      this.labels = data;
    });
  }

  clear() {
    this.ngOnInit();
  }

  addLoad() {

    this.entityService.planList().subscribe(data => {
      let selectGetData = JSON.parse(data['_body']);
      if (selectGetData.responseCode == '200') {
        this.planList = selectGetData.succesObject;
      }
    });

    let languageCombo = this.entityService.languageLoad().subscribe(data => {
      let language_selectGetData = JSON.parse(data['_body']);
      this.languageList = language_selectGetData.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });


    this.entityService.addData().subscribe(data => {
      let selectGetData = JSON.parse(data['_body']);
      if (selectGetData.responseCode == '200') {
        // this.userBaseFieldName = selectGetData.authSuccesObject.screenFieldDisplayVoList.map(
        //   element => {
        //     return element;
        //   }
        // );

        if (localStorage.getItem('userId') == '1') {
          this.userBaseFieldName = [
            "mobile","passwordAlphanumericCaps","expiryDays","fromDate","toDate","userCount",
            "entityName","transactionCount","entityAddress","email","passwordLength","passwordSpecialChar",
            "passwordNumeric","userLoginId","location","subLocation","planId","entityLang", 'status'
          ]
        } else {
          this.userBaseFieldName = selectGetData.authSuccesObject.screenFieldDisplayVoList.map(
            element => {
              return element;
            }
          );
        }
      }
      else {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          disableClose: false,
          panelClass: 'btnCenter',
          width: 'auto',
          data: {
            title: 'Alert',
            server: 'servermessage',
            message: selectGetData.responseMessage,
            btnYes: 'OK',
          }
        });
      }
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
  }

  onSubmit(form) {
    this.componentLoaderService.display(true);
    form.entityLicenseDetailsVoList[0].planId = form.planId;
    this.entityService.entityCreation(form).subscribe(data => {
      let response = JSON.parse(data['_body']);
      this.componentLoaderService.display(false);
      if (response.responseCode == '200') {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          disableClose: false,
          width: 'auto',
          data: {
            title: 'Info',
            server: 'servermessage',
            message: response.responseMessage,
            btnYes: 'Ok',
          }
        });
        dialogRef.afterClosed().subscribe(data => {
          this.router.navigate(['/entity']);
        })
      }
      else if (response.responseCode == '301') {
        const dialogRefAlert = this.dialog.open(ConfirmationDialogComponent, {
          disableClose: false,
          width: 'auto',
          data: {
            title: 'Alert',
            server: 'servermessage',
            message: response.responseMessage,
            btnYes: 'Ok',
          }

        });
        dialogRefAlert.afterClosed().subscribe(data => {

          this.saveForm.controls['entityName'].reset();
        })
      }
      else {
        const dialogRefAlert = this.dialog.open(ConfirmationDialogComponent, {
          disableClose: false,
          width: 'auto',
          data: {
            title: 'Alert',
            server: 'servermessage',
            message: response.responseMessage,
            btnYes: 'Ok',
          }

        });
      }
    })
  }

  pwdCheck(event) {
    if (event.value <= 5) {
      const dialogRefAlert = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        width: 'auto',
        data: {
          title: 'Alert',
          message: 'twoDays',
          btnYes: 'Ok',
        }

      });
      dialogRefAlert.afterClosed().subscribe(data => {
        this.saveForm.controls['passwordLength'].reset();

      })
    }
  }

  loadDetails(value){
    this.entityService.planDetails(value).subscribe( data => {
      let load = JSON.parse(data['_body']);
      if(load.responseCode == '200' && load.succesObject.planName != undefined){
        load.succesObject.fromDate = new Date(load.succesObject.fromDate);
        load.succesObject.toDate = new Date(load.succesObject.toDate);
        this.saveForm.controls['entityLicenseDetailsVoList'].patchValue([load.succesObject]);
        this.enable =true;
      }
      else if(load.responseCode == '200' && load.succesObject.planName == undefined){
        this.enable = false;
        this.saveForm.controls['entityLicenseDetailsVoList'].reset();
      }
      else{
        const dialogRefAlert = this.dialog.open(ConfirmationDialogComponent, {
          disableClose: false,
          width: 'auto',
          data: {
            title: 'Alert',
            message: load.responseMessage,
            btnYes: 'Ok',
          }
  
        });
      }
    })
  }
}

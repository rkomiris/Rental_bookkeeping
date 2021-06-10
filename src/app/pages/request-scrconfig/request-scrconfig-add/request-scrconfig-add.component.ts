
import { Component, OnInit} from '@angular/core';
import {  MatDialog } from '@angular/material';
import {  FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { RequestScrconfigAddService } from './request-scrconfig-add.service';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import { ComponentLoaderService } from '../../../shared/component-loader.service';
import { JsonApiService } from 'src/assets/api/json-api.service';
@Component({
  selector: 'app-request-scrconfig-add',
  templateUrl: './request-scrconfig-add.component.html',
  styleUrls: ['./request-scrconfig-add.component.css']
})

export class RequestScrconfigAddComponent implements OnInit {
  labels: any = {}; /** LABEL CHANGES **/
  saveForm: FormGroup;
  count: number = 1;
  requestTypeList: any;
  requestSubTypeList: any;
  staticFieldComobo: any;
  fieldValidationCombo: any;
  userBaseFieldName: any = [];
  staticFieldFilter : any = {};
  fieldValidationFilter  : any = {};
  constructor(
    private componentLoaderService: ComponentLoaderService,
    private router: Router,
    private formBuilder: FormBuilder, private dialog: MatDialog, private requestScrconfigAddService: RequestScrconfigAddService,
    private jsonApiService: JsonApiService/** LABEL CHANGES **/) { }
  ngOnInit() {
    this.getLabelDetails(); /** LABEL CHANGES **/
    this.saveForm = this.formBuilder.group({
      requestScreenConfigurationName: ["", Validators.required],
      requestScreenConfigurationCode: ["",],
      requestScreenConfigurationIsActive: [true],
      requestTypeId: ["",],
      requestSubtypeId: ["",],
      requestScreenDetailConfigurationVoList: this.formBuilder.array([this.sequenceType()]),
    });
    this.onloadReqType()
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
  clearForm() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => this.router.navigate(
      ['/request-scrconfig/request-scrconfig-add']));
  }
  sequenceType() {
    return this.formBuilder.group({
      requestScreenDetailConfigurationSequance: ["", Validators.required],
      requestScreenDetailConfigurationFieldName: ["", Validators.required],
      requestScreenDetailConfigurationFieldType: ["", Validators.required],
      requestScreenDetailConfigurationFieldValue: ["",],
      requestScreenDetailConfigurationValidationIsRequired: ["", Validators.required],
      requestScreenDetailConfigurationIsActive: [true, Validators.required],
      requestScreenConfigId: ["",],
      requestScreenDetailConfigurationFieldStorageType: ["",],
      requestScreenDetailConfigurationIsMaster: ["",],
      requestScreenDetailConfigurationMasterCode: ["",],
    })
  }
  addSequence() {
    (this.saveForm.controls['requestScreenDetailConfigurationVoList'] as FormArray).push(this.sequenceType());
    this.count++;
  }
  deleteSequence() {
    if (this.count > 1) {
      (this.saveForm.controls['requestScreenDetailConfigurationVoList'] as FormArray).removeAt(-1);
      this.count--;
    }
  }
  onloadReqType() {
    this.requestScrconfigAddService.addrequest().subscribe(data => {
      let selectGetData = JSON.parse(data['_body']);
      this.userBaseFieldName = selectGetData.authSuccesObject.screenFieldDisplayVoList.map(
        element => {
          return element;
        }
      );
      this.componentLoaderService.display(false);
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
    this.requestScrconfigAddService.getreqtypeId().subscribe(data => {
      let resp = JSON.parse(data['_body']);
      this.requestTypeList = resp.succesObject;
    },
      error => {
        if (error.status === 401) {
          console.log("Error");
        }
      });

    this.staticFieldComobo = [{ Type: "Text Box", Value: "T" }, { Type: "Dropdown", Value: "S" },
    { Type: "Text area", Value: "A" },{ Type: "Check Box", Value: "C" },{ Type: "Radio", Value: "R" },{ Type: "Date Picker", Value: "D" }];
    this.fieldValidationCombo = [{ Name: "Yes", Value: true }, { Name: "No", Value: false }];

  }
  getSubTypeList(eve) {
    this.requestScrconfigAddService.getSubTypeList(eve.value).subscribe(data => {
      let resp = JSON.parse(data['_body']);
      this.requestSubTypeList = resp.succesObject;
    },
      error => {
        console.log(error)
      })
  }
  onSubmit() {
    let formvalue = this.saveForm.value;
    if (this.saveForm.invalid) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        panelClass: 'btnCenter',
        width: 'auto',
        data: {
          title: 'Alert',
          message: "mandatory",
          btnYes: 'OK',
        }
      });
    } else if (this.saveForm.valid) {
      this.componentLoaderService.display(true);
      let finalval: any = {};

      finalval = formvalue;
      finalval.screenFieldDisplayVoList = this.userBaseFieldName;
      this.requestScrconfigAddService.addScreenConfig(finalval).subscribe(data => {
        let resp = JSON.parse(data['_body']);
        if (resp.responseCode === '200') {
          const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            disableClose: false,
            panelClass: 'btnCenter',
            width: 'auto',
            data: {
              title: 'Info',
              server:'servermessage',
              message: resp.responseMessage,
              btnYes: 'OK',
            }
          });
          dialogRef.afterClosed().subscribe(data => {
            this.router.navigate(['/request-scrconfig'])
          })
        } else {
          const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            disableClose: false,
            panelClass: 'btnCenter',
            width: 'auto',
            data: {
              title: 'Alert',
              server:'servermessage',
              message: resp.responseMessage,
              btnYes: 'OK',
            }
          });
        }
        this.componentLoaderService.display(false);
      },
        error => {
          console.log(error)
        })
    }
  }
  dynamicRequired(eve, i){
    // const baseControl = (<FormArray>(
    //   this.saveForm.controls["requestScreenDetailConfigurationVoList"]
    // )).at(i);
    // baseControl["controls"].requestScreenDetailConfigurationFieldValue.setValidators([Validators.required]);
  }
}

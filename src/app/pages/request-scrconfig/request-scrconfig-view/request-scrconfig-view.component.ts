
import { Component, OnInit, ViewChild, Output, Inject, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, VERSION, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormBuilder, FormGroup, FormArray, Validators, NgForm, Form } from '@angular/forms';
import { Router } from "@angular/router";
import { DOCUMENT } from '@angular/common';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import { text } from '@angular/core/src/render3';
import {RequestScrconfigModifyService} from '../request-scrconfig-modify/request-scrconfig-modify.service';
import {RequestScrconfigAddService} from '../request-scrconfig-add/request-scrconfig-add.service';
import { ComponentLoaderService } from '../../../shared/component-loader.service';
import { JsonApiService } from 'src/assets/api/json-api.service';
@Component({
  selector: 'app-request-scrconfig-view',
  templateUrl: './request-scrconfig-view.component.html',
  styleUrls: ['./request-scrconfig-view.component.css']
})
export class RequestScrconfigViewComponent implements OnInit, OnDestroy {
  labels: any = {}; /** LABEL CHANGES **/
  saveForm: FormGroup;
  count: number = 1;
  requestTypeList: any;
  requestSubTypeList: any;
  staticFieldComobo : any;
  fieldValidationCombo: any;
  requestScreenrow : number;
  userBaseFieldName: any = [];
  constructor(private jsonApiService: JsonApiService/** LABEL CHANGES **/,
    private componentLoaderService: ComponentLoaderService, private requestScrconfigAddService : RequestScrconfigAddService,private RequestScrconfigModifyService : RequestScrconfigModifyService, private router: Router, private formBuilder: FormBuilder, private dialog: MatDialog) { }

  ngOnInit() {
    this.getLabelDetails(); /** LABEL CHANGES **/
    this.componentLoaderService.display(true);
    this.saveForm = this.formBuilder.group({
      requestScreenConfigurationName : ["",],
      requestScreenConfigurationCode: ["",],
      requestScreenConfigurationIsActive : ["",],
      requestTypeId: ["",],
      requestSubtypeId: ["",],
      requestScreenDetailConfigurationVoList: this.formBuilder.array([this.sequenceType()]),
      requestScreenDetailConfigurationFieldStorageType : ["",],
      requestScreenDetailConfigurationIsMaster : ["",],
      requestScreenDetailConfigurationMasterCode : ["",],
      requestScreenDetailConfigurationIsActive : ["",],
    });
    this.onloadModifyData();
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
      requestScreenDetailConfigurationSequance: ["", Validators.required],
      requestScreenDetailConfigurationFieldName: ["", Validators.required],
      requestScreenDetailConfigurationFieldType: ["", Validators.required],
      requestScreenDetailConfigurationFieldValue: ["",],
      requestScreenDetailConfigurationValidationIsRequired: ["", Validators.required],
      requestScreenDetailConfigurationIsActive: ["", Validators.required],
      requestScreenConfigId: ["",],
      requestScreenDetailConfigurationFieldStorageType: ["",],
      requestScreenDetailConfigurationIsMaster: ["",],
      requestScreenDetailConfigurationMasterCode: ["",],
      requestScreenDetailConfigId : [""]
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
  onloadModifyData() {
    this.staticFieldComobo = [{ Type: "text", Value: "T" }, { Type: "dropdown", Value: "S" },
    { Type: "Text area", Value: "A" },{ Type: "Check Box", Value: "C" },{ Type: "Radio", Value: "R" } ,{ Type: "Date Picker", Value: "D" }];
  this.fieldValidationCombo = [{Name: "Yes", Value : true},{ Name: "No", Value : false}];
   let rowId = localStorage.getItem('requestScreenConfigId');
  /**  this.requestScrconfigAddService.getreqtypeId().subscribe(data => {
    let resp = JSON.parse(data['_body']);
    this.requestTypeList = resp.succesObject;
  },
    error => {
      if (error.status === 401) {
        console.log("Error");
      }
    }); */
    this.RequestScrconfigModifyService.getModifyData(rowId).subscribe(data => {
     let resp = JSON.parse(data['_body']);
     if(resp.succesObject.requestScreenDetailConfigurationVoList != null){
      this.requestScreenrow = resp.succesObject.requestScreenDetailConfigurationVoList.length
      for(let i = 1; i < this.requestScreenrow; i++){
       (this.saveForm.controls['requestScreenDetailConfigurationVoList'] as FormArray).push(this.sequenceType());
     }
     }
     resp.succesObject.requestScreenConfigurationVo.requestScreenDetailConfigurationVoList = resp.succesObject.requestScreenDetailConfigurationVoList;
     this.userBaseFieldName = resp.authSuccesObject.screenFieldDisplayVoList.map(
      element => {
        return element;
      }
    );
     this.saveForm.patchValue(resp.succesObject.requestScreenConfigurationVo);
     this.requestScrconfigAddService.getSubTypeList(resp.succesObject.requestScreenConfigurationVo.requestTypeId).subscribe(data => {
      let resp = JSON.parse(data['_body']);
      this.requestSubTypeList = resp.succesObject;
    },
      error => {
        console.log(error)
      })

    },
    error => {
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
        this.componentLoaderService.display(false);
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
      if(this.saveForm.invalid){
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
      }else if(this.saveForm.valid){
      this.RequestScrconfigModifyService.modifyScreenConfig(formvalue).subscribe(data => {
        let resp = JSON.parse(data['_body']);
        if(resp.statusCode === '200'){
          const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            disableClose: false,
            panelClass: 'btnCenter',
            width: 'auto',
            data: {
              title: 'Info',
              server:'servermessage',
              message: resp.statusMessage,
              btnYes: 'OK',
            }
          });
          dialogRef.afterClosed().subscribe( data => {
            this.router.navigate(['/request-scrconfig'])
          })
        }else{
          const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            disableClose: false,
            panelClass: 'btnCenter',
            width: 'auto',
            data: {
              title: 'Alert',
              server:'servermessage',
              message: resp.statusMessage,
              btnYes: 'OK',
            }
          });
        }
      },
        error => {
          console.log(error)
        })
    }
  }
  ngOnDestroy(){
    localStorage.removeItem('requestScreenConfigId');
  }
}

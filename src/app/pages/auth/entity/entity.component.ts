import { Component, OnInit, Inject, } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../login/login.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { ComponentLoaderService } from 'src/app/shared/component-loader.service';
import * as moment from 'moment';

@Component({
  selector: 'app-entity',
  templateUrl: './entity.component.html',
  styleUrls: ['./entity.component.css']
})
export class EntityComponent implements OnInit {

  saveForm: FormGroup;
  count: number = 1;
  userRoleFieldName: any;
  today;
  enable: boolean;
  languageList: any = [];
  languageFilter : any;
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
  private router: Router, 
    private formBuilder: FormBuilder, 
    private dialog: MatDialog,
    private loginService: LoginService,
    private componentLoaderService: ComponentLoaderService,
    private dialogRefOwn: MatDialogRef<EntityComponent>, ) { }

  ngOnInit() {
    console.log(this.data.data)
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
      planName: [this.data.data.planName],
      mobile : ['',Validators.required],
     // passwordCheckCount: [''],
      location: ['', Validators.required],
      subLocation: ['', Validators.required],
      status:[false],
      entityLang: ['en', Validators.required],
      // userCount:[''],
      // fromDate:[''],
      // toDate:[''],
      // transactionCount:[''],
      entityLicenseDetailsVoList: this.formBuilder.array([this.sequenceType()]),
    });
    if(this.data.data.planId != null && this.data.data.planName != 'Custom'){
      this.loadDetails();
    }
    else{
      this.enable = false
    }
  }

  loadDetails(){
    // let languageCombo = this.loginService.languageLoad().subscribe(data => {
    //   let language_selectGetData = JSON.parse(data['_body']);
    //   this.languageList = language_selectGetData.succesObject;
    // }, error => {
    //   if (error.status === 401) {
    //     console.log("Error");
    //   }
    // });

    this.languageList = [
      {languageCode: 'en', language: "English"},
      {languageCode: 'jp', language:"Japanese"}
    ]

    this.loginService.planDetails(this.data.data.planId).subscribe( data => {
      let load = JSON.parse(data['_body']);
      load.succesObject.fromDate = new Date(load.succesObject.fromDate);
      load.succesObject.toDate = new Date(load.succesObject.toDate);
      this.saveForm.controls['entityLicenseDetailsVoList'].patchValue([load.succesObject]);
      this.enable =true;
    })
  }

  sequenceType() {
    return this.formBuilder.group({
      userCount:[''],
      fromDate:[''],
      toDate:[''],
      transactionCount:[''],
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

  closeForm(){ 
    this.dialogRefOwn.close();
    this.router.navigateByUrl('login')
  }

  clear(){
    this.ngOnInit();
  }

  

  onSubmit(form){
    this.componentLoaderService.display(true);
    form.entityLicenseDetailsVoList[0].planId = this.data.data.planId;
    this.loginService.entityCreation(form).subscribe(data => {
      let response =  JSON.parse(data['_body']);
      this.componentLoaderService.display(false);
      if(response.responseCode == '200'){
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
          this.dialogRefOwn.close();
          this.router.navigateByUrl('login')
        })
      }
      else if(response.responseCode == '301'){
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
          // if(response.responseMessage == "User Name Already Exists"){
            this.saveForm.controls['entityName'].reset();
          // }
        })
      }
      else{
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
        // dialogRefAlert.afterClosed().subscribe(data => {
        //   // if(response.responseMessage == "User Name Already Exists"){
        //     this.saveForm.controls['entityName'].reset();
        //   // }
        // })
      }
    })
  }

  pwdCheck(event){
    if(event.value <= 5){
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
        // }
      })
    }
  }
}

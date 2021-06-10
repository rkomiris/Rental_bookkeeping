import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { AuthenticationModifyService } from './authentication-modify.service';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import { ComponentLoaderService } from '../../../shared/component-loader.service';
import { JsonApiService } from 'src/assets/api/json-api.service';
@Component({
  selector: 'app-authentication-modify',
  templateUrl: './authentication-modify.component.html',
  styleUrls: ['./authentication-modify.component.css']
})
export class AuthenticationModifyComponent implements OnInit, OnDestroy {
  labels: any = {}; /** LABEL CHANGES **/
  saveForm: FormGroup;
  screenCombo: any;
  userRoleCombo: any;
  constructor(
    private jsonApiService: JsonApiService/** LABEL CHANGES **/,
    private router: Router,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private authenticationModifyService: AuthenticationModifyService,
    private componentLoaderService: ComponentLoaderService) {
  }
  ngOnInit() {
    this.getLabelDetails(); /** LABEL CHANGES **/
    this.componentLoaderService.display(true);
    this.saveForm = this.formBuilder.group({
      screenId: ['', Validators.required],
      roleId: ['', Validators.required],
      addFlag: ['', Validators.required],
      modifyFlag: ['', Validators.required],
      deleteFlag: ['', Validators.required],
      viewFlag: ['', Validators.required]
    });
    this.onloadSelectboxData();
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
  onloadSelectboxData() {
    let screenCombo = this.authenticationModifyService.load_ScreenselectBoxData().subscribe(data => {
      let screen_selectGetData = JSON.parse(data['_body']);
      this.screenCombo = screen_selectGetData.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
    let userroleCombo = this.authenticationModifyService.load_userRoleselectBoxData().subscribe(data => {
      let userrole_selectGetData = JSON.parse(data['_body']);
      this.userRoleCombo = userrole_selectGetData.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
    let authenticationId = localStorage.getItem('authenticationId');
    let getModify = this.authenticationModifyService.getAuthentication(authenticationId).subscribe(data => {
      let userrole_selectGetData = JSON.parse(data['_body']);
      let formData = userrole_selectGetData.succesObject;
      this.saveForm.patchValue(formData);
      if (formData.addFlag == '1') {
        this.saveForm.patchValue({ addFlag: true });
      } else { this.saveForm.patchValue({ addFlag: false }); }
      if (formData.modifyFlag == '1') {
        this.saveForm.patchValue({ modifyFlag: true });
      } else { this.saveForm.patchValue({ modifyFlag: false }); }
      if (formData.deleteFlag == '1') {
        this.saveForm.patchValue({ deleteFlag: true });
      } else { this.saveForm.patchValue({ deleteFlag: false }); }
      if (formData.viewFlag == '1') {
        this.saveForm.patchValue({ viewFlag: true });
      } else { this.saveForm.patchValue({ viewFlag: false }); }
      this.componentLoaderService.display(false);
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
  }
  onSubmit() {
    if (this.saveForm.value.addFlag === true || this.saveForm.value.addFlag == '1') {
      this.saveForm.value.addFlag = '1';
    } else { this.saveForm.value.addFlag = '0'; }
    if (this.saveForm.value.modifyFlag === true || this.saveForm.value.modifyFlag == '1') {
      this.saveForm.value.modifyFlag = '1';
    } else { this.saveForm.value.modifyFlag = '0'; }
    if (this.saveForm.value.deleteFlag === true || this.saveForm.value.deleteFlag == '1') {
      this.saveForm.value.deleteFlag = '1';
    } else { this.saveForm.value.deleteFlag = '0'; }
    if (this.saveForm.value.viewFlag === true || this.saveForm.value.viewFlag == '1') {
      this.saveForm.value.viewFlag = '1';
    } else { this.saveForm.value.viewFlag = '0'; }
    let formvalue = Object.assign(this.saveForm.value, {'authenticationId' : localStorage.getItem('authenticationId')});
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
      this.authenticationModifyService.modifyAuthentication(formvalue).subscribe(data => {
        let Response = JSON.parse(data['_body']);
        if (Response.responseCode === '200') {
          const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            disableClose: false,
            panelClass: 'btnCenter',
            width: 'auto',
            data: {
              title: 'Info',
              server: 'servermessage',
              message: Response.responseMessage,
              btnYes: 'OK',
            }
          });
          dialogRef.afterClosed().subscribe(data => {
            this.router.navigate(['/authentication']);
          });
        } else {
          const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            disableClose: false,
            panelClass: 'btnCenter',
            width: 'auto',
            data: {
              title: 'Alert',
              server: 'servermessage',
              message: Response.responseMessage,
              btnYes: 'OK',
            }
          });
        }
        this.componentLoaderService.display(false);
      })
    }
  }
  ngOnDestroy() {
    localStorage.removeItem('authenticationId');
  }
}

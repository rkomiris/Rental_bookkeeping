
import { Component, OnInit, ViewChild, Output, Inject } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, VERSION, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormBuilder, FormGroup, Validators, NgForm, Form } from '@angular/forms';
import { Router } from "@angular/router";
import { DOCUMENT } from '@angular/common';
import { UserAddService } from './user-add.service';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import { ComponentLoaderService } from '../../../shared/component-loader.service';
import { JsonApiService } from 'src/assets/api/json-api.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css']
})
export class UserAddComponent implements OnInit {

  saveForm: FormGroup;
  userDeptCombo: any;
  userRoleCombo: any;
  userDivisionCombo: any;
  userLocationCombo: any;
  userSubLocationCombo: any;
  levelCombo: any;
  password1: '';
  conpassword: '';
  hide = false;
  hide1 = false;
  userBaseFieldName: any = [];
  subLocationList: any = [];
  userRoleList: any = [];
  languageList: any = [];
  labels: any = {};/** LABEL CHANGES **/

  constructor(
    private componentLoaderService: ComponentLoaderService,
    private router: Router,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private UseraddService: UserAddService,
    private jsonApiService: JsonApiService/** LABEL CHANGES **/) {
  this.userLocationCombo = [];
    this.languageList = [];
  }

  ngOnInit() {
    this.componentLoaderService.display(true);
    this.saveForm = this.formBuilder.group({
      userLoginId: ['', Validators.required],
      userEmployeeId: ['', Validators.required],
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      emailId: ['', Validators.required],
      userRole: ['', Validators.required],
      userDepartment: ['', Validators.required],
      // division: [''],
      phoneNumber: [''],
      mobile: ['', Validators.required],
      currentAddress: [''],
      permanentAddress: [''],
      userLocation: ['', Validators.required],
      subLocation: ['', Validators.required],
      // commonId: [''],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      activeFlag: [true],
      langCode: [localStorage.getItem('langCode'), Validators.required],
    });
    this.onloadSelectboxData();
    this.getLabelDetails();/** LABEL CHANGES **/
    this.componentLoaderService.display(false);
  }
  /**** LABEL CHNAGES ****/
  getLabelDetails() {
    let lang;
    if (localStorage.getItem('langCode') !== null) {
      lang = localStorage.getItem('langCode');
    } else {
      lang = environment.defaultLocale;
    }
    this.jsonApiService
      .fetch('/' + lang + '.json')
      .subscribe((data) => {
        this.labels = data;
      });
  }
  onloadSelectboxData() {
    this.UseraddService.adduserscreen().subscribe(data => {
      let selectGetData = JSON.parse(data['_body']);
      if (selectGetData.responseCode == '200') {
        this.userBaseFieldName = selectGetData.authSuccesObject.screenFieldDisplayVoList.map(
          element => {
            return element;
          }
        );
      } 
      else if(selectGetData.responseCode == '301'){
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
        dialogRef.afterClosed().subscribe(data => {
          this.router.navigate(['/user']);
        })
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

    /** Correctly method calling */
    let locationCombo = this.UseraddService.load_LocationselectBoxData().subscribe(data => {
      let location_selectGetData = JSON.parse(data['_body']);
      this.userLocationCombo = location_selectGetData.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });

    /** language Load */
    let languageCombo = this.UseraddService.languageLoad().subscribe(data => {
      let language_selectGetData = JSON.parse(data['_body']);
      this.languageList = language_selectGetData.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
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
      if (this.password1 !== this.conpassword) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          disableClose: false,
          panelClass: 'btnCenter',
          width: 'auto',
          data: {
            title: 'Alert',
            message: 'pwdmismatch',
            btnYes: 'OK',
          }
        });
      } else if (this.password1 === this.conpassword) {
        this.componentLoaderService.display(true);
        let finalval: any = {};

        finalval = formvalue;
        if (finalval.activeFlag == true) {
          finalval.activeFlag = "1";
        } else {
          finalval.activeFlag = "0";
        }
        finalval.screenFieldDisplayVoList = this.userBaseFieldName;
        this.UseraddService.addUser(finalval).subscribe(data => {
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
              this.router.navigate(['/user']);
            })
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
        });
      }
    }
  }

  /** Correct method */
  getSubLocation(val,form) {
    form.controls['subLocation'].reset();
    form.controls['userDepartment'].reset();
    form.controls['userRole'].reset(); 
    this.userSubLocationCombo = [];
    this.subLocationList  = [];
    this.userRoleList = [];
    let subLocationListData = this.UseraddService.load_subLocationData(val).subscribe(data => {
      let resp = JSON.parse(data['_body']);
      this.userSubLocationCombo = resp.succesObject;

    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });

  }
  /** Correct method */
  getDeptLocation(val, locationId, form) {
    form.controls['userDepartment'].reset();
    form.controls['userRole'].reset();
    this.subLocationList  = [];
    this.userRoleList = [];
    this.UseraddService.load_selectBox_subLocationData({ userLocation: locationId, sublocationId: val }).subscribe(
      data => {
        let resp = JSON.parse(data['_body']);
        this.subLocationList = resp.succesObject;
      },
      error => {
        console.log(error);
      }
    );
  }
  executerGetUSerRole(id, form) {
    form.controls['userRole'].reset();
    this.userRoleList = [];
    let userRoleListData = this.UseraddService.load_userRoleelectBoxData({ userDepartment: id }).subscribe(data => {
      let resp = JSON.parse(data['_body']);
      this.userRoleList = resp.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
  }
}


import { Component, OnInit, ViewChild, Output, Inject, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, VERSION, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormBuilder, FormGroup, Validators, NgForm, Form } from '@angular/forms';
import { Router } from "@angular/router";
import { DOCUMENT } from '@angular/common';
import { UserViewService } from './user-view.service';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import { ComponentLoaderService } from '../../../shared/component-loader.service';
import { JsonApiService } from 'src/assets/api/json-api.service';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.css']
})
export class UserViewComponent implements OnInit {
  
  saveForm: FormGroup;
  userDeptCombo : any;
  userRoleCombo : any;
  userDivisionCombo : any;
  userLocationCombo : any;
  userSubLocationCombo: any;
  levelCombo : any;
  userBaseFieldName: any = [];
  languageList: any = [];
  labels: any = {}; /** LABEL CHANGES **/
  
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private userViewService: UserViewService,
    private componentLoaderService: ComponentLoaderService,
    private jsonApiService: JsonApiService/** LABEL CHANGES **/
    ) {
  }
  ngOnInit() {
    this.saveForm = this.formBuilder.group({
      userLoginId: ['', Validators.required],
      userEmployeeId: ['', Validators.required],
      firstName: ['', Validators.required],
      middleName: ['', Validators.required],
      lastName: ['', Validators.required],
      emailId: ['', Validators.required],
      userRole: ['', Validators.required],
      userDepartment: ['', Validators.required],
      // division: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      mobile: ['', Validators.required],
      currentAddress: [''],
      permanentAddress: [''],
      userLocation: ['', Validators.required],
      subLocation: ['', Validators.required],
      // commonId: ['', Validators.required],
      // password: ['', Validators.required],
      // confirmPassword: ['' , Validators.required],
      // activeFlag:[true],
      activeFlag:[],
      langCode: ['',Validators.required]
    });
    this.onloadSelectboxData();
    this.getLabelDetails();

  }
  getLabelDetails() {
    let lang;
    if(localStorage.getItem('langCode') !== null){
      lang = localStorage.getItem('langCode');
    }
    this.jsonApiService.fetch('/'+lang+'.json').subscribe((data) => {
        this.labels = data;
      });
  }
  
  onloadSelectboxData(){
    this.componentLoaderService.display(true);

    /** language Load */
    let languageCombo = this.userViewService.languageLoad().subscribe(data => {
      let language_selectGetData = JSON.parse(data['_body']);
      this.languageList = language_selectGetData.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
    let deptCombo = this.userViewService.load_DeptselectBoxData().subscribe(data => {
      let dept_selectGetData = JSON.parse(data['_body']);
      this.userDeptCombo = dept_selectGetData.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
    let divisionCombo = this.userViewService.load_DivisionselectBoxData().subscribe(data => {
      let division_selectGetData = JSON.parse(data['_body']);
      this.userDivisionCombo = division_selectGetData.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
    let locationCombo = this.userViewService.load_LocationselectBoxData().subscribe(data => {
      let location_selectGetData = JSON.parse(data['_body']);
      this.userLocationCombo = location_selectGetData.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
    let roleCombo = this.userViewService.load_RoleselectBoxData().subscribe(data => {
      let role_selectGetData = JSON.parse(data['_body']);
      this.userRoleCombo = role_selectGetData.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
    let modifyGetData = this.userViewService.modifygetData().subscribe(data => {
      let modifyData = JSON.parse(data['_body']);
      let subLocationListData = this.userViewService.load_subLocationData(modifyData.succesObject.userLocation).subscribe(data => {
        let resp = JSON.parse(data['_body']);
        this.userSubLocationCombo = resp.succesObject;
      }, error => {
        if (error.status === 401) {
          console.log("Error");
        }
      });
      this.userBaseFieldName = modifyData.authSuccesObject.screenFieldDisplayVoList.map(
        element => {
          return element;
        }
      );
     // this.conpassword = modifyData.succesObject.password;
      this.saveForm.patchValue(modifyData.succesObject);
      this.saveForm.patchValue({confirmPassword: modifyData.succesObject.password});
    //  this.saveForm.patchValue(modifyData.succesObject);
      this.componentLoaderService.display(false);
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
    let levelCombo = this.userViewService.load_levelselectBoxData().subscribe(data => {
      let level_selectGetData = JSON.parse(data['_body']);
      this.levelCombo = level_selectGetData.succesObject;
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
      this.userViewService.modifyUser(formvalue).subscribe(data => {
        let Response = JSON.parse(data['_body']);
        if (Response.responseCode === '200') {
          const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            disableClose: false,
            panelClass: 'btnCenter',
            width: 'auto',
            data: {
              title: 'Info',
              server:'servermessage',
              message: Response.responseMessage,
              btnYes: 'OK',
            }
          });
          dialogRef.afterClosed().subscribe(data => {
            this.router.navigate(['/user']);
          });
        } else {
          const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            disableClose: false,
            panelClass: 'btnCenter',
            width: 'auto',
            data: {
              title: 'Alert',
              server:'servermessage',
              message: Response.responseMessage,
              btnYes: 'OK',
            }
          });
        }
      })
    }
  }
  ngOnDestroy(){
    localStorage.getItem('usercurid');
  }
}

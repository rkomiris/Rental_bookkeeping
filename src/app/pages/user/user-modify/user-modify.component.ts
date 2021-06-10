
import { Component, OnInit, ViewChild, Output, Inject, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, VERSION, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormBuilder, FormGroup, Validators, NgForm, Form } from '@angular/forms';
import { Router } from "@angular/router";
import { DOCUMENT } from '@angular/common';
import { UserModifyService } from './user-modify.service';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import { ComponentLoaderService } from '../../../shared/component-loader.service';
import { environment } from 'src/environments/environment';
import { JsonApiService } from 'src/assets/api/json-api.service';
@Component({
  selector: 'app-user-modify',
  templateUrl: './user-modify.component.html',
  styleUrls: ['./user-modify.component.css']
})
export class UserModifyComponent implements OnInit, OnDestroy {

  saveForm: FormGroup;
  userDeptCombo: any;
  userRoleCombo: any;
  userDivisionCombo: any;
  userLocationCombo: any;
  userSubLocationCombo: any;
  levelCombo: any;
  userBaseFieldName: any = [];
  password1: '';
  conpassword: '';
  subLocationList: any = [];
  userRoleList: any = [];
  hide = false;
  hide1 = false;
  languageList : any = [];
  labels: any = {};
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private userModifyService: UserModifyService,
    private jsonApiService: JsonApiService,
    private componentLoaderService: ComponentLoaderService) {
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
      // password: ['', Validators.required],
      // confirmPassword: ['', Validators.required],
      activeFlag: [true],
      langCode: ['',Validators.required]
    });
    this.onloadSelectboxData();
    this.getLabelDetails();
    // this.getSubLocation();
  }
  /**** LABEL CHNAGES ****/
  getLabelDetails() {
    let lang;
    if (localStorage.getItem('langCode') !== null) {
      lang = localStorage.getItem('langCode');
    } 
    this.jsonApiService
      .fetch('/' + lang + '.json')
      .subscribe((data) => {
        this.labels = data;
      });
  }
  onloadSelectboxData() {
    
    let deptCombo = this.userModifyService.load_DeptselectBoxData().subscribe(data => {
      let dept_selectGetData = JSON.parse(data['_body']);
      this.userDeptCombo = dept_selectGetData.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
    let divisionCombo = this.userModifyService.load_DivisionselectBoxData().subscribe(data => {
      let division_selectGetData = JSON.parse(data['_body']);
      this.userDivisionCombo = division_selectGetData.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
    /** language Load */
    let languageCombo = this.userModifyService.languageLoad().subscribe(data => {
      let language_selectGetData = JSON.parse(data['_body']);
      this.languageList = language_selectGetData.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
    let locationCombo = this.userModifyService.load_LocationselectBoxData().subscribe(data => {
      let location_selectGetData = JSON.parse(data['_body']);
      this.userLocationCombo = location_selectGetData.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
    let roleCombo = this.userModifyService.load_RoleselectBoxData().subscribe(data => {
      let role_selectGetData = JSON.parse(data['_body']);
      this.userRoleCombo = role_selectGetData.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
     this.userModifyService.modifygetData().subscribe(data => {
     let modifyData = JSON.parse(data['_body']);
      let subLocationListData = this.userModifyService.load_subLocationData(modifyData.succesObject.userLocation).subscribe(data => {  
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
      this.getSubLocation(modifyData.succesObject.userLocation);
      this.getDeptLocation(modifyData.succesObject.subLocation, modifyData.succesObject.userLocation);
      this.executerGetUSerRole(modifyData.succesObject.userDepartment);
      this.saveForm.patchValue(modifyData.succesObject);
      this.saveForm.patchValue({ confirmPassword: modifyData.succesObject.password });
      this.componentLoaderService.display(false);
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });  
    let levelCombo = this.userModifyService.load_levelselectBoxData().subscribe(data => {
      let level_selectGetData = JSON.parse(data['_body']);
      this.levelCombo = level_selectGetData.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
  }
 
  onSubmit() {
    let formvalue = Object.assign(this.saveForm.value, { id: localStorage.getItem('usercurid') });
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
      if (this.saveForm.value.password !== this.saveForm.value.confirmPassword) {
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
      } else  {
        this.componentLoaderService.display(true);
        let finalval: any = {};

        finalval = formvalue;
       finalval.screenFieldDisplayVoList = this.userBaseFieldName;
        this.userModifyService.modifyUser(finalval).subscribe(data => {
          let Response = JSON.parse(data['_body']);
          if (Response.responseCode === '200') {
            if(localStorage.getItem('userId') == this.saveForm.value['id']){              
            localStorage.setItem('langCode',this.saveForm.value.langCode)
            }
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
        });
      }
    }
  }
  getSubLocation(val) {    
    let subLocationListData = this.userModifyService.load_subLocationData(val).subscribe(data => {
      let resp = JSON.parse(data['_body']);
      this.userSubLocationCombo = resp.succesObject;

    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
  }
  getSubLocation2(val, form) {    
    form.controls['subLocation'].reset();
    form.controls['userDepartment'].reset();
    form.controls['userRole'].reset();
    form.controls.userRole.touched = true;
    form.controls.subLocation.touched = true;
    form.controls.userDepartment.touched = true;
    this.userSubLocationCombo = [];
    this.subLocationList  = [];
    this.userRoleList = [];
    let subLocationListData = this.userModifyService.load_subLocationData(val).subscribe(data => {
      let resp = JSON.parse(data['_body']);
      this.userSubLocationCombo = resp.succesObject;

    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
  }
  getDeptLocation(val, locationId) {
    this.userModifyService.load_selectBox_subLocationData({ userLocation: locationId, sublocationId: val }).subscribe(
      data => {
        let resp = JSON.parse(data['_body']);
        this.subLocationList = resp.succesObject;
      },
      error => {
        console.log(error);
      }
    );
  }

  getDeptLocation2(val, locationId, form) {
    form.controls['userDepartment'].reset();
    form.controls['userRole'].reset();
    form.controls.userRole.touched = true;
    form.controls.userDepartment.touched = true;
    this.subLocationList  = [];
    this.userRoleList = [];
    this.userModifyService.load_selectBox_subLocationData({ userLocation: locationId, sublocationId: val }).subscribe(
      data => {
        let resp = JSON.parse(data['_body']);
        this.subLocationList = resp.succesObject;
      },
      error => {
        console.log(error);
      }
    );
  }
  executerGetUSerRole(id) {
    let userRoleListData = this.userModifyService.load_userRoleelectBoxData({ userDepartment: id }).subscribe(data => {
      let resp = JSON.parse(data['_body']);
      this.userRoleList = resp.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
  }
  executerGetUSerRole2(id, form) {
    form.controls['userRole'].reset();
    form.controls['userRole'].touched = true;
    this.userRoleList = [];
    let userRoleListData = this.userModifyService.load_userRoleelectBoxData({ userDepartment: id }).subscribe(data => {
      let resp = JSON.parse(data['_body']);
      this.userRoleList = resp.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
  }
  ngOnDestroy() {
    localStorage.getItem('usercurid');
  }
}

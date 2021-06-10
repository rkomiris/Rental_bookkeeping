
import { Component, OnInit, ViewChild,OnDestroy, Output, Inject } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, VERSION, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormBuilder, FormGroup, Validators, NgForm, Form } from '@angular/forms';
import { Router } from "@angular/router";
import { DOCUMENT } from '@angular/common';
import { UserRoleAddService } from './user-role-add.service';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import { ComponentLoaderService } from '../../../shared/component-loader.service';
import { JsonApiService } from 'src/assets/api/json-api.service';

@Component({
  selector: 'app-user-role-add',
  templateUrl: './user-role-add.component.html',
  styleUrls: ['./user-role-add.component.css']
})
export class UserRoleAddComponent implements OnInit, OnDestroy {
  saveForm: FormGroup;
  userDepartmentCombo: any;
  userLocationCombo: any;
  departmentList: any = [];
  Combo: any = [];
  role = false;
  dept = false;
  loca = false;
  des = false;
  userBaseFieldName: any = [];
  subLocationList: any = [];
  roleType: any = [];
  labels: any = {}; /** LABEL CHANGES **/
  locationId: number;
  sublocationId: number;

  constructor(
    private componentLoaderService: ComponentLoaderService,
    private router: Router, private formBuilder: FormBuilder,
    private jsonApiService: JsonApiService/** LABEL CHANGES **/,
     private dialog: MatDialog,
     private userRoleAddService: UserRoleAddService) {
  }

  ngOnInit() {
   this.saveForm = this.formBuilder.group({
      userRoleName: ['', Validators.required],
      roleType: ['', Validators.required],
      sublocationId: ['', Validators.required],
      userDepartment: ['', Validators.required],
      userLocation: ['', Validators.required],
      description: ['', ],
    });
    this.onloadSelectboxData();
    this.getLabelDetails(); /** LABEL CHANGES **/
    this.getRoleType();
  }
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
  onloadSelectboxData() {
    this.userRoleAddService.addUser().subscribe(data => {
      let selectGetData = JSON.parse(data['_body']);
      this.userBaseFieldName = selectGetData.authSuccesObject.screenFieldDisplayVoList.map(
        element => {
          return element;
        }
      );
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
    let loadLoactionSelectBox = this.userRoleAddService.load_LoactionselectBoxData().subscribe(data => {
      let location_selectGetData = JSON.parse(data['_body']);
      this.userLocationCombo = location_selectGetData.succesObject;
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
      this.componentLoaderService.display(true);
      let finalval: any = {};

      finalval = formvalue;
      finalval.screenFieldDisplayVoList = this.userBaseFieldName;
      this.userRoleAddService.addUserRole(finalval).subscribe(data => {
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
            this.router.navigate(['/userrole']);
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
        this.componentLoaderService.display(false);
      });
    }
  }
  
  getSubLocation(val,saveForm) {
    this.locationId = val;
    saveForm.controls['sublocationId'].reset(); 
    saveForm.controls['userDepartment'].reset();
    this.subLocationList = [];
    this.departmentList = [];
    this.userRoleAddService.load_subLocationselectBoxData(val).subscribe(
      data => {
        let resp = JSON.parse(data['_body']);
        this.subLocationList = resp.succesObject;
      },
      error => {
        console.log(error);
      }
    );
  }

  getdepartment(val,saveForm) {
    saveForm.controls['userDepartment'].reset();
    this.departmentList = [];
    this.sublocationId = val;
    this.userRoleAddService.load_selectBox_departmentData(this.locationId, this.sublocationId).subscribe(
      data => {
        let resp = JSON.parse(data['_body']);
        this.departmentList = resp.succesObject;
      },
      error => {
        console.log(error);
      }
    );
  } 

  getRoleType(){
    let loadLoactionSelectBox = this.userRoleAddService.getRoleType().subscribe(data => {
      let location_selectGetData = JSON.parse(data['_body']);
      this.roleType = location_selectGetData.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
  }

  ngOnDestroy(){
    localStorage.removeItem('userMappingId');
  }
}

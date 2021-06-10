import { Component, OnInit, ViewChild, Output, Inject } from '@angular/core';
import { MatDialog} from '@angular/material';
import { FormBuilder, FormGroup, Validators, NgForm, Form } from '@angular/forms';
import { Router } from "@angular/router";
import { DeparmentAddService } from './deparment-add.service';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import { ComponentLoaderService } from '../../../shared/component-loader.service';
//import { RoomconfigAddService } from '../../roomconfig/roomconfig-add/roomconfig-add.service';
import { JsonApiService } from 'src/assets/api/json-api.service';

@Component({
  selector: 'app-department-add',
  templateUrl: './department-add.component.html',
  styleUrls: ['./department-add.component.css']
})
export class DepartmentAddComponent implements OnInit {

  saveForm: FormGroup;
  userLocationCombo: any;
  userBaseFieldName: any = [];
  userSubLocationCombo: any = [];
  labels: any = {}; /** LABEL CHANGES **/

  constructor(
    private componentLoaderService: ComponentLoaderService,
    private jsonApiService: JsonApiService/** LABEL CHANGES **/,
    //private roomconfigAddService: RoomconfigAddService,    
    private router: Router, 
    private formBuilder: FormBuilder, 
    private dialog: MatDialog, 
    private deparmentAddService: DeparmentAddService) {
  }

  ngOnInit() {
    this.componentLoaderService.display(true);
    this.getLabelDetails(); /** LABEL CHANGES **/
    this.saveForm = this.formBuilder.group({
      userDepartmentName: ['', Validators.required],
      userLocation: ['', Validators.required],
      sublocationId: ['', Validators.required],
      description: ['']
    });

    this.onloadSelectboxData();
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
    this.deparmentAddService.departmentaddscreen().subscribe(data => {
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
    let loadLoactionSelectBox = this.deparmentAddService.load_LoactionselectBoxData().subscribe(data => {
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
    if(this.saveForm.value.gfiLocationFlag === true){
      this.saveForm.value.gfiLocationFlag = "1";
    }else{
      this.saveForm.value.gfiLocationFlag = "0";
    }
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
      this.deparmentAddService.addDepartment(finalval).subscribe(data => {
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
            this.router.navigate(['/department']);
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
      })
    }
  }

  subLocationDropDown(event, form) {
    let val = event.value;    
    form.controls['sublocationId'].reset();
    // form.controls['sublocationId'].touched = true;
    this.userSubLocationCombo = [];
    let loadSelectBoxList = this.deparmentAddService.load_subLocationselectBoxData(val).subscribe(data => {
      let RC_selectGetData = JSON.parse(data['_body']);
      this.userSubLocationCombo = RC_selectGetData.succesObject;
    }, error => {
      if(error.status === 401)
      {
        console.log(error);
      }
    });
  }
}


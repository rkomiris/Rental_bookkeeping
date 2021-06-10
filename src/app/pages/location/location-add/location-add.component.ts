import { Component, OnInit, ViewChild, Output, Inject } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, VERSION, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormBuilder, FormGroup, Validators, NgForm, Form } from '@angular/forms';
import { Router } from "@angular/router";
import { DOCUMENT } from '@angular/common';
import { LocationAddService } from './location-add.service';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import { ComponentLoaderService } from '../../../shared/component-loader.service';
import { JsonApiService } from 'src/assets/api/json-api.service';
@Component({
  selector: 'app-location-add',
  templateUrl: './location-add.component.html',
  styleUrls: ['./location-add.component.css']
})
export class LocationAddComponent implements OnInit {
  saveForm: FormGroup;
  countryCombo : any;
  cityCombo : any;
  stateCombo : any;
  userBaseFieldName: any = [];
  labels: any = {}
  lang: any;
  
  constructor(
    private componentLoaderService: ComponentLoaderService,
    private router: Router, 
    private formBuilder: FormBuilder, 
    private dialog: MatDialog, 
    private locationAddService: LocationAddService,
    private jsonApiService: JsonApiService) {
  }

  private locationValidators = [
    Validators.pattern(/A-Za-z0-9.+$/ )
];
  
  ngOnInit() {
    //this.componentLoaderService.display(true);
    this.saveForm = this.formBuilder.group({
      userLocationName: ['', Validators.required],
      userLocationDetails: ['', Validators.required],
      zip: [''],
      phone: [''],
      fax: [''],
      email: [''],
      contactName: [''],
      cityId: [''],
      stateId: [''],
      countryId: [''],
      // deleteFlag: [false , Validators.required]
    });
    this.onloadSelectboxData();
    this.getLabelDetails();
  }
  /** LABEL CHANGES **/
  getLabelDetails() {
    // let lang;
    if(localStorage.getItem('langCode') !== null){
      this.lang = localStorage.getItem('langCode');
    }
    this.jsonApiService.fetch('/'+this.lang+'.json').subscribe((data) => {
        this.labels = data;
      });
  }
  
  onloadSelectboxData() {
    this.locationAddService.locationaddscreen().subscribe(data => {
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
    let deptCombo = this.locationAddService.load_CityselectBoxData().subscribe(data => {
      let dept_selectGetData = JSON.parse(data['_body']);
      this.cityCombo = dept_selectGetData.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
    let divisionCombo = this.locationAddService.load_countryselectBoxData().subscribe(data => {
      let division_selectGetData = JSON.parse(data['_body']);
      this.countryCombo = division_selectGetData.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
    let locationCombo = this.locationAddService.load_stateselectBoxData().subscribe(data => {
      let location_selectGetData = JSON.parse(data['_body']);
      this.stateCombo = location_selectGetData.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
  }
  onSubmit() {
    let formvalue = this.saveForm.value;

 /**    if(this.saveForm.value.deleteFlag === true || this.saveForm.value.deleteFlag == '1'){
      this.saveForm.value.deleteFlag = "1";
    }else if(this.saveForm.value.deleteFlag === false || this.saveForm.value.deleteFlag == '0'){
      this.saveForm.value.deleteFlag = "0";
    } */
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
      this.locationAddService.addLocation(finalval).subscribe(data => {
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
            this.router.navigate(['/location']);
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
  clearForm() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => this.router.navigate(['/location/location-add']));
  }
}


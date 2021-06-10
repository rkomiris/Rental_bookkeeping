import { Component, OnInit, OnDestroy} from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, VERSION, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormBuilder, FormGroup, Validators, NgForm, Form } from '@angular/forms';
import { Router } from "@angular/router";
import { DOCUMENT } from '@angular/common';
import { LocationModifyService } from './location-modify.service';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import { ComponentLoaderService } from '../../../shared/component-loader.service';
import { JsonApiService } from 'src/assets/api/json-api.service';

@Component({
  selector: 'app-location-modify',
  templateUrl: './location-modify.component.html',
  styleUrls: ['./location-modify.component.css']
})
export class LocationModifyComponent implements OnInit , OnDestroy{

  saveForm: FormGroup;
  countryCombo : any;
  cityCombo : any;
  stateCombo : any;
  userBaseFieldName: any = [];
  labels : any = {};

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private locationModifyService: LocationModifyService,
    private jsonApiService: JsonApiService,
    private componentLoaderService: ComponentLoaderService) {
  }

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
      // deleteFlag: ['', Validators.required]
    });
    this.onloadSelectboxData();
    this.getLabelDetails();
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
  
  onloadSelectboxData(){
    
    let deptCombo = this.locationModifyService.load_CityselectBoxData().subscribe(data => {
      let dept_selectGetData = JSON.parse(data['_body']);
      this.cityCombo = dept_selectGetData.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
    let divisionCombo = this.locationModifyService.load_countryselectBoxData().subscribe(data => {
      let division_selectGetData = JSON.parse(data['_body']);
      this.countryCombo = division_selectGetData.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
    let locationCombo = this.locationModifyService.load_stateselectBoxData().subscribe(data => {
      let location_selectGetData = JSON.parse(data['_body']);
      this.stateCombo = location_selectGetData.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
    let locationmodifyData = this.locationModifyService.getModifyData().subscribe(data => {
      
      let modify_selectGetData = JSON.parse(data['_body']);
      this.userBaseFieldName = modify_selectGetData.authSuccesObject.screenFieldDisplayVoList.map(
        element => {
          return element;
        }
      );
      this.saveForm.patchValue(modify_selectGetData.succesObject);
    },  
    error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
    this.componentLoaderService.display(false);
  }
  onSubmit() {
    let formvalue = Object.assign(this.saveForm.value, {id : localStorage.getItem('locationId')});
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
      this.locationModifyService.modifyLocation(finalval).subscribe(data => {
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
  ngOnDestroy(){
    localStorage.removeItem('locationId');
  }
}

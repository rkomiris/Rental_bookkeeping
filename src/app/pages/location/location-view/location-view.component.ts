import { Component, OnInit, OnDestroy} from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, VERSION, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormBuilder, FormGroup, Validators, NgForm, Form } from '@angular/forms';
import { Router } from "@angular/router";
import { DOCUMENT } from '@angular/common';
import { LocationViewService } from './location-view.service';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import { ComponentLoaderService } from '../../../shared/component-loader.service';
import { JsonApiService } from 'src/assets/api/json-api.service';
@Component({
  selector: 'app-location-view',
  templateUrl: './location-view.component.html',
  styleUrls: ['./location-view.component.css']
})

export class LocationViewComponent implements OnInit, OnDestroy {
  saveForm: FormGroup;
  countryCombo : any;
  cityCombo : any;
  stateCombo : any;
  userBaseFieldName: any = [];
  labels: any = {};
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private locationViewService: LocationViewService,
    private componentLoaderService: ComponentLoaderService,
    private jsonApiService: JsonApiService) {
  }
  ngOnInit() {
    this.componentLoaderService.display(true);
    this.saveForm = this.formBuilder.group({
      userLocationName: ['', Validators.required],
      userLocationDetails: ['', Validators.required],
      zip: ['', Validators.required],
      phone: ['', Validators.required],
      fax: ['', Validators.required],
      email: ['', Validators.required],
      contactName: ['', Validators.required],
      cityId: ['', Validators.required],
      stateId: ['', Validators.required],
      countryId: ['', Validators.required],
      // deleteFlag: ['', Validators.required]
    });
    this.getLabelDetails();
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
  onloadSelectboxData(){
    let deptCombo = this.locationViewService.load_CityselectBoxData().subscribe(data => {
      let dept_selectGetData = JSON.parse(data['_body']);
      this.cityCombo = dept_selectGetData.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
    let divisionCombo = this.locationViewService.load_countryselectBoxData().subscribe(data => {
      let division_selectGetData = JSON.parse(data['_body']);
      this.countryCombo = division_selectGetData.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
    let locationCombo = this.locationViewService.load_stateselectBoxData().subscribe(data => {
      let location_selectGetData = JSON.parse(data['_body']);
      this.stateCombo = location_selectGetData.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
    let locationmodifyData = this.locationViewService.getModifyData().subscribe(data => {
      let modify_selectGetData = JSON.parse(data['_body']);
      this.userBaseFieldName = modify_selectGetData.authSuccesObject.screenFieldDisplayVoList.map(
        element => {
          return element;
        }
      );
      this.saveForm.patchValue(modify_selectGetData.succesObject);
      if(modify_selectGetData.succesObject.deleteFlag == '1'){
        this.saveForm.patchValue({deleteFlag : true});
      }else{
        this.saveForm.patchValue({deleteFlag : false});
      }
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
    this.componentLoaderService.display(false);
  }
  ngOnDestroy(){
    localStorage.removeItem('locationId');
  }
}

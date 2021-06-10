import { Component, OnInit, ViewChild, Output, Inject } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, VERSION, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormBuilder, FormGroup, Validators, NgForm, Form } from '@angular/forms';
import { Router } from "@angular/router";
import { DOCUMENT } from '@angular/common';
import { DeparmentViewService } from './deparment-view.service';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import { ComponentLoaderService } from '../../../shared/component-loader.service';
//import { RoomconfigAddService } from '../../roomconfig/roomconfig-add/roomconfig-add.service';
import { JsonApiService } from 'src/assets/api/json-api.service';

@Component({
  selector: 'app-department-view',
  templateUrl: './department-view.component.html',
  styleUrls: ['./department-view.component.css']
})
export class DepartmentViewComponent implements OnInit {

  saveForm: FormGroup;
  userLocationCombo: any;
  userBaseFieldName: any = [];
  userSubLocationCombo: any = [];
  val: any;
  labels: any = {}; /** LABEL CHANGES **/

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    //private roomconfigAddService: RoomconfigAddService,
    private dialog: MatDialog,
    private deparmentViewService: DeparmentViewService,
    private componentLoaderService: ComponentLoaderService,
    private jsonApiService: JsonApiService/** LABEL CHANGES **/) {
  }
  ngOnInit() {
    this.componentLoaderService.display(true);
    this.getLabelDetails(); /** LABEL CHANGES **/
    this.saveForm = this.formBuilder.group({
      userDepartmentName: ['', Validators.required],
      userLocation: ['', Validators.required],
      sublocationId: ['', Validators.required],
      description: [''],
      // gfiLocationFlag: ['', Validators.required],
    });
    this.val = localStorage.getItem('locationId');
    this.subLocationDropDown(this.val);

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
    let loadLoactionSelectBox = this.deparmentViewService.load_LoactionselectBoxData().subscribe(data => {
      let location_selectGetData = JSON.parse(data['_body']);
      this.userLocationCombo = location_selectGetData.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
    let departmentmodifyData = this.deparmentViewService.getModifyData().subscribe(data => {
      let modify_selectGetData = JSON.parse(data['_body']);
      this.userBaseFieldName = modify_selectGetData.authSuccesObject.screenFieldDisplayVoList.map(
        element => {
          return element;
        }
      );
      this.saveForm.patchValue(modify_selectGetData.succesObject);
      if (modify_selectGetData.succesObject.gfiLocationFlag == '1') {
        this.saveForm.patchValue({gfiLocationFlag : true});
      } else {
        this.saveForm.patchValue({gfiLocationFlag : false});
      }
      this.componentLoaderService.display(false);
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
  }
  ngOnDestroy(){
    localStorage.removeItem('departmentId');
    localStorage.removeItem('locationId');

  }

  subLocationDropDown(val) {
    let loadSelectBoxList = this.deparmentViewService.load_subLocationselectBoxData(val).subscribe(data => {
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


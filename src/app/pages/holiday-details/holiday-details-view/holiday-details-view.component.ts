import { Component, OnInit, ViewChild, Output, Inject } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, VERSION, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormBuilder, FormGroup, Validators, NgForm, Form, FormArray } from '@angular/forms';
import { Router } from "@angular/router";
import { DOCUMENT } from '@angular/common';
import { HolidayDetailsViewService } from './holiday-details-view.service';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import { ComponentLoaderService } from '../../../shared/component-loader.service';
import * as moment from 'moment';
import { JsonApiService } from 'src/assets/api/json-api.service';
@Component({
  selector: 'app-holiday-details-view',
  templateUrl: './holiday-details-view.component.html',
  styleUrls: ['./holiday-details-view.component.css']
})
export class HolidayDetailsViewComponent implements OnInit {
  //filters input //
  labels: any = {}; /** LABEL CHANGES **/
  locationFilter: any = {};
  sublocationFilter: any = {};
  deptFilter: any;
  saveForm: FormGroup;
  locationCombo: any = [];
  sublocationCombo: any = [];
  deptCombo: any;
  userBaseFieldName: any = [];
  loadData: any;
  leaveTypeList: any = [];
  count: number = 1;
  constructor(
    private jsonApiService: JsonApiService/** LABEL CHANGES **/,
    private componentLoaderService: ComponentLoaderService,
    private router: Router, private formBuilder: FormBuilder, private dialog: MatDialog, private HolidayDetailsModifyService: HolidayDetailsViewService
  ) {
  }
  ngOnInit() {
    this.getLabelDetails(); /** LABEL CHANGES **/
    this.componentLoaderService.display(true);
    this.saveForm = this.formBuilder.group({
      // locationId: ['', Validators.required],
      // sublocationId: ['', Validators.required],
      // departmentId: [''],
      holidayDate: ['', Validators.required],
      leaveType: ['', Validators.required],
      description: ['', Validators.required],
      holidayDetailsList: this.formBuilder.array([this.dynamicRows()])
    });
    if(localStorage.getItem('langCode') == 'en'){
      this.leaveTypeList = [{name: 'National', id: 2}, {name: 'Local', id: 1}]
    }else if(localStorage.getItem('langCode') == 'jp'){
      this.leaveTypeList = [{name: '国民', id: 2}, {name: '地元', id: 1}]
    }
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
  
  dynamicRows() {
    return this.formBuilder.group({
      locationId: ['', Validators.required],
      sublocationId: ['', Validators.required],
      activeFlag: [true],
      holidayDetailsId: [null]
    });
  }
  addRow() {
    if (this.count <= 100) {
      (this.saveForm.controls['holidayDetailsList'] as FormArray).push(this.dynamicRows());
      this.count++;
    }
  }
  deleteRow() {
    if (this.count > 1) {
      (this.saveForm.controls['holidayDetailsList'] as FormArray).removeAt(-1);
      this.count--;
    }
  }
  onloadSelectboxData() {
    this.HolidayDetailsModifyService.load_holidayDetailsModify().subscribe(data => {
      let selectGetData = JSON.parse(data['_body']);
      this.loadData = selectGetData.succesObject;

      this.loadData.holidayDate =
        new Date(this.loadData.holidayDate);
      
      if (selectGetData.succesObject.holidayDetailsList != null) {
        
        for (let i = 0; i < selectGetData.succesObject.holidayDetailsList.length; i++) {
          this.getSubLocation(selectGetData.succesObject.holidayDetailsList[i].locationId, i)
          this.addRow();
        }
      }
      this.saveForm.patchValue(this.loadData);
      this.deleteRow()
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
    this.HolidayDetailsModifyService.load_LocationselectBoxData().subscribe(data => {
      let selectGetData = JSON.parse(data['_body']);
      this.locationCombo = selectGetData.succesObject;
      this.componentLoaderService.display(false);
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
  }
  getSubLocation(eve, i) {

    this.HolidayDetailsModifyService.load_subLocationData(eve).subscribe(data => {
      let selectGetData = JSON.parse(data['_body']);
      this.sublocationCombo[i] = selectGetData.succesObject;
      this.componentLoaderService.display(false);
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
    this.saveForm.patchValue({ sublocationId: '' });
    this.saveForm.patchValue({ departmentId: '' });
    // this.HolidayDetailsModifyService.load_DeptselectBoxData(eve.value).subscribe(data => {
    //   let selectGetData = JSON.parse(data['_body']);
    //   this.deptCombo = selectGetData.succesObject;
    //   this.componentLoaderService.display(false);
    // }, error => {
    //   if (error.status === 401) {
    //     console.log("Error");
    //   }
    // });
  }
  getDepartment(event, locationId) {
    this.HolidayDetailsModifyService.load_DeptselectBoxData({
      sublocationId: event.value,
      userLocation: locationId
    }).subscribe(data => {
      let selectGetData = JSON.parse(data['_body']);
      this.deptCombo = selectGetData.succesObject;
      this.componentLoaderService.display(false);
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
    this.saveForm.patchValue({ departmentId: '' });
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
      //  this.HolidayDetailsModifyService.modifyHolidayDetail(finalval).subscribe(data => {
      //    let Response = JSON.parse(data['_body']);
      //    if (Response.responseCode === '200') {
      //      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      //        disableClose: false,
      //        panelClass: 'btnCenter',
      //        width: 'auto',
      //        data: {
      //          title: 'Info',
      //          message: Response.responseMessage,
      //          btnYes: 'OK',
      //        }
      //      });
      //      dialogRef.afterClosed().subscribe(data => {
      //        this.router.navigate(['/holiday-details']);
      //      });
      //    } else {
      //      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      //        disableClose: false,
      //        panelClass: 'btnCenter',
      //        width: 'auto',
      //        data: {
      //          title: 'Alert',
      //          message: Response.responseMessage,
      //          btnYes: 'OK',
      //        }
      //      });
      //    }
      //    this.componentLoaderService.display(false);
      //  });
    }
  }

}

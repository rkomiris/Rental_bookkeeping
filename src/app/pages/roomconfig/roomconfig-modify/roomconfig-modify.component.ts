import { Component, OnInit, ViewChild, Output, Inject } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, VERSION, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormBuilder, FormGroup, Validators, FormArray, NgForm, Form } from '@angular/forms';
import { Router } from "@angular/router";
import { DOCUMENT } from '@angular/common';
import { RoomconfigModifyService } from './roomconfig-modify.service';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import { ComponentLoaderService } from '../../../shared/component-loader.service';
import * as moment from 'moment';

@Component({
  selector: 'app-roomconfig-modify',
  templateUrl: './roomconfig-modify.component.html',
  styleUrls: ['./roomconfig-modify.component.css']
})
export class RoomconfigModifyComponent implements OnInit {
  saveForm: FormGroup;
  count: number = 1;
  roomConfigScreenrow: number;
  RC_location_selectFormGetDate: any = [];
  RC_aminite_selectFormGetDate: any = [];
  RC_sublocation_selectFormGetDate: any = [];
  userBaseFieldName: any = [];
  subLocationListdept: any = [];
  amenityFilter : any = {};
  priorityList: any[] = [
    {id:1, value: 'Low'},
    {id:2, value:'Medium'},
    {id:3, value:'High'}

  ];
  constructor(
    private componentLoaderService: ComponentLoaderService, 
    private router: Router, 
    private formBuilder: FormBuilder, 
    private dialog: MatDialog, 
    private roomconfigModifyService: RoomconfigModifyService
  ) { }
  
  ngOnInit() {
    this.componentLoaderService.display(true);
    this.RC_list_modify();
    this.onloadSelectboxData();
    this.saveForm = this.formBuilder.group({
      rinRoomDetailConfigVoList: this.formBuilder.array([this.sequenceType()]),  // For Row Add and Remove
      roomConfigCode: ['', Validators.required],
      roomConfigRoomName: ['', Validators.required],
      roomConfigNoOfSeats: ['', Validators.required],
      id: ['', Validators.required],
      buildingName: [''],
      sublocationId: ['', Validators.required],
      isRoomConfigActive: [true],
      isRoomConfigApprovalRequired: [false,],
      isRoomConfigUnderMaintenance: [false,],
      fromDate: [null],
      toDate: [null],
      roomConfigPriorty:['', Validators.required]
    });
  }

  sequenceType() {
    return this.formBuilder.group({
      amenityId: ['', Validators.required],
      roomDetailNumberOfAmenities: ['', Validators.required],
      isRoomDetailConfigActive: [true,],
      roomConfigDetailId: []
    })
  }
  addSequence() {
    if (this.count <= 9) {
      (this.saveForm.controls['rinRoomDetailConfigVoList'] as FormArray).push(this.sequenceType());
      this.count++;
    }
  }
  deleteSequence() {
    if (this.count > 1) {
      (this.saveForm.controls['rinRoomDetailConfigVoList'] as FormArray).removeAt(-1);
      this.count--;
    }
  }


  RC_list_modify() {
    let rowId = localStorage.getItem('roomConfigId');
    this.roomconfigModifyService.load_modify_project(rowId).subscribe(data => {
      let RC_ModifyListGetData = JSON.parse(data['_body']);
      let RC_Modify_TableData = RC_ModifyListGetData.succesObject;

      this.userBaseFieldName = RC_ModifyListGetData.succesObject.screenFieldDisplayVoList.map(
        element => {
          return element;
        }
      );
      
      let loadSelectBoxList = this.roomconfigModifyService.load_subLocationselectBoxData(RC_Modify_TableData.id).subscribe(data => {
        let RC_selectGetData = JSON.parse(data['_body']);
        this.RC_sublocation_selectFormGetDate = RC_selectGetData.succesObject;
      }, error => {
        if (error.status === 401) {
          alert(error);
        }
      });
      this.roomConfigScreenrow = RC_Modify_TableData.rinRoomDetailConfigVoList.length
      for (let i = 1; i < this.roomConfigScreenrow; i++) {
        (this.saveForm.controls['rinRoomDetailConfigVoList'] as FormArray).push(this.sequenceType());
      }
      this.saveForm.patchValue(RC_ModifyListGetData.succesObject);
      if (RC_ModifyListGetData.succesObject.fromDate != null && RC_ModifyListGetData.succesObject.toDate != null) {
        let x = new Date(RC_ModifyListGetData.succesObject.fromDate);
        let y = new Date(RC_ModifyListGetData.succesObject.toDate);
        this.saveForm.patchValue({ fromDate: x, toDate: y });
      }
    }, error => {
      if (error.status === 401) {
        alert(error);
      }
    })
    this.componentLoaderService.display(false);
  }



  onloadSelectboxData() {
    let loadSelectBoxList = this.roomconfigModifyService.load_rcselectBoxData().subscribe(data => {
      let RC_selectGetData = JSON.parse(data['_body']);
      this.RC_location_selectFormGetDate = RC_selectGetData.succesObject;
    }, error => {
      if (error.status === 401) {
        alert(error);
      }
    });
    let roomConfigList = this.roomconfigModifyService.roomConfigDropdown().subscribe(data => {
      let RC_selectGetData = JSON.parse(data['_body']);
      this.RC_aminite_selectFormGetDate = RC_selectGetData.succesObject;
    }, error => {
      if (error.status === 401) {
        alert(error);
      }
    });
  }


  subLocationDropDown(val) {
    let loadSelectBoxList = this.roomconfigModifyService.load_subLocationselectBoxData(val).subscribe(data => {
      let RC_selectGetData = JSON.parse(data['_body']);
      this.RC_sublocation_selectFormGetDate = RC_selectGetData.succesObject;
    }, error => {
      if (error.status === 401) {
        alert(error);
      }
    });
    this.roomconfigModifyService.load_subLocationData(val).subscribe(
      data => {
        let resp = JSON.parse(data['_body']);
        this.subLocationListdept = resp.succesObject;
      },
      error => {
        alert(error);
      }
    );
  }




  onSubmit() {
    let formvalue = this.saveForm.value;
    let fromDate = moment(this.saveForm.controls.fromDate.value).format('DD/MM/YYYY');
    let toDate = moment(this.saveForm.controls.toDate.value).format('DD/MM/YYYY');
    let fromDateTime = moment(this.saveForm.controls.fromDate.value).format('hh-mm');
    let toDateTime = moment(this.saveForm.controls.toDate.value).format('hh-mm');
    if (this.saveForm.invalid) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        panelClass: 'btnCenter',
        width: 'auto',
        data: {
          title: 'Alert',
          message: "Please fill all mandatory Fields",
          btnYes: 'OK',
        }
      });
    } else if (this.saveForm.controls.isRoomConfigUnderMaintenance.value == true && fromDate === toDate && fromDateTime === toDateTime) {  
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          disableClose: false,
          panelClass: 'btnCenter',
          width: 'auto',
          data: {
            title: 'Alert',
            message: "From Date and To Date Cannot be same",
            btnYes: 'OK',
          }
        });
      
      
    } else if (this.saveForm.valid) {
      
        this.componentLoaderService.display(true);
        let finalval: any = {};

        finalval = formvalue;
        finalval.screenFieldDisplayVoList = this.userBaseFieldName;
        this.roomconfigModifyService.update_modify_project(finalval).subscribe(data => {
          let Response = JSON.parse(data['_body']);
          if (Response.responseCode === '200') {
            const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
              disableClose: false,
              panelClass: 'btnCenter',
              width: 'auto',
              data: {
                title: 'Info',
                message: Response.responseMessage,
                btnYes: 'OK',
              }
            });
            dialogRef.afterClosed().subscribe(data => {
              this.router.navigate(['/roomconfig'])
            })
          } else {
            const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
              disableClose: false,
              panelClass: 'btnCenter',
              width: 'auto',
              data: {
                title: 'Alert',
                message: Response.responseMessage,
                btnYes: 'OK',
              }
            });
          }
          this.componentLoaderService.display(false);
        },
          error => {
            alert(error)
          })
      }
    }
  
}

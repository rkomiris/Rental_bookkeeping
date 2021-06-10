
import { Component, OnInit, ViewChild, ElementRef, Output, Inject } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource,VERSION, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormBuilder, FormGroup, FormArray, Validators, NgForm, Form } from '@angular/forms';
import { Router } from "@angular/router";
import { DOCUMENT } from '@angular/common';
import { RoomconfigAddService } from './roomconfig-add.service';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import { ComponentLoaderService } from '../../../shared/component-loader.service';
import * as moment from 'moment';

@Component({
  selector: 'app-roomconfig-add',
  templateUrl: './roomconfig-add.component.html',
  styleUrls: ['./roomconfig-add.component.css']
})
export class RoomconfigAddComponent implements OnInit {
  saveForm: FormGroup;
  count: number = 1;
  userBaseFieldName: any = [];
  today = new Date();
  amenityFilter : any = {};
  priorityList: any[] = [
    {id:1, value: 'Low'},
    {id:2, value:'Medium'},
    {id:3, value:'High'}

  ];
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private roomconfigAddService: RoomconfigAddService,
    private componentLoaderService: ComponentLoaderService) { }

  ngOnInit() {
    this.componentLoaderService.display(true);
    console.log("count",this.count);
   
    this.saveForm = this.formBuilder.group({
      rinRoomDetailConfigVoList: this.formBuilder.array([this.sequenceType()]),  // For Row Add and Remove
      roomConfigCode: [''],
      roomConfigRoomName: ['', Validators.required],
      roomConfigNoOfSeats: ['', Validators.required],
      id: ['', Validators.required],
      buildingName: [''],
      sublocationId : ['', Validators.required],
      isRoomConfigActive: [true],
      isRoomConfigApprovalRequired: [false, ],
      isRoomConfigUnderMaintenance: [false, ],
      fromDate : [null],
      toDate : [null],
      roomConfigPriorty:['', Validators.required]
    });

    this.roomconfigAddService.addRoomConfigDetails().subscribe(data => {
      let selectGetData = JSON.parse(data['_body']);
      this.userBaseFieldName = selectGetData.succesObject.screenFieldDisplayVoList.map(
        element => {
          console.log(element);
          return element;
        }
      );
      this.componentLoaderService.display(false);
      console.log(this.userBaseFieldName);
      console.log(this.saveForm.value);
    }, error => {
      if (error.status === 401) {
        alert("Error");
      }
    });


    this.onloadSelectboxData();
  }
  sequenceType() {
    return this.formBuilder.group({
      amenityId: ['', Validators.required],
      roomDetailNumberOfAmenities: ['', Validators.required],
      isRoomDetailConfigActive: [true, ],
    })
  }
  addSequence() {
    if (this.count <= 9) {
      console.log("count",this.count);
      (this.saveForm.controls['rinRoomDetailConfigVoList'] as FormArray).push(this.sequenceType());
      this.count++;
    }
  }
  clearForm() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => this.router.navigate(['/roomconfig/roomconfig-add']));
  }
  deleteSequence() {
    if (this.count > 1) {
      (this.saveForm.controls['rinRoomDetailConfigVoList'] as FormArray).removeAt(-1);
      this.count--;
    }
  }



RC_location_selectFormGetDate: any = [];
RC_aminite_selectFormGetDate: any = [];
RC_sublocation_selectFormGetDate: any = [];

onloadSelectboxData() {
  let loadSelectBoxList = this.roomconfigAddService.load_rcselectBoxData().subscribe(data => {
    let RC_selectGetData = JSON.parse(data['_body']);
    this.RC_location_selectFormGetDate = RC_selectGetData.succesObject;
  }, error => {
    if(error.status === 401)
    {
      alert(error);
    }
  });
  let roomConfigList = this.roomconfigAddService.roomConfigDropdown().subscribe(data => {
    let RC_selectGetData = JSON.parse(data['_body']);
    this.RC_aminite_selectFormGetDate = RC_selectGetData.succesObject;
  }, error => {
    if(error.status === 401)
    {
      alert(error);
    }
  });
}



subLocationDropDown(val) {
  let loadSelectBoxList = this.roomconfigAddService.load_subLocationselectBoxData(val).subscribe(data => {
    let RC_selectGetData = JSON.parse(data['_body']);
    this.RC_sublocation_selectFormGetDate = RC_selectGetData.succesObject;
  }, error => {
    if(error.status === 401)
    {
      alert(error);
    }
  });
}





onSubmit() {
  let formvalue = this.saveForm.value;
  console.log("save form", this.saveForm);
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
  }else if (this.saveForm.controls.isRoomConfigUnderMaintenance.value == true && fromDate === toDate && fromDateTime === toDateTime) {  
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
    // if(){
    this.componentLoaderService.display(true);
    let finalval: any = {};

    finalval = formvalue;
    finalval.screenFieldDisplayVoList = this.userBaseFieldName;
    console.log(finalval);
    this.roomconfigAddService.addProjectList(formvalue).subscribe(data => {
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
  // }
}
}



}

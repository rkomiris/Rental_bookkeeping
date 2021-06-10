import { Component, OnInit, ViewChild, ElementRef, Output, Inject } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, VERSION, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormBuilder, FormGroup, FormArray, Validators, NgForm, Form } from '@angular/forms';
import { Router } from "@angular/router";
import { RoomBookingConfigurationAddService } from '../room-booking-configuration-add/room-booking-configuration-add.service';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import { ComponentLoaderService } from '../../../shared/component-loader.service';
@Component({
  selector: 'app-room-booking-configuration-view',
  templateUrl: './room-booking-configuration-view.component.html',
  styleUrls: ['./room-booking-configuration-view.component.css']
})
export class RoomBookingConfigurationViewComponent implements OnInit {

  saveForm: FormGroup;
  count: number = 1;
  public selected: any;
  locationList: any;
  subLocationList: any;
  userDepartmentList: any;
  subLocationNameSeq_data: any = [];
  dynamicUserRoleList: any = [];
  dynamicUserList: any = [];
  roomConfigIdList : any;
  userBaseFieldName: any = [];
  subLocationListdept: any = [];

  constructor(
    private componentLoaderService: ComponentLoaderService, 
    private router: Router, 
    private formBuilder: FormBuilder, 
    private dialog: MatDialog, 
    private roomBookingConfigurationAddService: RoomBookingConfigurationAddService
  ) { }
  
  
  ngOnInit() {
    this.componentLoaderService.display(true);
    this.saveForm = this.formBuilder.group({
      roomWorkFlowSeqVoList: this.formBuilder.array([this.sequenceType()]),  // For Row Add and Remove
      roomWorkFlowCode: ['', Validators.required],
      roomConfigId: ['', Validators.required],
      workFlowLocationId: ['', Validators.required],
      workFlowSublocationId: ['', Validators.required],
      workFlowDepartmentId: ['', Validators.required],
      roomWorkFlowDescription: ['', Validators.required],
      roomWorkFlowIsMailRequired: [false, Validators.required],
      roomWorkFlowIsNotificationRequired: [false, Validators.required],
      roomWorkFlowIsMgtEscalationRequired: [false, Validators.required],
      roomWorkFlowIsActive: [true, Validators.required],
      roomWorkFlowSlaVo: this.formBuilder.array([this.seq3sla(1)]),
      allFlag : []
    });

    this.onloadDropDownData();

    const seq3Sla = (<FormArray>(
      this.saveForm.controls["roomWorkFlowSeqVoList"]
    )).at(0);
    seq3Sla["controls"].roomWorkFlowSlaVo.push(this.seq3sla(2));
    seq3Sla["controls"].roomWorkFlowSlaVo.push(this.seq3sla(3));
    (this.saveForm.controls['roomWorkFlowSlaVo'] as FormArray).push(this.seq3sla(2));
    (this.saveForm.controls['roomWorkFlowSlaVo'] as FormArray).push(this.seq3sla(3));
  }


  sequenceType() {
    return this.formBuilder.group({
      id: [''],
      sublocationId: [''],
      userDepartmentId: [''],
      userRoleId: [''],
      roomWorkFlowSeqIsActive: [true],
      userId: [''],
      roomWorkFlowSlaVo: this.formBuilder.array([this.seq3sla(1)]),
      roomWorkFlowId: [''],
      roomWorkFlowSeqId: ['']
    })
  }
  addSequence() {
    if (this.count <= 2) {
      (this.saveForm.controls['roomWorkFlowSeqVoList'] as FormArray).push(this.sequenceType());
      this.count++;
      const seq3Sla = (<FormArray>(
        this.saveForm.controls["roomWorkFlowSeqVoList"]
      )).at(this.saveForm.value.roomWorkFlowSeqVoList.length - 1);
      seq3Sla["controls"].roomWorkFlowSlaVo.push(this.seq3sla(2));
      seq3Sla["controls"].roomWorkFlowSlaVo.push(this.seq3sla(3));
    }
  }
  deleteSequence() {
    if (this.count > 1) {
      (this.saveForm.controls['roomWorkFlowSeqVoList'] as FormArray).removeAt(-1);
      this.count--;
    }
  }
  seq3sla(val) {
    return this.formBuilder.group({
      protoType: val,
      roomWorkFlowSla: [''],
      roomWorkFlowSlaType: [''],
      roomWorkFlowSlaResolution: [''],
      roomWorkFlowSlaRespond: [''],
      roomWorkFlowSlaIsActive: [true],
      roomWorkFlowId: [''],
      roomWorkFlowSeqId: [''],
      roomWorkFlowSlaId: ['']
    });
  }




  onloadDropDownData(){
    let locationListData = this.roomBookingConfigurationAddService.load_LocationData().subscribe(data => {
      let resp = JSON.parse(data['_body']);
      this.locationList = resp.succesObject;
    }, error => {
      if (error.status === 401) {
        alert("Error");
      }
    });
    let deptListData = this.roomBookingConfigurationAddService.load_DepartmentselectBoxData().subscribe(data => {
      let resp = JSON.parse(data['_body']);
      this.userDepartmentList = resp.succesObject;
    }, error => {
      if (error.status === 401) {
        alert("Error");
      }
    });
    let roomConfigList = this.roomBookingConfigurationAddService.load_RoomConfigselectBoxData().subscribe(data => {
      let resp = JSON.parse(data['_body']);
      this.roomConfigIdList = resp.succesObject;
    }, error => {
      if (error.status === 401) {
        alert("Error");
      }
    });
    let viewConfigList = this.roomBookingConfigurationAddService.viewProjectList(localStorage.getItem('roomWorkFlowId')).subscribe(data => {
      let resp = JSON.parse(data['_body']);
      let locationId = resp.succesObject[0].workFlowLocationId;

      this.userBaseFieldName = resp.succesObject[0].screenFieldDisplayVoList.map(
        element => {
          console.log(element);
          return element;
        }
      );
      console.log(this.userBaseFieldName);


      let subLocationListData = this.roomBookingConfigurationAddService.load_subLocationData(locationId).subscribe(data => {
        let resp = JSON.parse(data['_body']);
        this.subLocationList = resp.succesObject;

      }, error => {
        if (error.status === 401) {
          alert("Error");
        }
      });
      if (resp.succesObject[0].roomWorkFlowSeqVoList != null) {
      let dynamicRows = resp.succesObject[0].roomWorkFlowSeqVoList;
      for (let j = 0; j < dynamicRows.length - 1; j++) {
        this.addSequence();
      }
      for (let j = 0; j < dynamicRows.length; j++) {
        let subLocationListData = this.roomBookingConfigurationAddService.load_subLocationData(dynamicRows[j].id).subscribe(data => {
          let resp = JSON.parse(data['_body']);
          this.subLocationNameSeq_data[j] = resp.succesObject;
        }, error => {
          if (error.status === 401) {
            alert("Error");
          }
        });
        let userRoleListData = this.roomBookingConfigurationAddService.load_userRoleelectBoxData({ userDepartment: dynamicRows[j].userDepartmentId }).subscribe(data => {
          let resp = JSON.parse(data['_body']);
          this.dynamicUserRoleList[j] = resp.succesObject;
        }, error => {
          if (error.status === 401) {
            alert("Error");
          }
        });
        let excuterUSer = this.roomBookingConfigurationAddService.getUSer(dynamicRows[j].userRoleId).subscribe(data => {
          let resp = JSON.parse(data['_body']);
          this.dynamicUserList[j] = resp.succesObject;
        }, error => {
          if (error.status === 401) {
            alert("Error");
          }
        });
      }
    }
   
    if(resp.succesObject[0].roomWorkFlowSeqVoList === null){
      resp.succesObject[0].roomWorkFlowSeqVoList = [];
    }
    this.saveForm.patchValue(resp.succesObject[0]);
    if (this.saveForm.value.allFlag === true) {
      this.saveForm.patchValue({allFlag : true});
      this.saveForm.patchValue({workFlowLocationId : 0});
      this.saveForm.patchValue({workFlowSublocationId : 0});
      this.saveForm.patchValue({workFlowDepartmentId : 0});
    }
    }, error => {
      if (error.status === 401) {
        alert("Error");
      }
    });
    this.componentLoaderService.display(false);
  }




  get_subLocation(val) {
    let subLocationListData = this.roomBookingConfigurationAddService.load_subLocationData(val).subscribe(data => {
      let resp = JSON.parse(data['_body']);
      this.subLocationList = resp.succesObject;

    }, error => {
      if (error.status === 401) {
        alert("Error");
      }
    });
    this.roomBookingConfigurationAddService.load_subLocation_selectBox_Data(val).subscribe(
      data => {
        let resp = JSON.parse(data['_body']);
        this.subLocationListdept = resp.succesObject;
        console.log(this.subLocationListdept);
      },
      error => {
        alert(error);
      }
    );
  }

  

  selected_sequenceLocationType(eve, i) {
    let subLocationListData = this.roomBookingConfigurationAddService.load_subLocationData(eve).subscribe(data => {
      let resp = JSON.parse(data['_body']);
      this.subLocationNameSeq_data[i] = resp.succesObject;
    }, error => {
      if (error.status === 401) {
        alert("Error");
      }
    });
  }


  dynamicGetUSerRole(val, i) {
    let userRoleListData = this.roomBookingConfigurationAddService.load_userRoleelectBoxData({ userDepartment: val }).subscribe(data => {
      let resp = JSON.parse(data['_body']);
      this.dynamicUserRoleList[i] = resp.succesObject;
    }, error => {
      if (error.status === 401) {
        alert("Error");
      }
    });
  }


  dynamicFieldsGetUSer(val, i) {
    let excuterUSer = this.roomBookingConfigurationAddService.getUSer(val).subscribe(data => {
      let resp = JSON.parse(data['_body']);
      this.dynamicUserList[i] = resp.succesObject;
    }, error => {
      if (error.status === 401) {
        alert("Error");
      }
    });
  }




  onSubmit() {
    if (this.saveForm.valid) {
      this.roomBookingConfigurationAddService.modifyProjectList(this.saveForm.value).subscribe(data => {
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
            this.router.navigateByUrl('/room-booking-configuration');
          });
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
      },
        error => {
          if (error.status === 401) {
          }
        })
    }
    else {
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
    }
}


numberOnly(event): boolean {
  const charCode = (event.which) ? event.which : event.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    return false;
  }
  return true;
}
callflagall(f) {
  console.log(f)
  if (f.checked === true) {
    this.saveForm.patchValue({workFlowLocationId : 0});
    this.saveForm.patchValue({workFlowSublocationId : 0});
    this.saveForm.patchValue({workFlowDepartmentId : 0});
  }else{
    this.saveForm.patchValue({workFlowLocationId : ''});
    this.saveForm.patchValue({workFlowSublocationId : ''});
    this.saveForm.patchValue({workFlowDepartmentId : ''});
  }
}


}

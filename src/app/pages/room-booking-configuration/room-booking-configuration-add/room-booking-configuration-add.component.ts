import { Component, OnInit, ViewChild, ElementRef, Output, Inject } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, VERSION, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormBuilder, FormGroup, FormArray, Validators, NgForm, Form } from '@angular/forms';
import { Router } from "@angular/router";
import { RoomBookingConfigurationAddService } from './room-booking-configuration-add.service';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import { ComponentLoaderService } from '../../../shared/component-loader.service';
import { RequestWorkflowAddService } from '../../request-workflow/request-workflow-add/request-workflow-add.service';

@Component({
  selector: 'app-room-booking-configuration-add',
  templateUrl: './room-booking-configuration-add.component.html',
  styleUrls: ['./room-booking-configuration-add.component.css']
})

export class RoomBookingConfigurationAddComponent implements OnInit {
  saveForm: FormGroup;
  count: number = 1;
  public selected: any;
  locationList: any;
  subLocationList: any;
  userDepartmentList: any = [];
  dynamicuserDepartmentList : any = [];
  subLocationNameSeq_data: any = [];
  dynamicUserRoleList: any = [];
  dynamicUserList: any = [];
  roomConfigIdList : any;
  userBaseFieldName: any = [];
  qtd: any = [[], [], []];
  squExdepartmentlist: any = [];
  Pattern = '^(?:[0-9]{1,3}(?:\.[0-9]{0,2})?)$';
  userlocationFilter : any = {};
  usersublocationFilter : any = {};
  userdepartmentFilter : any = {};
  userroleFilter : any = {};
  userFilter : any = {};
  slaTypes: any[] = [
    { value: 1, viewValue: 'Hours' },
    { value: 2, viewValue: 'Day' },
  ];
  slaTypeFilter: any = [[] ,[], [], [], [], [], [], [], [], []];
  constructor(
    private router: Router, 
    private formBuilder: FormBuilder, 
    private dialog: MatDialog, 
    private roomBookingConfigurationAddService: RoomBookingConfigurationAddService,
    private componentLoaderService: ComponentLoaderService
  ) { }


  ngOnInit() {
    this.componentLoaderService.display(true);
    this.saveForm = this.formBuilder.group({
      roomWorkFlowSeqVoList: this.formBuilder.array([this.sequenceType()]),  // For Row Add and Remove
      roomWorkFlowCode: [''],
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


    this.roomBookingConfigurationAddService.addRoomBookingConfigDetails().subscribe(data => {
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


    const seq3Sla = (<FormArray>(
      this.saveForm.controls["roomWorkFlowSeqVoList"]
    )).at(0);

    seq3Sla["controls"].roomWorkFlowSlaVo.push(this.seq3sla(2));
    seq3Sla["controls"].roomWorkFlowSlaVo.push(this.seq3sla(3));
    (this.saveForm.controls['roomWorkFlowSlaVo'] as FormArray).push(this.seq3sla(2));
    (this.saveForm.controls['roomWorkFlowSlaVo'] as FormArray).push(this.seq3sla(3));
    seq3Sla["controls"].roomWorkFlowSlaVo.disable();
    this.saveForm.controls['roomWorkFlowSlaVo'].disable();
  }


  cancel() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
    this.router.navigate(['/room-booking-configuration/room-booking-configuration-add']));

  }
  sequenceType() {
    return this.formBuilder.group({
      id: [''],
      sublocationId: [''],
      userDepartmentId: [''],
      userRoleId: [''],
      roomWorkFlowSeqIsActive: [true],
      userId: [''],
      roomWorkFlowSlaVo: this.formBuilder.array([this.seq3sla(1)])
    })
  }
  addSequence() {
    if (this.count <= 2) {
      // this.qtd[this.count] = {};
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


  validateFloatKeyPress(el, i, j) {
    console.log(el, i, j);
  //  var v = parseFloat(el.value);
   // el.value = (isNaN(v)) ? '' : v.toFixed(2);
    let match = (/(\d{0,3})[^.]*((?:\.\d{0,2})?)/g).exec(this.qtd[i][j].replace(/[^\d.]/g, ''));
    console.log(match);
    el.value = match[1] + match[2];
    this.qtd[i][j] = el.value;
}


  seq3sla(val) {
    return this.formBuilder.group({
      protoType: val,
      roomWorkFlowSla: ['', Validators.required],
      roomWorkFlowSlaType: ['', Validators.required],
      roomWorkFlowSlaResolution: [''],
      roomWorkFlowSlaRespond: [''],
      roomWorkFlowSlaIsActive: [true]
    });
  }



  onloadDropDownData(){
    /* location load*/
    let locationListData = this.roomBookingConfigurationAddService.load_LocationData().subscribe(data => {
      let resp = JSON.parse(data['_body']);
      this.locationList = resp.succesObject;
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

    let deptListData = this.roomBookingConfigurationAddService.load_selectBox_subLocationData(val).subscribe(data => {
      let resp = JSON.parse(data['_body']);
      this.userDepartmentList = resp.succesObject;
    }, error => {
      if (error.status === 401) {
        alert("Error");
      }
    });
    
  }


  selected_sequenceLocationType(eve, i, form) {
    const seq3Sla = (<FormArray>(
      this.saveForm.controls["roomWorkFlowSeqVoList"]
    )).at(i);
    console.log("Form", form);
    form.controls.roomWorkFlowSeqVoList.controls[i].controls.sublocationId.reset();
    form.controls.roomWorkFlowSeqVoList.controls[i].controls.userDepartmentId.reset();
    form.controls.roomWorkFlowSeqVoList.controls[i].controls.userRoleId.reset();
    form.controls.roomWorkFlowSeqVoList.controls[i].controls.userId.reset();

    seq3Sla["controls"].roomWorkFlowSlaVo.enable();
    let subLocationListData = this.roomBookingConfigurationAddService.load_subLocationData(eve).subscribe(data => {
      let resp = JSON.parse(data['_body']);
      this.subLocationNameSeq_data[i] = resp.succesObject;
    }, error => {
      if (error.status === 401) {
        alert("Error");
      }
    });

    this.roomBookingConfigurationAddService.load_selectBox_subLocationData(eve).subscribe(
      data => {
        let resp = JSON.parse(data['_body']);
        this.dynamicuserDepartmentList[i] = resp.succesObject;
        console.log(this.userDepartmentList[i]);
      },
      error => {
        alert(error);
      }
    );
  }

  /*dynamicGetDepartment(val, i){
    this.roomBookingConfigurationAddService.load_selectBox_subLocationData(val).subscribe(
      data => {
        let resp = JSON.parse(data['_body']);
        this.userDepartmentList[i] = resp.succesObject;
        console.log(this.squExdepartmentlist[i]);
      },
      error => {
        alert(error);
      }
    );
  }*/


  dynamicGetUSerRole(val, i,form) {
    form.controls.roomWorkFlowSeqVoList.controls[i].controls.userRoleId.reset();
    form.controls.roomWorkFlowSeqVoList.controls[i].controls.userId.reset();
    let userRoleListData = this.roomBookingConfigurationAddService.load_userRoleelectBoxData({ userDepartment: val }).subscribe(data => {
      let resp = JSON.parse(data['_body']);
      this.dynamicUserRoleList[i] = resp.succesObject;
    }, error => {
      if (error.status === 401) {
        alert("Error");
      }
    });
  }


  dynamicFieldsGetUSer(val, i,form) {
    form.controls.roomWorkFlowSeqVoList.controls[i].controls.userId.reset();
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
      let formValue: any = {};
      formValue = this.saveForm.value;
      if(formValue.roomWorkFlowSeqVoList.length >= 1){
        if(formValue.roomWorkFlowSeqVoList[0].id == '') {
          formValue.roomWorkFlowSeqVoList = [];
        }
      }
      formValue.screenFieldDisplayVoList = this.userBaseFieldName;
      console.log(this.saveForm.value)
      this.roomBookingConfigurationAddService.addProjectList(formValue).subscribe(data => {
        let Response = JSON.parse(data['_body']);
        if (Response.responseCode === '200') {
          const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            disableClose: false,
            panelClass: 'btnCenter',
            width: 'auto',
            data: {
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

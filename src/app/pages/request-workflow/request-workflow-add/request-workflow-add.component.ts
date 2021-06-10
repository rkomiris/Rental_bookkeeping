
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { RequestWorkflowAddService } from './request-workflow-add.service';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import { empty } from 'rxjs';
import { ComponentLoaderService } from '../../../shared/component-loader.service';
import { JsonApiService } from 'src/assets/api/json-api.service';
export interface SLApriorityData {
  name: string;
}
@Component({
  selector: 'app-request-workflow-add',
  templateUrl: './request-workflow-add.component.html',
  styleUrls: ['./request-workflow-add.component.css']
})
export class RequestWorkflowAddComponent implements OnInit {
  labels: any = {}; /** LABEL CHANGES **/
  saveForm: FormGroup;
  count: number = 1;
  count1: number = 1;
  public selected: any;
  enablesla: Boolean;
  rwfTypes: any[] = [
    { value: 1, viewValue: 'Request' },
    { value: 2, viewValue: 'Room Booking' },
  ];
  slaTypes: any[] = [
    { value: 1, viewValue: 'Hours' },
    { value: 2, viewValue: 'Day' },
  ];
  exslaTypeFilter: any = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []
    , [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [],
    , [], [], [], [], [], [], [], , [], [], [], [], [], [], [], , [], [], [], [], [], [], [], , [], [], [], [], [], [], [], , [], [], [], [], [], [], [], , [], [], [], [], [], [], [], , [], [], [], [], [], [], [], , [], [], [], [], [], [], [], , [], [], [], [], [], [], [], , [], [], [], [], [], [], [], , [], [], [], [], [], [], [], , [], [], [], [], [], [], []];
  workflowLevelOneSlaTypeFilter: any = {};
  workflowLevelTwoSlaTypeFilter: any = {};
  seqSlaTypeFilter: any = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []
    , [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [],
    , [], [], [], [], [], [], [], , [], [], [], [], [], [], [], , [], [], [], [], [], [], [], , [], [], [], [], [], [], [], , [], [], [], [], [], [], [], , [], [], [], [], [], [], [], , [], [], [], [], [], [], [], , [], [], [], [], [], [], [], , [], [], [], [], [], [], [], , [], [], [], [], [], [], [], , [], [], [], [], [], [], [], , [], [], [], [], [], [], []];
  exlocationListFilter: any = {};
  exsublocationFilter: any = {};
  exuserDepartmentFilter: any = {};
  exuserRoleFilter: any = {};
  exuseruserFilter: any = {};
  sequserLocationFilter: any = {};
  seqsublocationFilter: any = {};
  sequserDepartmentFilter: any = {};
  sequserRoleFilter: any = {};
  sequserFilter: any = {};
  selectedListType: Boolean = undefined;
  userDepartmentList: any;
  departmentlist: any = [];
  exedepartmentlist: any = [];
  reqTypeList: any;
  reqSubTypeList: any;
  locationList: any;
  subLocationList: any;
  customlocationList: any;
  customsubLocationList: any = [];
  customdepartmentlist: any = [];
  roomConfigList: any;
  exesubLocationList: any;
  userRoleList: any;
  subLocationNameSeq_data: any = {};
  subLocationNameExSeq_data: any = [];
  squdepartmentlist: any = {};
  squExdepartmentlist: any = [];
  dynamicExUserRoleList: any = [];
  dynamicExUserList: any = [];
  isSelected: boolean = false;
  selectedList: Boolean = undefined;
  executerUserList: any;
  dynamicUserList: any = [];
  dynamicUserRoleList: any = [];
  executer: any = [];
  sequence1: any = [];
  sequence2: any = [];
  sequence3: any = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []
    , [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [],
    , [], [], [], [], [], [], [], , [], [], [], [], [], [], [], , [], [], [], [], [], [], [], , [], [], [], [], [], [], [], , [], [], [], [], [], [], [], , [], [], [], [], [], [], [], , [], [], [], [], [], [], [], , [], [], [], [], [], [], [], , [], [], [], [], [], [], [], , [], [], [], [], [], [], [], , [], [], [], [], [], [], [], , [], [], [], [], [], [], []];
  exSequence3: any = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []
    , [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [],
    , [], [], [], [], [], [], [], , [], [], [], [], [], [], [], , [], [], [], [], [], [], [], , [], [], [], [], [], [], [], , [], [], [], [], [], [], [], , [], [], [], [], [], [], [], , [], [], [], [], [], [], [], , [], [], [], [], [], [], [], , [], [], [], [], [], [], [], , [], [], [], [], [], [], [], , [], [], [], [], [], [], [], , [], [], [], [], [], [], []];
  workFlowDepartmentId = 0;
  workFlowLocationId = 0;
  workFlowSublocationId = 0;
  workflowLevelOnes: any[] = [
    { value: 1, viewValue: 'Reporting To Only' },
    { value: 2, viewValue: 'Hierarchy' },
    { value: 3, viewValue: 'Restriction Hierarchy' },
    // { value: 0, viewValue: 'None' },
  ];
  userBaseFieldName: any = [];
  defaultCommon: any = '1';
  // customActive : boolean = true;
  // customworkFlowDepartmentId : any;
  // customworkFlowSublocationId : any;
  customworkFlowLocationId: any;
  locationListFilter: any;
  subLocationFilter: any;
  departmentFilter: any;
  customActive: any;
  customCount: number = 0;
  @ViewChild('customworkFlowLocationIdInput') customworkFlowLocationIdInput: ElementRef;
  @ViewChild('customworkFlowSublocationIdInput') customworkFlowSublocationIdInput: ElementRef;
  @ViewChild('customworkFlowDepartmentIdInput') customworkFlowDepartmentIdInput: ElementRef;
  @ViewChild('customActiveInput') customActiveInput: ElementRef;
  customworkFlowSublocationId: any;
  customworkFlowDepartmentId: any;
  rwfTypeChange(data) {
    this.isSelected = true;
    if (data.value === 1) {
      this.selectedListType = true;
    } else {
      this.selectedListType = false;
    }
  }
  sequanceOne(data) {
    if (data.value === 3) {
      this.selectedList = true;
    } else {
      this.selectedList = false;
    }

    if (data.value != 0 && data.value != undefined) {
      this.saveForm.controls['seq1requestWorkFlowSlaVo'].enable();
    } else {
      this.saveForm.controls['seq1requestWorkFlowSlaVo'].disable();
    }
    if (data.value == '1') {
      this.saveForm.controls['seq2requestWorkFlowSlaVo'].enable();
    } else {
      this.saveForm.controls['seq2requestWorkFlowSlaVo'].disable();
      this.saveForm.patchValue({ reqWorkFlowSeqLevelTypeTwo: '' });
    }
  }
  workflowLevelTwos: any[] = [
    { value: 4, viewValue: 'Department Head' },
    // { value: 0, viewValue: 'None' },
  ];
  sequanceTwo(data) {
    this.isSelected = true;
    if (data.value != 0 && data.value != undefined) {
      this.saveForm.controls['seq2requestWorkFlowSlaVo'].enable();
      this.enablesla = true;
    } else {
      this.saveForm.controls['seq2requestWorkFlowSlaVo'].disable();
      this.enablesla = false;
    }
  }
  constructor(
    private jsonApiService: JsonApiService/** LABEL CHANGES **/,
    private componentLoaderService: ComponentLoaderService,
    private router: Router, private formBuilder: FormBuilder,
    private dialog: MatDialog, private requestWorkflowAddService: RequestWorkflowAddService) { }
  ngOnInit() {
    this.getLabelDetails(); /** LABEL CHANGES **/
    this.componentLoaderService.display(true);
    this.saveForm = this.formBuilder.group({
      seq1reqWorkFlowSeqIsActive: [true],
      seq2reqWorkFlowSeqIsActive: [true],
      requestWorkFlowSequenceList: this.formBuilder.array([this.sequenceType()]),
      requestWorkFlowExecuterVo: this.formBuilder.array([this.sequenceExType()]), // For Row Add and Remove
      requestWorkFlowCode: [''],
      // workFlowLocationId: [''],  --my ref
      // workFlowSublocationId: [''], --my ref
      // workFlowDepartmentId: [''],  --my ref
      requestTypeId: ['', Validators.required],
      requestSubTypeId: ['', Validators.required],
      executorWeekend: [false],
      executorHoliday: [false],
      approverWeekend: [false],
      approverHoliday: [false],
      // roomConfigId: [0, ],
      // reqWorkFlowType: ['', Validators.required],
      // executerLocationId: ['', Validators.required],
      // executerSublocationId: ['', Validators.required],
      // executerRoleId: ['', Validators.required],
      // executerDepartmentId: ['', Validators.required],
      reqWorkFlowSeqLevelTypeOne: [''],
      reqWorkFlowSeqLevelTypeTwo: [''],
      // executerSla: ['', Validators.required],
      // executerSlaType: ['', Validators.required],
      // seq1reqWorkFlowSeqSla: [''],
      // seq1reqWorkFlowSeqSlaType: [''],
      // seq2reqWorkFlowSeqSla: [''],
      // seq2reqWorkFlowSeqSlaType: [''],
      // executerUserId: [0],
      // reqWorkFlowSeqSequence: ['', Validators.required],
      // reqWorkFlowSeqLevelType: ['', Validators.required],
      reqWorkFlowSeqLevelhierarchy: [''],
      reqWorkFlowIsActive: [true],
      // allFlag: [false],
      reqWorkFlowReassign: [false],
      reqWorkFlowDescription: ['', Validators.required],
      reqWorkFlowIsMailRequired: [false],
      reqWorkFlowIsNotificationRequired: [true],
      reqWorkFlowIsMgtEscalationRequired: [false],
      requestWorkFlowSlaVo: this.formBuilder.array([this.executerSla(1)]),
      seq1requestWorkFlowSlaVo: this.formBuilder.array([this.seq1Sla(1)]),
      seq2requestWorkFlowSlaVo: this.formBuilder.array([this.seq2Sla(1)]),
      slaConfigure: [false],
      requestWorkFlowDetailsVoList: this.formBuilder.array([])
    });
    this.onloadSelectboxData();
    (this.saveForm.controls['requestWorkFlowSlaVo'] as FormArray).push(this.executerSla(2));
    (this.saveForm.controls['requestWorkFlowSlaVo'] as FormArray).push(this.executerSla(3));
    (this.saveForm.controls['seq1requestWorkFlowSlaVo'] as FormArray).push(this.seq1Sla(2));
    (this.saveForm.controls['seq1requestWorkFlowSlaVo'] as FormArray).push(this.seq1Sla(3));
    (this.saveForm.controls['seq2requestWorkFlowSlaVo'] as FormArray).push(this.seq2Sla(2));
    (this.saveForm.controls['seq2requestWorkFlowSlaVo'] as FormArray).push(this.seq2Sla(3));
    const seq3Sla = (<FormArray>(
      this.saveForm.controls["requestWorkFlowSequenceList"]
    )).at(0);
    const seqExSla = (<FormArray>(
      this.saveForm.controls["requestWorkFlowExecuterVo"]
    )).at(0);
    seqExSla["controls"].requestWorkFlowSlaVo.push(this.seq3sla(2));
    seqExSla["controls"].requestWorkFlowSlaVo.push(this.seq3sla(3));
    seq3Sla["controls"].requestWorkFlowSlaVo.push(this.seq3sla(2));
    seq3Sla["controls"].requestWorkFlowSlaVo.push(this.seq3sla(3));
    this.saveForm.controls['seq1requestWorkFlowSlaVo'].disable();
    this.saveForm.controls['seq2requestWorkFlowSlaVo'].disable();
    seq3Sla["controls"].requestWorkFlowSlaVo.disable();
    if (this.defaultCommon == '0') {
      seqExSla["controls"].requestWorkFlowSlaVo.disable();
    }

  }
  validateFloatKeyPressexecuter(el, j) {
    let match = (/(\d{0,3})[^.]*((?:\.\d{0,2})?)/g).exec(this.executer[j].replace(/[^\d.]/g, ''));
    el.value = match[1] + match[2];
    this.executer[j] = el.value;
  }
  customrequestWorkFlowDetailsVoList(locationId, subLocationId, refdepartmentId, isActive, currrentRow) {

    this.allFlag = false;
    let departmentId: any = [];
    for (let i = 0; i < refdepartmentId.length; i++) {
      if (refdepartmentId[i] == 0) {
        departmentId.push(refdepartmentId[i]);
      }
      else if (refdepartmentId[i] !== 0 && departmentId[0] != 0) {
        departmentId.push(refdepartmentId[i]);
      }
    }

    if (locationId != undefined && subLocationId != undefined && departmentId != undefined) {
      if (this.saveForm.value.requestWorkFlowDetailsVoList.length === 0) {
        departmentId.forEach(element => {
          let row = this.formBuilder.group({
            workFlowLocationId: [locationId],
            workFlowSublocationId: [subLocationId],
            workFlowDepartmentId: [element],
            reqWorkFlowDetailsIsActive: [isActive._checked]
          });
          (this.saveForm.controls['requestWorkFlowDetailsVoList'] as FormArray).push(row);
        });
        for (let i = 0; i < departmentId.length; i++) {
          let j = currrentRow + i;
          let subLocationListData = this.requestWorkflowAddService.load_subLocationData(locationId).subscribe(data => {
            let resp = JSON.parse(data['_body']);
            this.customsubLocationList[j] = resp.succesObject;

          }, error => {
            if (error.status === 401) {
              console.log("Error");
            }
          });
          this.requestWorkflowAddService.getDept(subLocationId, locationId).subscribe(
            data => {
              let resp = JSON.parse(data['_body']);
              this.customdepartmentlist[j] = resp.succesObject;
            },
            error => {
              console.log(error);
            });
        }
        this.customworkFlowLocationIdInput['value'] = undefined;
        this.customworkFlowSublocationIdInput['value'] = undefined;
        this.customworkFlowDepartmentIdInput['value'] = undefined;
        this.customActiveInput['_checked'] = true;
        this.subLocationList = [];
        this.departmentlist = [];
        this.customworkFlowSublocationId = undefined;
        this.customworkFlowDepartmentId = undefined;
      } else if (this.saveForm.value.requestWorkFlowDetailsVoList.length >= 1) {

        departmentId.forEach(element => {
          let row = this.formBuilder.group({
            workFlowLocationId: [locationId],
            workFlowSublocationId: [subLocationId],
            workFlowDepartmentId: [element],
            reqWorkFlowDetailsIsActive: [isActive._checked]
          });
          (this.saveForm.controls['requestWorkFlowDetailsVoList'] as FormArray).push(row);
        });
        for (let i = 0; i < departmentId.length; i++) {
          let j = currrentRow + i;
          let subLocationListData = this.requestWorkflowAddService.load_subLocationData(locationId).subscribe(data => {
            let resp = JSON.parse(data['_body']);
            this.customsubLocationList[j] = resp.succesObject;

          }, error => {
            if (error.status === 401) {
              console.log("Error");
            }
          });
          this.requestWorkflowAddService.getDept(subLocationId, locationId).subscribe(
            data => {
              let resp = JSON.parse(data['_body']);
              this.customdepartmentlist[j] = resp.succesObject;
            },
            error => {
              console.log(error);
            });
        }
        this.customworkFlowLocationIdInput['value'] = undefined;
        this.customworkFlowSublocationIdInput['value'] = undefined;
        this.customworkFlowDepartmentIdInput['value'] = undefined;
        this.customActiveInput['_checked'] = true;
        this.subLocationList = [];
        this.departmentlist = [];
        this.customworkFlowSublocationId = undefined;
        this.customworkFlowDepartmentId = undefined;
        //   } else {
        //     const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        //       disableClose: false,
        //       panelClass: 'btnCenter',
        //       width: 'auto',
        //       data: {
        //         title: 'Alert',
        //         server: 'servermessage',
        //         message: resp.responseMessage,
        //         btnYes: 'OK',
        //       }
        //     });
        //   }
        // }, error => {
        //   if (error.status === 401) {
        //     console.log("Error");
        //   }
        // });
      }
    } else {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        panelClass: 'btnCenter',
        width: 'auto',
        data: {
          title: 'Alert',
          message: "locSubDept",
          btnYes: 'OK',
        }
      });
    }
    setTimeout(() => {
      locationId = undefined;
      subLocationId = undefined
      departmentId = undefined
      isActive = undefined

    }, 1000);
  }
  removecustomrequestWorkFlowDetailsVoList(i) {
    if (this.saveForm.value.requestWorkFlowDetailsVoList.length > 0) {
      (this.saveForm.controls['requestWorkFlowDetailsVoList'] as FormArray).removeAt(i);
      this.customsubLocationList.splice(i, 1);
      this.customdepartmentlist.splice(i, 1);
    }
  }
  validateFloatKeyPresssequence1(el, j) {
    let match = (/(\d{0,3})[^.]*((?:\.\d{0,2})?)/g).exec(this.sequence1[j].replace(/[^\d.]/g, ''));
    el.value = match[1] + match[2];
    this.sequence1[j] = el.value;
  }
  validateFloatKeyPresssequence2(el, j) {
    let match = (/(\d{0,3})[^.]*((?:\.\d{0,2})?)/g).exec(this.sequence2[j].replace(/[^\d.]/g, ''));
    el.value = match[1] + match[2];
    this.sequence2[j] = el.value;
  }
  validateFloatKeyPress(el, i, j) {
    let match = (/(\d{0,3})[^.]*((?:\.\d{0,2})?)/g).exec(this.sequence3[i][j].replace(/[^\d.]/g, ''));
    el.value = match[1] + match[2];
    this.sequence3[i][j] = el.value;
  }
  validateExFloatKeyPress(el, i, j) {
    let match = (/(\d{0,3})[^.]*((?:\.\d{0,2})?)/g).exec(this.exSequence3[i][j].replace(/[^\d.]/g, ''));
    el.value = match[1] + match[2];
    this.exSequence3[i][j] = el.value;
  }
  callflagall(f) {
    if (this.saveForm.value.allFlag === true) {
      // this.saveForm.value.workFlowLocationId = 0;
      //  this.saveForm.value.workFlowSublocationId = 0;
      //  this.saveForm.value.workFlowDepartmentId = 0;
      this.workFlowLocationId = 0;
      this.workFlowSublocationId = 0;
      this.workFlowDepartmentId = 0;
    }
    /* if (this.saveForm.value.allFlag === true) {
       this.saveForm = this.formBuilder.group({
         workFlowLocationId: ['' , Validators.required],
         workFlowSublocationId: ['' , Validators.required],
         workFlowDepartmentId: ['' , Validators.required],
       });
     }*/

  }

  seq3sla(val) {
    return this.formBuilder.group({
      type: 1,
      protoType: val,
      reqWorkFlowSla: [''],
      reqWorkFlowSlaType: [''],
      reqWorkFlowSlaIsActive: [true]
    });
  }
  seq2Sla(val) {
    return this.formBuilder.group({
      type: 1,
      protoType: val,
      reqWorkFlowSla: [''],
      reqWorkFlowSlaType: [''],
      reqWorkFlowSlaIsActive: [true]
    });
  }
  seq1Sla(val) {
    return this.formBuilder.group({
      type: 1,
      protoType: val,
      reqWorkFlowSla: ['', Validators.required],
      reqWorkFlowSlaType: ['', Validators.required],
      reqWorkFlowSlaIsActive: [true]
    });
  }
  executerSla(val) {
    return this.formBuilder.group({
      type: 2,
      protoType: val,
      reqWorkFlowSla: ['', Validators.required],
      reqWorkFlowSlaType: ['', Validators.required],
      reqWorkFlowSlaIsActive: [true]
    });
  }
  sequenceType() {
    return this.formBuilder.group({
      locationId: [''],
      sublocationId: [''],
      userDepartmentId: [''],
      userRoleId: [''],
      reqWorkFlowSeqLevelType: [''],
      reqWorkFlowSeqLevelhierarchy: [0],
      reqWorkFlowSeqIsActive: [true],
      userId: [0],
      requestWorkFlowSlaVo: this.formBuilder.array([this.seq3sla(1)])
    })
  }
  sequenceExType() {
    return this.formBuilder.group({
      executerLocationId: [''],
      executerSublocationId: [''],
      executerRoleId: [''],
      executerDepartmentId: [''],
      executerUserId: [0],
      requestWorkFlowSlaVo: this.formBuilder.array([this.seq3sla(1)])
    })
  }
  addSequence() {
    if (this.count <= 100) {
      (this.saveForm.controls['requestWorkFlowSequenceList'] as FormArray).push(this.sequenceType());
      let userRoleListData = this.requestWorkflowAddService.load_userRoleelectBoxData({}).subscribe(data => {
        let resp = JSON.parse(data['_body']);
        this.dynamicExGetUSerRole[this.count] = resp.succesObject;
      }, error => {
        if (error.status === 401) {
          console.log("Error");
        }
      });
      this.count++;
      const seq3Sla = (<FormArray>(
        this.saveForm.controls["requestWorkFlowSequenceList"]
      )).at(this.saveForm.value.requestWorkFlowSequenceList.length - 1);
      seq3Sla["controls"].requestWorkFlowSlaVo.push(this.seq3sla(2));
      seq3Sla["controls"].requestWorkFlowSlaVo.push(this.seq3sla(3));
    }
  }
  deleteSequence() {
    if (this.count > 1) {
      (this.saveForm.controls['requestWorkFlowSequenceList'] as FormArray).removeAt(-1);
      this.count--;
    }
  }
  addExSequence() {


    if (this.count1 <= 100) {
      (this.saveForm.controls['requestWorkFlowExecuterVo'] as FormArray).push(this.sequenceExType());
      this.count1++;
      const seq3Sla = (<FormArray>(
        this.saveForm.controls["requestWorkFlowExecuterVo"]
      )).at(this.saveForm.value.requestWorkFlowExecuterVo.length - 1);
      seq3Sla["controls"].requestWorkFlowSlaVo.push(this.seq3sla(2));
      seq3Sla["controls"].requestWorkFlowSlaVo.push(this.seq3sla(3));
      if (this.defaultCommon == '1') {
        const seqExSla = (<FormArray>(
          this.saveForm.controls["requestWorkFlowExecuterVo"]
        )).at(this.saveForm.value.requestWorkFlowExecuterVo.length - 1);
        // seqExSla["controls"].requestWorkFlowSlaVo.disable();
      }
      let userRoleListData = this.requestWorkflowAddService.load_userRoleelectBoxData({}).subscribe(data => {
        let resp = JSON.parse(data['_body']);
        this.dynamicExUserRoleList[this.count1 - 1] = resp.succesObject;
      }, error => {
        if (error.status === 401) {
          console.log("Error");
        }
      });
      let excuterUSer = this.requestWorkflowAddService.getUSer({}).subscribe(data => {
        let resp = JSON.parse(data['_body']);
        this.dynamicExUserList[this.count1 - 1] = resp.succesObject;
      }, error => {
        if (error.status === 401) {
          console.log("Error");
        }
      });
    }
  }
  deleteExSequence(i) {
    if (this.count1 > 1) {
      (this.saveForm.controls['requestWorkFlowExecuterVo'] as FormArray).removeAt(i);
      this.count1--;
    }
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  clearForm() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => this.router.navigate(['/request-configuration/request-configuration-add']));
  }
  onloadSelectboxData() {
    /********** ADD *************/
    this.requestWorkflowAddService.addscreen().subscribe(data => {
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
    /********** Location *************/
    let locationListData = this.requestWorkflowAddService.load_LocationData().subscribe(data => {
      let resp = JSON.parse(data['_body']);
      this.locationList = resp.succesObject;

      this.customlocationList = resp.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
    /********** Department *************/
    // let deptListData = this.requestWorkflowAddService.load_DepartmentselectBoxData().subscribe(data => {
    //   let resp = JSON.parse(data['_body']);
    //   this.userDepartmentList = resp.succesObject;
    // }, error => {
    //   if (error.status === 401) {
    //     console.log("Error");
    //   }
    // });
    /********** reuest type *************/
    let reqListData = this.requestWorkflowAddService.load_reqtypeList().subscribe(data => {
      let resp = JSON.parse(data['_body']);
      this.reqTypeList = resp.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
    /********** User Role *************/
    let userRoleListData = this.requestWorkflowAddService.load_userRoleelectBoxData({}).subscribe(data => {
      let resp = JSON.parse(data['_body']);
      this.dynamicExUserRoleList[this.count1 - 1] = resp.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
    /********** User *************/
    let excuterUSer = this.requestWorkflowAddService.getUSer({}).subscribe(data => {
      let resp = JSON.parse(data['_body']);
      this.dynamicExUserList[this.count1 - 1] = resp.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
  }

  executerGetUSerRole(id) {
    let userRoleListData = this.requestWorkflowAddService.load_userRoleelectBoxData({ userDepartment: id }).subscribe(data => {
      let resp = JSON.parse(data['_body']);
      this.userRoleList = resp.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
  }

  get_subLocation(val) {
    let subLocationListData = this.requestWorkflowAddService.load_subLocationData(val).subscribe(data => {
      let resp = JSON.parse(data['_body']);
      this.subLocationList = resp.succesObject;

    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
  }
  get_Dept(val, locationId) {
    this.requestWorkflowAddService.getDept(val, locationId).subscribe(
      data => {
        let resp = JSON.parse(data['_body']);
        this.departmentlist = resp.succesObject;
      },
      error => {
        console.log(error);
      }
    );
  }
  /*********** Request Subtype **********/
  selectedRequestType(val) {
    let subLocationListData = this.requestWorkflowAddService.load_selectBox_subTypeData(val).subscribe(data => {
      let resp = JSON.parse(data['_body']);
      this.reqSubTypeList = resp.succesObject;

    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
  }
  selected_executerLocationType(val) {
    let subLocationListData = this.requestWorkflowAddService.load_subLocationData(val).subscribe(data => {
      let resp = JSON.parse(data['_body']);
      this.exesubLocationList = resp.succesObject;

    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
    this.requestWorkflowAddService.load_selectBox_subLocationData(val).subscribe(
      data => {
        let resp = JSON.parse(data['_body']);
        this.exedepartmentlist = resp.succesObject;
      },
      error => {
        console.log(error);
      }
    );
  }
  selected_sequenceLocationType(eve, i) {
    let subLocationListData = this.requestWorkflowAddService.load_subLocationData(eve).subscribe(data => {
      let resp = JSON.parse(data['_body']);
      this.subLocationNameSeq_data[i] = resp.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
    if (eve != null || eve != '') {
      const seq3Sla = (<FormArray>(
        this.saveForm.controls["requestWorkFlowSequenceList"]
      )).at(i);
      seq3Sla["controls"].requestWorkFlowSlaVo.enable();
    } else {
      const seq3Sla = (<FormArray>(
        this.saveForm.controls["requestWorkFlowSequenceList"]
      )).at(i);
      seq3Sla["controls"].requestWorkFlowSlaVo.disable();
    }
  }
  selected_sequenceSubLocationType(eve, i, row) {
    this.requestWorkflowAddService.getSeqDepartment(eve, row.value.id).subscribe(
      data => {
        let resp = JSON.parse(data['_body']);
        this.squdepartmentlist[i] = resp.succesObject;
      },
      error => {
        console.log(error);
      }
    );
  }
  onSubmit() {
    let seq1Exist: boolean;
    let seq2Exist: boolean;
    this.saveForm.controls["requestWorkFlowSlaVo"].disable();
    if (this.saveForm.valid) {
      this.componentLoaderService.display(true);

      if (this.saveForm.value.reqWorkFlowSeqLevelTypeTwo == 4) {
        let val = {
          locationId: 0,
          sublocationId: 0,
          userDepartmentId: 0,
          userRoleId: 0,
          // reqWorkFlowSeqSla: this.saveForm.value.seq2reqWorkFlowSeqSla,
          // reqWorkFlowSeqSlaType: this.saveForm.value.seq2reqWorkFlowSeqSlaType,
          reqWorkFlowSeqLevelType: this.saveForm.value.reqWorkFlowSeqLevelTypeTwo,
          reqWorkFlowSeqLevelhierarchy: 0,
          reqWorkFlowSeqIsActive: true,
          requestWorkFlowSlaVo: this.saveForm.value.seq2requestWorkFlowSlaVo
        }
        this.saveForm.value.requestWorkFlowSequenceList.unshift(val);
        seq2Exist = true;
      }
      if (this.saveForm.value.reqWorkFlowSeqLevelTypeOne == 1 || this.saveForm.value.reqWorkFlowSeqLevelTypeOne == 2) {
        let val = {
          locationId: 0,
          sublocationId: 0,
          userDepartmentId: 0,
          userRoleId: 0,
          // reqWorkFlowSeqSla: this.saveForm.value.seq1reqWorkFlowSeqSla,
          // reqWorkFlowSeqSlaType: this.saveForm.value.seq1reqWorkFlowSeqSlaType,
          reqWorkFlowSeqLevelType: this.saveForm.value.reqWorkFlowSeqLevelTypeOne,
          reqWorkFlowSeqLevelhierarchy: 0,
          reqWorkFlowSeqIsActive: true,
          requestWorkFlowSlaVo: this.saveForm.value.seq1requestWorkFlowSlaVo
        }
        this.saveForm.value.requestWorkFlowSequenceList.unshift(val);
        seq1Exist = true;
      }
      else if (this.saveForm.value.reqWorkFlowSeqLevelTypeOne == 3) {
        let val = {
          locationId: 0,
          sublocationId: 0,
          userDepartmentId: 0,
          userRoleId: 0,
          // reqWorkFlowSeqSla: this.saveForm.value.seq1reqWorkFlowSeqSla,
          // reqWorkFlowSeqSlaType: this.saveForm.value.seq1reqWorkFlowSeqSlaType,
          reqWorkFlowSeqLevelType: this.saveForm.value.reqWorkFlowSeqLevelTypeOne,
          reqWorkFlowSeqLevelhierarchy: this.saveForm.value.reqWorkFlowSeqLevelhierarchy,
          reqWorkFlowSeqIsActive: true,
          requestWorkFlowSlaVo: this.saveForm.value.seq1requestWorkFlowSlaVo
        }
        this.saveForm.value.requestWorkFlowSequenceList.unshift(val);
        seq1Exist = true;
      }

      for (let i = 0; i < this.saveForm.value.requestWorkFlowSequenceList.length; i++) {
        this.saveForm.value.requestWorkFlowSequenceList[i].reqWorkFlowSeqSequence = i + 1;
      }
      for (let i = 0; i < this.saveForm.value.requestWorkFlowSequenceList.length; i++) {
        if (this.saveForm.value.requestWorkFlowSequenceList[i].requestWorkFlowSlaVo === undefined) {
          this.saveForm.value.requestWorkFlowSequenceList.splice(i, 1);
        }
      }
      this.saveForm.value.seq1requestWorkFlowSlaVo = undefined;
      this.saveForm.value.seq2requestWorkFlowSlaVo = undefined;
      this.saveForm.value.screenFieldDisplayVoList = this.userBaseFieldName;
      if (this.defaultCommon == '1' && this.saveForm.value.requestWorkFlowExecuterVo.length > 1) {
        let requestWorkFlowSlaVo = this.saveForm.value.requestWorkFlowExecuterVo[0].requestWorkFlowSlaVo;
        for (let i = 0; i < this.saveForm.value.requestWorkFlowExecuterVo.length; i++) {
          this.saveForm.value.requestWorkFlowExecuterVo[i].requestWorkFlowSlaVo = requestWorkFlowSlaVo;
        }
      }
      this.saveForm.value.slaConfigure = this.defaultCommon;
      if (this.saveForm.value.requestWorkFlowExecuterVo[0].executerDepartmentId == '' &&
        this.saveForm.value.requestWorkFlowExecuterVo[0].executerUserId == '0' &&
        this.saveForm.value.requestWorkFlowExecuterVo[0].executerSublocationId == '' &&
        this.saveForm.value.requestWorkFlowExecuterVo[0].executerRoleId == '' &&
        this.saveForm.value.requestWorkFlowExecuterVo[0].executerLocationId == ''
      ) {
        this.saveForm.value.requestWorkFlowExecuterVo = []
      }
      this.requestWorkflowAddService.addProjectList(this.saveForm.value).subscribe(data => {
        let Response = JSON.parse(data['_body']);
        if (Response.responseCode === '200') {
          const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            disableClose: false,
            panelClass: 'btnCenter',
            width: 'auto',
            data: {
              title: 'Info',
              server: 'servermessage',
              message: Response.responseMessage,
              btnYes: 'OK',
            }
          });
          dialogRef.afterClosed().subscribe(data => {
            this.router.navigateByUrl('/request-configuration');
          });
        } else {
          const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            disableClose: false,
            panelClass: 'btnCenter',
            width: 'auto',
            data: {
              title: 'Alert',
              server: 'servermessage',
              message: Response.responseMessage,
              btnYes: 'OK',
            }
          });
          if (seq1Exist === true && seq2Exist === true) {
            this.saveForm.value.requestWorkFlowSequenceList.splice(0, 2);
          }
          if (seq1Exist === true && seq2Exist === undefined) {
            this.saveForm.value.requestWorkFlowSequenceList.splice(0, 1);
          }
        }
        this.componentLoaderService.display(false);
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
          message: "mandatory",
          btnYes: 'OK',
        }
      });
    }
  }
  executerGetUSer(val) {
    let excuterUSer = this.requestWorkflowAddService.getUSer({ "userRole": val }).subscribe(data => {
      let resp = JSON.parse(data['_body']);
      this.executerUserList = resp.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
  }
  dynamicGetUSerRole(val, i, row) {
    let userRoleListData = this.requestWorkflowAddService.load_userRoleelectBoxData({ userDepartment: val, userLocation: row.value.id, sublocationId: row.value.sublocationId }).subscribe(data => {
      let resp = JSON.parse(data['_body']);
      this.dynamicUserRoleList[i] = resp.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
  }
  dynamicFieldsGetUSer(val, i) {
    let excuterUSer = this.requestWorkflowAddService.getUSer({ "userRole": val }).subscribe(data => {
      let resp = JSON.parse(data['_body']);
      this.dynamicUserList[i] = resp.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
  }
  selected_ExsequenceLocationType(eve, i, form) {
    form.controls.requestWorkFlowExecuterVo.controls[i].controls.executerSublocationId.reset();
    form.controls.requestWorkFlowExecuterVo.controls[i].controls.executerDepartmentId.reset();
    form.controls.requestWorkFlowExecuterVo.controls[i].controls.executerRoleId.reset();
    form.controls.requestWorkFlowExecuterVo.controls[i].controls.executerUserId.reset();
    this.subLocationNameExSeq_data[i] = [];
    this.squExdepartmentlist[i] = [];
    this.dynamicExUserRoleList[i] = [];
    this.dynamicExUserList[i] = [];

    let subLocationListData = this.requestWorkflowAddService.load_subLocationData(eve).subscribe(data => {
      let resp = JSON.parse(data['_body']);
      this.subLocationNameExSeq_data[i] = resp.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
    if (this.defaultCommon == '0') {
      if (eve != null || eve != '') {
        const seq3Sla = (<FormArray>(
          this.saveForm.controls["requestWorkFlowExecuterVo"]
        )).at(i);
        seq3Sla["controls"].requestWorkFlowSlaVo.enable();
      } else {
        const seq3Sla = (<FormArray>(
          this.saveForm.controls["requestWorkFlowExecuterVo"]
        )).at(i);
        seq3Sla["controls"].requestWorkFlowSlaVo.disable();
      }
    }
    let userRoleListData = this.requestWorkflowAddService.load_userRoleelectBoxData({ userLocation: eve }).subscribe(data => {
      let resp = JSON.parse(data['_body']);
      this.dynamicExUserRoleList[i] = resp.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
    let excuterUSer = this.requestWorkflowAddService.getUSer({ userLocation: eve }).subscribe(data => {
      let resp = JSON.parse(data['_body']);
      this.dynamicExUserList[i] = resp.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
  }
  selected_ExsequencesubLocationType(eve, i, Row, form) {

    form.controls.requestWorkFlowExecuterVo.controls[i].controls.executerDepartmentId.reset();
    form.controls.requestWorkFlowExecuterVo.controls[i].controls.executerRoleId.reset();
    form.controls.requestWorkFlowExecuterVo.controls[i].controls.executerUserId.reset();
    this.squExdepartmentlist[i] = [];
    this.dynamicExUserRoleList[i] = [];
    this.dynamicExUserList[i] = [];

    this.requestWorkflowAddService.load_ExselectBox_subLocationData({ userLocation: Row.value.executerLocationId, sublocationId: eve }).subscribe(
      data => {
        let resp = JSON.parse(data['_body']);
        this.squExdepartmentlist[i] = resp.succesObject;
      },
      error => {
        console.log(error);
      }
    );
    let userRoleListData = this.requestWorkflowAddService.load_userRoleelectBoxData({ userLocation: Row.value.executerLocationId, sublocationId: eve }).subscribe(data => {
      let resp = JSON.parse(data['_body']);
      this.dynamicExUserRoleList[i] = resp.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
    let excuterUSer = this.requestWorkflowAddService.getUSer({ userLocation: Row.value.executerLocationId, sublocationId: eve }).subscribe(data => {
      let resp = JSON.parse(data['_body']);
      this.dynamicExUserList[i] = resp.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
  }
  dynamicExGetUSerRole(val, i, form, Row) {
    form.controls.requestWorkFlowExecuterVo.controls[i].controls.executerRoleId.reset();
    form.controls.requestWorkFlowExecuterVo.controls[i].controls.executerUserId.reset();
    this.dynamicExUserRoleList[i] = [];
    this.dynamicExUserList[i] = [];
    let userRoleListData = this.requestWorkflowAddService.load_userRoleelectBoxData({ userLocation: Row.value.executerLocationId, sublocationId: Row.value.executerSublocationId, userDepartment: val }).subscribe(data => {
      let resp = JSON.parse(data['_body']);
      this.dynamicExUserRoleList[i] = resp.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
    let excuterUSer = this.requestWorkflowAddService.getUSer({ userLocation: Row.value.executerLocationId, sublocationId: Row.value.executerSublocationId, userDepartment: val }).subscribe(data => {
      let resp = JSON.parse(data['_body']);
      this.dynamicExUserList[i] = resp.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
  }
  dynamicExFieldsGetUSer(val, i, form) {
    form.controls.requestWorkFlowExecuterVo.controls[i].controls.executerUserId.reset();
    this.dynamicExUserList[i] = [];
    let excuterUSer = this.requestWorkflowAddService.getUSer({ "userRole": val }).subscribe(data => {
      let resp = JSON.parse(data['_body']);
      this.dynamicExUserList[i] = resp.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
  }



  slideToggle(event) {
    if (event.checked === false) {
      this.defaultCommon = '1';
    } else if (event.checked === true) {
      this.defaultCommon = '0';
    }
  }
  /** LABEL CHANGES **/
  getLabelDetails() {
    let lang;
    if (localStorage.getItem('langCode') !== null) {
      lang = localStorage.getItem('langCode');
    }
    this.jsonApiService.fetch('/' + lang + '.json').subscribe((data) => {
      this.labels = data;
    });
  }

  allFlag: boolean = false;
  ev(eve) {
    this.allFlag = false;
    eve.value.forEach(data => {
      if (data == 0) {
        this.allFlag = true
      }
    })
  }
}


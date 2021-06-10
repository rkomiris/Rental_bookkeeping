
import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, VERSION, MatDialog, MatDialogRef, MAT_DIALOG_DATA, PageEvent } from '@angular/material';
import { FormControl, FormBuilder, FormGroup, FormArray, Validators, NgForm, Form } from '@angular/forms';
import { Router } from "@angular/router";
import { DOCUMENT } from '@angular/common';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import { RequestWorkflowAddService } from '../request-workflow-add/request-workflow-add.service';
import { ComponentLoaderService } from '../../../shared/component-loader.service';
import { JsonApiService } from 'src/assets/api/json-api.service';
import { RequestWorkflowModifyService } from '../request-workflow-modify/request-workflow-modify.service';
@Component({
  selector: 'app-request-workflow-view',
  templateUrl: './request-workflow-view.component.html',
  styleUrls: ['./request-workflow-view.component.css']
})
export class RequestWorkflowViewComponent implements OnInit, OnDestroy {
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
  selectedListType: Boolean;
  userDepartmentList: any;
  reqTypeList: any;
  departmentlist: any = [];
  reqSubTypeList: any;
  locationList: any;
  subLocationList: any;
  roomConfigList: any;
  exesubLocationList: any;
  userRoleList: any;
  subLocationNameSeq_data: any = {};
  dynamicUserList: any = [];
  executerUserList: any;
  sequances: any;
  dynamicUserRoleList: any = [];
  executer: any = [];
  sequence1: any = [];
  sequence2: any = [];
  userBaseFieldName: any = [];
  exedepartmentlist: any = [];
  squdepartmentlist: any = {};
  sequence3: any = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []
    , [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [],
    , [], [], [], [], [], [], [], , [], [], [], [], [], [], [], , [], [], [], [], [], [], [], , [], [], [], [], [], [], [], , [], [], [], [], [], [], [], , [], [], [], [], [], [], [], , [], [], [], [], [], [], [], , [], [], [], [], [], [], [], , [], [], [], [], [], [], [], , [], [], [], [], [], [], [], , [], [], [], [], [], [], [], , [], [], [], [], [], [], []];
  exSequence3: any = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []
    , [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [],
    , [], [], [], [], [], [], [], , [], [], [], [], [], [], [], , [], [], [], [], [], [], [], , [], [], [], [], [], [], [], , [], [], [], [], [], [], [], , [], [], [], [], [], [], [], , [], [], [], [], [], [], [], , [], [], [], [], [], [], [], , [], [], [], [], [], [], [], , [], [], [], [], [], [], [], , [], [], [], [], [], [], [], , [], [], [], [], [], [], []];
  workFlowDepartmentId = 0;
  workFlowSublocationId = 0;
  workFlowLocationId = 0;
  subLocationNameExSeq_data: any = [];
  squExdepartmentlist: any = [];
  dynamicExUserRoleList: any = [];
  dynamicExUserList: any;
  defaultCommon: any = '1';
  customlocationList: any;
  customsubLocationList: any = [];
  customdepartmentlist: any = [];
  customworkFlowSublocationId: any;
  customworkFlowDepartmentId: any;
  staticuserRoleList: any;
  customworkFlowLocationId: any;
  locationListFilter: any;
  subLocationFilter: any;
  departmentFilter: any;
  customActive: any;
  lowValue: number = 0;
  highValue: number = 5;
  highValueDetailList: number = 5;
  lowValueDetailList: number = 0;
  @ViewChild('customworkFlowLocationIdInput') customworkFlowLocationIdInput: ElementRef;
  @ViewChild('customworkFlowSublocationIdInput') customworkFlowSublocationIdInput: ElementRef;
  @ViewChild('customworkFlowDepartmentIdInput') customworkFlowDepartmentIdInput: ElementRef;
  @ViewChild('customActiveInput') customActiveInput: ElementRef;
  rwfTypeChange(data) {
    this.isSelected = true;
    if (data.value === 1) {
      this.selectedListType = true;
    } else {
      this.selectedListType = false;
    }
  }
  workflowLevelOnes: any[] = [
    { value: 1, viewValue: 'Reporting To Only' },
    { value: 2, viewValue: 'Hierarchy' },
    { value: 3, viewValue: 'Restriction Hierarchy' },
    { value: 0, viewValue: 'None' },
  ];
  isSelected: boolean = false;
  selectedList: Boolean = undefined;
  modifyData;
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
    { value: 0, viewValue: 'None' },
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
    private dialog: MatDialog, private requestWorkflowModifyService: RequestWorkflowModifyService,
    private requestWorkflowAddService: RequestWorkflowAddService) { }
  ngOnInit() {
    this.getLabelDetails(); /** LABEL CHANGES **/
    this.componentLoaderService.display(true);
    this.saveForm = this.formBuilder.group({
      seq1reqWorkFlowSeqIsActive: [],
      seq2reqWorkFlowSeqIsActive: [],
      requestWorkFlowSequenceList: this.formBuilder.array([this.sequenceType()]),  // For Row Add and Remove
      requestWorkFlowExecuterVo: this.formBuilder.array([this.sequenceExType()]),
      requestWorkFlowCode: [''],
      // workFlowLocationId: [''],  --my ref
      // workFlowSublocationId: [''],  --my ref
      // workFlowDepartmentId: [''],   --my ref
      requestTypeId: ['', Validators.required],
      requestSubTypeId: ['', Validators.required],
      executorWeekend: [],
      executorHoliday: [],
      approverWeekend: [],
      approverHoliday: [],
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
      reqWorkFlowIsMailRequired: [false,],
      reqWorkFlowIsNotificationRequired: [false],
      reqWorkFlowIsMgtEscalationRequired: [false],
      requestWorkFlowSlaVo: this.formBuilder.array([this.executerSla(1)]),
      seq1requestWorkFlowSlaVo: this.formBuilder.array([this.seq1Sla(1)]),
      seq2requestWorkFlowSlaVo: this.formBuilder.array([this.seq2Sla(1)]),
      seq1Id: [null],
      seq2Id: [null],
      slaConfigure: [false],
      requestWorkFlowDetailsVoList: this.formBuilder.array([])
    });
    //  this.onloadSelectboxData();
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
    if (this.defaultCommon == '0') {
      seqExSla["controls"].requestWorkFlowSlaVo.disable();
    }
    seq3Sla["controls"].requestWorkFlowSlaVo.push(this.seq3sla(2));
    seq3Sla["controls"].requestWorkFlowSlaVo.push(this.seq3sla(3));
    this.onloadSelectboxData();
    this.RWF_list_modify();
    this.saveForm.controls['seq1requestWorkFlowSlaVo'].disable();
    this.saveForm.controls['seq2requestWorkFlowSlaVo'].disable();
    seq3Sla["controls"].requestWorkFlowSlaVo.disable();


    let userRoleListData = this.requestWorkflowAddService.load_userRoleelectBoxData({}).subscribe(data => {
      let resp = JSON.parse(data['_body']);
      this.staticuserRoleList = resp.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
    this.componentLoaderService.display(false);
  }
  seq3sla(val) {
    return this.formBuilder.group({
      type: 1,
      protoType: val,
      reqWorkFlowSla: [''],
      reqWorkFlowSlaType: [''],
      reqWorkFlowSlaIsActive: [true],
      reqWorkFlowSlaId: ['']
    });
  }
  seq2Sla(val) {
    return this.formBuilder.group({
      type: 1,
      protoType: val,
      reqWorkFlowSla: [''],
      reqWorkFlowSlaType: [''],
      reqWorkFlowSlaIsActive: [true],
      reqWorkFlowSlaId: ['']
    });
  }
  seq1Sla(val) {
    return this.formBuilder.group({
      type: 1,
      protoType: val,
      reqWorkFlowSla: ['', Validators.required],
      reqWorkFlowSlaType: ['', Validators.required],
      reqWorkFlowSlaIsActive: [true],
      reqWorkFlowSlaId: ['']
    });
  }
  executerSla(val) {
    return this.formBuilder.group({
      type: 2,
      protoType: val,
      reqWorkFlowSla: ['', Validators.required],
      reqWorkFlowSlaType: ['', Validators.required],
      reqWorkFlowSlaIsActive: [true],
      reqWorkFlowSlaId: ['']
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
      requestWorkFlowSlaVo: this.formBuilder.array([this.seq3sla(1)]),
      reqWorkFlowSeqId: ['']
    })
  }
  validateFloatKeyPressexecuter(el, j) {
    let match = (/(\d{0,3})[^.]*((?:\.\d{0,2})?)/g).exec(this.executer[j].replace(/[^\d.]/g, ''));
    el.value = match[1] + match[2];
    this.executer[j] = el.value;
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
    //  var v = parseFloat(el.value);
    // el.value = (isNaN(v)) ? '' : v.toFixed(2);
    let match = (/(\d{0,3})[^.]*((?:\.\d{0,2})?)/g).exec(this.sequence3[i][j].replace(/[^\d.]/g, ''));
    el.value = match[1] + match[2];
    this.sequence3[i][j] = el.value;
  }
  validateExFloatKeyPress(el, i, j) {
    let match = (/(\d{0,3})[^.]*((?:\.\d{0,2})?)/g).exec(this.exSequence3[i][j].replace(/[^\d.]/g, ''));
    el.value = match[1] + match[2];
    this.exSequence3[i][j] = el.value;
  }
  sequenceExType() {
    return this.formBuilder.group({
      executerLocationId: [''],
      executerSublocationId: [''],
      executerRoleId: [''],
      executerDepartmentId: [''],
      executerUserId: [0],
      reqWorkFlowExecuterId: [],
      requestWorkFlowSlaVo: this.formBuilder.array([this.seq3sla(1)])
    })
  }
  addSequence() {
    if (this.count <= 100) {
      (this.saveForm.controls['requestWorkFlowSequenceList'] as FormArray).push(this.sequenceType());
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
  addExSequence(disableFlag) {
    if (this.count1 <= 100) {
      (this.saveForm.controls['requestWorkFlowExecuterVo'] as FormArray).push(this.sequenceExType());
      this.count1++;
      const seq3Sla = (<FormArray>(
        this.saveForm.controls["requestWorkFlowExecuterVo"]
      )).at(this.saveForm.value.requestWorkFlowExecuterVo.length - 1);
      seq3Sla["controls"].requestWorkFlowSlaVo.push(this.seq3sla(2));
      seq3Sla["controls"].requestWorkFlowSlaVo.push(this.seq3sla(3));
      if (this.defaultCommon == '1' && disableFlag == '1') {
        const seqExSla = (<FormArray>(
          this.saveForm.controls["requestWorkFlowExecuterVo"]
        )).at(this.saveForm.value.requestWorkFlowExecuterVo.length - 1);
        // seqExSla["controls"].requestWorkFlowSlaVo.disable();       
        this.getPaginatorData({
          length: 26,
          pageIndex: 0,
          pageSize: this.saveForm.value.requestWorkFlowExecuterVo.length,
          previousPageIndex: 0
        })
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
        this.dynamicExUserList = resp.succesObject;
      }, error => {
        if (error.status === 401) {
          console.log("Error");
        }
      });
    }
  }
  deleteExSequence(i, item) {
    if (this.count1 > 1) {
      (this.saveForm.controls['requestWorkFlowExecuterVo'] as FormArray).removeAt(i);
      this.count1--;
      let reqWorkFlowExecuterId;
      if (item != null && item.value.reqWorkFlowExecuterId != null) {
        reqWorkFlowExecuterId = item.value.reqWorkFlowExecuterId
      } else {
        reqWorkFlowExecuterId = null
      }

      if (reqWorkFlowExecuterId != null) {
        let locationListData = this.requestWorkflowAddService.dynamicRowDelete(reqWorkFlowExecuterId).subscribe(data => {
          let resp = JSON.parse(data['_body']);
        }, error => {
          if (error.status === 401) {
            console.log("Error");
          }
        });
        this.subLocationNameExSeq_data.splice(i, 1);
        this.squExdepartmentlist.splice(i, 1);
        this.dynamicExUserRoleList.splice(i, 1);
        this.dynamicExUserList.splice(i, 1);
      }
    }

  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  onloadSelectboxData() {
    let locationListData = this.requestWorkflowAddService.load_LocationData().subscribe(data => {
      let resp = JSON.parse(data['_body']);
      this.locationList = resp.succesObject;
      this.customlocationList = resp.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
    let deptListData = this.requestWorkflowAddService.load_DepartmentselectBoxData().subscribe(data => {
      let resp = JSON.parse(data['_body']);
      this.userDepartmentList = resp.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
    let reqListData = this.requestWorkflowAddService.load_reqtypeList().subscribe(data => {
      let resp = JSON.parse(data['_body']);
      this.reqTypeList = resp.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
    /*let roomConfigListData = this.requestWorkflowAddService.load_roomBookList_Data().subscribe(data => {
      let resp = JSON.parse(data['_body']);
      this.roomConfigList = resp.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });*/
  }
  RWF_list_modify() {
    let tempData = JSON.parse(window.localStorage.getItem('reqWorkFlowId'));
    this.requestWorkflowModifyService.load_modify_project(tempData).subscribe(data => {
      let RWF_ModifyListGetData = JSON.parse(data['_body']);
      let RWF_ModifyList_TableData = RWF_ModifyListGetData.succesObject;
      this.defaultCommon = RWF_ModifyList_TableData.slaConfigure;
      this.modifyData = RWF_ModifyListGetData.succesObject;
      this.saveForm.patchValue({executorHoliday : RWF_ModifyList_TableData.executorHoliday});
      this.saveForm.patchValue({executorWeekend : RWF_ModifyList_TableData.executorWeekend});
      this.saveForm.patchValue({approverHoliday : RWF_ModifyList_TableData.approverHoliday});
      this.saveForm.patchValue({approverWeekend : RWF_ModifyList_TableData.approverWeekend});
      this.userBaseFieldName = RWF_ModifyListGetData.authSuccesObject.screenFieldDisplayVoList.map(
        element => {
          return element;
        }
      );
      let dynamicRows: any = [];
      let sequences: any = [];

      if (RWF_ModifyList_TableData.requestWorkFlowDetailsVoList != null && RWF_ModifyList_TableData.requestWorkFlowDetailsVoList.length > 0) {

        for (let i = 0; i < RWF_ModifyList_TableData.requestWorkFlowDetailsVoList.length; i++) {
          let item = RWF_ModifyList_TableData.requestWorkFlowDetailsVoList[i];
          this.customrequestWorkFlowDetailsVoList(item.workFlowLocationId, item.workFlowSublocationId, item.workFlowDepartmentId, { _checked: item.reqWorkFlowDetailsIsActive }, i, item.reqWorkFlowDetailsId, item.reqWorkFlowId)
        }
      } else {
        RWF_ModifyList_TableData.requestWorkFlowDetailsVoList = [];
      }

      if (RWF_ModifyList_TableData.requestWorkFlowSequenceList != null) {
        for (let i = 0; i < RWF_ModifyList_TableData.requestWorkFlowSequenceList.length; i++) {
          if (RWF_ModifyList_TableData.requestWorkFlowSequenceList[i].reqWorkFlowSeqLevelType == 0) {
            dynamicRows.push(RWF_ModifyList_TableData.requestWorkFlowSequenceList[i]);
          } else {
            // if(RWF_ModifyList_TableData.requestWorkFlowSequenceList[i].requestWorkFlowSlaVo)
            sequences.push(RWF_ModifyList_TableData.requestWorkFlowSequenceList[i]);
          }

        }
      }
      this.sequances = sequences;
      for (let k = 0; k < dynamicRows.length - 1; k++) {
        this.addSequence();
      }
      for (let j = 0; j < dynamicRows.length; j++) {
        let subLocationseqListData = this.requestWorkflowAddService.load_subLocationData(dynamicRows[j].id).subscribe(data => {
          let resp = JSON.parse(data['_body']);
          this.subLocationNameSeq_data[j] = resp.succesObject;
        }, error => {
          if (error.status === 401) {
            console.log("Error");
          }
        });
        let userRoleListData = this.requestWorkflowAddService.load_userRoleelectBoxData({ userDepartment: dynamicRows[j].userDepartmentId }).subscribe(data => {
          let resp = JSON.parse(data['_body']);
          this.dynamicUserRoleList[j] = resp.succesObject;
        }, error => {
          if (error.status === 401) {
            console.log("Error");
          }
        });



        let excuterUSer = this.requestWorkflowAddService.getUSer({ "userRole": dynamicRows[j].userRoleId }).subscribe(data => {
          let resp = JSON.parse(data['_body']);
          this.dynamicUserList[j] = resp.succesObject;
        }, error => {
          if (error.status === 401) {
            console.log("Error");
          }
        });
        const seq3Sla = (<FormArray>(
          this.saveForm.controls["requestWorkFlowSequenceList"]
        )).at(j);
        seq3Sla["controls"].requestWorkFlowSlaVo.enable();
      }
      if (RWF_ModifyListGetData.succesObject.reqWorkFlowType == '1') {
        this.selectedListType = true;
      } else {
        this.selectedListType = false;
      }
      let subLocationListData = this.requestWorkflowAddService.load_subLocationData(RWF_ModifyList_TableData.workFlowLocationId).subscribe(data => {
        let resp = JSON.parse(data['_body']);
        this.subLocationList = resp.succesObject;
      }, error => {
        if (error.status === 401) {
          console.log("Error");
        }
      });
      let reqsubTypeData = this.requestWorkflowAddService.load_selectBox_subTypeData(RWF_ModifyList_TableData.requestTypeId).subscribe(data => {
        let resp = JSON.parse(data['_body']);
        this.reqSubTypeList = resp.succesObject;
      }, error => {
        if (error.status === 401) {
          console.log("Error");
        }
      });
      let exesubLocationListData = this.requestWorkflowAddService.load_subLocationData(RWF_ModifyList_TableData.executerLocationId).subscribe(data => {
        let resp = JSON.parse(data['_body']);
        this.exesubLocationList = resp.succesObject;
      }, error => {
        if (error.status === 401) {
          console.log("Error");
        }
      });
      let excuterUSer = this.requestWorkflowAddService.getUSer({ "userRole": RWF_ModifyList_TableData.executerRoleId }).subscribe(data => {
        let resp = JSON.parse(data['_body']);
        this.executerUserList = resp.succesObject;
      }, error => {
        if (error.status === 401) {
          console.log("Error");
        }
      });
      let userRoleListData = this.requestWorkflowAddService.load_userRoleelectBoxData({ userDepartment: RWF_ModifyList_TableData.executerDepartmentId }).subscribe(data => {
        let resp = JSON.parse(data['_body']);
        this.userRoleList = resp.succesObject;
      }, error => {
        if (error.status === 401) {
          console.log("Error");
        }
      });
      RWF_ModifyList_TableData.requestWorkFlowSequenceList = dynamicRows;
      if (RWF_ModifyList_TableData.requestWorkFlowSequenceList !== null && RWF_ModifyList_TableData.requestWorkFlowSequenceList.length > 0) {
        for (let i in RWF_ModifyList_TableData.requestWorkFlowSequenceList) {
          if (RWF_ModifyList_TableData.requestWorkFlowSequenceList[i] !== undefined) {
            for (let j in RWF_ModifyList_TableData.requestWorkFlowSequenceList[i].requestWorkFlowSlaVo) {
              this.sequence3[i][j] = RWF_ModifyList_TableData.requestWorkFlowSequenceList[i].requestWorkFlowSlaVo[j].reqWorkFlowSla;
            }
            // this.sequence3[i][j] = RWF_ModifyList_TableData.requestWorkFlowSequenceList[i].requestWorkFlowSlaVo[j].reqWorkFlowSla;
            this.selected_sequenceLocationType(RWF_ModifyList_TableData.requestWorkFlowSequenceList[i].locationId, i);
            this.selected_sequenceSubLocationType(RWF_ModifyList_TableData.requestWorkFlowSequenceList[i].sublocationId, i, { value: { id: RWF_ModifyList_TableData.requestWorkFlowSequenceList[i].locationId } })
          }

        }
      } else {
        RWF_ModifyList_TableData.requestWorkFlowSequenceList = [];
      }
      if (RWF_ModifyList_TableData.requestWorkFlowExecuterVo !== null && RWF_ModifyList_TableData.requestWorkFlowExecuterVo.length > 0) {
        //  for (let j in RWF_ModifyList_TableData.requestWorkFlowSlaVo ) {
        //   this.executer[j] = RWF_ModifyList_TableData.requestWorkFlowSlaVo[j].reqWorkFlowSla;
        //  }
        const seqExSla = (<FormArray>(
          this.saveForm.controls["requestWorkFlowExecuterVo"]
        )).at(0);
        seqExSla["controls"].requestWorkFlowSlaVo.enable();
        let len = RWF_ModifyList_TableData.requestWorkFlowExecuterVo.length;
        for (let i = 0; i < len; i++) {
          if(RWF_ModifyList_TableData.requestWorkFlowExecuterVo[i].executerLocationId != null){
            this.selected_ExsequenceLocationType(RWF_ModifyList_TableData.requestWorkFlowExecuterVo[i].executerLocationId, i);
          }
          if(RWF_ModifyList_TableData.requestWorkFlowExecuterVo[i].executerSublocationId != null){
            this.selected_ExsequencesubLocationType(RWF_ModifyList_TableData.requestWorkFlowExecuterVo[i].executerSublocationId, i, 
                  { value: RWF_ModifyList_TableData.requestWorkFlowExecuterVo[i].executerSublocationId })
          }
          
          let row = {};
          row['value'] = RWF_ModifyList_TableData.requestWorkFlowExecuterVo[i];
          // this.dynamicExGetUSerRole(RWF_ModifyList_TableData.requestWorkFlowExecuterVo[i].executerDepartmentId, i, row);
          // this.dynamicExFieldsGetUSer(RWF_ModifyList_TableData.requestWorkFlowExecuterVo[i].executerRoleId, i, len);
          this.addExSequence(0);
        }
        for (let i in RWF_ModifyList_TableData.requestWorkFlowExecuterVo) {
          for (let j in RWF_ModifyList_TableData.requestWorkFlowExecuterVo[i].requestWorkFlowSlaVo) {
            this.exSequence3[i][j] = RWF_ModifyList_TableData.requestWorkFlowExecuterVo[i].requestWorkFlowSlaVo[j].reqWorkFlowSla;
          }
        }
      }
      
      this.selected_executerLocationType(RWF_ModifyList_TableData.executerLocationId);
      // this.get_subLocation(RWF_ModifyList_TableData.workFlowLocationId);
      this.saveForm.patchValue(RWF_ModifyList_TableData);
      if (RWF_ModifyList_TableData.slaConfigure == '0') {
        this.saveForm.patchValue({ slaConfigure: true })
      } else {
        this.saveForm.patchValue({ slaConfigure: false })
      }
      if (sequences.length > 0) {
        if (sequences.length === 1) {
          if (sequences[0].reqWorkFlowSeqLevelType == '4') {
            this.saveForm.controls['seq2requestWorkFlowSlaVo'].enable();
            this.saveForm.patchValue({ reqWorkFlowSeqLevelTypeTwo: sequences[0].reqWorkFlowSeqLevelType });
            this.saveForm.patchValue({ seq2reqWorkFlowSeqSla: sequences[0].reqWorkFlowSeqSla });
            this.saveForm.patchValue({ seq2reqWorkFlowSeqSlaType: sequences[0].reqWorkFlowSeqSlaType });
            // this.saveForm.patchValue({ reqWorkFlowSeqId2: sequences[0].reqWorkFlowSeqId });
            // this.saveForm.patchValue({ reqWorkFlowId2: sequences[0].reqWorkFlowId });
            this.saveForm.patchValue({ seq2requestWorkFlowSlaVo: sequences[0].requestWorkFlowSlaVo });
            this.saveForm.patchValue({ seq2Id: sequences[0].reqWorkFlowSeqId });
            this.saveForm.patchValue({ seq2reqWorkFlowSeqIsActive: sequences[0].reqWorkFlowSeqIsActive });
          } else {
            this.saveForm.controls['seq1requestWorkFlowSlaVo'].enable();
            this.saveForm.patchValue({ reqWorkFlowSeqLevelTypeOne: sequences[0].reqWorkFlowSeqLevelType });
            this.saveForm.patchValue({ seq1reqWorkFlowSeqSla: sequences[0].reqWorkFlowSeqSla });
            this.saveForm.patchValue({ seq1reqWorkFlowSeqSlaType: sequences[0].reqWorkFlowSeqSlaType });
            this.saveForm.patchValue({ reqWorkFlowSeqId1: sequences[0].reqWorkFlowSeqId });
            this.saveForm.patchValue({ reqWorkFlowId1: sequences[0].reqWorkFlowId });
            this.saveForm.patchValue({ seq1requestWorkFlowSlaVo: sequences[0].requestWorkFlowSlaVo });
            this.saveForm.patchValue({ seq1Id: sequences[0].reqWorkFlowSeqId });
            this.saveForm.patchValue({ seq1reqWorkFlowSeqIsActive: sequences[0].reqWorkFlowSeqIsActive });
            if (sequences[0].reqWorkFlowSeqLevelType == '3') {
              this.selectedList = true;
              this.saveForm.patchValue({ reqWorkFlowSeqLevelhierarchy: sequences[0].reqWorkFlowSeqLevelhierarchy });
            }
          }
        } else if (sequences.length === 2) {
          this.saveForm.controls['seq1requestWorkFlowSlaVo'].enable();
          this.saveForm.controls['seq2requestWorkFlowSlaVo'].enable();
          this.saveForm.patchValue({ reqWorkFlowSeqLevelTypeOne: sequences[0].reqWorkFlowSeqLevelType });
          this.saveForm.patchValue({ seq1reqWorkFlowSeqSla: sequences[0].reqWorkFlowSeqSla });
          this.saveForm.patchValue({ seq1reqWorkFlowSeqSlaType: sequences[0].reqWorkFlowSeqSlaType });
          // this.saveForm.patchValue({ reqWorkFlowSeqId1: sequences[0].reqWorkFlowSeqId });
          // this.saveForm.patchValue({ reqWorkFlowId1: sequences[0].reqWorkFlowId });
          this.saveForm.patchValue({ seq1requestWorkFlowSlaVo: sequences[0].requestWorkFlowSlaVo });
          this.saveForm.patchValue({ seq1Id: sequences[0].reqWorkFlowSeqId });
          this.saveForm.patchValue({ seq1reqWorkFlowSeqIsActive: sequences[0].reqWorkFlowSeqIsActive });
          if (sequences[0].reqWorkFlowSeqLevelType == '3') {
            this.selectedList = true;
            this.saveForm.patchValue({ reqWorkFlowSeqLevelhierarchy: sequences[0].reqWorkFlowSeqLevelhierarchy });
          }
          this.saveForm.patchValue({ reqWorkFlowSeqLevelTypeTwo: sequences[1].reqWorkFlowSeqLevelType });
          this.saveForm.patchValue({ seq2reqWorkFlowSeqSla: sequences[1].reqWorkFlowSeqSla });
          this.saveForm.patchValue({ seq2reqWorkFlowSeqSlaType: sequences[1].reqWorkFlowSeqSlaType });
          // this.saveForm.patchValue({ reqWorkFlowSeqId2: sequences[1].reqWorkFlowSeqId });
          // this.saveForm.patchValue({ reqWorkFlowId2: sequences[1].reqWorkFlowId });
          this.saveForm.patchValue({ seq2requestWorkFlowSlaVo: sequences[1].requestWorkFlowSlaVo });
          this.saveForm.patchValue({ seq2Id: sequences[1].reqWorkFlowSeqId });
          this.saveForm.patchValue({ seq2reqWorkFlowSeqIsActive: sequences[1].reqWorkFlowSeqIsActive });
        }
        if (sequences != undefined && sequences.length > 0) {
          for (let i in sequences) {
            if (sequences[i].requestWorkFlowSlaVo !== undefined && sequences[i].requestWorkFlowSlaVo.length > 0) {
              if (sequences[i].reqWorkFlowSeqSequence == 1) {
                for (let j in sequences[i].requestWorkFlowSlaVo) {
                  this.sequence1[j] = sequences[i].requestWorkFlowSlaVo[j].reqWorkFlowSla;
                }
              }
              if (sequences[i].reqWorkFlowSeqSequence == 2) {
                for (let j in sequences[i].requestWorkFlowSlaVo) {
                  this.sequence2[j] = sequences[i].requestWorkFlowSlaVo[j].reqWorkFlowSla;
                }
              }
            }
          }
        }
      }
      this.deleteExSequence(this.saveForm.value.requestWorkFlowExecuterVo.length - 1, null);
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });

  }
  /*get_subLocation(val) {
    let subLocationListData = this.requestWorkflowAddService.load_subLocationData(val).subscribe(data => {
      let resp = JSON.parse(data['_body']);
      this.subLocationList = resp.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
  }*/
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
  selectedRequestType(val) {
    let reqSubTypeData = this.requestWorkflowAddService.load_selectBox_subTypeData(val).subscribe(data => {
      let resp = JSON.parse(data['_body']);
      this.reqSubTypeList = resp.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
  }
  /* selected_executerLocationType(val) {
     let subLocationListData = this.requestWorkflowAddService.load_subLocationData(val).subscribe(data => {
       let resp = JSON.parse(data['_body']);
       this.exesubLocationList = resp.succesObject;
     }, error => {
       if (error.status === 401) {
         console.log("Error");
       }
     });
   }*/
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
    // this.requestWorkflowAddService.load_selectBox_subLocationData(eve).subscribe(
    //   data => {
    //     let resp = JSON.parse(data['_body']);
    //     this.squdepartmentlist[i] = resp.succesObject;
    //   },
    //   error => {
    //     console.log(error);
    //   }
    // );
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
          reqWorkFlowSeqLevelType: this.saveForm.value.reqWorkFlowSeqLevelTypeTwo,
          reqWorkFlowSeqLevelhierarchy: 0,
          reqWorkFlowSeqIsActive: this.saveForm.controls.seq2reqWorkFlowSeqIsActive.value,
          reqWorkFlowSeqId: this.saveForm.value.seq2Id,
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
          reqWorkFlowSeqLevelType: this.saveForm.value.reqWorkFlowSeqLevelTypeOne,
          reqWorkFlowSeqLevelhierarchy: 0,
          reqWorkFlowSeqIsActive: this.saveForm.controls.seq1reqWorkFlowSeqIsActive.value,
          reqWorkFlowSeqId: this.saveForm.value.seq1Id,
          requestWorkFlowSlaVo: this.saveForm.value.seq1requestWorkFlowSlaVo
        }
        this.saveForm.value.requestWorkFlowSequenceList.unshift(val);
        seq1Exist = true;
      }
      else if (this.saveForm.value.reqWorkFlowSeqLevelTypeOne = 3) {
        let val = {
          locationId: 0,
          sublocationId: 0,
          userDepartmentId: 0,
          userRoleId: 0,
          reqWorkFlowSeqLevelType: this.saveForm.value.reqWorkFlowSeqLevelTypeOne,
          reqWorkFlowSeqLevelhierarchy: this.saveForm.value.reqWorkFlowSeqLevelhierarchy,
          reqWorkFlowSeqIsActive: this.saveForm.controls.seq1reqWorkFlowSeqIsActive.value,
          reqWorkFlowSeqId: this.saveForm.value.seq1Id,
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
      // this.saveForm.value.seq1requestWorkFlowSlaVo = undefined;
      // this.saveForm.value.seq2requestWorkFlowSlaVo = undefined;
      if (this.saveForm.value.requestWorkFlowSequenceList[0].locationId == "" && 
      this.saveForm.value.requestWorkFlowSequenceList[0].reqWorkFlowSeqLevelType == "") {
        this.saveForm.value.requestWorkFlowSequenceList = [];
      }

      this.saveForm.value.screenFieldDisplayVoList = this.userBaseFieldName;
      if (this.defaultCommon == '1' && this.saveForm.value.requestWorkFlowExecuterVo.length > 1) {
        let requestWorkFlowExecuterVoindex0 = this.saveForm.value.requestWorkFlowExecuterVo[0];
        let requestWorkFlowExecuterVo = this.saveForm.value.requestWorkFlowExecuterVo;
        for (let i = 0; i < this.saveForm.value.requestWorkFlowExecuterVo.length; i++) {
          // this.saveForm.value.requestWorkFlowExecuterVo[i].requestWorkFlowSlaVo = requestWorkFlowSlaVo;
          // requestWorkFlowExecuterVo[i].executerLocationId = requestWorkFlowExecuterVoindex0.executerLocationId;
          // requestWorkFlowExecuterVo[i].executerSublocationId = requestWorkFlowExecuterVoindex0.executerSublocationId;
          // requestWorkFlowExecuterVo[i].executerRoleId = requestWorkFlowExecuterVoindex0.executerRoleId;
          // requestWorkFlowExecuterVo[i].executerDepartmentId = requestWorkFlowExecuterVoindex0.executerDepartmentId;
          // requestWorkFlowExecuterVo[i].executerUserId = requestWorkFlowExecuterVoindex0.executerUserId;
          // index 0 
          requestWorkFlowExecuterVo[i].requestWorkFlowSlaVo[0].type = requestWorkFlowExecuterVoindex0.requestWorkFlowSlaVo[0].type;
          requestWorkFlowExecuterVo[i].requestWorkFlowSlaVo[0].protoType = requestWorkFlowExecuterVoindex0.requestWorkFlowSlaVo[0].protoType;
          requestWorkFlowExecuterVo[i].requestWorkFlowSlaVo[0].reqWorkFlowSlaType = requestWorkFlowExecuterVoindex0.requestWorkFlowSlaVo[0].reqWorkFlowSlaType;
          requestWorkFlowExecuterVo[i].requestWorkFlowSlaVo[0].reqWorkFlowSla = requestWorkFlowExecuterVoindex0.requestWorkFlowSlaVo[0].reqWorkFlowSla;
          requestWorkFlowExecuterVo[i].requestWorkFlowSlaVo[0].reqWorkFlowSlaIsActive = requestWorkFlowExecuterVoindex0.requestWorkFlowSlaVo[0].reqWorkFlowSlaIsActive;
          // index 1
          requestWorkFlowExecuterVo[i].requestWorkFlowSlaVo[1].type = requestWorkFlowExecuterVoindex0.requestWorkFlowSlaVo[1].type;
          requestWorkFlowExecuterVo[i].requestWorkFlowSlaVo[1].protoType = requestWorkFlowExecuterVoindex0.requestWorkFlowSlaVo[1].protoType;
          requestWorkFlowExecuterVo[i].requestWorkFlowSlaVo[1].reqWorkFlowSlaType = requestWorkFlowExecuterVoindex0.requestWorkFlowSlaVo[1].reqWorkFlowSlaType;
          requestWorkFlowExecuterVo[i].requestWorkFlowSlaVo[1].reqWorkFlowSla = requestWorkFlowExecuterVoindex0.requestWorkFlowSlaVo[1].reqWorkFlowSla;
          requestWorkFlowExecuterVo[i].requestWorkFlowSlaVo[1].reqWorkFlowSlaIsActive = requestWorkFlowExecuterVoindex0.requestWorkFlowSlaVo[1].reqWorkFlowSlaIsActive;
          // index 2
          requestWorkFlowExecuterVo[i].requestWorkFlowSlaVo[2].type = requestWorkFlowExecuterVoindex0.requestWorkFlowSlaVo[2].type;
          requestWorkFlowExecuterVo[i].requestWorkFlowSlaVo[2].protoType = requestWorkFlowExecuterVoindex0.requestWorkFlowSlaVo[2].protoType;
          requestWorkFlowExecuterVo[i].requestWorkFlowSlaVo[2].reqWorkFlowSlaType = requestWorkFlowExecuterVoindex0.requestWorkFlowSlaVo[2].reqWorkFlowSlaType;
          requestWorkFlowExecuterVo[i].requestWorkFlowSlaVo[2].reqWorkFlowSla = requestWorkFlowExecuterVoindex0.requestWorkFlowSlaVo[2].reqWorkFlowSla;
          requestWorkFlowExecuterVo[i].requestWorkFlowSlaVo[2].reqWorkFlowSlaIsActive = requestWorkFlowExecuterVoindex0.requestWorkFlowSlaVo[2].reqWorkFlowSlaIsActive;
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
      // if (this.saveForm.value.requestWorkFlowSequenceList[0].reqWorkFlowSeqLevelType !== 1) {
      //   this.saveForm.value.seq2reqWorkFlowSeqIsActive = false;
      // }
      this.requestWorkflowModifyService.update_modify_project(this.saveForm.value).subscribe(data => {
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
        });
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
  ngOnDestroy() {
    localStorage.removeItem('reqWorkFlowId');
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
  selected_ExsequenceLocationType(eve, i) {

    let subLocationListData = this.requestWorkflowAddService.load_subLocationData(eve).subscribe(data => {
      let resp = JSON.parse(data['_body']);
      this.subLocationNameExSeq_data[i] = resp.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
    // this.requestWorkflowAddService.load_selectBox_subLocationData(eve).subscribe(
    //   data => {
    //     let resp = JSON.parse(data['_body']);
    //     this.squExdepartmentlist[i] = resp.succesObject;
    //   },
    //   error => {
    //     console.log(error);
    //   }
    // );
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
    // let userRoleListData = this.requestWorkflowAddService.load_userRoleelectBoxData({userLocation : eve }).subscribe(data => {
    //   let resp = JSON.parse(data['_body']);
    //   this.dynamicExUserRoleList[i] = resp.succesObject;
    // }, error => {
    //   if (error.status === 401) {
    //     console.log("Error");
    //   }
    // });
    // let excuterUSer = this.requestWorkflowAddService.getUSer({userLocation : eve }).subscribe(data => {
    //   let resp = JSON.parse(data['_body']);
    //   this.dynamicExUserList[i] = resp.succesObject;
    // }, error => {
    //   if (error.status === 401) {
    //     console.log("Error");
    //   }
    // });
  }
  dynamicExGetUSerRole(val, i, Row) {

    // let userRoleListData = this.requestWorkflowAddService.load_userRoleelectBoxData({userLocation : Row.value.executerLocationId, sublocationId :  Row.value.executerSublocationId, userDepartment :val}).subscribe(data => {
    //   let resp = JSON.parse(data['_body']);
    //   this.dynamicExUserRoleList[i] = resp.succesObject;
    // }, error => {
    //   if (error.status === 401) {
    //     console.log("Error");
    //   }
    // });
    // let excuterUSer = this.requestWorkflowAddService.getUSer({userLocation : Row.value.executerLocationId, sublocationId : Row.value.executerSublocationId, userDepartment : val}).subscribe(data => {
    //   let resp = JSON.parse(data['_body']);
    //   this.dynamicExUserList[i] = resp.succesObject;
    // }, error => {
    //   if (error.status === 401) {
    //     console.log("Error");
    //   }
    // });
  }
  dynamicExFieldsGetUSer(val, i, len) {
    this.saveForm.value.requestWorkFlowExecuterVo[i].executerUserId = '';
    let excuterUSer = this.requestWorkflowAddService.getUSer({ "userRole": val }).subscribe(data => {
      let resp = JSON.parse(data['_body']);
      this.dynamicExUserList[i] = resp.succesObject;
      if (i == len - 1) {
        this.componentLoaderService.display(false);
      }
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
  }

  selected_ExsequenceLocationType2(eve, i, form, Row) {
    form.controls.requestWorkFlowExecuterVo.controls[i].controls.executerSublocationId.reset();
    form.controls.requestWorkFlowExecuterVo.controls[i].controls.executerDepartmentId.reset();
    form.controls.requestWorkFlowExecuterVo.controls[i].controls.executerRoleId.reset();
    form.controls.requestWorkFlowExecuterVo.controls[i].controls.executerUserId.reset();
    let subLocationListData = this.requestWorkflowAddService.load_subLocationData(eve).subscribe(data => {
      let resp = JSON.parse(data['_body']);
      this.subLocationNameExSeq_data[i] = resp.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
    this.requestWorkflowAddService.load_selectBox_subLocationData(eve).subscribe(
      data => {
        let resp = JSON.parse(data['_body']);
        this.squExdepartmentlist[i] = resp.succesObject;
      },
      error => {
        console.log(error);
      }
    );
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
  }
  dynamicExGetUSerRole2(val, i, form, Row) {
    form.controls.requestWorkFlowExecuterVo.controls[i].controls.executerRoleId.reset();
    form.controls.requestWorkFlowExecuterVo.controls[i].controls.executerUserId.reset();
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
  dynamicExFieldsGetUSer2(val, i, form) {
    form.controls.requestWorkFlowExecuterVo.controls[i].controls.executerUserId.reset();
    this.saveForm.value.requestWorkFlowExecuterVo[i].executerUserId = '';
    let excuterUSer = this.requestWorkflowAddService.getUSer({ "userRole": val }).subscribe(data => {
      let resp = JSON.parse(data['_body']);
      this.dynamicExUserList[i] = resp.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
  }
  selected_ExsequencesubLocationType(eve, i, Row) {
    this.requestWorkflowAddService.load_ExselectBox_subLocationData({ userLocation: Row.value.executerLocationId, sublocationId: eve }).subscribe(
      data => {
        let resp = JSON.parse(data['_body']);
        this.squExdepartmentlist[i] = resp.succesObject;
      },
      error => {
        console.log(error);
      }
    );
    // let userRoleListData = this.requestWorkflowAddService.load_userRoleelectBoxData({userLocation : Row.value.executerLocationId, sublocationId : eve}).subscribe(data => {
    //   let resp = JSON.parse(data['_body']);
    //   this.dynamicExUserRoleList[i] = resp.succesObject;
    // }, error => {
    //   if (error.status === 401) {
    //     console.log("Error");
    //   }
    // });
    // let excuterUSer = this.requestWorkflowAddService.getUSer({userLocation : Row.value.executerLocationId, sublocationId : eve}).subscribe(data => {
    //   let resp = JSON.parse(data['_body']);
    //   this.dynamicExUserList[i] = resp.succesObject;
    // }, error => {
    //   if (error.status === 401) {
    //     console.log("Error");
    //   }
    // });
  }
  slideToggle(event) {
    if (event.checked === false) {
      this.defaultCommon = '1';
    } else if (event.checked === true) {
      this.defaultCommon = '0';
    }
  }

  customrequestWorkFlowDetailsVoList(locationId, subLocationId, departmentId, isActive, currrentRow, reqWorkFlowDetailsId, reqWorkFlowId) {
    if (locationId != undefined && subLocationId != undefined && departmentId != undefined) {
      let row = this.formBuilder.group({
        workFlowLocationId: [locationId],
        workFlowSublocationId: [subLocationId],
        workFlowDepartmentId: [departmentId],
        reqWorkFlowDetailsIsActive: [isActive._checked],
        reqWorkFlowDetailsId: [reqWorkFlowDetailsId],
        reqWorkFlowId: [reqWorkFlowId],

      });
      (this.saveForm.controls['requestWorkFlowDetailsVoList'] as FormArray).push(row);
      let subLocationListData = this.requestWorkflowAddService.load_subLocationData(locationId).subscribe(data => {
        let resp = JSON.parse(data['_body']);
        this.customsubLocationList[currrentRow] = resp.succesObject;

      }, error => {
        if (error.status === 401) {
          console.log("Error");
        }
      });
      this.requestWorkflowAddService.getDept(subLocationId, locationId).subscribe(
        data => {
          let resp = JSON.parse(data['_body']);
          this.customdepartmentlist[currrentRow] = resp.succesObject;
        },
        error => {
          console.log(error);
        }
      );
      this.customworkFlowLocationIdInput['value'] = undefined;
      this.customworkFlowSublocationIdInput['value'] = undefined;
      this.customworkFlowDepartmentIdInput['value'] = undefined;
      this.customActiveInput['_checked'] = undefined;
      this.subLocationList = [];
      this.departmentlist = [];
      this.customworkFlowSublocationId = undefined;
      this.customworkFlowDepartmentId = undefined;
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
  customrequestWorkFlowDetailsVoListClick(locationId, subLocationId, departmentId, isActive, currrentRow) {
    if (locationId != undefined && subLocationId != undefined && departmentId != undefined) {
      if (this.saveForm.value.requestWorkFlowDetailsVoList.length === 0) {
        let row = this.formBuilder.group({
          workFlowLocationId: [locationId],
          workFlowSublocationId: [subLocationId],
          workFlowDepartmentId: [departmentId],
          reqWorkFlowDetailsIsActive: [isActive._checked]
        });
        (this.saveForm.controls['requestWorkFlowDetailsVoList'] as FormArray).push(row);
        let subLocationListData = this.requestWorkflowAddService.load_subLocationData(locationId).subscribe(data => {
          let resp = JSON.parse(data['_body']);
          this.customsubLocationList[currrentRow] = resp.succesObject;

        }, error => {
          if (error.status === 401) {
            console.log("Error");
          }
        });
        this.requestWorkflowAddService.getDept(subLocationId, locationId).subscribe(
          data => {
            let resp = JSON.parse(data['_body']);
            this.customdepartmentlist[currrentRow] = resp.succesObject;
          },
          error => {
            console.log(error);
          }
        );
        this.customworkFlowLocationIdInput['value'] = undefined;
        this.customworkFlowSublocationIdInput['value'] = undefined;
        this.customworkFlowDepartmentIdInput['value'] = undefined;
        this.customActiveInput['_checked'] = undefined;
        this.subLocationList = [];
        this.departmentlist = [];
        this.customworkFlowSublocationId = undefined;
        this.customworkFlowDepartmentId = undefined;
      } else if (this.saveForm.value.requestWorkFlowDetailsVoList.length >= 1) {
        let value = [{
          "requestWorkFlowDetailsVoList": this.saveForm.value.requestWorkFlowDetailsVoList,
          "workFlowDepartmentId": departmentId,
          "workFlowLocationId": locationId,
          "workFlowSublocationId": subLocationId,
          "reqWorkFlowDetailsIsActive": isActive._checked
        }];
        let respData = this.requestWorkflowAddService.check_existinguserList(value).subscribe(data => {
          let resp = JSON.parse(data['_body']);
          if (resp.responseCode == '200') {
            let row = this.formBuilder.group({
              workFlowLocationId: [locationId],
              workFlowSublocationId: [subLocationId],
              workFlowDepartmentId: [departmentId],
              reqWorkFlowDetailsIsActive: [isActive._checked]
            });
            (this.saveForm.controls['requestWorkFlowDetailsVoList'] as FormArray).push(row);
            let subLocationListData = this.requestWorkflowAddService.load_subLocationData(locationId).subscribe(data => {
              let resp = JSON.parse(data['_body']);
              this.customsubLocationList[currrentRow] = resp.succesObject;

            }, error => {
              if (error.status === 401) {
                console.log("Error");
              }
            });
            this.requestWorkflowAddService.getDept(subLocationId, locationId).subscribe(
              data => {
                let resp = JSON.parse(data['_body']);
                this.customdepartmentlist[currrentRow] = resp.succesObject;
              },
              error => {
                console.log(error);
              }
            );
            this.customworkFlowLocationIdInput['value'] = undefined;
            this.customworkFlowSublocationIdInput['value'] = undefined;
            this.customworkFlowDepartmentIdInput['value'] = undefined;
            this.customActiveInput['_checked'] = undefined;
            this.subLocationList = [];
            this.departmentlist = [];
            this.customworkFlowSublocationId = undefined;
            this.customworkFlowDepartmentId = undefined;
          } else {
            const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
              disableClose: false,
              panelClass: 'btnCenter',
              width: 'auto',
              data: {
                title: 'Alert',
                server: 'servermessage',
                message: resp.responseMessage,
                btnYes: 'OK',
              }
            });
          }
        }, error => {
          if (error.status === 401) {
            console.log("Error");
          }
        });
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
  getPaginatorData(event: PageEvent): PageEvent {
    this.lowValue = event.pageIndex * event.pageSize;
    this.highValue = this.lowValue + event.pageSize;
    return event;
  }
  getPaginatorDataDetailList(event: PageEvent): PageEvent {
    this.lowValueDetailList = event.pageIndex * event.pageSize;
    this.highValueDetailList = this.lowValue + event.pageSize;
    return event;
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
}

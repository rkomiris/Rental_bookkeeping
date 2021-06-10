import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ComponentLoaderService } from 'src/app/shared/component-loader.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { ForwardRequestService } from './forward-request.service';
import { validateConfig } from '@angular/router/src/config';
import { JsonApiService } from 'src/assets/api/json-api.service';
import { TypeaheadMatch } from 'ngx-bootstrap';

@Component({
  selector: 'app-forward-request-add',
  templateUrl: './forward-request-add.component.html',
  styleUrls: ['./forward-request-add.component.css']
})
export class ForwardRequestAddComponent implements OnInit {
  saveForm: FormGroup;
  reqTypeList: any = [];
  reqSubTypeList: any = [];
  locationList: any = [];
  sublocationList: any = [];
  departmentList: any = [];
  dropValues: any = [];
  checkValues: any = [];
  radioValues: any = [];
  checkBoxValues: any = [];
  requestTypeFilter: any;
  requestSubTypeFilter: any;
  locationFilter: any;
  subLocationFilter: any;
  departmentFilter: any;
  requestPriorityFilter: any;
  locationIdTemp: any;
  requestTypeId: any;
  requestSubTypeId: any;
  sublocationId: any;
  departmentId: any;
  voDetails: any = [];
  requestDetailList: any = [];
  labels: any;
  requestType;
  requestSubType;
  forward: boolean = false;
  redirect: boolean = false;
  originalDepartmentId;
  originalRequestTypeId;
  originalRequestSubTypeId;

  priorityCombo = [
    { id: 1, Value: 'Low' },
    { id: 2, Value: 'Medium' },
    { id: 3, Value: 'High' }
  ];
  screenList: any = [];
  resolverRow: any;
  constructor(
    private dialogRefOwn: MatDialogRef<ForwardRequestAddComponent>,
    private forwardReqService: ForwardRequestService,
    private formBuilder: FormBuilder,
    private componentLoaderService: ComponentLoaderService,
    private dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    private router: Router, private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private jsonApiService: JsonApiService) { }

  ngOnInit() {
    this.resolverRow = this.data.data;
    if (this.data.title == "Forward Request") { this.forward = true; }
    else if (this.data.title == "Redirect Request") { this.redirect = true; }
    this.requestDetailList = this.data.data.requestDetailList;
    let x = [{}];
    let obj = {
      requestTypeId: this.resolverRow.requestTypeId,
      requestSubtypeId: this.resolverRow.requestSubtypeId
    };
    this.forwardReqService.screenlist(obj).subscribe(data => {
      let resp = JSON.parse(data['_body']);
      this.screenList = resp.succesObject;
      let c = resp.succesObject;
      this.originalDepartmentId = this.resolverRow.departmentId;
      this.originalRequestTypeId = this.resolverRow.requestTypeId,
        this.originalRequestSubTypeId = this.resolverRow.requestSubtypeId,
        x = c;
      // reqSubject , fromdate , todate, attachment name , mobile number , extension

      let remarks = "Forward request from " + this.resolverRow.requestCode;
      this.saveForm = this.formBuilder.group({
        userId: [''],
        descisionType: [''],
        remarks: ['', Validators.required],
        requestId: [''],
        requestTypeId: ['', Validators.required],
        requestSubTypeId: ['', Validators.required],
        locationId: ['', Validators.required],
        subLocationId: ['', Validators.required],
        departmentId: ['', Validators.required],
        requestPriority: ['', Validators.required],
        requestDetailList: this.formBuilder.array([]),
        requestSubject: [''],
        requestCode: [''],
        requestFromDate: [''],
        requestToDate: [''],
        requestMobileNo: [''],
        requestExtension: [''],
        requestAttachment: [''],
        originalDepartmentId: [''],

      });
      this.onLoadData();
      // if(this.data.title == "Forward Request"){
      //    this.addSequence(x);
      // }
      // this.addSequence(x);
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
    this.getLabelDetails();
    this.componentLoaderService.display(true);
  }
  /**** LABEL CHNAGES ****/
  getLabelDetails() {
    let lang;
    if (localStorage.getItem('langCode') !== null) {
      lang = localStorage.getItem('langCode');
    }
    this.jsonApiService.fetch('/' + lang + '.json').subscribe((data) => {
      this.labels = data;
    });
  }
  sequenceType(val) {
    return this.formBuilder.group(val);

  }

  addSequence(x) { 
    if (x.length > 0) {
      for (let i = 0; i < x.length; i++) {
        if (x[i].requestScreenDetailConfigurationFieldType == "S") {
          this.dropValues[i] = x[i].list_value;
        }
        if (x[i].requestScreenDetailConfigurationFieldType == "C") {
          this.checkValues[i] = x[i].list_value;
        }
        if (x[i].requestScreenDetailConfigurationFieldType == "R") {
          this.radioValues[i] = x[i].list_value;
        }
        x[i].list_value = String(x[i].list_value)
        const creds = this.saveForm.controls.requestDetailList as FormArray;
        creds.push(this.formBuilder.group(x[i]));
      }
    }

  }
  onLoadData() {

    let requestTypeCall = this.forwardReqService.reqTypeId().subscribe(data => {
      let resp = JSON.parse(data['_body']);
      if (resp.responseCode == '200') {
        this.reqTypeList = resp.succesObject;
        this.voDetails = resp.succesObject;
      } else {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          disableClose: false,
          panelClass: 'btnCenter',
          width: 'auto',
          data: {
            title: 'Alert',
            server: 'servermessage',
            message: resp.respnseMessage,
            btnYes: 'OK',
          }
        });
      }
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });

    let requestSubTypeCall = this.forwardReqService.getSubTypeList(this.resolverRow.requestTypeId).subscribe(data => {
      let resp = JSON.parse(data['_body']);
      if (resp.responseCode == '200') {
        this.reqSubTypeList = resp.succesObject;
      } else {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          disableClose: false,
          panelClass: 'btnCenter',
          width: 'auto',
          data: {
            title: 'Alert',
            server: 'servermessage',
            message: resp.respnseMessage,
            btnYes: 'OK',
          }
        });
      }
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });

    let locationCall = this.forwardReqService.load_selectBox_LocationData().subscribe(data => {
      let resp = JSON.parse(data['_body']);
      if (resp.responseCode == '200') {
        this.locationList = resp.succesObject;
      } else {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          disableClose: false,
          panelClass: 'btnCenter',
          width: 'auto',
          data: {
            title: 'Alert',
            server: 'servermessage',
            message: resp.respnseMessage,
            btnYes: 'OK',
          }
        });
      }
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
    // let subLocationCall = this.forwardReqService.load_selectBox_subLocationData(this.resolverRow.id).subscribe(data => {
    //   let resp = JSON.parse(data['_body']);
    //   if (resp.responseCode == '200') {
    //     this.sublocationList = resp.succesObject;
    //   } else {
    //     const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    //       disableClose: false,
    //       panelClass: 'btnCenter',
    //       width: 'auto',
    //       data: {
    //         title: 'Alert',
    //         server: 'servermessage',
    //         message: resp.respnseMessage,
    //         btnYes: 'OK',
    //       }
    //     });
    //   }
    // }, error => {
    //   if (error.status === 401) {
    //     console.log("Error");
    //   }
    // });
    // let departmentCall = this.forwardReqService.getSeqDepartment(this.resolverRow.sublocationId, this.resolverRow.id).subscribe(data => {
    //   let resp = JSON.parse(data['_body']);
    //   if (resp.responseCode == '200') {
    //     this.departmentList = resp.succesObject;
    //   } else {
    //     const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    //       disableClose: false,
    //       panelClass: 'btnCenter',
    //       width: 'auto',
    //       data: {
    //         title: 'Alert',
    //         server: 'servermessage',
    //         message: resp.respnseMessage,
    //         btnYes: 'OK',
    //       }
    //     });
    //   }
    // }, error => {
    //   if (error.status === 401) {
    //     console.log("Error");
    //   }
    // });
    this.requestType = this.resolverRow.requestTypeName;
    this.requestSubType = this.resolverRow.requestSubTypeName;
    this.saveForm.patchValue({
      userId: localStorage.getItem('userId'),
      descisionType: 8,
      requestId: this.resolverRow.requestId,
      // requestTypeId: this.resolverRow.requestTypeName,
      // requestSubTypeId: this.resolverRow.requestSubTypeName,
      // requestTypeId: this.resolverRow.requestTypeId,
      // requestSubTypeId: this.resolverRow.requestSubtypeId,
      // locationId: this.resolverRow.id,
      // subLocationId: this.resolverRow.sublocationId,
      // departmentId: this.resolverRow.departmentId,      
      requestPriority: this.resolverRow.requestPriority,

    })

    // this.saveForm.get('userId').patchValue(localStorage.getItem('userId'));
    // this.saveForm.get('descisionType').patchValue(8);
    // this.saveForm.get('requestId').patchValue(this.resolverRow.requestId);
    // this.saveForm.get('requestTypeId').patchValue( this.resolverRow.requestTypeId);
    // this.saveForm.get('requestSubTypeId').patchValue(this.resolverRow.requestSubTypeId);
    // this.saveForm.get('locationId').patchValue(this.resolverRow.id);
    // this.saveForm.get('subLocationId').patchValue(this.resolverRow.sublocationId);
    // this.saveForm.get('departmentId').patchValue(this.resolverRow.departmentId);
    // this.saveForm.get('requestPriority').patchValue(this.resolverRow.requestPriority);

    this.componentLoaderService.display(false);
  }

  getReqSubType(val) {
    this.requestTypeId = val;
    // this.saveForm.patchValue({ requestTypeId: '' });
    this.saveForm.patchValue({ requestSubTypeId: '' });
    let requestSubTypeCall = this.forwardReqService.getSubTypeList(val).subscribe(data => {
      let resp = JSON.parse(data['_body']);
      if (resp.responseCode == '200') {
        this.reqSubTypeList = resp.succesObject;
      } else {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          disableClose: false,
          panelClass: 'btnCenter',
          width: 'auto',
          data: {
            title: 'Alert',
            server: 'servermessage',
            message: resp.respnseMessage,
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
  getReqSubLocation(val) {
    this.locationIdTemp = val;
    this.saveForm.patchValue({ locationId: this.locationIdTemp });
    this.saveForm.patchValue({ departmentId: '' });
    let subLocationCall = this.forwardReqService.load_selectBox_subLocationData(val).subscribe(data => {
      let resp = JSON.parse(data['_body']);
      if (resp.responseCode == '200') {
        this.sublocationList = resp.succesObject;
      } else {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          disableClose: false,
          panelClass: 'btnCenter',
          width: 'auto',
          data: {
            title: 'Alert',
            server: 'servermessage',
            message: resp.respnseMessage,
            btnYes: 'OK',
          }
        });
        dialogRef.afterClosed().subscribe(data => {
          // this.dialogRef.close();
          // this.router.navigateByUrl('/request-resolver');
        })
      }
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
  }

  getReqDepartment(val) {
    this.saveForm.patchValue({ subLocationId: val });
    // this.saveForm.patchValue({ departmentId: '' });
    let departmentCall = this.forwardReqService.load_selectBox_departmentData(val, this.locationIdTemp).subscribe(data => {
      let resp = JSON.parse(data['_body']);
      if (resp.responseCode == '200') {
        this.departmentList = resp.succesObject;
      } else {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          disableClose: false,
          panelClass: 'btnCenter',
          width: 'auto',
          data: {
            title: 'Alert',
            server: 'servermessage',
            message: resp.respnseMessage,
            btnYes: 'OK',
          }
        });
        dialogRef.afterClosed().subscribe(data => {
          // this.dialogRef.close();
          // this.router.navigateByUrl('/request-resolver');
        })
      }
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
  }

  setDepartment(val) {
    this.saveForm.patchValue({ departmentId: val });
  }

  onSubmit() {
    let tempList = this.saveForm.value.requestDetailList
    this.saveForm.value.requestDetailList = [];
    for(let i= 0; i < tempList.length; i++){
      if(tempList[i].requestScreenDetailConfigurationFieldName !== null){
        this.saveForm.value.requestDetailList.push(tempList[i]);
      }
    }

    if(this.saveForm.value.requestTypeId == ""){ this.errorMessage(); } 
    else if(this.saveForm.value.requestSubTypeId == "") { this.errorMessage(); }
    else if(this.saveForm.value.locationId == "") { this.errorMessage(); }
    else if(this.saveForm.value.subLocationId == "") { this.errorMessage(); }
    else if(this.saveForm.value.departmentId == "") { this.errorMessage(); }
    else if(this.saveForm.value.requestPriority == "") { this.errorMessage(); }
    else if(this.saveForm.value.remarks == "") { this.errorMessage(); }

    else if(this.saveForm.value.requestDetailList != null ){
      for(let i = 0; i < this.saveForm.value.requestDetailList.length; i++){
        if(this.saveForm.value.requestDetailList[i].requestScreenDetailConfigurationFieldValue == ""
        && this.saveForm.value.requestDetailList[i].requestScreenDetailConfigurationValidationIsRequired == true){
          this.errorMessage();
          
        }
      }
      this.forwardRedirect();
    }
    
  }

  forwardRedirect(){
    // else{
      if (this.data.title == 'Redirect Request') {
        this.saveForm.value['id'] = this.saveForm.value.locationId;
        this.saveForm.value['reqLocationId'] = this.resolverRow.reqLocationId;
        this.saveForm.value['reqSublocationId'] = this.resolverRow.reqSublocationId;
        // this.saveForm.value['requestTypeId'] = this.resolverRow.requestTypeId;
        // this.saveForm.value['requestSubTypeId'] = this.resolverRow.requestSubtypeId;
        this.saveForm.value['currentStatusId'] = 14;
        this.saveForm.value['descisionType'] = undefined;
        this.saveForm.value['requestSubject'] = this.resolverRow.requestSubject;
        this.saveForm.value['requestCode'] = this.resolverRow.requestCode;
        this.saveForm.value['requestFromDate'] = this.resolverRow.requestFromDate;
        this.saveForm.value['requestToDate'] = this.resolverRow.requestToDate;
        this.saveForm.value['requestMobileNo'] = this.resolverRow.requestMobileNo;
        this.saveForm.value['requestExtension'] = this.resolverRow.requestExtension;
        this.saveForm.value['requestAttachment'] = this.resolverRow.requestAttachment;
        this.saveForm.value['originalDepartmentId'] = this.originalDepartmentId;
        this.saveForm.value['originalRequestTypeId'] = this.originalRequestTypeId;
        this.saveForm.value['originalRequestSubTypeId'] = this.originalRequestSubTypeId;
        // this.saveForm.value['subRequestId'] = this.resolverRow.subRequestId;
        for (let i = 0; i < this.saveForm.value.requestDetailList.length; i++) {
          if(this.saveForm.value.requestDetailList[i].requestScreenDetailConfigurationFieldName !== null){
          if (this.saveForm.value.requestDetailList[i].list_value == 'null' || 
          this.saveForm.value.requestDetailList[i].list_value == null ||
          this.saveForm.value.requestDetailList[i].list_value == "undefined" ) {
            this.saveForm.value.requestDetailList[i].list_value = null;
          } else {
            if(this.saveForm.value.requestDetailList[i].list_value.includes(',')){
              this.saveForm.value.requestDetailList[i].list_value = this.saveForm.value.requestDetailList[i].list_value.split(',')
            }
            else if(this.saveForm.value.requestDetailList[i].list_value.includes('/')){
              this.saveForm.value.requestDetailList[i].list_value = this.saveForm.value.requestDetailList[i].list_value.split('/')
            }
            else{
              this.saveForm.value.requestDetailList[i].list_value = this.saveForm.value.requestDetailList[i].list_value;
            }
            
          }
        }
        }
      }
      else {
        this.saveForm.value['requestDetailList'] = this.requestDetailList;
        this.saveForm.value['requestTypeId'] = this.resolverRow.requestTypeId;
        this.saveForm.value['requestSubTypeId'] = this.resolverRow.requestSubtypeId;
        this.saveForm.value['reqLocationId'] = this.resolverRow.reqLocationId;
        this.saveForm.value['reqSublocationId'] = this.resolverRow.reqSublocationId;
        this.saveForm.value['requesterId'] = Number(localStorage.getItem('requesterId'));
        this.saveForm.value['requestSubject'] = this.resolverRow.requestSubject;
        this.saveForm.value['requestCode'] = this.resolverRow.requestCode;
        this.saveForm.value['requestFromDate'] = this.resolverRow.requestFromDate;
        this.saveForm.value['requestToDate'] = this.resolverRow.requestToDate;
        this.saveForm.value['requestMobileNo'] = this.resolverRow.requestMobileNo;
        this.saveForm.value['requestExtension'] = this.resolverRow.requestExtension;
        this.saveForm.value['requestAttachment'] = this.resolverRow.requestAttachment;
        this.saveForm.value['originalDepartmentId'] = this.originalDepartmentId;
        if (this.resolverRow.forwardRequestId != undefined) {
          this.saveForm.value['forwardRequestId'] = this.resolverRow.forwardRequestId;
        }
      }
    

      let subLocationCall = this.forwardReqService.submitReq(this.saveForm.value, this.data.url).subscribe(data => {
        let resp = JSON.parse(data['_body']);
        if (resp.responseCode == "200") {
          const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            disableClose: false,
            panelClass: 'btnCenter',
            width: 'auto',
            data: {
              title: 'Info',
              server: 'servermessage',
              message: resp.responseMessage,
              btnYes: 'OK',
            }
          });
          dialogRef.afterClosed().subscribe(data => {
            this.dialogRefOwn.close();
            this.router.navigateByUrl('/request-resolver');
          })
        } else {
          const dialogRefError = this.dialog.open(ConfirmationDialogComponent, {
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
    // }
  }

  errorMessage(){
    const dialogRefError = this.dialog.open(ConfirmationDialogComponent, {
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


  getCheckboxes(event, value, i, form) {
    if (event.checked === true) {
      this.checkBoxValues.push(value);
    } else if (event.checked === false) {
      let index = this.checkBoxValues.indexOf(value);
      if (index > -1) {
        this.checkBoxValues.splice(index, 1);
      }
    }
    form.objectList = this.checkBoxValues;
  }

  screenDetails(value, form){
   
    const control = <FormArray>this.saveForm.controls['requestDetailList'];
        for(let i = control.length-1; i >= 0; i--) {
            control.removeAt(i)
    }
    this.forwardReqService.screenDetails(value.requestTypeId, value.requestSubTypeId).subscribe(data => {
      let details = JSON.parse(data['_body']);
      if(details.responseCode == '200'){
        this.addSequence(details.succesObject);
        
       
      }
      else{
        const dialogRefError = this.dialog.open(ConfirmationDialogComponent, {
          disableClose: false,
          panelClass: 'btnCenter',
          width: 'auto',
          data: {
            title: 'Info',
            server: 'servermessage',
            message: details.responseMessage,
            btnYes: 'OK',
          }
        });
        dialogRefError.afterClosed().subscribe(data => {

        })
      }
    })
  }

}

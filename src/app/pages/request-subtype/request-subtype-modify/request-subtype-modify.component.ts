
import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material';
import {  FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router } from "@angular/router";
import { RequestSubtypeModifyService } from './request-subtype-modify.service';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import { ComponentLoaderService } from '../../../shared/component-loader.service';
import { JsonApiService } from 'src/assets/api/json-api.service';

@Component({
  selector: 'app-request-subtype-modify',
  templateUrl: './request-subtype-modify.component.html',
  styleUrls: ['./request-subtype-modify.component.css']
})
export class RequestSubtypeModifyComponent implements OnInit {
  labels: any = {}; /** LABEL CHANGES **/
  modifyForm: FormGroup;
  RST_selectFormGetDate: any;
  userBaseFieldName: any = []; 
   priorityArr = [];
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private requestSubtypeModifyService: RequestSubtypeModifyService,
    private jsonApiService: JsonApiService/** LABEL CHANGES **/,
    private componentLoaderService: ComponentLoaderService) {
    this.RST_selectFormGetDate = [];
  }
  ngOnInit() {
    this.componentLoaderService.display(true);
    this.getLabelDetails(); /** LABEL CHANGES **/
    this.modifyForm = this.formBuilder.group({
      requestSubTypeCode:["", ],
      requestTypeId: ["", Validators.required],
      requestSubTypeName:["",  Validators.required],
      requestSubTypeIsActive:["",],
      requestSubtypePriorty: ['', Validators.required]
    });
    if(localStorage.getItem('langCode') == 'en' ){
      this.priorityArr = [
        { name: 'Low', value: 1 },
        { name: 'Medium', value: 2},
        { name: 'High', value: 3 }];
    }else if(localStorage.getItem('langCode') == 'jp'){
      this. priorityArr = [
        { name: '低い', value: 1 },
        { name: '中', value: 2 },
        { name: '高い', value: 3 }];
    }
    this.onloadSelectboxData();
    this.RST_list_modify();
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

  RST_list_modify() {
    let tempData = JSON.parse(window.localStorage.getItem('requestSubTypeId'));
    this.requestSubtypeModifyService.load_modify_project(tempData).subscribe(data => {
      let reqSubTypeModifyListGetData = JSON.parse(data['_body']);
      let reqSubTypeModifyList_TableData = reqSubTypeModifyListGetData.succesObject;
      this.userBaseFieldName = reqSubTypeModifyListGetData.authSuccesObject.screenFieldDisplayVoList.map(
        element => {
          return element;
        }
      );
   //   this.modifyForm.patchValue(masterModifyList_TableData);
     // this.componentLoaderService.display(false);
      this.modifyForm.patchValue(reqSubTypeModifyList_TableData);
      this.componentLoaderService.display(false);
    }, error => {
      if(error.status === 401)
      {
        console.log("Error");
      }
    })

}
onloadSelectboxData() {
  let loadSelectBoxList = this.requestSubtypeModifyService.load_selectBoxData().subscribe(data => {
    let RST_selectGetData = JSON.parse(data['_body']);
    this.RST_selectFormGetDate = RST_selectGetData.succesObject;
  }, error => {
    if(error.status === 401)
    {
      console.log("Error");
    }
  })

}

onSubmit() {
  let formvalue = this.modifyForm.value;
  if (this.modifyForm.invalid) {
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
  } else if (this.modifyForm.valid) {
    this.componentLoaderService.display(true);
    let finalval: any = {};

    finalval = formvalue;
    
    if(null != formvalue.requestSubTypeIsActive && formvalue.requestSubTypeIsActive == true ){
      formvalue.requestSubTypeIsActive = 1
    }else{
      formvalue.requestSubTypeIsActive = 0
    }
    finalval.screenFieldDisplayVoList = this.userBaseFieldName;
    this.requestSubtypeModifyService.update_modify_project(finalval).subscribe(data => {
      let Response = JSON.parse(data['_body']);
      if (Response.responseCode === '200') {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          disableClose: false,
          panelClass: 'btnCenter',
          width: 'auto',
          data: {
            title: 'Info',
            message: Response.responseMessage,
            server:'servermessage',
            btnYes: 'OK',
          }
        });
        dialogRef.afterClosed().subscribe(data => {
          this.router.navigate(['/request-subtype']);
        })
      } else {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          disableClose: false,
          panelClass: 'btnCenter',
          width: 'auto',
          data: {
            title: 'Alert',
            message: Response.responseMessage,
            server:'servermessage',
            btnYes: 'OK',
          }
        });
        dialogRef.afterClosed().subscribe(data => {
          this.modifyForm.controls['requestSubTypeName'].reset();
        })
      }
      this.componentLoaderService.display(false);
    });
  }
}

ngOnDestroy(){
  localStorage.removeItem('requestSubTypeId');
}

}

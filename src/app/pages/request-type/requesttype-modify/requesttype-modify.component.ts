
import { Component, OnInit, OnDestroy} from '@angular/core';
import { MatDialog } from '@angular/material';
import {  FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router } from "@angular/router";
import { RequesttypeModifyService } from './requesttype-modify.service';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import { ComponentLoaderService } from '../../../shared/component-loader.service';
import { JsonApiService } from 'src/assets/api/json-api.service';
@Component({
  selector: 'app-requesttype-modify',
  templateUrl: './requesttype-modify.component.html',
  styleUrls: ['./requesttype-modify.component.css']
})

export class RequesttypeModifyComponent implements OnInit, OnDestroy {
  labels: any = {}; /** LABEL CHANGES **/
  modifyForm: FormGroup;
  userBaseFieldName: any = [];
  constructor(
    private jsonApiService: JsonApiService/** LABEL CHANGES **/,
    private router: Router,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private requesttypeModifyService: RequesttypeModifyService,
    private componentLoaderService: ComponentLoaderService) { }
  ngOnInit() {
    this.getLabelDetails(); /** LABEL CHANGES **/
    this.componentLoaderService.display(true);
    this.modifyForm = this.formBuilder.group({
      requestTypeCode:["",  ],
      requestTypeName:["", Validators.required],
      requestTypeUrl: ['/request/request-add', Validators.required],
      requestTypeIsActive:["", Validators.required],
    });
    this.master_list_modify();
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
  master_list_modify() {
    let tempData = JSON.parse(window.localStorage.getItem('requestTypeId'));
    this.requesttypeModifyService.load_modify_project(tempData).subscribe(data => {
      let masterModifyListGetData = JSON.parse(data['_body']);
      let masterModifyList_TableData = masterModifyListGetData.succesObject;
      this.userBaseFieldName = masterModifyListGetData.authSuccesObject.screenFieldDisplayVoList.map(
        element => {
          return element;
        }
      );
      this.modifyForm.patchValue(masterModifyList_TableData);
      this.componentLoaderService.display(false);
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
    finalval.screenFieldDisplayVoList = this.userBaseFieldName;
    this.requesttypeModifyService.update_modify_project(finalval).subscribe(data => {
      let Response = JSON.parse(data['_body']);
      if (Response.responseCode === '200') {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          disableClose: false,
          panelClass: 'btnCenter',
          width: 'auto',
          data: {
            title: 'Info',
            server:'servermessage',
            message: Response.responseMessage,
            btnYes: 'OK',
          }
        });
        dialogRef.afterClosed().subscribe(data => {
          this.router.navigate(['/request-type'])
        })
      } else {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          disableClose: false,
          panelClass: 'btnCenter',
          width: 'auto',
          data: {
            title: 'Alert',
            server:'servermessage',
            message: Response.responseMessage,
            btnYes: 'OK',
          }
        });
        dialogRef.afterClosed().subscribe(data => {
          this.modifyForm.controls['requestTypeName'].reset();
        })
      }
      this.componentLoaderService.display(false);
    })
  }
}

ngOnDestroy(){
  window.localStorage.removeItem('requestTypeId');
}


}

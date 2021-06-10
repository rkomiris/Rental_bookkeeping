import { Component, OnInit, ViewChild, Output, Inject } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource,VERSION, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormBuilder, FormGroup, Validators, NgForm, Form } from '@angular/forms';
import { Router } from "@angular/router";
import { DOCUMENT } from '@angular/common';
import { RequestSubtypeAddService } from './request-subtype-add.service';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import { ComponentLoaderService } from '../../../shared/component-loader.service';
import { JsonApiService } from 'src/assets/api/json-api.service';

@Component({
  selector: 'app-request-subtype-add',
  templateUrl: './request-subtype-add.component.html',
  styleUrls: ['./request-subtype-add.component.css']
})

export class RequestSubtypeAddComponent implements OnInit {
  saveForm: FormGroup;
  RST_selectFormGetDate: any;
  userBaseFieldName: any = [];
  priorityArr: any = [ ];
 labels: any = {}; /** LABEL CHANGES **/
  constructor(
    private componentLoaderService: ComponentLoaderService,
    private router: Router,
    private formBuilder: FormBuilder,
    private dialog: MatDialog, 
    private jsonApiService: JsonApiService,
    private requestSubtypeAddService: RequestSubtypeAddService) 
    { this.RST_selectFormGetDate = [];}
    
  ngOnInit() {
    
    this.componentLoaderService.display(true);
    this.saveForm = this.formBuilder.group({
      requestSubTypeCode: [''],
      requestTypeId: ['', Validators.required],
      requestSubTypeName: ['', Validators.required],
      requestSubTypeIsActive: [1],
      requestSubtypePriorty: ['', Validators.required]
    });
    this.getLabelDetails();
    if(localStorage.getItem('langCode') == 'en' ){
      this.priorityArr = [
        { name: 'Low', value: '1' },
        { name: 'Medium', value: '2' },
        { name: 'High', value: '3' }];
    }else if(localStorage.getItem('langCode') == 'jp'){
      this. priorityArr = [
        { name: '低い', value: '1' },
        { name: '中', value: '2' },
        { name: '高い', value: '3' }];
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

onloadSelectboxData() {

  this.requestSubtypeAddService.addsubrequest().subscribe(data => {
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
  let loadSelectBoxList = this.requestSubtypeAddService.load_selectBoxData().subscribe(data => {
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
    this.requestSubtypeAddService.addProjectList(finalval).subscribe(data => {
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
          this.router.navigate(['/request-subtype'])
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
          this.saveForm.controls['requestSubTypeName'].reset();
        })
      }
      this.componentLoaderService.display(false);
    })
  }
}
clearForm() {
  this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => this.router.navigate(['/request-subtype/request-subtype-add']));
}
}

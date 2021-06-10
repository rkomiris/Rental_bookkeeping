
import { Component, OnInit, OnDestroy} from '@angular/core';
import { MatDialog} from '@angular/material';
import {  FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router } from "@angular/router";
import { SublocationModifyService } from './sublocation-modify.service';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import { ComponentLoaderService } from '../../../shared/component-loader.service';
import { JsonApiService } from 'src/assets/api/json-api.service';

@Component({
  selector: 'app-sublocation-modify',
  templateUrl: './sublocation-modify.component.html',
  styleUrls: ['./sublocation-modify.component.css']
})
export class SublocationModifyComponent implements OnInit, OnDestroy {
  modifyForm: FormGroup;
  SL_selectFormGetDate: any;
  userBaseFieldName: any = [];
  labels: any = {}; /** LABEL CHANGES **/

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private sublocationModifyService: SublocationModifyService,
    private componentLoaderService: ComponentLoaderService,
    private jsonApiService: JsonApiService/** LABEL CHANGES **/) { }
  
    ngOnInit() {
    this.componentLoaderService.display(true);
    this.getLabelDetails(); /** LABEL CHANGES **/
    this.sublocation_list_modify();
    this.onloadSelectboxData();
    this.modifyForm = this.formBuilder.group({
      subLocationCode: ["",],
      id: ["", Validators.required],
      subLocationName: ["", Validators.required],
      subLocationIsActive: ["", Validators.required],
    });
  }
  getLabelDetails() {
    let lang;
    if(localStorage.getItem('langCode') !== null){
      lang = localStorage.getItem('langCode');
    }
    this.jsonApiService.fetch('/'+lang+'.json').subscribe((data) => {
        this.labels = data;
      });
  }

  sublocation_list_modify() {
    let tempData = JSON.parse(window.localStorage.getItem('sublocationId'));
    this.sublocationModifyService.load_modify_project(tempData).subscribe(data => {
      let subLocationModifyListGetData = JSON.parse(data['_body']);
      let subLocationModifyList_TableData = subLocationModifyListGetData.succesObject;
      this.userBaseFieldName = subLocationModifyListGetData.authSuccesObject.screenFieldDisplayVoList.map(
        element => {
          return element;
        }
      );
      this.modifyForm.patchValue(subLocationModifyList_TableData);
      this.componentLoaderService.display(false);
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
  }
  onloadSelectboxData() {
    let loadSelectBoxList = this.sublocationModifyService.load_selectBoxData().subscribe(data => {
      let SL_selectGetData = JSON.parse(data['_body']);
      this.SL_selectFormGetDate = SL_selectGetData.succesObject;
    }, error => {
      if (error.status === 401) {
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
      this.sublocationModifyService.update_modify_project(finalval).subscribe(data => {
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
            this.router.navigate(['/sublocation'])
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
        }
        this.componentLoaderService.display(false);
      });
    }
  }

ngOnDestroy(){
  localStorage.removeItem('sublocationId');
}

}

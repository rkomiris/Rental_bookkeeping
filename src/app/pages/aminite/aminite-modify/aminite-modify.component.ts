import { Component, OnInit, ViewChild, Output, Inject, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource,VERSION, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormBuilder, FormGroup, Validators, NgForm, Form } from '@angular/forms';
import { Router } from "@angular/router";
import { DOCUMENT } from '@angular/common';
import { AminiteModifyService } from './aminite-modify.service';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import { ComponentLoaderService } from '../../../shared/component-loader.service';
@Component({
  selector: 'app-aminite-modify',
  templateUrl: './aminite-modify.component.html',
  styleUrls: ['./aminite-modify.component.css']
})
export class AminiteModifyComponent implements OnInit, OnDestroy {

  modifyForm: FormGroup;
  userBaseFieldName: any = [];
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private aminiteModifyService: AminiteModifyService,
    private componentLoaderService: ComponentLoaderService) { }
  ngOnInit() {
    this.componentLoaderService.display(true);
    this.modifyForm = this.formBuilder.group({
      amenityCode:["",  ],
      amenityName:["", Validators.required ],
      amenityActive:["", Validators.required ],
      amenityVoList : [null],
      amenityList : [null],
      amenityId : [null]
    });
    this.aminite_list_modify();
  }
  aminite_list_modify() {
    let tempData = JSON.parse(window.localStorage.getItem('aminiteId'));
    this.aminiteModifyService.load_modify_project(tempData).subscribe(data => {
      let aminiteModifyListGetData = JSON.parse(data['_body']);
      let aminiteModifyList_TableData = aminiteModifyListGetData.succesObject;
      this.userBaseFieldName = aminiteModifyListGetData.succesObject.screenFieldDisplayVoList.map(
        element => {
          return element;
        }
      );
      this.modifyForm.patchValue(aminiteModifyList_TableData);
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
    this.aminiteModifyService.update_modify_project(finalval).subscribe(data => {
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
          this.router.navigate(['/amenity'])
        })
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
      }
      this.componentLoaderService.display(false);
    },
      error => {
        console.log(error)
      })
  }
}
ngOnDestroy(){
  localStorage.removeItem('aminiteId');
}
}


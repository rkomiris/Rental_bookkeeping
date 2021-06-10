import { Component, OnInit, ViewChild, Output, Inject } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource,VERSION, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormBuilder, FormGroup, Validators, NgForm, Form } from '@angular/forms';
import { Router } from "@angular/router";
import { DOCUMENT } from '@angular/common';
import { AminiteAddService } from './aminite-add.service';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import { ComponentLoaderService } from '../../../shared/component-loader.service';

@Component({
  selector: 'app-aminite-add',
  templateUrl: './aminite-add.component.html',
  styleUrls: ['./aminite-add.component.css']
})


export class AminiteAddComponent implements OnInit {
  saveForm: FormGroup;
  userBaseFieldName: any = [];
  constructor(
    private componentLoaderService: ComponentLoaderService,
    private router: Router, private dialog: MatDialog, private formBuilder: FormBuilder, private aminiteAddService: AminiteAddService) { }
  ngOnInit() {
    this.componentLoaderService.display(true);
    this.saveForm = this.formBuilder.group({
      amenityCode: [''],
      amenityName: ['', Validators.required],
      amenityActive: [true],
      amenityVoList : [null],
      amenityList : [null]
    });
    this.aminiteAddService.addaminity().subscribe(data => {
      let selectGetData = JSON.parse(data['_body']);
      this.userBaseFieldName = selectGetData.succesObject.screenFieldDisplayVoList.map(
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

  }

  clearForm() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => this.router.navigate(['/amenity/amenity-add']));
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
    this.aminiteAddService.addProjectList(finalval).subscribe(data => {
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
          this.router.navigate(['/amenity']);
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
      }
      this.componentLoaderService.display(false);
    },
      error => {
        console.log(error)
      });
  }
}











}

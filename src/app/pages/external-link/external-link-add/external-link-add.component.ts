import { Component, OnInit, ViewChild, Output, Inject } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource,VERSION, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormBuilder, FormGroup, Validators, NgForm, Form } from '@angular/forms';
import { Router } from "@angular/router";
import { DOCUMENT } from '@angular/common';
import { ExternalLinkAddService } from './external-link-add.service';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import { ComponentLoaderService } from '../../../shared/component-loader.service';
import { JsonApiService } from 'src/assets/api/json-api.service';

@Component({
  selector: 'app-external-link-add',
  templateUrl: './external-link-add.component.html',
  styleUrls: ['./external-link-add.component.css']
})


export class ExternalLinkAddComponent implements OnInit {
  labels: any = {}; /** LABEL CHANGES **/
  saveForm: FormGroup;
  userBaseFieldName: any = [];

  constructor(
    private jsonApiService: JsonApiService/** LABEL CHANGES **/,
    private componentLoaderService: ComponentLoaderService,
    private router: Router,
    private dialog: MatDialog, private formBuilder: FormBuilder, 
    private externalLinkAddService: ExternalLinkAddService) { }

  ngOnInit() {
    this.getLabelDetails(); /** LABEL CHANGES **/
    this.saveForm = this.formBuilder.group({
      externalLinkName: ['', Validators.required],
      externalLinkLogo: ['', Validators.required],
      externalLinkUrl: ['', Validators.required],
      externalLinkDisplaySeq: ['', Validators.required],
      externalLinkIsActive: [true],
    });
    this.externalLinkAddService.addexternal().subscribe(data => {
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

  }


numberOnly(event): boolean {
  const charCode = (event.which) ? event.which : event.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) {
    return false;
  }
  return true;
}

clearForm() {
  this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => this.router.navigate(['/external-link/external-link-add']));
}
onSubmit() {
  let logoFile = this.saveForm.value.externalLinkLogo;
  this.saveForm.value.externalLinkLogo = undefined;
  let temp = this.saveForm.value;
  temp.screenFieldDisplayVoList = this.userBaseFieldName;
  let formData = new FormData();
  let action = JSON.stringify(temp);
  formData.append('action', action);
  if (logoFile !== null && logoFile !== undefined && logoFile !== '') {
    let file = logoFile.files[0];
    formData.append('file', file);
  }
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
    this.externalLinkAddService.addProjectList(formData).subscribe(data => {
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
          this.router.navigate(['/external-link'])
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


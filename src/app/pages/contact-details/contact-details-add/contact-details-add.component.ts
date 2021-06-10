import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ComponentLoaderService } from 'src/app/shared/component-loader.service';
import { ContactDetailsAddService } from './contact-details-add.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { JsonApiService } from 'src/assets/api/json-api.service';

@Component({
  selector: 'app-contact-details-add',
  templateUrl: './contact-details-add.component.html',
  styleUrls: ['./contact-details-add.component.css']
})
export class ContactDetailsAddComponent implements OnInit {
  labels: any = {}; /** LABEL CHANGES **/
  saveForm: FormGroup;
  userBaseFieldName: any = [];

  constructor(
    private jsonApiService: JsonApiService/** LABEL CHANGES **/,
    private router: Router,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private contactDetailsAddService: ContactDetailsAddService,
    private componentLoaderService: ComponentLoaderService
  ) { }

  ngOnInit() {
    this.getLabelDetails(); /** LABEL CHANGES **/
    this.saveForm = this.formBuilder.group({
      emergencyContactName: ['', Validators.required],
      emergencyContactPath: ['', Validators.required],
    });
    this.loadData();
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
  loadData() {
    let modifyGetData = this.contactDetailsAddService.getById().subscribe(data => {
      let modifyData = JSON.parse(data['_body']);
      
      this.userBaseFieldName = modifyData.authSuccesObject.screenFieldDisplayVoList.map(
        element => {
          return element;
        });
      
        this.saveForm.patchValue({emergencyContactName: modifyData.succesObject.emergencyContactName});
        this.saveForm.patchValue({emergencyContactPath: modifyData.succesObject.emergencyContactPath});
        this.componentLoaderService.display(false);
      // }, error => {
      //   if (error.status === 401) {
      //     console.log("Error");
      //   }
      // });
    });
  }

  onSubmit(saveForm){
    let seqmodel: any = {};  

    if(saveForm.value.emergencyContactName == null || saveForm.value.emergencyContactPath == null){
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        panelClass: 'btnCenter',
        width: 'auto',
        data: {
          title: 'Alert',
          message: 'mandatory',
          btnYes: 'OK'
        }
      });
    }
   
    seqmodel.emergencyContactName = saveForm.controls.emergencyContactName.value;
    
    let file = saveForm.value.emergencyContactPath.files[0];
    let formData = new FormData();
    let action = JSON.stringify(seqmodel);    
    formData.append('action', action);
    formData.append('file', file);

    this.contactDetailsAddService.add(formData).subscribe(
      data => {
        let resp = JSON.parse(data['_body']);
        if (resp.responseCode === '200') {
          const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            disableClose: false,
            panelClass: 'btnCenter',
            width: 'auto',
            data: {
              title: 'Info',
              server:'servermessage',
              message: resp.responseMessage,
              btnYes: 'OK'
            }
          });
          dialogRef.afterClosed().subscribe(data => {
            this.router.navigate(['/contact-details']);
          });
        } else {
          const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            disableClose: false,
            panelClass: 'btnCenter',
            width: 'auto',
            data: {
              title: 'Alert',
              server:'servermessage',
              message: resp.responseMessage,
              btnYes: 'OK'
            }
          });
        }
        this.componentLoaderService.display(false);
      },
      error => {
        console.log(error);
      }
    );
  }
}


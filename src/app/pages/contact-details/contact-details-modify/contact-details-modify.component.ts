import { Component, OnInit, OnDestroy } from '@angular/core';
import { ContactDetailsModifyService } from './contact-details-modify.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ComponentLoaderService } from 'src/app/shared/component-loader.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { ContactDetailsViewService } from '../contact-details-view/contact-details-view.service';
import { JsonApiService } from 'src/assets/api/json-api.service';

@Component({
  selector: 'app-contact-details-modify',
  templateUrl: './contact-details-modify.component.html',
  styleUrls: ['./contact-details-modify.component.css']
})
export class ContactDetailsModifyComponent implements OnInit {
  labels: any = {}; /** LABEL CHANGES **/
  saveForm: FormGroup;
  userBaseFieldName: any = [];
  formField: any = [];

  constructor(
    private jsonApiService: JsonApiService/** LABEL CHANGES **/,
    private router: Router,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private contactDetailsModifyService: ContactDetailsModifyService,
    private contactDetailsViewService: ContactDetailsViewService,
    private componentLoaderService: ComponentLoaderService
  ) { }

  ngOnInit() {
    this.getLabelDetails(); /** LABEL CHANGES **/
    this.componentLoaderService.display(false);
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
    let modifyGetData = this.contactDetailsModifyService.getById().subscribe(data => {
      let modifyData = JSON.parse(data['_body']);
      this.formField = modifyData.succesObject;
      this.userBaseFieldName = modifyData.authSuccesObject.screenFieldDisplayVoList.map(
        element => {
          return element;
        });

      this.saveForm.patchValue({ emergencyContactName: modifyData.succesObject.emergencyContactName });
      this.saveForm.patchValue({ emergencyContactPath: modifyData.succesObject.emergencyContactPath });
      this.componentLoaderService.display(false);

    });
  }

  onSubmit(saveForm){
    let seqmodel: any = {};
    
    seqmodel.emergencyContactName = saveForm.controls.emergencyContactName.value;
    seqmodel.emergencyContactPathId = localStorage.getItem('emergencyId');

    let formData = new FormData();
    let action = JSON.stringify(seqmodel);    
    formData.append('action', action);  

    if(saveForm.value.emergencyContactPath.files !== undefined){
      let file = saveForm.value.emergencyContactPath.files[0];
      formData.append('file', file);
    }
  
    this.contactDetailsModifyService.modify(formData).subscribe(
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
            localStorage.removeItem('emergencyId');
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

  download(){
    let event = localStorage.getItem('emergencyId');
    
    this.contactDetailsViewService.picDownloadFn( event ).subscribe(
      data => {
        let headers = data.headers;
        let contentType =
          headers.get("Content-type") || "application/octet-stream";
        let fileHeaders = headers.get("Content-Disposition");
        // let startIndex = fileHeaders.indexOf("filename =") + 11; // Adjust '+ 10' if filename is not the right one.
        // let endIndex = fileHeaders.length - 1; // Check if '- 1' is necessary
        // let filename = fileHeaders.substring(startIndex, endIndex);
        let filename = this.saveForm.value.emergencyContactPath;
        let urlCreator =
          window.URL ||
          (<any>window).webkitURL ||
          (<any>window).mozURL ||
          (<any>window).msURL;
        if (urlCreator) {
          
          let blob = new Blob([data["body"]], { type: contentType });
          let url = urlCreator.createObjectURL(blob);
          let a = document.createElement("a");
          document.body.appendChild(a);
          a.style.display = "none";
          a.href = url;
          a.download = filename; // you may assign this value from header as well
          a.click();
          window.URL.revokeObjectURL(url);
        }
      },
      error => {
        if (error.status === 401) {
        }
        console.log(error);
      });
  
  }

  get(){
    this.formField.emergencyContactPath = "";
  }

  ngOnDestroy(){
    localStorage.removeItem('emergencyId');
  }
}


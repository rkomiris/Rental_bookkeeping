import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ContactDetailsViewService } from './contact-details-view.service';
import { ComponentLoaderService } from 'src/app/shared/component-loader.service';
import { ContactDetailsViewModule } from './contact-details-view.module';
import { JsonApiService } from 'src/assets/api/json-api.service';

@Component({
  selector: 'app-contact-details-view',
  templateUrl: './contact-details-view.component.html',
  styleUrls: ['./contact-details-view.component.css']
})
export class ContactDetailsViewComponent implements OnInit {
  labels: any = {}; /** LABEL CHANGES **/
  saveForm: FormGroup;
  userBaseFieldName: any = [];
  formField: any = [];

  constructor(
    private jsonApiService: JsonApiService/** LABEL CHANGES **/,
    private router: Router,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private contactDetailsViewService: ContactDetailsViewService,
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
    let modifyGetData = this.contactDetailsViewService.getById().subscribe(data => {
      let modifyData = JSON.parse(data['_body']);
      this.formField = modifyData.succesObject;
      this.userBaseFieldName = modifyData.authSuccesObject.screenFieldDisplayVoList.map(
        element => {
          return element;
        });
      
        this.saveForm.patchValue({emergencyContactName: modifyData.succesObject.emergencyContactName});
        this.saveForm.patchValue({emergencyContactPath: modifyData.succesObject.emergencyContactPath});
        this.componentLoaderService.display(false);
    });
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

  ngOnDestroy(){
    localStorage.removeItem('emergencyId');
  }
}




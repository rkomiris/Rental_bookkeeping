import { Component, OnInit, ViewChild, Output, Inject } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, VERSION, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormBuilder, FormGroup, Validators, NgForm, Form } from '@angular/forms';
import { Router } from "@angular/router";
import { DOCUMENT } from '@angular/common';
import { ExternalLinkModifyService } from './external-link-modify.service';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import { ComponentLoaderService } from '../../../shared/component-loader.service';
import { JsonApiService } from 'src/assets/api/json-api.service';

@Component({
  selector: 'app-external-link-modify',
  templateUrl: './external-link-modify.component.html',
  styleUrls: ['./external-link-modify.component.css']
})


export class ExternalLinkModifyComponent implements OnInit {
  labels: any = {}; /** LABEL CHANGES **/
  modifyForm: FormGroup;
  userBaseFieldName: any = [];
  exLinkModifyList_TableData: any = [];
  attachment: Boolean;
  constructor( private jsonApiService: JsonApiService/** LABEL CHANGES **/,
    private componentLoaderService: ComponentLoaderService, private router: Router, private formBuilder: FormBuilder, private dialog: MatDialog, private externalLinkModifyService: ExternalLinkModifyService) { }


  ngOnInit() {
    this.getLabelDetails(); /** LABEL CHANGES **/
    this.componentLoaderService.display(true);
    this.exlink_list_modify();
    this.attachment = false;
    this.modifyForm = this.formBuilder.group({
      externalLinkName: ["", Validators.required],
      externalLinkLogo: ["", Validators.required],
      externalLinkUrl: ["", Validators.required],
      externalLinkDisplaySeq: ["", Validators.required],
      externalLinkIsActive: ["", Validators.required],
      id: [""]
    });
  }

  exlink_list_modify() {

    let tempData = JSON.parse(window.localStorage.getItem('id'));

    this.externalLinkModifyService.load_modify_project(tempData).subscribe(data => {
      let exLinkModifyListGetData = JSON.parse(data['_body']);
      this.exLinkModifyList_TableData = exLinkModifyListGetData.succesObject;
      this.userBaseFieldName = exLinkModifyListGetData.authSuccesObject.screenFieldDisplayVoList.map(
        element => {
          return element;
        }
      );
      if (this.exLinkModifyList_TableData.externalLinkLogo !== null) {
        this.attachment = true;
      }
      this.modifyForm.patchValue(this.exLinkModifyList_TableData);
      this.componentLoaderService.display(false);
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    })
  }

  selection(modifyForm){
    
    if(this.exLinkModifyList_TableData.externalLinkLogo !== modifyForm.externalLinkLogo){
      this.exLinkModifyList_TableData.externalLinkLogo  = "";
    }

  }
  onSubmit() {
    let logoFile = this.modifyForm.value.externalLinkLogo;
    this.modifyForm.value.externalLinkLogo = undefined;
    let temp = this.modifyForm.value;
    temp.screenFieldDisplayVoList = this.userBaseFieldName;
    let formData = new FormData();
    let action = JSON.stringify(temp);
    formData.append('action', action);
    if (logoFile.files && logoFile !== null && logoFile !== undefined && logoFile !== '') {
      let file = logoFile.files[0];
      formData.append('file', file);
    }
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
      this.externalLinkModifyService.update_modify_project(formData).subscribe(data => {
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
      });
    }
  }

  pictureDownload() {
    if (this.exLinkModifyList_TableData.externalLinkLogo == null) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        panelClass: 'btnCenter',
        width: 'auto',
        data: {
          title: 'Alert',
          message: 'attachment',
          btnYes: 'OK',
        }
      });
    }
    else {
      this.externalLinkModifyService.picDownloadExternal(localStorage.getItem('id')).subscribe(
        data => {
          let headers = data.headers;
          let contentType =
            headers.get("Content-type") || "application/octet-stream";
          let fileHeaders = headers.get("Content-Disposition");
          // let startIndex = fileHeaders.indexOf("filename =") + 11; // Adjust '+ 10' if filename is not the right one.
          // let endIndex = fileHeaders.length - 1; // Check if '- 1' is necessary
          // let filename = fileHeaders.substring(startIndex, endIndex);
          let filename = this.modifyForm.value.externalLinkLogo;
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


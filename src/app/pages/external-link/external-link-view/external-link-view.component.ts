import { Component, OnInit, OnDestroy} from '@angular/core';
import { FormBuilder, FormGroup} from '@angular/forms';
import { ExternalLinkViewService } from './external-link-view.service';
import { ComponentLoaderService } from '../../../shared/component-loader.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material';
import { JsonApiService } from 'src/assets/api/json-api.service';

@Component({
  selector: 'app-external-link-view',
  templateUrl: './external-link-view.component.html',
  styleUrls: ['./external-link-view.component.css']
})

export class ExternalLinkViewComponent implements OnInit , OnDestroy{
  labels: any = {}; /** LABEL CHANGES **/
  viewForm: FormGroup;
  userBaseFieldName: any = [];
  exLinkViewList_TableData: any = [];
  constructor( private jsonApiService: JsonApiService/** LABEL CHANGES **/,private componentLoaderService: ComponentLoaderService, private formBuilder: FormBuilder,private dialog: MatDialog, private externalLinkViewService: ExternalLinkViewService) { }

  ngOnInit() {
    this.getLabelDetails(); /** LABEL CHANGES **/
    this.componentLoaderService.display(true);
    this.viewForm = this.formBuilder.group({
      externalLinkName:["", ],
      externalLinkLogo:["",  ],
      externalLinkUrl:["",  ],
      externalLinkDisplaySeq:["",  ],
      externalLinkIsActive:["", ],
    });
    this.exlink_list_view();
  }

  exlink_list_view() {
    let tempData = JSON.parse(window.localStorage.getItem('id'));
    this.externalLinkViewService.load_view_project(tempData).subscribe(data => {
      let exLinkViewListGetData = JSON.parse(data['_body']);
      let exLinkViewList_TableData = exLinkViewListGetData.succesObject;
      this.exLinkViewList_TableData = exLinkViewListGetData.succesObject;
      this.userBaseFieldName = exLinkViewListGetData.authSuccesObject.screenFieldDisplayVoList.map(
        element => {
          return element;
        }
      );
      this.viewForm.patchValue(exLinkViewList_TableData);
      this.componentLoaderService.display(false);
    }, error => {
      if(error.status === 401)
      {
        console.log("Error");
      }
    })

}

pictureDownload() {
  if (this.exLinkViewList_TableData.externalLinkLogo == null) {
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
    this.externalLinkViewService.picDownloadExternal(localStorage.getItem('id')).subscribe(
      data => {
        let headers = data.headers;
        let contentType =
          headers.get("Content-type") || "application/octet-stream";
        let fileHeaders = headers.get("Content-Disposition");
        // let startIndex = fileHeaders.indexOf("filename =") + 11; // Adjust '+ 10' if filename is not the right one.
        // let endIndex = fileHeaders.length - 1; // Check if '- 1' is necessary
        // let filename = fileHeaders.substring(startIndex, endIndex);
          let filename = this.viewForm.value.externalLinkLogo;
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

ngOnDestroy(){
  localStorage.removeItem('id');
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


import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { LandingPageService } from '../../landing-page.service';
import { environment } from 'src/environments/environment';
import { WidgetsService } from 'src/app/pages/widgets/widgets.service';
import { DomSanitizer } from '@angular/platform-browser';
import { JsonApiService } from 'src/assets/api/json-api.service';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {
  fullurl = environment.API_HOST;
  url: string = this.fullurl.substring(0, this.fullurl.length - 3) + "/pic/widgets/";
  imagename: string;
  widgetId: any ; 
  previewPicture;
  picName: any;
  labels: any = {}; 
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private dialog: MatDialog, 
              private _sanitizer: DomSanitizer,
              private jsonApiService: JsonApiService,
              private widgetsModifyService: WidgetsService,) {}
  imageDownloadName;
  ngOnInit() {

    if (this.data.detail.widgetDetailAttPath !== null) {
      if (this.data.detail.widgetDetailAttPath && this.data.detail.widgetDetailAttPath.includes(',')) {
        this.picName = this.data.detail.widgetDetailAttPath.split(",");
      }else if (this.data.detail.widgetDetailAttPath != null && !this.data.detail.widgetDetailAttPath.includes(',')) {
        this.picName = [this.data.detail.widgetDetailAttPath];
      } 
    }



    this.imagename  = this.picName[this.data.index];

    this.imageDownloadName = this.picName[this.data.index].split("widgets/")
    this.previewPicture = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
    +  this.data.detail.widgetDetailAttPathImageLoad[this.data.index]);
    this.widgetId = localStorage.getItem('widgetDetailId');
    this.getLabelDetails();
  }
  getLabelDetails()
  {
    let lang;
    if(localStorage.getItem('langCode') !== null){
      lang = localStorage.getItem('langCode');
    }
    this.jsonApiService.fetch('/'+lang+'.json').subscribe((data) => {
        this.labels = data;
      });
  }

  download(){
    let a = this.widgetsModifyService.indiviudalattDownloadFn(this.widgetId, this.imageDownloadName[1]).subscribe(
      data => {
        let headers = data.headers;
        let contentType =
          headers.get("Content-type") || "application/octet-stream";
        let fileHeaders = headers.get("Content-Disposition");
        // let startIndex = fileHeaders.indexOf("filename =") + 11; // Adjust '+ 10' if filename is not the right one.
        // let endIndex = fileHeaders.length - 1; // Check if '- 1' is necessary
        // let filename = fileHeaders.substring(startIndex, endIndex);
        let filename = this.imageDownloadName[1];
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

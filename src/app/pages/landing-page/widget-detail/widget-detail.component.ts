import { Component, OnInit, Inject } from '@angular/core';
import {  MAT_DIALOG_DATA , MatDialog} from '@angular/material';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import {environment } from '../../../../environments/environment';
import { LandingPageService } from './../landing-page.service';
import { PreviewComponent } from './preview/preview.component';
import { DomSanitizer } from '@angular/platform-browser';
import { JsonApiService } from 'src/assets/api/json-api.service';
@Component({
  selector: 'app-widget-detail',
  templateUrl: './widget-detail.component.html',
  // styleUrls: ['./widget-detail.component.css']
  styleUrls: ['./widget-detail-srmav.component.css']
})
export class WidgetDetailComponent implements OnInit {
  fullurl = environment.API_HOST;
  url: string = this.fullurl.substring(0, this.fullurl.length - 3) + "/pic/widgets/";

  counter = 0;
  applicaitonDate: any = [];
  curentCount = 0;
  appobjlength;
  totalSlides;
  widthtomove;
  labels: any = {};
  list:any = [];

  attachPicture : any = [];


  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private dialog: MatDialog, 
              private _sanitizer: DomSanitizer,
              private service: LandingPageService,
              private jsonApiService: JsonApiService) { }

  ngOnInit() {
    this.mappingObject(this.data);
    localStorage.setItem("widgetDetailId",this.data.widgetDetailId);
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

  mappingObject(data){

    for(let i = 0;  i < this.data.widgetDetailAttPathImageLoad.length; i++){
      this.attachPicture[i] =  this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
          +  this.data.widgetDetailAttPathImageLoad[i]);
    }
    
    if (data.widgetDetailAttPath.includes(',')) {
      this.list = data.widgetDetailAttPath.split(",");
    }else {
      this.list = [data.widgetDetailAttPath];
    }
  }
  
  widgetDetailIdcall(id) {
   this.service.attDownloadFn(id).subscribe(
      data1 => {
        let data: any = data1;
        let headers = data.headers;
        let contentType =
          headers.get("Content-type") || "application/octet-stream";
        let fileHeaders = headers.get("Content-Disposition");
        // let startIndex = fileHeaders.indexOf("filename =") + 11; // Adjust '+ 10' if filename is not the right one.
        // let endIndex = fileHeaders.length - 1; // Check if '- 1' is necessary
        // let filename = fileHeaders.substring(startIndex, endIndex);
        let filename = "attachmentDownload.zip";
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
  descriptionPopup(mess){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: false,
      panelClass: 'btnCenter',
      width: 'auto',
      data: {
        message: mess,
        title: 'viewFullDescription',
        mess : '1'
      }
    });
  }

  preview(image, index){
    const dialogRef = this.dialog.open(PreviewComponent, {
      disableClose: false,
      panelClass: 'btnCenter',
      height: '500px',
      width: '500px',
      //width: 'auto',
      data: {
        message: 1,
        title: 'viewFullDescription',
        mess : '1',
        value: image,
        detail: this.data,
        index: index
      }
    });
  }

  ngOnDestroy(){
    localStorage.removeItem('widgetId');
    localStorage.removeItem('widgetDetailId');
  }

  goLeft(){
    let elem = document.getElementById("caroitemsapplinks");

    this.curentCount++;
    if(this.curentCount>=this.totalSlides){
        this.curentCount = 0;
    }else if(this.curentCount<=0){
        this.curentCount = this.totalSlides;
    }
    let y = elem.style.left = -(this.curentCount*this.widthtomove) +'px';
  }

  goRight(){
    let elem = document.getElementById("caroitemsapplinks");

   if(this.curentCount>=this.totalSlides){
       this.curentCount = 0;
   }else if(this.curentCount<=0){
       this.curentCount = this.totalSlides;
   }
   this.curentCount--;
   let y = elem.style.left = +(this.curentCount*this.widthtomove) +'px';
  }

  ngAfterViewInit(){
    let caroitem = "+100px";
    let marginforitem = 10;
    let elem = document.getElementById("caroitemsapplinks");

    let caroitemwidth = caroitem.split(/(\d+)/);
    let itemwidth  = +caroitemwidth[1] + marginforitem;
    let widthitems = window.getComputedStyle(document.getElementById("caroitemsapplinks"),null).getPropertyValue("width");
    
    let containerwidth = window.getComputedStyle(document.getElementsByClassName("caroconatiner")[0],null).getPropertyValue("width");
     let widthpix = widthitems.split(/(\d+)/);
     let actualwidth = +widthpix[1];

     let actualitems = Math.trunc(actualwidth/itemwidth);

     /* width moving part */
     let lefttomove = (actualwidth - itemwidth*actualitems);
    this.widthtomove = actualwidth-lefttomove;

    /* calculating slides to move */
    let slidestoshow =  Math.trunc(elem.children.length/actualitems);
     let remaining = elem.children.length%actualitems;
     this.totalSlides = slidestoshow;

    if(remaining>0){
      this.totalSlides = slidestoshow+remaining;
     }else{
      this.totalSlides = slidestoshow;
    }

  }
}

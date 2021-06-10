import { ApplicationService } from './application.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { HeaderService } from 'src/app/shared/layout/app-layout/header/header.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  // styleUrls: ['./application.component.css']
  styleUrls: ['./application-srmav.component.css']
})
export class ApplicationComponent implements OnInit {

  applicaitonData: object;

  curentCount: number = 0;

  totalSlides;
  widthtomove;
  actualitems;
  lefttomove;
  message : any;

  appobjlength: number;

  constructor(private dialog : MatDialog,private headerService : HeaderService,private appService: ApplicationService, private router: Router,) { }

  dataLoaded() {

     let caroitem = "+100px";
     let marginforitem = 10;
     let elem = document.getElementById("caroitemsapp");

     let caroitemwidth = caroitem.split(/(\d+)/);
     let itemwidth  = +caroitemwidth[1] + marginforitem;

     let widthitems = window.getComputedStyle(document.getElementById("caroitemsapp"),null).getPropertyValue("width");
     let containerwidth = window.getComputedStyle(document.getElementsByClassName("caroconatiner")[0],null).getPropertyValue("width");
     let widthpix = widthitems.split(/(\d+)/);
     let actualwidth = +widthpix[1];
     let actualitems = Math.trunc(actualwidth/itemwidth);

     /* width moving part */

     let lefttomove = (actualwidth - itemwidth * actualitems);

     this.widthtomove = actualwidth - lefttomove;

    /* calculating slides to move */

     let slidestoshow =  Math.trunc(this.appobjlength / actualitems);

     let remaining = this.appobjlength % actualitems;
     this.totalSlides = slidestoshow;


    //elem.style.paddingLeft = lefttomove+'px';
     if (remaining > 0) {
      this.totalSlides = slidestoshow+1;
     } else {
      this.totalSlides = slidestoshow;
    }

  }

   goLeft() {
    let elem = document.getElementById("caroitemsapp");


    this.curentCount++;

    if(this.curentCount>=this.totalSlides){
        this.curentCount = 0;
    }else if(this.curentCount<=0){
        this.curentCount = this.totalSlides;
    }
    let y = elem.style.left = -(this.curentCount*this.widthtomove) +'px';

  }

  goRight(){
    let elem = document.getElementById("caroitemsapp");

   if(this.curentCount>=this.totalSlides){
       this.curentCount = 0;
   }else if(this.curentCount<=0){
       this.curentCount = this.totalSlides;
   }
   this.curentCount--;
   let y = elem.style.left = -(this.curentCount*this.widthtomove) +'px';

}




  ngOnInit() {

    this.appService.getWidgetData().subscribe(data => {
      let resp = JSON.parse(data['_body']);
      let requestdefaultList = resp.succesObject;
      this.applicaitonData = requestdefaultList.requestTypeVoList;
      this.appobjlength = Object.keys(this.applicaitonData).length;
    },
    error => {
      console.log(error);
    }/*,
    () => {
      this.dataLoaded();
    }*/
    );
    this.headerService.currentMessage.subscribe(message => {this.message = message
    });
  }
  gotoURL(e) {
    let filter = this.message.filter(a => a.screenUrl === '/request');
   if (filter.length === 1) {
    localStorage.setItem('requestTypeId', e.requestTypeId);
    localStorage.setItem('requestTypeName', e.requestTypeName);
    this.router.navigate([e.requestTypeUrl]);
   }else{
    const dialogRef2 = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: false,
      width: 'auto',
      data: {
        title: 'Info',
        message: 'access',
        btnYes: 'Ok'
      }
    });
   }
   }
















}


import { element } from 'protractor';
import { Component, OnInit,AfterViewInit } from '@angular/core';
import { ApplicationService } from '../application/application.service';

@Component({
  selector: 'app-moreapp',
  templateUrl: './moreapp.component.html',
  // styleUrls: ['./moreapp.component.css']
  styleUrls: ['./moreapp-srmav.component.css']
})
export class MoreappComponent implements OnInit {


  curentCount:number = 0;

  totalSlides;
  widthtomove;
  applicaitonmoreData: any = [];

  constructor( private applicationService: ApplicationService) { }

  ngAfterViewInit(){
    let caroitem = "+100px";
    let marginforitem = 10;
    let elem = document.getElementById("caroitems");

    let caroitemwidth = caroitem.split(/(\d+)/);
    let itemwidth  = +caroitemwidth[1] + marginforitem;

    let widthitems = window.getComputedStyle(document.getElementById("caroitems"),null).getPropertyValue("width");
    
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


    // elem.style.paddingLeft = lefttomove+'px';
    if(remaining>0){
      this.totalSlides = slidestoshow+remaining;
     }else{
      this.totalSlides = slidestoshow;
    }

  }

   goLeft(){
    let elem = document.getElementById("caroitems");

    this.curentCount++;
    if(this.curentCount>=this.totalSlides){
        this.curentCount = 0;
    }else if(this.curentCount<=0){
        this.curentCount = this.totalSlides;
    }
    let y = elem.style.left = -(this.curentCount*this.widthtomove) +'px';


  }

  ngOnInit() {
    this.applicationService.getmoreappData().subscribe(data => {
      let resp = JSON.parse(data['_body']);
      let requestdefaultList = resp.succesObject;
      // let kkk = data['succesObject'];
      this.applicaitonmoreData = requestdefaultList;
      // this.appobjlength = Object.keys(this.applicaitonData).length;
    },
    error => {
      console.log(error);
    }/*,
    () => {
      this.dataLoaded();
    }*/
    );
  }
  callarg(e) {
    window.open(e, '_blank');
  }
 goRight(){
     let elem = document.getElementById("caroitems");

    if(this.curentCount>=this.totalSlides){
        this.curentCount = 0;
    }else if(this.curentCount<=0){
        this.curentCount = this.totalSlides;
    }
    this.curentCount--;
    let y = elem.style.left = +(this.curentCount*this.widthtomove) +'px';
}





}


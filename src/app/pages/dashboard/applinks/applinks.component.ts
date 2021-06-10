import { ApplinksService } from './applinks.service';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
@Component({
  selector: 'app-applinks',
  templateUrl: './applinks.component.html',
  // styleUrls: ['./applinks.component.css'],
  styleUrls: ['./applinks-srmav.component.css']
})
export class ApplinksComponent implements OnInit {

  counter = 0;
  applicaitonDate: any = [];
  curentCount = 0;
  appobjlength;

  totalSlides;
  widthtomove;
  fullurl = environment.API_HOST;
  url: string = this.fullurl.substring(0, this.fullurl.length - 3);
  constructor(private appService: ApplinksService,
    private _sanitizer: DomSanitizer,
    private router: Router,) { }

  ngOnInit() {

    this.appService.getWidgetData().subscribe(data => {
      let resdata = JSON.parse(data['_body']);
      this.applicaitonDate = resdata.succesObject;
      this.applicaitonDate.sort((a, b) => {
        return a.externalLinkDisplaySeq - b.externalLinkDisplaySeq
      });

      for (let i = 0; i < this.applicaitonDate.length; i++) {
        this.applicaitonDate[i].externalLinkLogoImage = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
          + this.applicaitonDate[i].externalLinkLogoImage);
      }
    },
      error => {
        console.log(error);
      },
      () => {
        // this.dataLoaded();
      }
    );

  }
  ngAfterViewInit() {
    let caroitem = "+100px";
    let marginforitem = 10;
    let elem = document.getElementById("caroitemsapplinks");

    let caroitemwidth = caroitem.split(/(\d+)/);
    let itemwidth = +caroitemwidth[1] + marginforitem;
    let widthitems = window.getComputedStyle(document.getElementById("caroitemsapplinks"), null).getPropertyValue("width");

    let containerwidth = window.getComputedStyle(document.getElementsByClassName("caroconatiner")[0], null).getPropertyValue("width");
    let widthpix = widthitems.split(/(\d+)/);
    let actualwidth = +widthpix[1];

    let actualitems = Math.trunc(actualwidth / itemwidth);

    /* width moving part */

    let lefttomove = (actualwidth - itemwidth * actualitems);

    this.widthtomove = actualwidth - lefttomove;

    /* calculating slides to move */

    let slidestoshow = Math.trunc(elem.children.length / actualitems);
    let remaining = elem.children.length % actualitems;
    this.totalSlides = slidestoshow;

    if (remaining > 0) {
      this.totalSlides = slidestoshow + remaining;
    } else {
      this.totalSlides = slidestoshow;
    }

  }

  goLeft() {
    let elem = document.getElementById("caroitemsapplinks");

    this.curentCount++;
    if (this.curentCount >= this.totalSlides) {
      this.curentCount = 0;
    } else if (this.curentCount <= 0) {
      this.curentCount = this.totalSlides;
    }
    let y = elem.style.left = -(this.curentCount * this.widthtomove) + 'px';

  }

  goRight() {
    let elem = document.getElementById("caroitemsapplinks");
    if (this.curentCount >= this.totalSlides) {
      this.curentCount = 0;
    } else if (this.curentCount <= 0) {
      this.curentCount = this.totalSlides;
    }
    this.curentCount--;
    let y = elem.style.left = +(this.curentCount * this.widthtomove) + 'px';
  }

  gotoURL(e) {
    window.open("http://" + e, '_blank');
  }
}


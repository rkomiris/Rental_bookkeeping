import { Component, OnInit, ViewChild, Output, EventEmitter, Inject, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, VERSION, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormBuilder, FormGroup, FormArray, Validators, NgForm, Form } from '@angular/forms';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';
import { PhoneBookService } from './phone-book.service';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import {environment } from '../../../environments/environment';
import { EmergencyContactComponent } from './emergency-contact/emergency-contact.component';
import { JsonApiService } from 'src/assets/api/json-api.service';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-phone',
  templateUrl: './phone.component.html',
  // styleUrls: ['./phone.component.css']
  styleUrls: ['./phone-srmav.component.css']
})

export class PhoneComponent implements OnInit {
  labels: any = {}; /** LABEL CHANGES **/
 searchlist: any = [];
 searchDuplicateList: any = [];
 singleobj: any;
 term: any = '';
 // singleselectedItem: any;
 selectedItem: any;
 displayalpha: any = [
 {val : 'a', display: 'A'},
 {val : 'b', display: 'B'},
 {val : 'c', display: 'C'},
 {val : 'd', display: 'D'},
 {val : 'e', display: 'E'},
 {val : 'f', display: 'F'},
 {val : 'g', display: 'G'},
 {val : 'h', display: 'H'},
 {val : 'i', display: 'I'},
 {val : 'j', display: 'J'},
 {val : 'k', display: 'K'},
 {val : 'l', display: 'L'},
 {val : 'm', display: 'M'},
 {val : 'n', display: 'N'},
 {val : 'o', display: 'O'},
 {val : 'p', display: 'P'},
 {val : 'q', display: 'Q'},
 {val : 'r', display: 'R'},
 {val : 's', display: 'S'},
 {val : 't', display: 'T'},
 {val : 'u', display: 'U'},
 {val : 'v', display: 'V'},
 {val : 'w', display: 'W'},
 {val : 'x', display: 'X'},
 {val : 'y', display: 'Y'},
 {val : 'z', display: 'Z'}
];
fullurl = environment.API_HOST;
  url: string = this.fullurl.substring(0, this.fullurl.length - 3);

displayNoRecords:Boolean;
searchcont = false;
  constructor(
    private jsonApiService: JsonApiService/** LABEL CHANGES **/,
    @Inject(DOCUMENT) private document: Document,
    private formBuilder: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private phoneBookService: PhoneBookService,
    private _sanitizer: DomSanitizer,
  ) { }

  ngOnInit() {
    this.getLabelDetails(); /** LABEL CHANGES **/
   let kk: any = {employeeName: 'a'};
   this.phoneBookService.search_list(kk).subscribe(data => {
    let SearchData = JSON.parse(data['_body']);
    this.searchlist = SearchData.succesObject;
    this.selectedItem = 'a';
    if(this.searchlist == null || this.searchlist == undefined ){
      this.displayNoRecords = false
    }else{
      this.displayNoRecords = true;
    }
  });

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
  callserch(kk) {
    this.phoneBookService.search_list(kk).subscribe(data => {
      let SearchData = JSON.parse(data['_body']);
      this.singleobj = undefined;
      this.searchlist = SearchData.succesObject;
      if(this.searchlist == null || this.searchlist == undefined ){
        this.displayNoRecords = false
      }else{
        this.displayNoRecords = true;
      }
    });
  }
  changeserch(arg) {
    this.selectedItem = {};
    let kk: any = {employeeName: arg};
    this.callserch(kk);
    this.selectedItem = arg;
  }
  profileImage;
  passsingle(sinobj) {
    this.singleobj = sinobj;
    this.profileImage  = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
    +  this.singleobj.imageLoad);
  }
  applyFilter(filterValue: string) {
    this.searchlist.filter = filterValue.trim().toLowerCase();
    if (this.searchlist.filteredData.length > 0 || this.searchlist.selected.length > 0) {
      this.displayNoRecords = false;
     } else {
      this.displayNoRecords = true;
    }

  }

  emergencyList(){
    const dialogRef = this.dialog.open(EmergencyContactComponent,
      {
        disableClose: false,
        panelClass: 'full-width-dialog',
        data: '1'
      });
  }

}

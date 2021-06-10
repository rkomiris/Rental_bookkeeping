import { Component, OnInit, ViewChild, Output, EventEmitter, Inject, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, VERSION, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormBuilder, FormGroup, FormArray, Validators, NgForm, Form } from '@angular/forms';
import { Router } from "@angular/router";
import { DOCUMENT } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';
import { FaqService } from './faq.service';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';



@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})

export class FaqComponent implements OnInit {

  panelOpenState = false;

  customCollapsedHeight: string = '34px';
  customExpandedHeight: string = '34px';

 // icon: boolean = false;
 // arrowclick(){
 //   this.panelOpenState ? 'open' : 'closed'
 //   this.icon = !this.icon;
 // }

  constructor(private faq_service:FaqService) { }

  ngOnInit() {
    this.faq_details();
   }



   items:any;

   faq_details(){
    let loadFAQ = this.faq_service.get_faq().subscribe(data=>{
    let faq_getData = JSON.parse(data['_body']);
    if (faq_getData.succesObject != undefined) {
      this.items =  faq_getData.succesObject;

    }


    },error=>{
      if(error.status === 401)
      {
        console.log("Error");
      }
    })
  }




}

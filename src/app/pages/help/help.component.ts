import { Component, OnInit, ViewChild, Output, EventEmitter, Inject, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, VERSION, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormBuilder, FormGroup, FormArray, Validators, NgForm, Form } from '@angular/forms';
import { Router } from "@angular/router";
import { DOCUMENT } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';
import { HelpService } from './help.service';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})

export class HelpComponent implements OnInit, OnDestroy {

  subscriptionlist:Subscription[]=[];  

  constructor(private help_service:HelpService) { }

  ngOnInit() {
    this.helpSearchData();
  }


  helpsearch : string;

  
  items:any;
  isHidden = true; 

  helpSearchData(){
    let loadHelpSearch = this.help_service.posthelp(this.helpsearch).subscribe(data=>{
      let helpdetails = JSON.parse(data['_body']);
      if (helpdetails.length == 0) {
          this.items =  helpdetails['successObject'];
          this.isHidden = !this.isHidden;
        } else {
          this.items =  helpdetails['successObject'];
          this.isHidden = true; 
        }

      },error=>{        
        if(error.status === 401)
        {
          console.log("Error");
        }
      })
      
      this.subscriptionlist.push(loadHelpSearch);
  }



  
  ngOnDestroy(){
    this.subscriptionlist.forEach((subscription)=>{
      subscription.unsubscribe(); 
    })
  }







}

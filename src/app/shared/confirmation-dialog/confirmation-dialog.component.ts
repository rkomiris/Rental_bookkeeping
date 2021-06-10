// import { Component, OnInit, Inject } from '@angular/core';
// import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { Router } from "@angular/router";
import { FormControl, FormBuilder, FormGroup, Validators, NgForm, Form } from '@angular/forms';
import { RequestService } from 'src/app/pages/request/request.service';
import {
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
  Inject,
  OnDestroy
} from "@angular/core";
import {
  MatPaginator,
  MatSort,
  MatTableDataSource,
  VERSION,
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from "@angular/material";
import { ComponentLoaderService } from '../../shared/component-loader.service';
import { JsonApiService } from 'src/assets/api/json-api.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  // styleUrls: ['./confirmation-dialog.component.css'],
  styleUrls: ['./confirmation-dialog-srmav.component.css']
})
export class ConfirmationDialogComponent implements OnInit {
  saveForm: FormGroup;
  pastRouter;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  requestBaseFieldName: any = [];
  dataSource: any = [];
  rowindex: any;
  searchRowscount: number = 0;
  displayMessage: any;
  title: any;
  language: any;
  labels: any ={};

  btnProjYes: any;
  btnProjNo: any;
  btnYes: any;
  btnNo: any;

  constructor(
    private formBuilder: FormBuilder,
    private componentLoaderService: ComponentLoaderService,
    private dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    private router: Router, private dialog: MatDialog,
     @Inject(MAT_DIALOG_DATA) public data: any,
     private jsonApiService: JsonApiService,/** LABEL CHANGES **/ 
    private requestService: RequestService ) {
    this.pastRouter = this.router.url;

  }

  ngOnInit() {
    if(localStorage.getItem("langCode") != null){      
    this.language = localStorage.getItem("langCode");
    }else{
      this.language = environment.defaultLocale;
    }
    this.displayMessage = this.data.message;
    this.title = this.data.title;
    this.saveForm = this.formBuilder.group({
      remarks: ['', Validators.required],
    });
    this.getLabelDetails();
    this.btnProjYes = this.data.btnPrjYes;
    this.btnProjNo = this.data.btnPrjNo;
    this.btnYes = this.data.btnYes;
    this.btnNo= this.data.btnNo;
  }
  /**** LABEL CHNAGES ****/
  getLabelDetails() {
    let lang;
    if(localStorage.getItem("langCode") != null){      
      lang = localStorage.getItem("langCode");
      }else{
        lang = environment.defaultLocale;
      }
    this.jsonApiService.fetch('/'+lang+'.json').subscribe((data) => {
        this.labels = data;
      });
  }
  onSubmit() {


    if (this.saveForm.valid) {
      this.dialogRef.close();
    }
}


  btnPrjYes(){
    localStorage.setItem('isCancelled', 'No');
  }
  btnPrjNo(){
    localStorage.setItem('isCancelled', 'Yes');
  }
}

import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FlashNewsModifyService } from './flash-news-modify.service';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { ComponentLoaderService } from '../../../shared/component-loader.service';
import { error } from 'util';
import { JsonApiService } from 'src/assets/api/json-api.service';
import * as moment from 'moment';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-flash-news-modify',
  templateUrl: './flash-news-modify.component.html',
  styleUrls: ['./flash-news-modify.component.css'],
  providers: [
    // The locale would typically be provided on the root module of your application. We do it at
    // the component level here, due to limitations of our example generation script.
    // { provide: MAT_DATE_LOCALE, useValue: 'ja-JP' },

    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})

export class FlashNewsModifyComponent implements OnInit {

  modifyForm: FormGroup;
  userBaseFieldName: any = [];
  newsTypes: any = [];
  today = new Date();
  flashNewsModifyListGetData: any = {};
  labels: any = {}; /** LABEL CHANGES **/

  fromDateEnable: boolean;
  toDateEnable: boolean;
  annDateEnable: boolean;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private jsonApiService: JsonApiService/** LABEL CHANGES **/,
    private flashNewsModifyService: FlashNewsModifyService,
    private componentLoaderService: ComponentLoaderService
  ) { }

  ngOnInit() {
    this.componentLoaderService.display(true);
    this.getLabelDetails(); /** LABEL CHANGES **/
    this.modifyForm = this.formBuilder.group({
      flashNewsCode: ['', Validators.required],
      flashNewsType: ['', Validators.required],
      flashNewsDate: ['', Validators.required],
      flashNewsValidFrom: ['', Validators.required],
      flashNewsValidTo: ['', Validators.required],
      flashNewsDescription: ['', Validators.required],
      isFlashNewsActive: [true],
    });
    if(localStorage.getItem('langCode') == 'en'){
      this.newsTypes=[
        {id: 1, name: 'Flash News'},
        {id: 2, name: 'Thought for the Day'},
      ];
    }else if(localStorage.getItem('langCode') == 'jp'){
      this.newsTypes=[
        {id: 1, name: 'フラッシュニュー'},
        {id: 2, name: '毎日の思想'},
      ];
    }
    this.aminite_list_modify();
    
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
  /**  if (window.localStorage.getItem('id') != null) {
      let tempId: any = JSON.parse(window.localStorage.getItem('id'));
     }  */

  aminite_list_modify() {

    let tempData = JSON.parse(window.localStorage.getItem('id'));
    this.flashNewsModifyService.load_modify_project(tempData).subscribe(data => {
      let flashNewsModifyListGetData = JSON.parse(data['_body']);
      let flashNewsModifyListTableData = flashNewsModifyListGetData.succesObject;
      this.userBaseFieldName = flashNewsModifyListGetData.authSuccesObject.screenFieldDisplayVoList.map(
        element => {
          return element;
        }
      );
      this.modifyForm.patchValue({flashNewsCode: flashNewsModifyListTableData.flashNewsCode});
      this.modifyForm.patchValue({flashNewsType: flashNewsModifyListTableData.flashNewsType});
      this.modifyForm.patchValue({flashNewsDate: new Date(flashNewsModifyListTableData.flashNewsDate).toISOString()});
      this.modifyForm.patchValue({flashNewsValidFrom: new Date(flashNewsModifyListTableData.flashNewsValidFrom).toISOString()});
      this.modifyForm.patchValue({flashNewsValidTo: new Date(flashNewsModifyListTableData.flashNewsValidTo).toISOString()});
      this.modifyForm.patchValue({flashNewsDescription: flashNewsModifyListTableData.flashNewsDescription});
      this.modifyForm.patchValue({isFlashNewsActive: flashNewsModifyListTableData.isFlashNewsActive});
      this.componentLoaderService.display(false);

      if(moment(this.today).format('DD/MM/YYYY') > moment(flashNewsModifyListTableData.flashNewsValidFrom).format('DD/MM/YYYY')){
        this.fromDateEnable = true;
      }
      if(moment(this.today).format('DD/MM/YYYY') > moment(flashNewsModifyListTableData.flashNewsValidTo).format('DD/MM/YYYY')){
        this.toDateEnable = true;
      }
      if(moment(this.today).format('DD/MM/YYYY') > moment(flashNewsModifyListTableData.flashNewsDate).format('DD/MM/YYYY')){
        this.annDateEnable = true;
      }
    }, error => {
      if (error.status === 401)
      {
        console.log("Error");
      }
    })
  }

    /**  this.modifyForm.patchValue({flashNewsCode: flashNewsModifyListTableData.flashNewsCode});
      this.modifyForm.patchValue({flashNewsType: flashNewsModifyListTableData.flashNewsType});
      this.modifyForm.patchValue({flashNewsDate: new Date(flashNewsModifyListTableData.flashNewsDate).toISOString()});
      this.modifyForm.patchValue({flashNewsValidFrom: new Date(flashNewsModifyListTableData.flashNewsValidFrom).toISOString()});
      this.modifyForm.patchValue({flashNewsValidTo: new Date(flashNewsModifyListTableData.flashNewsValidTo).toISOString()});
      this.modifyForm.patchValue({flashNewsDescription: flashNewsModifyListTableData.flashNewsDescription});
      this.modifyForm.patchValue({isFlashNewsActive: flashNewsModifyListTableData.isFlashNewsActive});
      this.componentLoaderService.display(false);
    }, error => {
      if (error.status === 401) {
        console.log('Error');
      }

    });  */
  


onSubmit() {
  
  let formvalue = this.modifyForm.value;
  let fND = moment(this.modifyForm.value.flashNewsValidFrom).format('DD/MM/YYYY');
  let fND1 = moment(this.modifyForm.value.flashNewsValidTo).format('DD/MM/YYYY');
  let fND3 = moment(this.modifyForm.value.flashNewsDate).format('DD/MM/YYYY');

  if(fND < moment(this.today).format('DD/MM/YYYY') ){
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: false,
      panelClass: 'btnCenter',
      width: 'auto',
      data: {
        title: 'Alert',
        message: 'requestdate',
        btnYes: 'OK',
      }
    });
  }

  
  else if (this.modifyForm.valid) {
    this.componentLoaderService.display(true);
    let finalval: any = {};

    finalval = formvalue;
    finalval.screenFieldDisplayVoList = this.userBaseFieldName;
    this.flashNewsModifyService.update_modify_project(finalval).subscribe(data => {
      let Response = JSON.parse(data['_body']);
      if (Response.responseCode === '200') {
      // if (Response.statusMessage === "Successfully Processed....") {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          disableClose: false,
          panelClass: 'btnCenter',
          width: 'auto',
          data: {
            title: 'Info',
            server:'servermessage',
            message: Response.responseMessage,
            btnYes: 'OK',
          }
        });
        dialogRef.afterClosed().subscribe(data => {
          this.router.navigate(['/flash-news']);
        })
      } else {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          disableClose: false,
          panelClass: 'btnCenter',
          width: 'auto',
          data: {
            title: 'Alert',
            server:'servermessage',
            message: Response.responseMessage,
            btnYes: 'OK',
          }
        });
      }
      this.componentLoaderService.display(false);
    });
  }
}

fromDateChange(form){
  form.controls['flashNewsValidTo'].reset();
  form.controls['flashNewsDate'].reset();
}

toDateChange(form){
  form.controls['flashNewsDate'].reset();
}

ngOnDestroy(){
  localStorage.removeItem('id');
}
}
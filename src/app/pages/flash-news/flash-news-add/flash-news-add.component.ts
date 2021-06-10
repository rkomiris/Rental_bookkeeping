import { Component, OnInit, ViewChild, Output, Inject } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, VERSION, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormBuilder, FormGroup, Validators, NgForm, Form } from '@angular/forms';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { FlashNewsAddService } from './flash-news-add.service';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { ComponentLoaderService } from '../../../shared/component-loader.service';
import { element } from '@angular/core/src/render3';
import { JsonApiService } from 'src/assets/api/json-api.service';

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
  selector: 'app-flash-news-add',
  templateUrl: './flash-news-add.component.html',
  styleUrls: ['./flash-news-add.component.css'],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]
})

export class FlashNewsAddComponent implements OnInit {

  saveForm: FormGroup;
  newsTypes: any = []; 
  flashNewsAddGetData: any = {};
  userBaseFieldName: any = [];
  today = new Date();
  labels: any = {}; /** LABEL CHANGES **/

  constructor(
    private componentLoaderService: ComponentLoaderService,
    private router: Router,
    private dialog: MatDialog,
    private jsonApiService: JsonApiService/** LABEL CHANGES **/,
    private formBuilder: FormBuilder,
    private flashNewsAddService: FlashNewsAddService) { }

  ngOnInit() {
    
    this.componentLoaderService.display(true);
    this.getLabelDetails(); /** LABEL CHANGES **/
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
    this.saveForm = this.formBuilder.group({
      flashNewsCode: [''],
      flashNewsType: ['', Validators.required],
      flashNewsDate: ['', Validators.required],
      flashNewsValidFrom: ['', Validators.required],
      flashNewsValidTo: ['', Validators.required],
      flashNewsDescription: ['', Validators.required],
      isFlashNewsActive: [true],
    });
    this.addService();
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
  addService()
  {
    this.flashNewsAddService.addflash().subscribe(data => {
      let selectGetData = JSON.parse(data['_body']);
      this.userBaseFieldName = selectGetData.authSuccesObject.screenFieldDisplayVoList.map(
        element => {
          return element;
        }
      );
      this.componentLoaderService.display(false);
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
  //  aminite_add_Submit(tempData): void {
  //    this.flashNewsAddService.addProjectList(tempData).subscribe(data => {
  //            let flashNewsadddata = JSON.parse(data['_body']);
   //   },
  //    error => {
  //      if (error.status === 401) {
  //        console.log('Error');
  //      }
  //    });
  //  }
   
  }
    
onSubmit() {
  
  let formvalue = this.saveForm.value;
  if (this.saveForm.invalid) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: false,
      panelClass: 'btnCenter',
      width: 'auto',
      data: {
        title: 'Alert',
        message: 'mandatory',
        btnYes: 'OK',
      }
    });
  } else if (this.saveForm.valid) {
    this.componentLoaderService.display(true);
    let finalval: any = {};
    finalval = formvalue;
    finalval.screenFieldDisplayVoList = this.userBaseFieldName;
    this.flashNewsAddService.addProjectList(finalval).subscribe(data => {
      let Response = JSON.parse(data['_body']);
      if (Response.responseCode === '200') {
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
        dialogRef.afterClosed().subscribe( data => {
          this.router.navigate(['/flash-news']);
        });
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
clearForm() 
  {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => this.router.navigate(['/flash-news/flash-news-add']));
  }
}
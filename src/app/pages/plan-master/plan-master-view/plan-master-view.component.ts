import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { environment } from 'src/environments/environment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ComponentLoaderService } from 'src/app/shared/component-loader.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { JsonApiService } from 'src/assets/api/json-api.service';
import { PlanMasterService } from '../plan-master.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-plan-master-view',
  templateUrl: './plan-master-view.component.html',
  styleUrls: ['./plan-master-view.component.css']
})
export class PlanMasterViewComponent implements OnInit, OnDestroy {

  saveForm: FormGroup;
  userBaseFieldName: any = [];
  labels: any = {};/** LABEL CHANGES **/
  currencyList: any = [];
  weekList: any = [];
  public imagePath;
  imgURL: any;
  location: any;
  myobj: any = {};
  public message: string;
  imgURLcal = true;
  
  constructor(
    private componentLoaderService: ComponentLoaderService,
    private router: Router,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private planMasterService: PlanMasterService,
    private _sanitizer: DomSanitizer,
    private jsonApiService: JsonApiService/** LABEL CHANGES **/
  ) { }

  ngOnInit() {
    this.componentLoaderService.display(true);
    this.saveForm = this.formBuilder.group({
      planId: [''],
      planName: ['', Validators.required],
      duration: [''],
      amount: ['', Validators.required],
      userCount: ['', Validators.required],
      transactionCount: ['', Validators.required],
      activeFlag: ['', Validators.required],
      offerAmount: [''],
      currencyId: ['', Validators.required],
      fromDate: [''],
      toDate:[''],
      offerRemarks: ['']
    })
    this.onloadData();
    this.getLabelDetails();/** LABEL CHANGES **/
    this.componentLoaderService.display(false);
  }

  /**** LABEL CHNAGES ****/
  getLabelDetails() {
    let lang;
    if (localStorage.getItem('langCode') !== null) {
      lang = localStorage.getItem('langCode');
    } else {
      lang = environment.defaultLocale;
    }
    this.jsonApiService
      .fetch('/' + lang + '.json')
      .subscribe((data) => {
        this.labels = data;
      });
  }

  onloadData(){
    
    this.planMasterService.currencyList().subscribe(data => {
      let selectGetData = JSON.parse(data['_body']);
      this.currencyList = selectGetData.succesObject;
    })
  
    let viewId = Number(localStorage.getItem('planId'))
    this.planMasterService.viewData(viewId).subscribe(data => {
      let selectGetData = JSON.parse(data['_body']);
      if (selectGetData.responseCode == '200') {
        this.saveForm.patchValue({planId: selectGetData.succesObject.planId});
        this.saveForm.patchValue({planName: selectGetData.succesObject.planName});
        this.saveForm.patchValue({duration: selectGetData.succesObject.duration});
        this.saveForm.patchValue({amount: selectGetData.succesObject.amount});
        this.saveForm.patchValue({userCount: selectGetData.succesObject.userCount});
        this.saveForm.patchValue({transactionCount: selectGetData.succesObject.transactionCount});
        this.saveForm.patchValue({activeFlag: selectGetData.succesObject.activeFlag});
        this.saveForm.patchValue({ offerAmount: selectGetData.succesObject.offerAmount });
        this.saveForm.patchValue({ offerRemarks: selectGetData.succesObject.offerRemarks });
        this.saveForm.patchValue({ currencyId: selectGetData.succesObject.currencyId });
        this.saveForm.patchValue({ fromDate: new Date(selectGetData.succesObject.fromDate) });
        this.saveForm.patchValue({ toDate: new Date(selectGetData.succesObject.toDate) });
        
        this.imgURL = selectGetData.succesObject.imageLoad;
        this.imgURLcal = false;
        this.imgURL = selectGetData.succesObject.imageLoad;
        this.imgURL = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
          + this.imgURL);

        // this.userBaseFieldName = selectGetData.authSuccesObject.screenFieldDisplayVoList.map(
        //   element => {
        //     return element;
        //   });

        if(localStorage.getItem('userId') == '1'){
          this.userBaseFieldName = ['select','planName','duration','userCount','transactionCount','amount',
        'offerAmount','offerRemarks','currencyName','activeFlag', 'fromDate','toDate','currencyId'];
        }else{
          this.userBaseFieldName = selectGetData.authSuccesObject.screenFieldDisplayVoList.map(
          element => {
            return element;
          }
        );
        }
      } 
      else {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          disableClose: false,
          panelClass: 'btnCenter',
          width: 'auto',
          data: {
            title: 'Alert',
            server: 'servermessage',
            message: selectGetData.responseMessage,
            btnYes: 'OK',
          }
        });
      }
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
  }

  ngOnDestroy() {
    localStorage.removeItem('planId');
  }

}

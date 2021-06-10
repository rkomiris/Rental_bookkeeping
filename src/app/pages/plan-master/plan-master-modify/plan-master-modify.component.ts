import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ComponentLoaderService } from 'src/app/shared/component-loader.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { JsonApiService } from 'src/assets/api/json-api.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { PlanMasterService } from '../plan-master.service';
import { DomSanitizer } from '@angular/platform-browser';
import { currentId } from 'async_hooks';

@Component({
  selector: 'app-plan-master-modify',
  templateUrl: './plan-master-modify.component.html',
  styleUrls: ['./plan-master-modify.component.css']
})
export class PlanMasterModifyComponent implements OnInit {

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
  today;

  imgURLcal = true;

  constructor(private componentLoaderService: ComponentLoaderService,
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
      amount: [''],
      userCount: ['', Validators.required],
      transactionCount: ['', Validators.required],
      activeFlag: ['', Validators.required],
      offerAmount: [''],
      currencyId: [''],
      duration: [''],
      fromDate: [''],
      toDate: [''],
      offerRemarks: ['']
    })
    this.onloadData();
    this.today = new Date();
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

  onloadData() {

    this.planMasterService.currencyList().subscribe(data => {
      let selectGetData = JSON.parse(data['_body']);
      this.currencyList = selectGetData.succesObject;
    })

    let viewId = Number(localStorage.getItem('planId'))
    this.planMasterService.viewData(viewId).subscribe(data => {
      let selectGetData = JSON.parse(data['_body']);
      if (selectGetData.responseCode == '200') {
        this.saveForm.patchValue({ planId: selectGetData.succesObject.planId });
        this.saveForm.patchValue({ planName: selectGetData.succesObject.planName });
        this.saveForm.patchValue({ duration: selectGetData.succesObject.duration });
        if(selectGetData.succesObject.amount == undefined){
          this.saveForm.patchValue({ amount: '' });
        }else{
          this.saveForm.patchValue({ amount: selectGetData.succesObject.amount });
        }
        
        this.saveForm.patchValue({ userCount: selectGetData.succesObject.userCount });
        this.saveForm.patchValue({ transactionCount: selectGetData.succesObject.transactionCount });
        this.saveForm.patchValue({ activeFlag: selectGetData.succesObject.activeFlag });
        this.saveForm.patchValue({ offerAmount: selectGetData.succesObject.offerAmount });
        this.saveForm.patchValue({ currencyId: selectGetData.succesObject.currencyId });
        this.saveForm.patchValue({ fromDate: new Date(selectGetData.succesObject.fromDate) });
        this.saveForm.patchValue({ toDate: new Date(selectGetData.succesObject.toDate) });
        this.saveForm.patchValue({ offerRemarks: selectGetData.succesObject.offerRemarks });

        this.imgURL = selectGetData.succesObject.imageLoad;
        this.imgURLcal = false;
        this.imgURL = selectGetData.succesObject.imageLoad;
        this.imgURL = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
          + this.imgURL);


        if (localStorage.getItem('userId') == '1') {
          this.userBaseFieldName = ['select', 'planName', 'duration', 'userCount', 'transactionCount', 'amount',
            'offerAmount', 'offerRemarks', 'currencyName', 'activeFlag', 'fromDate', 'toDate', 'currencyId'];
        } else {
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

  onSubmit() {
    let formvalue = this.saveForm.value;
    let formdata = new FormData();
    this.saveForm.patchValue({ fromDate: new Date(this.saveForm.value.fromDate) });
    this.saveForm.patchValue({ toDate: new Date(this.saveForm.value.toDate) });

    // if (this.myobj.file == null) {
    //   const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    //     disableClose: false,
    //     panelClass: 'btnCenter',
    //     width: 'auto',
    //     data: {
    //       title: 'Alert',
    //       message: 'image',
    //       btnYes: 'OK',
    //     }
    //   });
    // }else 
    // if (this.saveForm.invalid) {
    //   const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    //     disableClose: false,
    //     panelClass: 'btnCenter',
    //     width: 'auto',
    //     data: {
    //       title: 'Alert',
    //       message: 'mandatory',
    //       btnYes: 'OK',
    //     }
    //   });
    // }
    if(this.saveForm.value.amount == ''){
      this.saveForm.value.currencyId = '';
    }
    if (this.saveForm.value.userCount == '') {
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
    } else if (this.saveForm.value.transactionCount == '') {
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
    } else {
      formdata.append('action', JSON.stringify(this.saveForm.value));
      formdata.append('file', this.myobj.file);
      this.planMasterService.update(formdata).subscribe(data => {
        let modifyResponse = JSON.parse(data['_body']);
        let modifySuccessObject = modifyResponse.succesObject;
        if (modifyResponse.responseCode == '200') {
          const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            disableClose: false,
            panelClass: 'btnCenter',
            width: 'auto',
            data: {
              title: 'Info',
              server: 'servermessage',
              message: modifyResponse.responseMessage,
              btnYes: 'OK',
            }
          });
          dialogRef.afterClosed().subscribe(data => {
            if (data) {
              localStorage.removeItem('planId');
              this.router.navigate(['/plan-master']);
            }
          })
        }
        else {
          const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            disableClose: false,
            panelClass: 'btnCenter',
            width: 'auto',
            data: {
              title: 'Info',
              server: 'servermessage',
              message: modifyResponse.responseMessage,
              btnYes: 'OK',
            }
          });
        }
      })
    }

  }

  check(event) {
    if (event.value.length > 2) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        panelClass: 'btnCenter',
        width: 'auto',
        data: {
          title: 'Info',
          message: 'twoDays',
          btnYes: 'OK',
        }
      });
      dialogRef.afterClosed().subscribe(data => {
        // if(data){
        this.saveForm.controls['planDetailArr'].reset();
        // }
      })
    }
  }

  preview(files) {
    let mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = 'Only images are supported.';
      return;
    } else {
      this.message = '';
      this.myobj.file = files[0];
    }
    let reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    };
    this.imgURLcal = true;
  }

  currency(event){
    if(event.target.value == '' || event.target.value == null){
      this.saveForm.controls['currencyId'].reset();
    }
  }

}

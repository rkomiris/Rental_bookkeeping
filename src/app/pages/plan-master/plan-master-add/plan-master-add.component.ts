import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ComponentLoaderService } from 'src/app/shared/component-loader.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { JsonApiService } from 'src/assets/api/json-api.service';
import { environment } from 'src/environments/environment';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { PlanMasterService } from '../plan-master.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-plan-master-add',
  templateUrl: './plan-master-add.component.html',
  styleUrls: ['./plan-master-add.component.css']
})
export class PlanMasterAddComponent implements OnInit {

  saveForm: FormGroup;
  userBaseFieldName: any = [];
  currencyList: any = [];
  labels: any = {};/** LABEL CHANGES **/
  weekList: any = [];
  public imagePath;
  imgURL: any;
  location: any;
  myobj: any = {};
  imgURLcal: boolean;
  public message: string;
  today: any;

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
    this.today = new Date();
    this.saveForm = this.formBuilder.group({
      planName: ['', Validators.required],
      amount: [''],
      userCount: ['', Validators.required],
      transactionCount: ['', Validators.required],
      activeFlag: [true, Validators.required],
      offerAmount: [''],
      currencyId: [''],
      duration: [''],
      fromDate: [''],
      toDate: [''],
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

  clearForm() {
    this.ngOnInit();
  }

  onloadData() {

    this.planMasterService.currencyList().subscribe(data => {
      let selectGetData = JSON.parse(data['_body']);
      this.currencyList = selectGetData.succesObject;

    })

    this.planMasterService.addData().subscribe(data => {
      let selectGetData = JSON.parse(data['_body']);
      if (selectGetData.responseCode == '200') {
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
    // }

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
    }
    else if (this.saveForm.valid) {
      let formData = new FormData();
      let action = JSON.stringify(this.saveForm.value);
      let file = this.myobj.file;
      formData.append('action', action);
      formData.append('file', file);
      console.log(formData);

      this.planMasterService.create(formData).subscribe(data => {
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
        } else {
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

  currency(event) {
    if (event.target.value == '' || event.target.value == null) {
      this.saveForm.controls['currencyId'].reset();
    }
  }

}

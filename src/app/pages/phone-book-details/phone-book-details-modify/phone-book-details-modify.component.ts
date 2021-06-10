import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// import { FlashNewsAddService } from './flash-news-add.service';
import { PhoneBookDetailsService } from '../phone-book-details.service';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import { ComponentLoaderService } from '../../../shared/component-loader.service';
import { environment } from '../../../../environments/environment';
import { JsonApiService } from 'src/assets/api/json-api.service';
import { debug } from 'util';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-phone-book-details-modify',
  templateUrl: './phone-book-details-modify.component.html',
  styleUrls: ['./phone-book-details-modify.component.css']
})
export class PhoneBookDetailsModifyComponent implements OnInit {
  labels: any = {}; /** LABEL CHANGES **/
  saveForm: FormGroup;
  flashNewsAddGetData: any = {};
  deprtlist: any = [];
  locationList: any = [];
  subLocationList: any = [];
  subLocationListdept: any = [];
  userBaseFieldName: any = [];
  public imagePath;
  location: any;
  imgURL: any;

  imgURLcal = true;
  myobj: any = {};
  public message: string;
  fullurl = environment.API_HOST;
  url: string = this.fullurl.substring(0, this.fullurl.length - 3);
  userdroplist: any = [];
  constructor(
    private jsonApiService: JsonApiService/** LABEL CHANGES **/,
    private router: Router,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private phoneBookDetailsService: PhoneBookDetailsService,
    private componentLoaderService: ComponentLoaderService,
    private _sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.getLabelDetails(); /** LABEL CHANGES **/
    this.componentLoaderService.display(true);
    this.saveForm = this.formBuilder.group({
      employeeId: ['', Validators.required],
      employeeName: ['', Validators.required],
      userDepartmentId: ['', Validators.required],
      // flashNewsDate: ['', [this.startDate = moment(data.start).format('M/D/YYYY')]],
      mobileNumberC: [''],
      extensionNumber: [''],
      userLocationId: ['', Validators.required],
      skypeId: [''],
      sublocationId: ['', Validators.required],
      emailId: ['', Validators.required],
      mobileNumberP: [''],
      phoneNumber: [''],
      phoneBookIsActive: [true],
      phoneBookId: [],
    });
    this.loadview();
  }
  /** LABEL CHANGES **/
  getLabelDetails() {
    let lang;
    if (localStorage.getItem('langCode') !== null) {
      lang = localStorage.getItem('langCode');
    }
    this.jsonApiService.fetch('/' + lang + '.json').subscribe((data) => {
      this.labels = data;
    });
  }

  loadview() {
    if (localStorage.getItem('phoneBookId') !== null) {
      let id = localStorage.getItem('phoneBookId');
      this.loadviewall(id);
    }

  }
  loadviewall(id) {
    this.phoneBookDetailsService.load_dept().subscribe(data1 => {
      let Response = JSON.parse(data1['_body']);
      if (Response.responseCode === '200') {
        this.deprtlist = Response.succesObject;
      }
    });
    this.phoneBookDetailsService.load_selectBox_LocationData().subscribe(
      data => {
        let resp = JSON.parse(data['_body']);
        this.locationList = resp.succesObject;
      },
      error => {
        if (error.status === 401) {
          console.log('Error');
        }
      }
    );
    this.phoneBookDetailsService.phonebookview(id).subscribe(data1 => {
      let Response = JSON.parse(data1['_body']);
      if (Response.responseCode === '200') {

        let listData = Response.succesObject;
        this.userBaseFieldName = Response.authSuccesObject.screenFieldDisplayVoList.map(
          element => {
            return element;
          }
        );


        let tt = Response.succesObject;
        this.location = tt.userLocationId;
        this.saveForm.patchValue({ employeeId: tt.employeeId });
        this.saveForm.patchValue({ employeeName: tt.employeeName });
        // this.saveForm.patchValue({userDepartmentId: new Date(flashNewsModifyListTableData.userDepartmentId).toISOString()});
        //  this.saveForm.patchValue({mobileNumberC: new Date(flashNewsModifyListTableData.mobileNumberC).toISOString()});
        //  this.saveForm.patchValue({flashNewsValidTo: new Date(flashNewsModifyListTableData.flashNewsValidTo).toISOString()});
        this.saveForm.patchValue({ userDepartmentId: tt.userDepartmentId });
        this.saveForm.patchValue({ mobileNumberC: tt.mobileNumberC });
        this.saveForm.patchValue({ extensionNumber: tt.extensionNumber });
        this.saveForm.patchValue({ userLocationId: tt.userLocationId });
        this.saveForm.patchValue({ skypeId: tt.skypeId });
        this.saveForm.patchValue({ sublocationId: tt.sublocationId });
        this.saveForm.patchValue({ emailId: tt.emailId });
        this.saveForm.patchValue({ mobileNumberP: tt.mobileNumberP });
        this.saveForm.patchValue({ phoneNumber: tt.phoneNumber });
        this.saveForm.patchValue({ phoneBookIsActive: tt.phoneBookIsActive });
        this.saveForm.patchValue({ phoneBookId: tt.phoneBookId });

        this.getSubLocationList(tt.userLocationId);
        this.getDepartmentList(tt.sublocationId, tt.userLocationId);
        this.imgURL = tt.phoneBookProfile;
        this.imgURLcal = false;

        this.imgURL = tt.imageLoad;

        this.imgURL = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
          + this.imgURL);

      }
    });
    this.componentLoaderService.display(false);
  }
  url2;


  getSubLocationList(eve) {
    this.phoneBookDetailsService.load_selectBox_subLocationData(eve).subscribe(
      data => {
        let resp = JSON.parse(data['_body']);
        this.subLocationList = resp.succesObject;
      },
      error => {
        console.log(error);
      }
    );
  }
  getDepartmentList(val, locationId) {
    this.phoneBookDetailsService.load_subLocationData({ userLocation: locationId, sublocationId: val }).subscribe(
      data => {
        let resp = JSON.parse(data['_body']);
        this.subLocationListdept = resp.succesObject;
      },
      error => {
        console.log(error);
      }
    );
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



  onSubmit() {
    let formvalue = this.saveForm.value;
    formvalue.screenFieldDisplayVoList = this.userBaseFieldName;

    let formdata = new FormData();
    formdata.append('action', JSON.stringify(formvalue));

    if (this.myobj.file === undefined) {
      this.myobj.file = null;
    }
    formdata.append('file', this.myobj.file);
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
      this.phoneBookDetailsService.updateList(formdata).subscribe(data1 => {
        let Response = JSON.parse(data1['_body']);
        if (Response.responseCode === '200') {
          const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            disableClose: false,
            panelClass: 'btnCenter',
            width: 'auto',
            data: {
              title: 'Info',
              server: 'servermessage',
              message: Response.responseMessage,
              btnYes: 'OK',
            }
          });
          dialogRef.afterClosed().subscribe(data => {
            this.router.navigate(['/phonedetails']);
          });
        } else {
          const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            disableClose: false,
            panelClass: 'btnCenter',
            width: 'auto',
            data: {
              title: 'Alert',
              server: 'servermessage',
              message: Response.responseMessage,
              btnYes: 'OK',
            }
          });
        }
        this.componentLoaderService.display(false);
      },
        error => {
          console.log(error);
        });
    }
  }

  getSubLocationList2(eve, form) {
    form.controls['sublocationId'].reset();
    form.controls['userDepartmentId'].reset();
    form.controls['sublocationId'].touched = true;
    form.controls['userDepartmentId'].touched = true;
    this.subLocationList = [];
    this.subLocationListdept = [];
    this.phoneBookDetailsService.load_selectBox_subLocationData(eve).subscribe(
      data => {
        let resp = JSON.parse(data['_body']);
        this.subLocationList = resp.succesObject;
      },
      error => {
        console.log(error);
      }
    );
  }
  getDepartmentList2(val, locationId, form){
    form.controls['userDepartmentId'].reset();
    form.controls['userDepartmentId'].touched = true;
    this.subLocationListdept = [];
  this.phoneBookDetailsService.load_subLocationData({userLocation: locationId, sublocationId:val}).subscribe(
    data => {
      let resp = JSON.parse(data['_body']);
      this.subLocationListdept = resp.succesObject;
    },
    error => {
      console.log(error);
    }
  );
}

}

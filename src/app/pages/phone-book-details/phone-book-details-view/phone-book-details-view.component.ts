import { Component, OnInit, ViewChild, Output, Inject } from '@angular/core';
import { MatDialog } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// import { FlashNewsAddService } from './flash-news-add.service';
import { PhoneBookDetailsService } from '../phone-book-details.service';
import { ComponentLoaderService } from '../../../shared/component-loader.service';
import {environment } from '../../../../environments/environment';
import { JsonApiService } from 'src/assets/api/json-api.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-phone-book-details-view',
  templateUrl: './phone-book-details-view.component.html',
  styleUrls: ['./phone-book-details-view.component.css']
})
export class PhoneBookDetailsViewComponent implements OnInit {
  labels: any = {}; /** LABEL CHANGES **/
  saveForm: FormGroup;
  flashNewsAddGetData: any = {};
  deprtlist: any = [];
  locationList: any = [];
  subLocationList: any = [];
  subLocationListdept: any = [];
  userBaseFieldName: any = [];
  public imagePath;
  imgURL: any;
  location: any;
  myobj: any = {};
  disable = false;
  public message: string;
  userdroplist: any = [];
  fullurl = environment.API_HOST;
  url: string = this.fullurl.substring(0, this.fullurl.length - 3);

  constructor(
    private jsonApiService: JsonApiService/** LABEL CHANGES **/,
    private router: Router,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private phoneBookDetailsService: PhoneBookDetailsService,
    private componentLoaderService: ComponentLoaderService,
    private _sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.getLabelDetails(); /** LABEL CHANGES **/
    this.componentLoaderService.display(true);
    this.saveForm = this.formBuilder.group({
      employeeId: ['', Validators.required],
      employeeName: ['', Validators.required],
      userDepartmentId: ['', Validators.required],
      // flashNewsDate: ['', [this.startDate = moment(data.start).format('M/D/YYYY')]],
      mobileNumberC: ['', Validators.required],
      extensionNumber: ['', Validators.required],
      userLocationId: ['', Validators.required],
      skypeId: ['', Validators.required],
      sublocationId: ['', Validators.required],
      emailId : ['', Validators.required],
      mobileNumberP: ['', Validators.required],
      phoneNumber : ['', Validators.required],
      phoneBookIsActive: [true],
    });
    this.loadview();
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
        });
    this.phoneBookDetailsService.phonebookview(id).subscribe(data1 => {
      let Response = JSON.parse(data1['_body']);
      if (Response.responseCode === '200') {

        let listData = Response.succesObject;
        this.userBaseFieldName = Response.authSuccesObject.screenFieldDisplayVoList.map(
          element => {
            return element;
          });

        let tt = Response.succesObject;

        this.saveForm.patchValue({employeeId: tt.employeeId});
        this.saveForm.patchValue({employeeName: tt.employeeName});
       // this.saveForm.patchValue({userDepartmentId: new Date(flashNewsModifyListTableData.userDepartmentId).toISOString()});
      //  this.saveForm.patchValue({mobileNumberC: new Date(flashNewsModifyListTableData.mobileNumberC).toISOString()});
      //  this.saveForm.patchValue({flashNewsValidTo: new Date(flashNewsModifyListTableData.flashNewsValidTo).toISOString()});
        this.saveForm.patchValue({userDepartmentId: tt.userDepartmentId});
        this.saveForm.patchValue({mobileNumberC: tt.mobileNumberC});
        this.saveForm.patchValue({extensionNumber: tt.extensionNumber});
        this.saveForm.patchValue({userLocationId: tt.userLocationId});
        this.saveForm.patchValue({skypeId: tt.skypeId});
        this.saveForm.patchValue({sublocationId: tt.sublocationId});
        this.saveForm.patchValue({emailId: tt.emailId});
        this.saveForm.patchValue({mobileNumberP: tt.mobileNumberP});
        this.saveForm.patchValue({phoneNumber: tt.phoneNumber});
        this.saveForm.patchValue({phoneBookIsActive: tt.phoneBookIsActive});
        this.getSubLocationList(tt.userLocationId);
        this.getDepartmentList(tt.sublocationId,tt.userLocationId);
        this.imgURL = tt.phoneBookProfile;
        this.disable = true;
       // this.saveForm.disable();
       this.imgURL=tt.imageLoad;
       this.imgURL = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
       + this.imgURL);

      }
      });
    this.componentLoaderService.display(false);
  }

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
    // this.phoneBookDetailsService.load_subLocationData(eve).subscribe(
    //   data => {
    //     let resp = JSON.parse(data['_body']);
    //     this.subLocationListdept = resp.succesObject;
    //   },
    //   error => {
    //     console.log(error);
    //   }
    // );
  }
  getDepartmentList(val, locationId){
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
}
onSubmit() {

}

}


import { Component, OnInit, ViewChild, Output, EventEmitter, Inject, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, VERSION, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormBuilder, FormGroup, FormArray, Validators, NgForm, Form } from '@angular/forms';
import { Router } from "@angular/router";
import { DOCUMENT } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';
import { UserProfileService } from './user-profile.service';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { ComponentLoaderService } from '../../shared/component-loader.service';
import {environment } from '../../../environments/environment';
import { UserAddService } from '../user/user-add/user-add.service';
import { JsonApiService } from 'src/assets/api/json-api.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  // styleUrls: ['./user-profile.component.css']
  styleUrls: ['./user-profile-srmav.component.css']
})
export class UserProfileComponent implements OnInit {
labels: any = {}; /** LABEL CHANGES **/
userDetails: any;
fullurl = environment.API_HOST;
url: string = this.fullurl.substring(0, this.fullurl.length - 3);
viewDetails : boolean = true;
saveForm: FormGroup;
picurl : any;
profilePic : any;

locationList : any = [];
sublocationList : any = [];
departmentList : any = [];
locationId : number;
sublocationId: number;
departmnetId: number;
languageList: any = [];
langCode;

  constructor(
    private _sanitizer: DomSanitizer,
    private jsonApiService: JsonApiService/** LABEL CHANGES **/,
    @Inject(DOCUMENT) private document: Document,
    private formBuilder: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private UserProfileService: UserProfileService,
    private UseraddService: UserAddService,
    private componentLoaderService: ComponentLoaderService) {
 }

  ngOnInit() {
    this.getLabelDetails(); /** LABEL CHANGES **/
    this.userGetDetails();
    this.userLocation();
    this.departmentLoad();
    this.saveForm = this.formBuilder.group({
      employeeId: ['', Validators.required],
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: ['', Validators.required],
      mobile: [''],
      emailId: ['', Validators.required],
      skypeId: [''],
      currentAddress: [''],
      permanentAddress: [''],
      id:  [''],
      phoneBookId:  [''],
      locationId: [''],
      sublocationId: [''],
      departmentId: [''],
      langCode: ['']
    });
  }
  departmentLoad(){
    let languageCombo = this.UserProfileService.languageLoad().subscribe(data => {
      let language_selectGetData = JSON.parse(data['_body']);
      this.languageList = language_selectGetData.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
  }
  userGetDetails(){
    this.componentLoaderService.display(true);
    this.viewDetails = true;
    let loaduserDetails = this.UserProfileService.userDetails().subscribe(data => {
      let loaduserListGetData = JSON.parse(data['_body']);
      this.userDetails = loaduserListGetData.succesObject;
      this.locationId= this.userDetails.locationId;
      this.sublocationId = this.userDetails.sublocationId;
      this.langCode = this.userDetails.langCode;
      this.getSublocation(this.locationId);
      this.getDepartment(this.sublocationId);
      this.picurl = this.url + loaduserListGetData.succesObject.phoneBookProfile;
      this.picurl=this.userDetails.imageLoad;
      this.componentLoaderService.display(false);
      if(null!=this.userDetails.imageLoad){
        this.picurl = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
        + this.userDetails.imageLoad);
      }
     

    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
  }
  editDetails(){
    this.viewDetails = false;
    this.saveForm.patchValue(this.userDetails);
    this.saveForm.patchValue({langCode : this.userDetails.langCode});
  }
  onSelectFile(event) {
    this.profilePic = event.target;
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      reader.onload = (event) => { // called once readAsDataURL is completed
        this.picurl = event.target['result'];
      }
    }
  }
  onSubmit(){
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
    let temp = this.saveForm.value;
    let formData = new FormData();
    let action = JSON.stringify(temp);
    formData.append('action', action);
    if(this.profilePic != undefined){
      let file = this.profilePic.files[0];
      formData.append('file', file);
    }
    this.UserProfileService.updateUser(formData).subscribe(
      data => {
        let Response = JSON.parse(data['_body']);

        if(Response.responseCode == '200'){
          if(localStorage.getItem('userId') == this.saveForm.value['id']){              
            localStorage.setItem('langCode',this.saveForm.value.langCode)
          }
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
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => this.router.navigate(['/userprofile']));
          })
        }else{
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
      },
      error => {
        if (error.status === 401) {
          console.log('Error');
        }
      });
    }
  }

  userLocation(){
    let locationCombo = this.UserProfileService.userLocation().subscribe(data => {
      let location_selectGetData = JSON.parse(data['_body']);
      this.locationList = location_selectGetData.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
  }

  getSublocation(val){
    this.locationId = val;
    let locationCombo = this.UserProfileService.userSublocation(this.locationId).subscribe(data => {
      let location_selectGetData = JSON.parse(data['_body']);
      this.sublocationList = location_selectGetData.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
  }

  getDepartment(val){
    this.sublocationId = val;
    let locationCombo = this.UserProfileService.userDepartment(this.locationId, this.sublocationId).subscribe(data => {
      let location_selectGetData = JSON.parse(data['_body']);
      this.departmentList = location_selectGetData.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
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
}

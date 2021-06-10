import { Component, OnInit, ViewChild, Output, Inject } from '@angular/core';
import { MatDialog} from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// import { FlashNewsAddService } from './flash-news-add.service';
import { PhoneBookDetailsService } from '../phone-book-details.service';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import { ComponentLoaderService } from '../../../shared/component-loader.service';
import { JsonApiService } from 'src/assets/api/json-api.service';
@Component({
  selector: 'app-phone-book-details-add',
  templateUrl: './phone-book-details-add.component.html',
  styleUrls: ['./phone-book-details-add.component.css']
})
export class PhoneBookDetailsAddComponent implements OnInit {
  saveForm: FormGroup;
  labels: any = {}; /** LABEL CHANGES **/
  newsTypes = [
    {id: 1, name: 'Flash News'},
    {id: 2, name: 'Thought for the Day'},
  ];

  flashNewsAddGetData: any = {};
  deprtlist: any = [];
  locationList: any = [];
  subLocationList: any = [];
  public imagePath;
  imgURL: any;
  location: any;
  myobj: any = {};
  public message: string;
  userdroplist: any = [];
  userBaseFieldName: any = [];
  subLocationListdept: any = [];
  constructor(
    private jsonApiService: JsonApiService/** LABEL CHANGES **/,
    private router: Router,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private phoneBookDetailsService: PhoneBookDetailsService,
    private componentLoaderService: ComponentLoaderService
  ) { }

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


  ngOnInit() {
    this.getLabelDetails(); /** LABEL CHANGES **/
    this.componentLoaderService.display(true);
    this.saveForm = this.formBuilder.group({
      employeeId: ['', Validators.required],
      employeeName: ['', Validators.required],
      userDepartmentId: ['', Validators.required],
      mobileNumberC: [''],
      extensionNumber: [''],
      userLocationId: ['', Validators.required],
      skypeId: [''],
      sublocationId: ['', Validators.required],
      emailId : ['', Validators.required],
      mobileNumberP: [''],
      phoneNumber : [''],
      phoneBookIsActive: [true],
    });

    this.phoneBookDetailsService.addPhonebookDetails().subscribe(data => {
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


    this.loaddepartandreqtype();
    // this.onloadReqType();
  }



  loaddepartandreqtype() {
   
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
  }

  getSubLocationList(eve, form) {
   
    this.subLocationList = [];
    this.subLocationListdept = [];
    form.controls['sublocationId'].reset();
    form.controls['userDepartmentId'].reset();
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

  getDeptLocation(val, locationId, form){
    this.subLocationListdept = [];
    form.controls['userDepartmentId'].reset();
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
  clearForm() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => this.router.navigate(['/phonedetails/phone-add']));
  }
  onSubmit() {
    let formvalue = this.saveForm.value;
   
    formvalue.screenFieldDisplayVoList = this.userBaseFieldName;

    let formdata = new FormData();
    formdata.append('action' , JSON.stringify(formvalue));
    formdata.append('file', this.myobj.file);
    // this.myobj.file = ;
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
      this.myobj.action = formvalue;
      this.phoneBookDetailsService.addProjectList(formdata).subscribe(data1 => {
        let Response = JSON.parse(data1['_body']);
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
            this.router.navigate(['/phonedetails']);
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
      },
        error => {
          console.log(error);
        });
    }
  }

}

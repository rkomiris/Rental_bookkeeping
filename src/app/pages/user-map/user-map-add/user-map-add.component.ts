
import { Component, OnInit, ViewChild, Output, Inject } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, VERSION, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormBuilder, FormGroup, Validators, NgForm, Form } from '@angular/forms';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
// import { FlashNewsAddService } from './flash-news-add.service';
import { UserMapService } from '../user-map.service';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material';
import { ComponentLoaderService } from '../../../shared/component-loader.service';
import { JsonApiService } from 'src/assets/api/json-api.service';

@Component({
  selector: 'app-user-map-add',
  templateUrl: './user-map-add.component.html',
  styleUrls: ['./user-map-add.component.css']
})
export class UserMapAddComponent implements OnInit {
  saveForm: FormGroup;
  flashNewsAddGetData: any = {};
  deprtlist: any = [];
  locationList: any = [];
  subLocationList: any = [];
  public imagePath;
  imgURL: any;
  location: any;
  myobj: any = {};
  userRoleList: any = [];
  executerUserList: any = [];
  userdroplist: any = [];
  levelCombo: any = [];
  labels: any = {}; /** LABEL CHANGES **/
  reportUserList: any = [];
  userBaseFieldName: any = [];
  userSubLocationCombo: any = [];
  userReportingSubLocationCombo: any = [];
  departmentList: any =[];
  reportingDepartmentList: any = [];
  locationId: number;
  reportinglocationId: number;
  sublocationId: number;
  reportingsublocationId: number;

  public message: string;
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private userMapService: UserMapService,
    private jsonApiService: JsonApiService,/** LABEL CHANGES **/
    private componentLoaderService: ComponentLoaderService
  ) { }

  ngOnInit() {
    this.getLabelDetails(); /** LABEL CHANGES **/
    this.saveForm = this.formBuilder.group({
      userLocationId: ['', Validators.required],
      subLocationId : ['', Validators.required],
      userDepartmentId: ['', Validators.required],
      userRoleId: ['', Validators.required],
      userId: ['', Validators.required],
      reportingLocationId: ['', Validators.required],
      reportingSubLocationId: ['', Validators.required],
      reportingToUser: ['', Validators.required],
      reportingUserDepartment: ['', Validators.required],
      levelId: ['', Validators.required],
    });
    this.loaddepartandreqtype();
  }
  getLabelDetails() {
    let lang;
    if(localStorage.getItem('langCode') !== null){
      lang = localStorage.getItem('langCode');
    }
    this.jsonApiService.fetch('/'+lang+'.json').subscribe((data) => {
        this.labels = data;
      });
  }
  loaddepartandreqtype() {

    this.userMapService.usermapaddscreen().subscribe(data => {
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

    let levelCombo = this.userMapService.load_levelselectBoxData().subscribe(data => {
      let level_selectGetData = JSON.parse(data['_body']);
      this.levelCombo = level_selectGetData.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });

    this.userMapService.load_selectBox_LocationData().subscribe(
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
      this.userMapService.addProjectList(finalval).subscribe(data1 => {
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
            this.router.navigate(['/user-map']);
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


  getSubLocationList(val, form){
    this.locationId = val;
    form.controls['subLocationId'].reset();
    form.controls['userDepartmentId'].reset();
    form.controls['userRoleId'].reset();
    form.controls['userId'].reset();
    this.userSubLocationCombo = [];
    this.departmentList = [];
    this.userRoleList = [];
    this.executerUserList = [];
    
    let loadSelectBoxList = this.userMapService.load_subLocationselectBoxData(val).subscribe(data => {
      let RC_selectGetData = JSON.parse(data['_body']);
      this.userSubLocationCombo = RC_selectGetData.succesObject;
      
    }, error => {
      if(error.status === 401)
      {
        console.log(error);
      }
    });
  }

  getReportingSubLocationList(val, form){
    this.reportinglocationId = val;
    form.controls['reportingToUser'].reset();    
    form.controls['reportingUserDepartment'].reset();
    form.controls['reportingSubLocationId'].reset();
    this.userReportingSubLocationCombo = [];
    this.reportingDepartmentList = [];
    this.reportUserList = [];
    let loadSelectBoxList = this.userMapService.load_subLocationselectBoxData(val).subscribe(data => {
      let RC_selectGetData = JSON.parse(data['_body']);
      this.userReportingSubLocationCombo = RC_selectGetData.succesObject;
    }, error => {
      if(error.status === 401)
      {
        console.log(error);
      }
    });
  }

  getdepartmentList(val, form){
    this.sublocationId = val;
    form.controls['userDepartmentId'].reset();
    form.controls['userRoleId'].reset();
    form.controls['userId'].reset();
    this.departmentList = [];
    this.userRoleList = [];
    this.executerUserList = [];
    this.userMapService.load_selectBox_departmentData(this.locationId, this.sublocationId).subscribe(
      data => {
        let resp = JSON.parse(data['_body']);
        this.departmentList = resp.succesObject;
      },
      error => {
        console.log(error);
      }
    );
  }
  
  getReportingdepartmentList(val, form){
    this.reportingsublocationId = val;
    form.controls['reportingUserDepartment'].reset();
    form.controls['reportingToUser'].reset();
    this.reportingDepartmentList = [];
    this.reportUserList = [];
    this.userMapService.load_selectBox_departmentData(this.reportinglocationId, this.reportingsublocationId).subscribe(
      data => {
        let resp = JSON.parse(data['_body']);
        this.reportingDepartmentList = resp.succesObject;
      },
      error => {
        console.log(error);
      }
    );
  }

  
  
  executerGetUSerRole(id, form) {
    form.controls['userRoleId'].reset();
    form.controls['userId'].reset();
    this.userRoleList = [];
    this.executerUserList = [];
    let userRoleListData = this.userMapService.load_userRoleelectBoxData({ userDepartment: id }).subscribe(data => {
      let resp = JSON.parse(data['_body']);
      this.userRoleList = resp.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
  }

  executerGetUSer(val, form) {
    form.controls['userId'].reset();
    this.executerUserList = [];
    let excuterUSer = this.userMapService.getUSer(val).subscribe(data => {
      let resp = JSON.parse(data['_body']);
      this.executerUserList = resp.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
  }
  
  getreportuser(eve, form) {
    form.controls['reportingToUser'].reset();
    this.reportUserList = [];
    this.userMapService.load_selectBox_userdepta(eve).subscribe(
      data => {
        let resp = JSON.parse(data['_body']);
        this.reportUserList = resp.succesObject;
      },
      error => {
        console.log(error);
      }
    );
  }

}

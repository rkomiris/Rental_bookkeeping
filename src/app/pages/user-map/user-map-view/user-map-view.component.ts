
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
  selector: 'app-user-map-view',
  templateUrl: './user-map-view.component.html',
  styleUrls: ['./user-map-view.component.css']
})
export class UserMapViewComponent implements OnInit {

  saveForm: FormGroup;
  flashNewsAddGetData: any = {};
  deprtlist: any = [];
  locationList: any = [];
  subLocationList: any = [];
  public imagePath;
  imgURL: any;
  myobj: any = {};
  location: any;
  disable = false;
  userRoleList: any = [];
  executerUserList: any = [];
  labels: any = {}; /** LABEL CHANGES **/
  userdroplist: any = [];
  levelCombo: any = [];
  reportUserList: any = [];
  userBaseFieldName: any = [];

  userSubLocationCombo: any = [];
  reportingDepartmentList: any = [];
  userReportingSubLocationCombo:any = [];
  departmentList: any = [];

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
    this.componentLoaderService.display(true);
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
    this.loadview();
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
  loadview() {
    if (localStorage.getItem('userMappingId') !== null) {
      let id = localStorage.getItem('userMappingId');
      this.loadviewall(id);
    }

  }
  loadviewall(id) {
    
    let levelCombo = this.userMapService.load_levelselectBoxData().subscribe(data => {
      let level_selectGetData = JSON.parse(data['_body']);
      this.levelCombo = level_selectGetData.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
    this.userMapService.load_dept().subscribe(data1 => {
      let Response = JSON.parse(data1['_body']);
      if (Response.responseCode === '200') {
        this.deprtlist = Response.succesObject;
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
    this.userMapService.loadview(id).subscribe(data1 => {
      
      let Response = JSON.parse(data1['_body']);
      if (Response.responseCode === '200') {
        let tt = Response.succesObject;
        this.location = tt.userLocationId;
        this.saveForm.patchValue({userLocationId: tt.userLocationId});
        this.saveForm.patchValue({subLocationId: tt.subLocationId});
        this.saveForm.patchValue({userDepartmentId: tt.userDepartmentId});
        this.saveForm.patchValue({userRoleId: tt.userRoleId});
        this.saveForm.patchValue({userId: tt.userId});
        this.saveForm.patchValue({reportingLocationId: tt.reportingLocationId});
        this.saveForm.patchValue({reportingSubLocationId: tt.reportingSubLocationId});
        this.saveForm.patchValue({reportingToUser: tt.reportingToUser});
        this.saveForm.patchValue({levelId: tt.levelId});
        this.saveForm.patchValue({reportingUserDepartment: tt.reportingUserDepartment});
        this.saveForm.patchValue({userMappingId: tt.userMappingId});
        this.getSubLocationList(tt.userLocationId);
        this.getdepartmentList(tt.subLocationId);
        this.getReportingSubLocationList(tt.reportingLocationId);
        this.getReportingdepartmentList(tt.reportingSubLocationId);
        this.executerGetUSerRole(tt.userDepartmentId);
        this.executerGetUSer(tt.userRoleId);
        this.getreportuser(tt.reportingUserDepartment);
        this.userBaseFieldName = Response.authSuccesObject.screenFieldDisplayVoList.map(
          element => {
            return element;
          }
        );
      }
      this.componentLoaderService.display(false);
      });
  }
  executerGetUSerRole(id) {
    let userRoleListData = this.userMapService.load_userRoleelectBoxData({ userDepartment: id }).subscribe(data => {
      let resp = JSON.parse(data['_body']);
      this.userRoleList = resp.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
  }
  getreportuser(eve) {
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
  executerGetUSer(val) {
    let excuterUSer = this.userMapService.getUSer(val).subscribe(data => {
      let resp = JSON.parse(data['_body']);
      this.executerUserList = resp.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
  }
  
getSubLocationList(val){
  this.locationId = val;
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

getReportingSubLocationList(val){
  this.reportinglocationId = val;
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

getdepartmentList(val){
  this.sublocationId = val;
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

getReportingdepartmentList(val){
  this.reportingsublocationId = val;
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

}

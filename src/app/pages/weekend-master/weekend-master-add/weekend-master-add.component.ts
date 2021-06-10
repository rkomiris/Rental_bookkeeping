import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ComponentLoaderService } from 'src/app/shared/component-loader.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { JsonApiService } from 'src/assets/api/json-api.service';
import { environment } from 'src/environments/environment';
import { WeekendMasterService } from '../weekend-master.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-weekend-master-add',
  templateUrl: './weekend-master-add.component.html',
  styleUrls: ['./weekend-master-add.component.css']
})
export class WeekendMasterAddComponent implements OnInit {

  saveForm: FormGroup;
  userBaseFieldName: any = [];
  locationList: any = [];
  sublocationList: any = [];
  labels: any = {};/** LABEL CHANGES **/
  weekList: any = [];
  
  constructor(
    private componentLoaderService: ComponentLoaderService,
    private router: Router,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private weekendMasterService: WeekendMasterService,
    private jsonApiService: JsonApiService/** LABEL CHANGES **/
  ) { }

  ngOnInit() {
    this.componentLoaderService.display(true);
    this.saveForm = this.formBuilder.group({
      locationId: ['', Validators.required],
      subLocationId : ['', Validators.required],
      weekendDetailArr: ['', Validators.required],
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
    let languageCombo = this.weekendMasterService.locationLoad().subscribe(data => {
      let location_selectGetData = JSON.parse(data['_body']);
      this.locationList = location_selectGetData.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });

    let weekdayCombo = this.weekendMasterService.weekdayLoad().subscribe(data => {
      let weekday = JSON.parse(data['_body']);
      this.weekList = weekday.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });

    this.weekendMasterService.addData().subscribe(data => {
      let selectGetData = JSON.parse(data['_body']);
      if (selectGetData.responseCode == '200') {
        this.userBaseFieldName = selectGetData.authSuccesObject.screenFieldDisplayVoList.map(
          element => {
            return element;
          }
        );
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

  sublocation(value){
    let loadSelectBoxList = this.weekendMasterService.sublocationLoad(value).subscribe(data => {
      let RC_selectGetData = JSON.parse(data['_body']);
      this.sublocationList = RC_selectGetData.succesObject;
      
    }, error => {
      if(error.status === 401)
      {
        console.log(error);
      }
    });
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
      this.weekendMasterService.create(this.saveForm.value).subscribe(data => {
        let modifyResponse = JSON.parse(data['_body']);
        let modifySuccessObject = modifyResponse.succesObject;
        if(modifyResponse.responseCode == '200'){
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
            if(data){
              localStorage.removeItem('weekendId');
              this.router.navigate(['/weekend-master']);
            }
          })
        }else{
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

  check(event){
    if(event.value.length > 2){
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
          this.saveForm.controls['weekendDetailArr'].reset();
        // }
      })
    }
  }

}

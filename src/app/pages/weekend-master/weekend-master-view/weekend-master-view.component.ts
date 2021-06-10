import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { environment } from 'src/environments/environment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ComponentLoaderService } from 'src/app/shared/component-loader.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { WeekendMasterService } from '../weekend-master.service';
import { JsonApiService } from 'src/assets/api/json-api.service';

@Component({
  selector: 'app-weekend-master-view',
  templateUrl: './weekend-master-view.component.html',
  styleUrls: ['./weekend-master-view.component.css']
})
export class WeekendMasterViewComponent implements OnInit, OnDestroy {

  saveForm: FormGroup;
  userBaseFieldName: any = [];
  labels: any = {};/** LABEL CHANGES **/
  locationList: any = [];
  sublocationList : any = [];
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
      subLocationId: ['', Validators.required],
      weekendDetailArr: ['', Validators.required]
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
    let weekdayCombo = this.weekendMasterService.weekdayLoad().subscribe(data => {
      let weekday = JSON.parse(data['_body']);
      this.weekList = weekday.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });

    let viewId = Number(localStorage.getItem('weekendId'))
    this.weekendMasterService.viewData(viewId).subscribe(data => {
      let selectGetData = JSON.parse(data['_body']);
      if (selectGetData.responseCode == '200') {
        this.saveForm.patchValue({locationId: selectGetData.succesObject.location});
        this.saveForm.patchValue({subLocationId: selectGetData.succesObject.subLocation});
        this.saveForm.patchValue({weekendDetailArr: selectGetData.succesObject.weekendDetailArr});
        
        this.userBaseFieldName = selectGetData.authSuccesObject.screenFieldDisplayVoList.map(
          element => {
            return element;
          });
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
    localStorage.removeItem('weekendId');
  }

}

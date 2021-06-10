import { Component, OnInit, ViewChild, Output, EventEmitter, Inject, OnDestroy, OnChanges } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, VERSION, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormBuilder, FormGroup, FormArray, Validators, NgForm, Form } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';
import { HeaderService } from './header.service';
import { ConfirmationDialogComponent } from '../../../../shared/confirmation-dialog/confirmation-dialog.component';
// import { ApprovalService } from '../../../../pages/approval/approval.service';
import { environment } from '../../../../../environments/environment';
import { forEach } from '@angular/router/src/utils/collection';
import { JsonApiService } from 'src/assets/api/json-api.service';
// import { ChatTriggerService } from "../../../../chat-trigger.service";
import { ComponentLoaderService } from '../../../../shared/component-loader.service';
import { EntityHomeComponent } from 'src/app/shared/layout/app-layout/header/entity-home/entity-home.component';



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  // styleUrls: ['./header.component.css']
  styleUrls: ['./header-srmav.component.css']
})


export class HeaderComponent implements OnInit, OnChanges {
  fullurl = environment.API_HOST;
  url: string = this.fullurl.substring(0, this.fullurl.length - 3);
  // loginstatus:boolean;
  userDetails: any;
  mailDetails: any;
  appcount: any;
  notificationcount: any;
  approvallist: any = [];
  masterlist: any = [];
  configlist: any = [];
  transactionlist: any = [];
  profileName: any;
  labels: any = {};
  entityName;
  showEntity: boolean;

  constructor(
    private router: Router,
    public headerService: HeaderService,
    private jsonApiService: JsonApiService,
    private componentLoaderService: ComponentLoaderService,
    private dialog: MatDialog
  ) {
    this.routeEvent(this.router);
    this.headerService.notificationcount = 0;
    this.headerService.showEntity = false;
  }


  ngOnChanges() {
    this.callnotification();
    if (localStorage.getItem('userRole') == "1") {
      this.showEntity = true;
    }
  }


  ngOnInit() {

    this.componentLoaderService.display(true);
    let acc = localStorage.getItem('access_token');
    if (acc != undefined && acc != null) {
      this.getLabelDetails();
      this.userProfileDetails();
    }
  }

  /**** LABEL CHNAGES ****/
  getLabelDetails() {
    let lang;
    if (localStorage.getItem('langCode') !== null) {
      lang = localStorage.getItem('langCode');
    } else {
      lang = environment.defaultLocale;
    }
    this.jsonApiService.fetch('/' + lang + '.json').subscribe((data) => {
      this.labels = data;
    });
  }

  callmyroute() {
    localStorage.removeItem('currentStatusId');
    this.router.navigate(['/request']);
  }


  loadTasks() {
    document.getElementById("myTasks").classList.toggle('active');
  }

  mailnotifination() {
    document.getElementById("myTasks1").classList.toggle('active');
  }


  routeEvent(router: Router) {
    router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        if (e.url != '/') { }
        let acc = localStorage.getItem('access_token');
        if (acc === null) {
          this.router.navigate(['/']);
        }
      }
    });
  }

  userProfileDetails() {
    let userDetails = this.headerService.headerDetails().subscribe(
      data => {
        let resp = JSON.parse(data['_body']);
        this.userDetails = resp.succesObject;
        this.profileName = resp.succesObject.userName;
        this.masterlist = this.userDetails.screenVoList.filter(s => s.screenTypeFlag.includes('M'));
        this.transactionlist = this.userDetails.screenVoList.filter(s => s.screenTypeFlag.includes('T'));
        this.configlist = this.userDetails.screenVoList.filter(s => s.screenTypeFlag.includes('C'));
        localStorage.setItem('userId', resp.succesObject.userId);
        localStorage.setItem('entityId', resp.succesObject.entityId);
        localStorage.setItem('entityName', resp.succesObject.entityName);
        localStorage.setItem('userFullName', resp.succesObject.firstName);
        this.entityName = localStorage.getItem('entityName');
      },
      error => {
        if (error.status === 401) {
          console.log('Error');
        }
      }
    );
  }

  callnotification() {
    this.headerService.mailDetails().subscribe(
      data => {
        let resp = JSON.parse(data['_body']);
        if (resp.responseCode == '200') {
          this.headerService.mailDetails1 = resp.succesObject;
          if (localStorage.getItem('userRole') == '1') {
            this.headerService.showEntity = true;
          } else {
            this.headerService.showEntity = false;
          }
          this.headerService.notificationcount = this.headerService.mailDetails1.length;
        } else if (resp.responseCode == '301') {
          const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            disableClose: false,
            panelClass: 'btnCenter',
            width: 'auto',
            data: {
              title: 'Alert',
              server: 'servermessage',
              message: resp.responseMessage,
              btnYes: 'OK',
            }
          });
          dialogRef.afterClosed().subscribe(data => {
            if (data) {
              this.router.navigate(['']);
            }
          })
        }
      })
  }


  changeEntity() {

    if (localStorage.getItem('userRole') == '1') {
      const entity = this.dialog.open(EntityHomeComponent, {
        disableClose: false,
        panelClass: 'btnCenter',
        width: '85%',
        data:
        {
          title: "entityChange",
          message: 'entity',
        }
      });
    } else {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        panelClass: 'btnCenter',
        width: 'auto',
        data: {
          title: 'Alert',
          message: 'superAdmin',
          btnYes: 'Ok',
        }
      });
    }
  }

  function(event) {
    this.entityName = event;
  }

}

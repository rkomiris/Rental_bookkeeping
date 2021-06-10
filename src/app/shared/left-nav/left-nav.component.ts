import { Component, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Router, NavigationEnd } from '@angular/router';
import { HeaderService } from '../../shared/layout/app-layout/header/header.service';
import { environment } from '../../../environments/environment';
import { ApprovalService } from '../../pages/approval/approval.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material';
import { ChatTriggerService } from 'src/app/chat-trigger.service';
import { JsonApiService } from 'src/assets/api/json-api.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-left-nav',
  templateUrl: './left-nav.component.html',
  styleUrls: ['./left-nav.component.css']
})
export class LeftNavComponent implements OnInit {

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
  profile: any;
  id: Number;
  labels: any = {};
  entityName: String;
  userId: string;
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private headerService: HeaderService,
    private chatTriggerService: ChatTriggerService,
    private jsonApiService: JsonApiService,
    private approvalService: ApprovalService,
    private _sanitizer: DomSanitizer) {
    //this.routeEvent(this.router);
    this.headerService.notificationcount = 0;
    this.headerService.showEntity = false;
  }




  IsHidden = true;
  IsIsHidden = true;
  IsIsIsHidden = true;

  onSelect1() {
    this.IsHidden = !this.IsHidden;
  }

  onSelect2() {
    this.IsIsHidden = !this.IsIsHidden;
  }

  onSelect3() {
    this.IsIsIsHidden = !this.IsIsIsHidden;
  }

  sidenavWidth = 50;
  isActive: boolean = true;

  increase(): void {
    if (this.isActive) {
      this.sidenavWidth = 210;
      this.isActive = !this.isActive
    }
    else {
      this.sidenavWidth = 50;
      this.isActive = !this.isActive
    }
  }

  ngAfterViewInit(changes: SimpleChanges) {
  }

  ngOnInit() {
    let acc = localStorage.getItem('access_token');
    if (acc != null) {
      this.getLabelDetails();
      this.userProfileDetails();
    }
    if (localStorage.getItem('userId') !== null) {
      this.userId = localStorage.getItem('userId');
    }
  }

  /**** LABEL CHNAGES ****/
  getLabelDetails() {
    let lang;
    if (localStorage.getItem('langCode') !== null) {
      lang = localStorage.getItem('langCode');
    }
    this.jsonApiService.fetch('/' + lang + '.json').subscribe((data) => {
      this.labels = data;
    });
  }
  callmyroute() {
    localStorage.removeItem('currentStatusId');
    this.router.navigate(['/request']);
  }


  call() {
    this.approvalService.approvallist().subscribe(
      data => {
        let requestListGetData = JSON.parse(data['_body']);
        let requestListTableDate = requestListGetData.succesObject.requestVoList;
        this.headerService.approvallist = requestListTableDate;
        let arr: any = [];
        let count = 0;
        if (requestListTableDate != null) {
          if (requestListTableDate.length > 0) {
            requestListTableDate.forEach(element => {
              if (element.currentStatusId === 2) {
                count++;
              }
              this.appcount = count;
            });
          }
        } else {
          this.appcount = count;
        }
      },
      error => {
        if (error.status === 401) {
          console.log('Error');
        }
      }
    );
  }

  loadTasks() {
    document.getElementById("myTasks").classList.toggle('active');
  }

  mailnotifination() {
    document.getElementById("myTasks1").classList.toggle('active');
  }

  logout() {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: false,
      panelClass: 'btnCenter',
      width: 'auto',
      data: {
        title: 'Confirmation',
        message: 'logout',
        btnYes: 'Yes',
        btnNo: 'No'
      }
    });



    dialogRef.afterClosed().subscribe(data => {

      if (data == true) {

        this.approvalService.logout(localStorage.getItem('userId')).subscribe(data => {
          let Response = JSON.parse(data['_body']);
          if (Response.responseCode === '200') {

            window.localStorage.removeItem("access_token");
            window.localStorage.clear();
            this.router.navigateByUrl('/');
            this.chatTriggerService.changeStatus('close');

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
        })

      }
    });
  }

  userProfileDetails() {
    let userDetails = this.headerService.headerDetails().subscribe(
      data => {
        let resp = JSON.parse(data['_body']);
        if (resp.responseCode == '200') {
          this.userDetails = resp.succesObject;
          this.headerService.changeMessage(this.userDetails.screenVoList);
          this.masterlist = this.userDetails.screenVoList.filter(s => s.screenTypeFlag.includes('M'));
          this.transactionlist = this.userDetails.screenVoList.filter(s => s.screenTypeFlag.includes('T'));
          this.configlist = this.userDetails.screenVoList.filter(s => s.screenTypeFlag.includes('C'));
          this.profile = this.userDetails.profile;
          this.profile = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
            + this.userDetails.imageLoad);
          localStorage.setItem('userId', resp.succesObject.userId);
          localStorage.setItem('userId', resp.succesObject.userId);
          this.userId = resp.succesObject.userId;
          localStorage.setItem('entityId', resp.succesObject.entityId);
          localStorage.setItem('entityName', resp.succesObject.entityName);
          localStorage.setItem('userFullName', resp.succesObject.firstName);
          this.entityName = localStorage.getItem('entityName');
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
            this.router.navigate(['/login']);
          })
        } else if (resp.responseCode == '412' || resp.responseCode == '413') {
          this.userDetails = resp.succesObject;
          this.headerService.changeMessage(this.userDetails.screenVoList);
          this.masterlist = this.userDetails.screenVoList.filter(s => s.screenTypeFlag.includes('M'));
          this.transactionlist = this.userDetails.screenVoList.filter(s => s.screenTypeFlag.includes('T'));
          this.configlist = this.userDetails.screenVoList.filter(s => s.screenTypeFlag.includes('C'));
          this.profile = this.userDetails.profile;

          this.profile = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
            + this.userDetails.imageLoad);

          localStorage.setItem('userId', resp.succesObject.userId);
          localStorage.setItem('userId', resp.succesObject.userId);
          localStorage.setItem('entityId', resp.succesObject.entityId);
          localStorage.setItem('entityName', resp.succesObject.entityName);
          localStorage.setItem('userFullName', resp.succesObject.firstName);
          this.entityName = localStorage.getItem('entityName');
          this.router.navigate(['/changepassword']);
          // })
        } else {
          error => {
            console.log('Error');

          }
        }
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
      });
  }

}

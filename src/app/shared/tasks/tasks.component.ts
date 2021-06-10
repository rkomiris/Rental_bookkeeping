
import { TaskModalComponent } from './task-modal/task-modal.component';
import { Component, OnInit, DoCheck } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { HeaderService } from '../../shared/layout/app-layout/header/header.service';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { JsonApiService } from 'src/assets/api/json-api.service';


@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  // styleUrls: ['./tasks.component.css']
  styleUrls: ['./tasks-srmav.component.css']
})
export class TasksComponent implements OnInit, DoCheck {
  userDetails: any = [];
  currentUrl: string;
  display: boolean;
  warn: boolean;
  labels: any = {};

  constructor(private dialog: MatDialog,
    public headerService: HeaderService,
    private router: Router,
    private jsonApiService: JsonApiService
  ) { }

  ngOnInit() {
    this.currentUrl = this.router.url;
    this.getLabelDetails();
    this.headerService.mailDetails().subscribe(
      data => {
        let resp = JSON.parse(data['_body']);
        if(resp.succesObject != null){
        this.headerService.mailDetails1 = resp.succesObject;
        this.headerService.notificationcount = this.headerService.mailDetails1.length;
        }
      });
  }
  ngDoCheck() {
  }

  /**** LABEL CHNAGES ****/
  getLabelDetails() {
    let lang;
    if(localStorage.getItem('langCode') !== null){
      lang = localStorage.getItem('langCode');
    }
    this.jsonApiService.fetch('/'+lang+'.json').subscribe((data) => {
        this.labels = data;
      });
  }
  createDialogue(reqid) {
    this.router.navigate(['/approvalpage/' + reqid]);
  }
  onLoadList() {
    this.headerService.mailDetails().subscribe(
      data => {
        let resp = JSON.parse(data['_body']);
        this.headerService.mailDetails1 = resp.succesObject;

        if (this.headerService.mailDetails1.length > 0) {
          this.display = true;
          this.warn = false;
        } else {
          this.display = false;
          this.warn = true;
        }

      });
  }
  deletenotification(id) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: false,
      panelClass: 'btnCenter',
      width: 'auto',
      data: {
        title: 'Confirmation',
        message: 'delete',
        btnYes: 'Yes',
        btnNo: 'No'
      }
    });
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.headerService.deletenotification(id).subscribe(
          data => {
            let resp = JSON.parse(data['_body']);
            if (resp.responseCode == '200') {
              const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                disableClose: false,
                panelClass: 'btnCenter',
                width: 'auto',
                data: {
                  title: 'Alert',
                  server:'servermessage',
                  message: resp.responseMessage,
                  btnYes: 'Ok',
                }
              });
              this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => this.router.navigate([String(this.currentUrl)]));
              dialogRef.afterClosed().subscribe(data => {
                this.onLoadList();
                document.getElementById("myTasks1").classList.add('active');
              })
              
            } else {
              const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                disableClose: false,
                panelClass: 'btnCenter',
                width: 'auto',
                data: {
                  title: 'Alert',
                  server:'servermessage',
                  message: resp.responseMessage,
                  btnYes: 'Ok',
                }
              });
            }
          });
      }
    });
  }

}

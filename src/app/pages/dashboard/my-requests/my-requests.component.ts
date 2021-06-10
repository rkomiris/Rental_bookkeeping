import { MyRequestsService } from './my-requests.service';
import { Component, OnInit } from '@angular/core';
// import * as d3 from "d3";
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { HeaderService } from 'src/app/shared/layout/app-layout/header/header.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-my-requests',
  templateUrl: './my-requests.component.html',
  // styleUrls: ['./my-requests.component.css'],
  styleUrls: ['./my-request-srmav.component.css']
})
export class MyRequestsComponent implements OnInit {
  applicaitonData: any = [];
  message : any;
  constructor(private dialog : MatDialog,private headerService : HeaderService, 
    private appService: MyRequestsService, private router: Router) { }


  ngOnInit() {
    this.headerService.currentMessage.subscribe(message => {this.message = message
      });
    this.appService.getWidgetData().subscribe(data => {

     // this.applicaitonData = data['succesObject'];
     // let dataval = data['succesObject'];
      let GetData = JSON.parse(data['_body']);
      let dataval = GetData.succesObject;
      dataval.forEach(val => {
        if (val.currentStatusId === 3) {
        val.src = 'assets/img/escalated.png';
        } else if (val.currentStatusId === 1) {
          val.src = 'assets/img/completed.png';
        } else if (val.currentStatusId === 10) {
          val.src = 'assets/img/reopen.png';
        } else if (val.currentStatusId === 5) {
          val.src = 'assets/img/approved.png';
        } else if (val.currentStatusId === 11) {
          val.src = 'assets/img/cancel.png';
        } else if (val.currentStatusId === 2) {
          val.src = 'assets/img/pending.png';
        }else if (val.currentStatusId === 6) {
          val.src = 'assets/img/reject.png';
        }else if (val.currentStatusId === 8) {
          val.src = 'assets/img/inprogress.png';
        }else if (val.currentStatusId === 14) {
          val.src = 'assets/img/hold.jpg';
        }else if (val.currentStatusId === 7) {
          val.src = 'assets/img/resubmit.png';
        }
        this.applicaitonData.push(val);
      });
    });

  }

   requestNav(status) {
   let filter = this.message.filter(a => a.screenUrl === '/request');
   if (filter.length === 1) {
    localStorage.setItem('currentStatusId', status);
    this.router.navigate(['/dashboardrequest']);
  }else{
    const dialogRef2 = this.dialog.open(ConfirmationDialogComponent, {
      disableClose: false,
      width: 'auto',
      data: {
        title: 'Info',
        message: 'access',
        btnYes: 'Ok'
      }
    });
  }
  }


}


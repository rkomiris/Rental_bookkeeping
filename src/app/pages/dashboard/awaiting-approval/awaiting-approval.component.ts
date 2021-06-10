import { Component, OnInit } from '@angular/core';
import { ApplinksService } from '../applinks/applinks.service';
import { HeaderService } from 'src/app/shared/layout/app-layout/header/header.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
@Component({
  selector: 'app-awaiting-approval',
  templateUrl: './awaiting-approval.component.html',
  // styleUrls: ['./awaiting-approval.component.css'],
  styleUrls: ['./awaiting-approval-srmav.component.css']
})
export class AwaitingApprovalComponent implements OnInit {
  applicaitonDate: any = [];
  appobjlength = 0;
  message : any;
  constructor(private router: Router,
    private dialog : MatDialog,
    private headerService : HeaderService,
    private applinksService: ApplinksService) { }

  ngOnInit() {
    //debugger;
    this.headerService.currentMessage.subscribe(message => {this.message = message
    });
    this.applinksService.getawaitingDataCount().subscribe(data => {
      let GetData = JSON.parse(data['_body']);
      if (GetData.succesObject.totalRecords == undefined || GetData.succesObject.totalRecords == null)
      {
        this.applicaitonDate = 0;
      }
      else
      {
      this.applicaitonDate = GetData.succesObject.totalRecords;
      }

    },
    error => {
      console.log(error);
    },
    () => {
     // this.dataLoaded();
    }
    );
  }

  approvalNav() {
    let filter = this.message.filter(a => a.screenUrl === '/approvallist');
    if (filter.length === 1) {
      localStorage.setItem('awaitingApproval','1');
     this.router.navigate(['/approvallist']);
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


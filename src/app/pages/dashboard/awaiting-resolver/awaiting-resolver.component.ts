import { Component, OnInit } from '@angular/core';
import { ApplinksService } from '../applinks/applinks.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { HeaderService } from 'src/app/shared/layout/app-layout/header/header.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
@Component({
  selector: 'app-awaiting-resolver',
  templateUrl: './awaiting-resolver.component.html',
  // styleUrls: ['./awaiting-resolver.component.css']
  styleUrls: ['./awaiting-resolver-srmav.component.css']
})
export class AwaitingResolverComponent implements OnInit {
  appobjlength = 0;
  message : any;
  constructor(private applinksService: ApplinksService,
    private router: Router,
    private dialog: MatDialog,
    private headerService : HeaderService,
    ) { }

  ngOnInit() {
    this.headerService.currentMessage.subscribe(message => {this.message = message
     });
        this.applinksService.getawaitingResolverDataCount().subscribe(data => {
      let GetData = JSON.parse(data['_body']);
      if (GetData.succesObject.totalRecords == undefined || GetData.succesObject.totalRecords == null)
      {
        GetData.succesObject.totalRecords = 0;
        this.appobjlength = GetData.succesObject.totalRecords;
      }
      else
      {
      this.appobjlength = GetData.succesObject.totalRecords;
      }
    },
    error => {
      console.log(error);
    },
    () => {
    }
    );
  }
  reqResolver(){
    let filter = this.message.filter(a => a.screenUrl === '/request-resolver');
    if (filter.length === 1) {
      localStorage.setItem('fromMytask', '1');
    this.router.navigate(['/request-resolver']);
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


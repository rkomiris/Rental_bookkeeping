import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormBuilder, FormGroup, FormArray, Validators, NgForm, Form } from '@angular/forms';
import { ChangepasswordService } from './changepassword.service';
import { MatDialog } from '@angular/material';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { JsonApiService } from 'src/assets/api/json-api.service';
@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.css']
})
export class ChangepasswordComponent implements OnInit {
  hide1;
  hide2;
  hide3;
  userId: string;
  oldpassword: string;
  newpassword: string;
  confirmpassword: string;
  successMessage: string;
  changedmessage: string;
  labels: any = {};
  constructor(private router: Router,
    private dialog: MatDialog,
    private jsonApiService: JsonApiService,
    private changepasswordService: ChangepasswordService) { }
  ngOnInit() {
    if (localStorage.getItem('userId') !== null) {
      this.userId = localStorage.getItem('userId');
    }
    this.getLabelDetails();
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

  changenewpassword(ev): void {

    if (ev.srcElement[0].value == "" || ev.srcElement[1].value == "" || ev.srcElement[2].value == "") {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        width: 'auto',
        data: {
          title: 'Alert',
          message: 'password',
          btnYes: 'OK'

        }
      });
    } else if (ev.srcElement[1].value !== ev.srcElement[2].value) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        width: 'auto',
        data: {
          title: 'Alert',
          message: 'confirmpassword',
          btnYes: 'OK'

        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result == true) {
          //this.newpassword = "";
          this.confirmpassword = "";
        }
      });
    } else if (ev.srcElement[0].value === ev.srcElement[1].value) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        width: 'auto',
        data: {
          title: 'Alert',
          message: 'passwordcheck',
          btnYes: 'OK'

        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result == true) {
          this.newpassword = "";
          this.confirmpassword = "";
        }
      });
    } else {
      this.changepasswordService.changenew_password(
        this.userId, this.oldpassword, this.newpassword, this.confirmpassword).subscribe(data => {
          let changeNewPasswordRes = JSON.parse(data['_body']);
          this.successMessage = changeNewPasswordRes.responseMessage;
          if (changeNewPasswordRes.responseCode == 200) {
            this.successMessage = changeNewPasswordRes.responseMessage;
            setTimeout(() => {
              this.router.navigateByUrl('/landing-page');
              // window.localStorage.removeItem('access_token');
              // window.localStorage.clear();
              // this.router.navigateByUrl('/');
            }, 3000);


          }
        }, error => {
          if (error.status === 401) {
            console.log('Error');
          }
        });
    }
  }
}


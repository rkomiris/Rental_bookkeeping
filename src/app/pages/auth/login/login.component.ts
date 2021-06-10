import { Component, OnInit, Inject } from '@angular/core';
import { Router } from "@angular/router";
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { LoginService } from "./login.service";
import { DOCUMENT } from '@angular/common';
import { debounceTime } from 'rxjs/operators';
import { Observable, Subject, Subscription } from 'rxjs';
import { ComponentLoaderService } from 'src/app/shared/component-loader.service';
import { MatDialog } from '@angular/material';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { environment } from 'src/environments/environment';
import { EntityComponent } from '../entity/entity.component';
import { HeaderService } from 'src/app/shared/layout/app-layout/header/header.service';
import { SubscriptionComponent } from '../subscription/subscription.component';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  // styleUrls: ['./login.component.css'],
  styleUrls: ['./login-srmav.component.css'],
})
export class LoginComponent implements OnInit {

  hide = true;

  isHidden = true;
  _success = new Subject<string>();
  successMessage: string;

  constructor(private componentLoaderService: ComponentLoaderService
    , @Inject(DOCUMENT) private document: Document,
    private dialog: MatDialog,
    private router: Router,
    private loginService: LoginService,
    private headerService: HeaderService) { }


  forgotPasswordShowDiv(divName: string) {

    if (divName === 'forgotpw') {
      this.isHidden = !this.isHidden;


    }
  }

  cancelShowDiv(divName: string, event) {
    if (divName === 'cancelBtn') {
      this.isHidden = !this.isHidden;
      this.username = '';
      this.password = '';
      this.successMessage = "";


    }
  }

  ngOnInit() {
    this.document.body.classList.add('loginonly');
    window.localStorage.clear();
    this.componentLoaderService.display(false);
    this._success.subscribe((message) => this.successMessage = message);
    this._success.pipe(
      debounceTime(70000)
    ).subscribe(() => this.successMessage = null);

  }

  username: string = '';
  password: string = '';

  login(ev) {
    if (this.username == '' && this.password == '') {
      this._success.next('Username/Password is Required');
    }
    else if (this.username != '' && this.password == '') {
      this._success.next('Enter your password');
    }
    else if (this.username == '' && this.password != '') {
      this._success.next('Enter your username');
    }
    else if (this.username != '' && this.password != '') {
      this.componentLoaderService.display(true);
      this.loginService.postlogin(this.username, this.password).subscribe(data => {
        let loginRes = JSON.parse(data['_body']);
        if (loginRes.status == '200') {
          this.router.navigate(['/landing-page']);
          localStorage.setItem('access_token', loginRes.oAuth2AccessToken.access_token);
          localStorage.setItem('langCode', loginRes.oAuth2AccessToken.userDetails.langCode);
          localStorage.setItem('entityId', loginRes.oAuth2AccessToken.userDetails.entityId);
          localStorage.setItem('userRole', loginRes.oAuth2AccessToken.userDetails.roleId);

          this.headerService.firstName = loginRes.oAuth2AccessToken.userDetails.firstName;
          this.headerService.lastName = loginRes.oAuth2AccessToken.userDetails.lastName;

        } else {
          this._success.next(loginRes.message);
        }
      }, error => {
        // if (error.status === '401') {
        console.log(error)
        let loginRes = JSON.parse(error['_body']);
        this._success.next(loginRes.message);
        // }
      })


      this.componentLoaderService.display(false);
    }
  }

  forgotpassword(ev): void {

    this.loginService.userValid(this.username).subscribe(data => {
      let forgotPasswordRes = JSON.parse(data['_body']);
      if (forgotPasswordRes.responseCode == '200') {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          disableClose: false,
          width: 'auto',
          data: {
            title: 'Confirmation',
            message: 'temppassword',
            btnYes: 'Yes',
            btnNo: 'No',
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result == true) {

            this.componentLoaderService.display(true);
            this.loginService.postforgotpw(this.username).subscribe(data => {
              let forgotPasswordRes = JSON.parse(data['_body']);
              if (forgotPasswordRes.responseCode == 200) {
                this._success.next(forgotPasswordRes.responseMessage);
                setTimeout(() => {
                  this.isHidden = !this.isHidden;
                }, 2000);
              } else {
                this._success.next(forgotPasswordRes.responseMessage);
                setTimeout(() => {
                  // this.isHidden = !this.isHidden;
                }, 2000);
              }
              this.componentLoaderService.display(false);
            }, error => {
              if (error.status === 401) {
                console.log(error);
              }
            })
          }
          else {
            this.successMessage = "";
            // this.isHidden = !this.isHidden;
          }

        })
      }else{
        this.successMessage = forgotPasswordRes.responseMessage;
      }
    })
  }

  userId(event) {
    let username = event.srcElement.value;
    if (username !== "") {
      this.successMessage = "";
    } else {
      this.successMessage = "Please enter the valid user name";
    }
  }


  entityCreation() {
    const dialogRef = this.dialog.open(EntityComponent, {
      disableClose: false,
      panelClass: 'btnCenter',
      width: '90%',
      data: {
        title: 'Entity',
        btnYes: 'Yes',
        btnNo: 'No',
      }
    });
  }


  planSubscription(){
    const dialogRef = this.dialog.open(SubscriptionComponent, {
      disableClose: false,
      panelClass: 'btnCenter',
      width: '90%',
      data: {
        title: 'Plan Subscription',
        btnYes: 'Yes',
        btnNo: 'No',
      }
    });
  }
}


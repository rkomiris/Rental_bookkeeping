import { Component, OnInit } from '@angular/core';
import { LoginService } from '../login/login.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { EntityComponent } from '../entity/entity.component';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})
export class SubscriptionComponent implements OnInit {

  loadDataList: any = [];
  imgURL: any;
  constructor( private loginService: LoginService,
    private dialogRefOwn: MatDialogRef<SubscriptionComponent>,
    private dialog: MatDialog,
    private _sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.loadData();
  }

  loadData(){
    this.loginService.planList().subscribe( data => {
      let load = JSON.parse(data['_body']);
      for(let i = 0; i< load.succesObject.length; i++){
        load.succesObject[i].imgURL = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
        + load.succesObject[i].imageLoad)
      }
      this.loadDataList = load.succesObject;
    })
  }

  entityCreation(count){
    const dialogRef = this.dialog.open(EntityComponent, {
      disableClose: false,
      panelClass: 'btnCenter',
      width: '90%',
      data: {
        title: 'Entity',
        data: count,
        btnYes: 'Yes',
        btnNo: 'No',
      }
    });
    this.dialogRefOwn.close();
  }

}

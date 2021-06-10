import { Component, OnInit } from '@angular/core';
import { ComponentLoaderService } from 'src/app/shared/component-loader.service';
import { Router } from '@angular/router';
import { UserEntityMappingService } from '../user-entity-mapping.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material';
import { JsonApiService } from 'src/assets/api/json-api.service';

@Component({
  selector: 'app-user-entity-mapping-add',
  templateUrl: './user-entity-mapping-add.component.html',
  styleUrls: ['./user-entity-mapping-add.component.css']
})
export class UserEntityMappingAddComponent implements OnInit {

  entityLicenseVOList: any = [];
  entityList: any = [];
  defaultVoList: any = [];
  userList: any;
  labels: any = {};

  constructor(
    private jsonApiService: JsonApiService/** LABEL CHANGES **/,
    private componentLoaderService: ComponentLoaderService,
    private router: Router,
    private userEntityMappingService: UserEntityMappingService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.componentLoaderService.display(true);
    this.getLabelDetails(); /** LABEL CHANGES **/
    this.onLoadData();
    this.componentLoaderService.display(false);
  }

   /** LABEL CHANGES **/
   getLabelDetails() {
    let lang;
    if(localStorage.getItem('langCode') !== null){
      lang = localStorage.getItem('langCode');
    }
    this.jsonApiService.fetch('/'+lang+'.json').subscribe((data) => {
        this.labels = data;
      });
  }
  
  filterItem(value) {
    this.entityLicenseVOList = this.defaultVoList;
    if (!value) {
      this.entityLicenseVOList = this.defaultVoList;
    } // when nothing has typed
    this.entityLicenseVOList = Object.assign([], this.entityLicenseVOList).filter(
      item => item.entityName.toLowerCase().indexOf(value.toLowerCase()) > -1
    )
  }
  onLoadData() {
    let loadScreenAuthList = this.userEntityMappingService.entityLoad(localStorage.getItem('userEntityId')).subscribe(
      data => {
        let LoadGetData = JSON.parse(data["_body"]);
        this.entityLicenseVOList = LoadGetData.succesObject;
        this.defaultVoList = LoadGetData.succesObject;
        this.userList = localStorage.getItem('userEntityName');
        this.entityLicenseVOList.forEach(element => {
          if(element['defaultValue'] == "1"){
            element['defaultChecked'] = true;
          }
          if(element['defaultValue'] == "0"){
            element['defaultChecked'] = false;
          }
        });

        this.entityLicenseVOList.forEach(element => {
          if (element.result == true) {
            element['default'] = true
            element['userId'] = localStorage.getItem('userEntityId');
          } else {
            element['default'] = false
            element['userId'] = localStorage.getItem('userEntityId');
          }
        });

      },
      error => {
        console.log("error");
      }
    );
  }

  check(event, item) {
    this.filterItem('');
    if (event.checked == true) {
      this.entityLicenseVOList.forEach(element => {
        if (element.id == item.id) {
          element['default'] = true;
          element['defaultChecked'] = false;
          element['defaultValue'] = "0";
          element['result'] = true;
        }
      })
    } else {
      this.entityLicenseVOList.forEach(element => {
        if (element.id == item.id) {
          element['default'] = false;
          element['defaultChecked'] = false;
          element['defaultValue'] = "0";
          element['result'] = false;
        }
      })
    }
  }

  defaultCheck(event, item) {
    this.filterItem('');
    this.entityLicenseVOList.forEach(element => {
      element['defaultValue'] = "0";
      element['defaultChecked'] = false;
      element['defaultValue'] = "0";

    });

    if (event.checked == true) {
      this.entityLicenseVOList.forEach(element => {
        if (element.id == item.id){
          element['defaultValue'] = "1";
          element['defaultChecked'] = true;
          element['defaultValue'] = "1";
        }
      });
    }

  }
  tempArray: any = [];
  onSubmit(){
    let temp: any = {};
    
    for(let i = 0; i< this.entityLicenseVOList.length; i++){
      this.entityLicenseVOList[i].entityId = this.entityLicenseVOList[i].id;
    }
    
    for (let k in this.entityLicenseVOList) {
      if (this.entityLicenseVOList[k].result == true && this.entityLicenseVOList[k].default == true) {        
          this.tempArray.push(this.entityLicenseVOList[k]);
      }
    }

    temp['userId'] = localStorage.getItem('userEntityId');
    temp['entityLicenseVOList'] = this.tempArray;

    let loadScreenAuthList = this.userEntityMappingService.save(temp).subscribe(
      data => {
        let LoadGetData = JSON.parse(data["_body"]);
        if(LoadGetData.responseCode == '200'){
          const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            disableClose: false,
            panelClass: 'btnCenter',
            width: 'auto',
            data: {
              title: 'Alert',
              server: 'servermessage',
              message: LoadGetData.responseMessage,
              btnYes: 'OK',
            }
          });
          dialogRef.afterClosed().subscribe(data => {
            if(data){
              localStorage.removeItem('userEntityId');
              localStorage.removeItem('userEntityName');
              this.router.navigate(['user-entity-mapping']);
            }
          })
        }
        else{
          const dialogRefAlert = this.dialog.open(ConfirmationDialogComponent, {
            disableClose: false,
            panelClass: 'btnCenter',
            width: 'auto',
            data: {
              title: 'Alert',
              server: 'servermessage',
              message: LoadGetData.responseMessage,
              btnYes: 'OK',
            }
          });
          dialogRefAlert.afterClosed().subscribe(data => {
            if(data){
              dialogRefAlert.close();
            }
          })
        }
      })

  }

  cancel(){
    localStorage.removeItem('userEntityId');
    localStorage.removeItem('userEntityName');
    this.router.navigate(['user-entity-mapping']);
  }

}

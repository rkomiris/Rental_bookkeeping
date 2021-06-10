import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { AuthenticationViewService } from './authentication-view.service';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
import { ComponentLoaderService } from '../../../shared/component-loader.service';
import { AuthenticationAddService } from '../authentication-add/authentication-add.service';
import { AuthenticationServiceService } from '../authentication-service.service';
import { JsonApiService } from 'src/assets/api/json-api.service';
@Component({
  selector: 'app-authentication-view',
  templateUrl: './authentication-view.component.html',
  // styleUrls: ['./authentication-view.component.css']
  styleUrls: ['./authentication-view-srmav.component.css']
})
export class AuthenticationViewComponent implements OnInit {
  labels: any = {}; /** LABEL CHANGES **/
  saveForm: FormGroup;
  screenCombo : any;
  userRoleCombo : any;
  newScreenForm: FormGroup;
  comboList;
  screenId: any;
  fieldListFlag: boolean = false;
  darkScrollbarOptions = {
    axis: "y",
    theme: "dark",
    scrollButtons: { enable: true }
  };
  subscreenList: any = [];
  screenFieldList: any = [];
  screenFucntionList: any = [];
  constructor(
    private jsonApiService: JsonApiService/** LABEL CHANGES **/,
    private componentLoaderService: ComponentLoaderService,
    private router: Router,
    private authenticationServiceService: AuthenticationServiceService,
    private formBuilder: FormBuilder, private dialog: MatDialog, private authenticationAddService: AuthenticationAddService) {
  }
  ngOnInit() {
    this.getLabelDetails(); /** LABEL CHANGES **/
    /*this.saveForm = this.formBuilder.group({
      screenId  : ['', Validators.required],
      roleId: ['', Validators.required],
      addFlag: [false, Validators.required],
      modifyFlag: [false, Validators.required],
      deleteFlag: [false, Validators.required],
      viewFlag: [false, Validators.required]
    });*/
    this.loadAuth_details();
    this.newScreenForm = this.formBuilder.group({
      screenId: ["", Validators.required],
      subScreenId: ["", Validators.required],
      departmentId: ["", Validators.required],
      cdcCenterId: ["", Validators.required],
      reportingToDepartmentId: ["", Validators.required],
      roleId: ["", Validators.required],
      reportingToUserId: ["", Validators.required],
      userId: ["", Validators.required],
      level: ["", Validators.required]
    });
   // this.onloadSelectboxData();
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
 /* onloadSelectboxData(){
    let screenCombo = this.authenticationAddService.load_ScreenselectBoxData().subscribe(data => {
      let screen_selectGetData = JSON.parse(data['_body']);
      this.screenCombo = screen_selectGetData.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
    let userroleCombo = this.authenticationAddService.load_userRoleselectBoxData().subscribe(data => {
      let userrole_selectGetData = JSON.parse(data['_body']);
      this.userRoleCombo = userrole_selectGetData.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
  }*/
  loadAuth_details() {
    this.componentLoaderService.display(true);
    let loadScreenAuthList = this.authenticationServiceService.getAddAuthList().subscribe(
      data => {
        let ListGetData = JSON.parse(data["_body"]);
        this.comboList = ListGetData.succesObject;
        let temp = {
          menuStatus: 200,
          menu: ListGetData.succesObject.screenDisplayVoList,
          masterMenu: ListGetData.succesObject.masterDisplayVoList,
          userName: ListGetData.succesObject.userName
        };
       // this.headerMenuService.changeMessage(temp);
        this.componentLoaderService.display(false);
      },
      error => {
        console.log("error");
      }
    );
  }
  reportingDepartmentUser(event) {
    let deptId = event.value;
    let reportingDepartmentUser = this.authenticationServiceService.reportingDepartmentUser(
      deptId
    ).subscribe(
      data => {
        let comboGetData = JSON.parse(data["_body"]);
        this.comboList["reportingToUser"] = comboGetData;
      },
      error => {
        console.log("error");
      }
    );
  }
  getSubScreen(event) {
    let scrId = event.value;
    let reportingDepartmentUser = this.authenticationServiceService.getSubScreen(
      scrId
    ).subscribe(
      data => {
        let comboGetData = JSON.parse(data["_body"]);
        this.comboList["subScreenCombo"] = comboGetData;
        this.comboList["subScreenCombo"].unshift({
          id: null,
          name: "Select--"
        });
        this.comboList["loadSubScreenFields"] = null;
        this.comboList["ScrFunction"] = null;
        this.fieldListFlag = false;
      },
      error => {
        console.log("error");
      }
    );
  }
  newScrFn: any = [];
  getsubScreenValues(ev, data) {
    let obj = {
      screenId: data
    };
    if (ev.checked === true) {
      this.newScrFn.push(obj);
      this.screenId = data;
     
      let loadScreenAuthList = this.authenticationServiceService.getSubScreen(data).subscribe(
        data => {
          let ListGetData = JSON.parse(data["_body"]);
          
          this.subscreenList = ListGetData.succesObject;
          this.screenFieldList = [];
          this.screenFucntionList = [];
        },
        error => {
          console.log("error");
        }
      );
    } else {
      let len = this.newScrFn.length;
      for(let i = 0; i <= len; i++){
      let el = this.newScrFn.find(itm => itm.screenId === data);
      if (el) this.newScrFn.splice(this.newScrFn.indexOf(el), 1);
      }
      this.subscreenList = [];
      this.screenFieldList = [];
      this.screenFucntionList = [];
    }
  }
  getfieldsValues(ev, data) {
    if (ev.checked === true) {
      this.screenFieldList = [];
      this.screenFucntionList = [];
      let screenId = this.screenId;
      // for (let i  = 0; i < this.newScrFn.length; i++){
      //   if(this.newScrFn[i].subScreenId == data){

      //   }else{
      //     this.newScrFn.push({subScreenId: data, screenId : this.newScrFn[i].subScreenId})
      //   }
      // }
      if (this.newScrFn.length >= 1) {
        if (this.newScrFn[this.newScrFn.length - 1].subScreenId && this.newScrFn[this.newScrFn.length - 1].subScreenId !== data) {
          if (this.newScrFn[this.newScrFn.length - 1].screenId == this.screenId) {
            this.newScrFn.push({ subScreenId: data, screenId: this.screenId })
          }
        }
      }
      if(this.newScrFn.length >= 1){
        this.newScrFn[this.newScrFn.length - 1].subScreenId = data;
        this.newScrFn[this.newScrFn.length - 1].screenId = this.screenId;
      }else{
        this.newScrFn = [{}];
      this.newScrFn[0]['subScreenId'] = data;
      this.newScrFn[0]['screenId'] = this.screenId;
      }
      if (ev.checked === true) {
        let loadScreenAuthList = this.authenticationServiceService.loadSubScreenFields(data, screenId).subscribe(
          data => {
            let ListGetData = JSON.parse(data["_body"]);
            this.screenFieldList = ListGetData.succesObject;
            this.newScrFn[this.newScrFn.length - 1].fieldAuthenticationMasterList = [];
            for (let i = 0; i < ListGetData.length; i++) {
              if (ListGetData[i].result === true) {
                this.selectFieldsMAnual(ListGetData[i].id, ListGetData[i].baseFilter)
              }
            }
          },
          error => {
            console.log("error");
          }
        );
        let loadScreenFnList = this.authenticationServiceService.loadScrFn(data, screenId).subscribe(
          data => {
            let ListGetData = JSON.parse(data["_body"]);
            this.screenFucntionList = ListGetData.succesObject;
            this.newScrFn[this.newScrFn.length - 1].functionAuthenticationMasterList = [];
            this.newScrFn[this.newScrFn.length - 1].functionAuthenticationMasterList = [];
            for (let i = 0; i < ListGetData.length; i++) {
              if (ListGetData[i].result === true) {
                this.selectFunctionsMAnual(ListGetData[i].id)
              }
            }
          },
          error => {
            console.log("error");
          }
        );
      }
    } else {
    for(let i = 0; i < this.newScrFn.length; i++){
      if(this.newScrFn[i].screenId === this.screenId && this.newScrFn[i].subScreenId === data){
        this.newScrFn.splice(i, 1);
      }
    }

    }
  }
  baseFilterCheck(eve, id, item) {
    let len = this.newScrFn.length - 1;
    let fieldAuthenticationMasterList = this.newScrFn[len].fieldAuthenticationMasterList;
    if (eve.checked === true) {
      for (let i = 0; i < fieldAuthenticationMasterList.length; i++) {
        if (fieldAuthenticationMasterList[i]["fieldId"] === id) {
          fieldAuthenticationMasterList[i]["baseFilter"] = true;
        }
      }
    } else {
      for (let i = 0; i < fieldAuthenticationMasterList.length; i++) {
        if (fieldAuthenticationMasterList[i]["fieldId"] === id) {
          fieldAuthenticationMasterList[i]["baseFilter"] = false;
        }
      }
    }
  }
  fieldValueCheck: any = [];
  fieldCheck(ev, data) {
    let obj = {
      screenFunctionId: data
    };
    if (ev.checked === true) {
      this.fieldValueCheck.push(obj);
    } else {
      let el = this.fieldValueCheck.find(itm => itm.screenFunctionId === data);

      if (el) this.fieldValueCheck.splice(this.fieldValueCheck.indexOf(el), 1);
    }
  }
  onSubmit() {
    if (this.newScrFn.length > 0) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        width: 'auto',
        data: {
          title:'Confirmation',
          message: "submit",
          btnPrjYes: 'Yes',
          btnPrjNo: 'No',
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          let finalValue = {};
          finalValue['roleId'] = Number(localStorage.getItem('roleId'));
          finalValue['screenAuthenticationMasterList'] = this.newScrFn;
          let loadSubScreenFields = this.authenticationServiceService.saveScrAuth(
            finalValue
          ).subscribe(
            data => {
              let ScreenGetData = JSON.parse(data["_body"]);
              if (ScreenGetData.responseCode === "200") {
                const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                  disableClose: false,
                  panelClass: "btnCenter",
                  width: "auto",
                  data: {
                    title: 'Info',
                    server:'servermessage',
                    message: ScreenGetData.responseMessage,
                    btnYes: "OK"
                  }
                });
                dialogRef.afterClosed().subscribe(data => {
                  this.router.navigateByUrl("/authentication");
                });
              }else{
                const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                  disableClose: false,
                  panelClass: "btnCenter",
                  width: "auto",
                  data: {
                    title:'Alert',
                    server:'servermessage',
                    message: ScreenGetData.responseMessage,
                    btnYes: "OK"
                  }
                });
              }
            },
            error => {
              console.log("error");
            }
          );
        }
      });
    } else {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        panelClass: "btnCenter",
        width: "auto",
        data: {
          title:'Alert',
          message: "mandatory",
          btnYes: "OK"
        }
      });
    }
  }
  cancel() {
    this.router.navigateByUrl("/authentication");
  }

  allNonTrades(event) {
    if(event.checked === true){
      this.newScrFn[this.newScrFn.length-1].fieldAuthenticationMasterList = [];
      for(let i = 0; i < this.screenFieldList.length; i++){
        let eve = {checked:true};
        this.selectFields(eve, this.screenFieldList[i].id, this.screenFieldList[i]);
      }
    }else{
        this.newScrFn[this.newScrFn.length-1].fieldAuthenticationMasterList = [];
        for(let i = 0; i < this.screenFieldList.length; i++){
          let eve = {checked:false};
          this.selectFields(eve, this.screenFieldList[i].id, this.screenFieldList[i]);
      }
    }
    // const checked = event.checked;
    // this.comboList["loadSubScreenFields"].forEach(
    //   item => (item.selected = checked)
    // );
    // if (event.checked === true) {
    //   for (let i = 0; i < this.comboList["loadSubScreenFields"].length; i++) {
    //     this.newScrFn.push({
    //       fieldId: this.comboList["loadSubScreenFields"][i].id,
    //       baseFilter: false
    //     });
    //   }
    // }
  }
  selectFields(eve, id, item) {
    let len = this.newScrFn.length - 1;
    let fieldAuthenticationMasterList = this.newScrFn[len].fieldAuthenticationMasterList;
    if (eve.checked === true) {
      item.result = true;
      this.newScrFn[len].fieldAuthenticationMasterList.push({ fieldId: id, baseFilter: false })
    } else {
      item.result = false;
      item.baseFilter = false;
      item.baseResult = false;
      let el = this.newScrFn[len].fieldAuthenticationMasterList.find(itm => itm.fieldId === id);
      if (el) this.newScrFn[len].fieldAuthenticationMasterList.splice(this.newScrFn[len].fieldAuthenticationMasterList.indexOf(el), 1);
    }
  }
  selectFieldsMAnual(id, baseFilter) {
    let len = this.newScrFn.length - 1;
    this.newScrFn[len].fieldAuthenticationMasterList.push({ fieldId: id, baseFilter: baseFilter })
  }
  selectFunctions(eve, id, item) {
    let len = this.newScrFn.length - 1;
    let functionAuthenticationMasterList = this.newScrFn[len].functionAuthenticationMasterList;
    if (eve.checked === true) {
      item.result = true;
      this.newScrFn[len].functionAuthenticationMasterList.push({ screenFunctionId: id })
    } else {
      item.result = false;
      let el = this.newScrFn[len].functionAuthenticationMasterList.find(itm => itm.screenFunctionId === id);
      if (el) this.newScrFn[len].functionAuthenticationMasterList.splice(this.newScrFn[len].functionAuthenticationMasterList.indexOf(el), 1);
    }
  }
  selectFunctionsMAnual(id) {
    let len = this.newScrFn.length - 1;
    this.newScrFn[len].functionAuthenticationMasterList.push({ screenFunctionId: id });

  }
 /* onSubmit() {
    if(this.saveForm.value.addFlag === true){this.saveForm.value.addFlag = '1';
    }else{ this.saveForm.value.addFlag = '0';}
    if(this.saveForm.value.modifyFlag === true){this.saveForm.value.modifyFlag = '1';
    }else{ this.saveForm.value.modifyFlag = '0';}
    if(this.saveForm.value.deleteFlag === true){this.saveForm.value.deleteFlag = '1';
    }else{ this.saveForm.value.deleteFlag = '0';}
    if(this.saveForm.value.viewFlag === true){this.saveForm.value.viewFlag = '1';
    }else{ this.saveForm.value.viewFlag = '0';}
    let formvalue = this.saveForm.value;
    if (this.saveForm.invalid) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        panelClass: 'btnCenter',
        width: 'auto',
        data: {
          message: "Please fill all mandatory Fields",
          btnYes: 'OK',
        }
      });
    } else if (this.saveForm.valid) {
      this.componentLoaderService.display(true);
      this.authenticationAddService.addAuthentication(formvalue).subscribe(data => {
        let Response = JSON.parse(data['_body']);
        if (Response.responseCode === '200') {
          const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            disableClose: false,
            panelClass: 'btnCenter',
            width: 'auto',
            data: {
              message: Response.responseMessage,
              btnYes: 'OK',
            }
          });
          dialogRef.afterClosed().subscribe(data => {
            this.router.navigate(['/authentication']);
          });
        } else {
          const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            disableClose: false,
            panelClass: 'btnCenter',
            width: 'auto',
            data: {
              message: Response.responseMessage,
              btnYes: 'OK',
            }
          });
        }
        this.componentLoaderService.display(false);
      })
    }
  }*/
/*
  saveForm: FormGroup;
  screenCombo: any;
  userRoleCombo: any;
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private authenticationViewService: AuthenticationViewService,
    private componentLoaderService: ComponentLoaderService) {
  }
  ngOnInit() {
    this.componentLoaderService.display(true);
    this.saveForm = this.formBuilder.group({
      screenId: ['', Validators.required],
      roleId: ['', Validators.required],
      addFlag: ['', Validators.required],
      modifyFlag: ['', Validators.required],
      deleteFlag: ['', Validators.required],
      viewFlag: ['', Validators.required]
    });
    this.onloadSelectboxData();
  }
  onloadSelectboxData() {
    let screenCombo = this.authenticationViewService.load_ScreenselectBoxData().subscribe(data => {
      let screen_selectGetData = JSON.parse(data['_body']);
      this.screenCombo = screen_selectGetData.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
    let userroleCombo = this.authenticationViewService.load_userRoleselectBoxData().subscribe(data => {
      let userrole_selectGetData = JSON.parse(data['_body']);
      this.userRoleCombo = userrole_selectGetData.succesObject;
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
    let authenticationId = localStorage.getItem('authenticationId');
    let getModify = this.authenticationViewService.getAuthentication(authenticationId).subscribe(data => {
      let userrole_selectGetData = JSON.parse(data['_body']);
      let formData = userrole_selectGetData.succesObject;
      this.saveForm.patchValue(formData);
      if (formData.addFlag == '1') {
        this.saveForm.patchValue({ addFlag: true });
      } else { this.saveForm.patchValue({ addFlag: false }); }
      if (formData.modifyFlag == '1') {
        this.saveForm.patchValue({ modifyFlag: true });
      } else { this.saveForm.patchValue({ modifyFlag: false }); }
      if (formData.deleteFlag == '1') {
        this.saveForm.patchValue({ deleteFlag: true });
      } else { this.saveForm.patchValue({ deleteFlag: false }); }
      if (formData.viewFlag == '1') {
        this.saveForm.patchValue({ viewFlag: true });
      } else { this.saveForm.patchValue({ viewFlag: false }); }
      this.componentLoaderService.display(false);
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
  }
  onSubmit() {
    if (this.saveForm.value.addFlag === true || this.saveForm.value.addFlag == '1') {
      this.saveForm.value.addFlag = '1';
    } else { this.saveForm.value.addFlag = '0'; }
    if (this.saveForm.value.modifyFlag === true || this.saveForm.value.modifyFlag == '1') {
      this.saveForm.value.modifyFlag = '1';
    } else { this.saveForm.value.modifyFlag = '0'; }
    if (this.saveForm.value.deleteFlag === true || this.saveForm.value.deleteFlag == '1') {
      this.saveForm.value.deleteFlag = '1';
    } else { this.saveForm.value.deleteFlag = '0'; }
    if (this.saveForm.value.viewFlag === true || this.saveForm.value.viewFlag == '1') {
      this.saveForm.value.viewFlag = '1';
    } else { this.saveForm.value.viewFlag = '0'; }
    let formvalue = Object.assign(this.saveForm.value, {'authenticationId' : localStorage.getItem('authenticationId')});
    if (this.saveForm.invalid) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        panelClass: 'btnCenter',
        width: 'auto',
        data: {
          message: "Please fill all mandatory Fields",
          btnYes: 'OK',
        }
      });
    } else if (this.saveForm.valid) {
      this.authenticationViewService.modifyAuthentication(formvalue).subscribe(data => {
        let Response = JSON.parse(data['_body']);
        if (Response.responseCode === '200') {
          const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            disableClose: false,
            panelClass: 'btnCenter',
            width: 'auto',
            data: {
              message: Response.responseMessage,
              btnYes: 'OK',
            }
          });
          dialogRef.afterClosed().subscribe(data => {
            this.router.navigate(['/authentication']);
          });
        } else {
          const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            disableClose: false,
            panelClass: 'btnCenter',
            width: 'auto',
            data: {
              message: Response.responseMessage,
              btnYes: 'OK',
            }
          });
        }
      })
    }
  }
  ngOnDestroy() {
    localStorage.removeItem('authenticationId');
  }*/
}

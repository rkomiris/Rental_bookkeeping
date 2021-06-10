import { Component, OnInit, ViewChild, Output, Inject,OnDestroy } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, VERSION, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormBuilder, FormGroup, Validators, NgForm, Form } from '@angular/forms';
import { Router } from "@angular/router";
import { ComponentLoaderService } from 'src/app/shared/component-loader.service';
import { DelegationAddService } from './delegation-add.service';
import { SelectionModel } from '@angular/cdk/collections';
import { requestListData } from '../../approval/approvallist/approvallist.component';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { JsonApiService } from 'src/assets/api/json-api.service';
import { DelegationModifyService } from '../delegation-modify/delegation-modify.service';

@Component({
  selector: 'app-delegation-add',
  templateUrl: './delegation-add.component.html',
  styleUrls: ['./delegation-add.component.css']
})
export class DelegationAddComponent implements OnInit {

  // userName: String;
  saveForm: FormGroup;
  userBaseFieldName: any = [];
  userDropDown: any = [];
  today = new Date();
  displayNoRecords: Boolean = true;
  seqmodel: any = {};
  dataSource: any = [];
  userNameTable: any = [];
  tableDataList: any = [];
  selection = new SelectionModel<requestListData>(false, []);
  delegationId: string;
  labels: any = {};
  loadDataList: any;

  types: any = [];
    // { value: 1, viewValue: 'Approver' },
    // { value: 2, viewValue: 'Resolver' },
  

  isAllSelected() {
  
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  highlight(element: requestListData) {
    element.highlighted = !element.highlighted;
  }

  masterToggle() {

    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  removeFilter(filterValue: string): void {
    this.displayNoRecords = true;
    if (filterValue.length == 0) {
    }
  }

  recordview(row, event) {
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    if (this.dataSource.filteredData.length > 0 || this.selection.selected.length > 0) {
      this.displayNoRecords = true;
      this.selection.clear();
    } else {
      this.displayNoRecords = false;
    }
  }

  constructor(private componentLoaderService: ComponentLoaderService,
    private router: Router, private formBuilder: FormBuilder, private dialog: MatDialog,
    private delegationAddService: DelegationAddService, private jsonApiService: JsonApiService,
    private delegationModifyService: DelegationModifyService,
  ) { }

  ngOnInit() {
    //this.userName = localStorage.getItem('userName');
    this.userNameTable.push('select');
    this.userNameTable.push('delegatedUserName');
    this.userNameTable.push('userActiveFrom');
    this.userNameTable.push('userActiveTo');
    this.userNameTable.push('userType');
    this.userNameTable.push('remarks');
    this.userNameTable.push('active');

    this.saveForm = this.formBuilder.group({
      userName: [''],
      delegationUserId: [''],
      userDelegationDetailsVoList: this.formBuilder.array([this.delegationUserDetails()]),
    })
    this.getLabelDetails();
    this.loadData();
    this.userLocation();
    this.tableDetails();
    if(localStorage.getItem('langCode') == 'en'){
      this.types = [{ value: 1, viewValue: 'Approver' },
      { value: 2, viewValue: 'Resolver' }]
    }else if(localStorage.getItem('langCode') == 'jp'){
      this.types = [{ value: 1, viewValue: '承認者' },
      { value: 2, viewValue: 'リゾルバ' }]
    }
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
  delegationUserDetails() {
    return this.formBuilder.group({
      delegatedUserId: ['', Validators.required],
      delegatedUserActive: [true, Validators.required],
      userActiveFrom: ['', Validators.required],
      userActiveTo: ['', Validators.required],
      userType: [true, Validators.required],
      delegationRemarks: [''],

    })
  }

  userLocation() {
    let userDropDown = this.delegationAddService.userDropDown().subscribe(
      data => {
        let userDropDownData = JSON.parse(data["_body"]);
        this.userDropDown = userDropDownData.succesObject;

      })
  }

  loadData() {
    let loadData = this.delegationAddService.loadData().subscribe(
      data => {
        let loadData = JSON.parse(data["_body"]);
        this.loadDataList = loadData.authSuccesObject;
        this.saveForm.patchValue({ userName: this.loadDataList.userName });

      })
  }

  tableDetails() {
    if(localStorage.getItem('delegationId') == null){
      this.delegationId = localStorage.getItem('userId');
    }
    else{
      this.delegationId = localStorage.getItem('delegationId');
    }
    
    if( this.delegationId !== null){
      let userDropDown = this.delegationAddService.userDetails(this.delegationId).subscribe(
      data => {
        let tableData = JSON.parse(data["_body"]);
        this.tableDataList = tableData.succesObject[0];
        if(tableData.succesObject.length > 0){
        this.dataSource = new MatTableDataSource(tableData.succesObject);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.displayNoRecords = true;
        }else{
          this.displayNoRecords = false;
        }
      })
    }
    
  }

  onSubmit() {
    if(localStorage.getItem('delegationId') == null){
      this.saveForm.value.delegationUserId = localStorage.getItem('userId');
    }else{
      this.saveForm.value.delegationUserId = localStorage.getItem('delegationId');
    }
    
    this.saveForm.value.delegationActive = 1;

    let submitData = this.delegationAddService.assignData(this.saveForm.value).subscribe(
      data => {
        let Response = JSON.parse(data["_body"]);
        if (Response.responseCode === '200') {
          const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            disableClose: false,
            panelClass: 'btnCenter',
            width: 'auto',
            data: {
              title: 'Info',              
              server:'servermessage',
              message: Response.responseMessage,
              btnYes: 'OK',
            }
          });
          dialogRef.afterClosed().subscribe(data => {
            this.tableDetails();
            this.saveForm.controls['userDelegationDetailsVoList'].reset();
          });

        }
        else {
          const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            disableClose: false,
            panelClass: 'btnCenter',
            width: 'auto',
            data: {
              title: 'Alert',
              server:'servermessage',
              message: Response.responseMessage,
              btnYes: 'OK',
            }
          });
        }
      })
  }

  projectDelete() {
    if (this.selection.selected.length === 1) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        width: 'auto',
        data: {
          title: 'Confirmation',
          message: 'delete',
          btnYes: 'Yes',
          btnNo: 'No',
        }
      });
      let temp: any = {};
      let delegatedUserId = [];
      for (let i = 0; i < this.selection.selected.length; i++) {
        delegatedUserId.push({ delegatedUserId: this.selection.selected[i]['userDelegationDetailsVo'].delegatedUserId });
      }
      temp.userDelegationDetailsVoList = delegatedUserId;
      temp.delegationUserId = localStorage.getItem('delegationUserId');
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.delegationModifyService.deleteList(Number(localStorage.getItem('delegationUserId')),
          Number(this.selection.selected[0]['userDelegationDetailsVo'].delegatedUserId)).subscribe(data => {
            let resp = JSON.parse(data['_body']);
            if (resp.responseCode == '200') {
              const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                disableClose: false,
                panelClass: 'btnCenter',
                width: 'auto',
                data: {
                  title: 'Info',
                  server:'servermessage',
                  message: resp.responseMessage,
                  btnYes: 'Ok',
                }
              });
              dialogRef.afterClosed().subscribe(data => {
                this.tableDetails();
                this.saveForm.controls['userDelegationDetailsVoList'].reset();
              });
            } else {
              const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                disableClose: false,
                width: 'auto',
                panelClass: 'btnCenter',
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
    // else if (this.selection.selected.length > 1) {
    //   const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    //     disableClose: false,
    //     width: 'auto',
    //     data: {
    //       title: 'Confirmation',
    //       message: 'Are you sure you want to delete this items?',
    //       btnYes: 'Yes',
    //       btnNo: 'No',
    //     }
    //   });
    //   let temp: any = {};
    //   let delegatedUserId = [];
    //   for (let i = 0; i < this.selection.selected.length; i++) {
    //     delegatedUserId.push({ delegatedUserId: this.selection.selected[i].delegatedUserId });
    //   }
    //   temp.userDelegationDetailsVoList = delegatedUserId;
    //   temp.delegationUserId = localStorage.getItem('delegationUserId');
    //   dialogRef.afterClosed().subscribe(result => {
    //     if (result) {
    //       this.delegationModifyService.deleteList(temp).subscribe(data => {
    //         let resp = JSON.parse(data['_body']);
    //         if (resp.responseCode == '200') {
    //           const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    //             disableClose: false,
    //             width: 'auto',
    //             panelClass: 'btnCenter',
    //             data: {
    //               title: 'Info',
    //               message: resp.responseMessage,
    //               btnYes: 'Ok',
    //             }
    //           });

    //           dialogRef.afterClosed().subscribe(data => {
    //             this.tableDetails();
    //             this.selection.clear();
    //             this.assignButton = true;
    //             this.modifyButton = false;
    //             this.updateButton = false;
    //             this.deleteButton = false;
    //             this.selection.clear();
    //           });
    //         } else {
    //           const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    //             disableClose: false,
    //             width: 'auto',
    //             panelClass: 'btnCenter',
    //             data: {
    //               title: 'Alert',
    //               message: resp.responseMessage,
    //               btnYes: 'Ok',
    //             }
    //           });
    //           this.selection.clear();
    //         }

    //       }, error => {
    //         if (error.status === 401) {
    //           console.log("Error");
    //         }
    //       });
    //     }
    //   });
    // } 
    else if (this.selection.selected.length === 0) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        panelClass: 'btnCenter',
        width: 'auto',
        data: {
          title: 'Alert',
          message: "selection",
          btnYes: 'Ok',
        }
      });
      dialogRef.afterClosed().subscribe(data => {
        this.selection.clear();
      })
    }
  }

  ngOnDestroy(){
    localStorage.removeItem('delegationId');
    localStorage.removeItem('delegationUserId');
    localStorage.removeItem('detailId');
    this.dataSource = [];
  }

  clear(form){
    // form.controls['userDelegationDetailsVoList'].reset();    
    // form.patchValue({ userName: this.loadDataList.userName });
    // this.tableDetails();
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => this.router.navigate(['/delegation/delegation-add']));
  }
    
  
}

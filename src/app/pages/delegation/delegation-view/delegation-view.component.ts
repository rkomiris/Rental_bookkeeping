import { Component, OnInit, ViewChild } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { useRoleListData } from '../../authentication/authentication.component';
import { MatPaginator, MatSort, MatDialog, MatTableDataSource } from '@angular/material';
import { ComponentLoaderService } from 'src/app/shared/component-loader.service';
import { Router } from '@angular/router';
import { DelegationModifyService } from '../delegation-modify/delegation-modify.service';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { moment } from 'ngx-bootstrap/chronos/test/chain';
import { JsonApiService } from 'src/assets/api/json-api.service';

@Component({
  selector: 'app-delegation-view',
  templateUrl: './delegation-view.component.html',
  styleUrls: ['./delegation-view.component.css']
})
export class DelegationViewComponent implements OnInit {

  

  userName: String;
  saveForm: FormGroup;
  dataForm: any = {};
  userBaseFieldName: any = [];
  userDropDown: any = [];
  today = new Date();
  displayNoRecords: Boolean = true;
  dataSource: any = [];
  userNameTable: any = [];
  tableDataList: any = [];
  selection = new SelectionModel<useRoleListData>(false, []);
  labels: any = {};
  delegationId: any;
  row: any;
  loadDataList: any = [];

  assignButton: Boolean;
  updateButton: Boolean;
  deleteButton: Boolean;
  modifyButton: Boolean;
  types: any = [];
  // types: any[] = [
  //   { value: 1, viewValue: 'Approver' },
  //   { value: 2, viewValue: 'Resolver' },
  // ];
  seqmodel: any;

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  highlight(element: useRoleListData) {
    console.log(element);
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
    private delegationModifyService: DelegationModifyService,
    private jsonApiService: JsonApiService
  ) { }

  ngOnInit() {
    this.userNameTable.push('select');
    this.userNameTable.push('delegatedUserName');
    this.userNameTable.push('userActiveFrom');
    this.userNameTable.push('userActiveTo');
    this.userNameTable.push('userType');
    this.userNameTable.push('remarks');

    this.saveForm = this.formBuilder.group({
      userName: [''],
      delegationUserId: [''],
      userDelegationDetailsVo: this.formBuilder.array([this.delegationUserDetails()]),
    })
    this.assignButton = true;
    this.updateButton = false;
    this.modifyButton = false;
    this.deleteButton = false;
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
      delegatedUserActive: ['', Validators.required],
      userActiveFrom: ['', Validators.required],
      userActiveTo: ['', Validators.required],
      userType: ['', Validators.required],
      delegationRemarks:[''],

    })
  }

  userLocation() {
    let userDropDown = this.delegationModifyService.userDropDown().subscribe(
      data => {
        let userDropDownData = JSON.parse(data["_body"]);
        this.userDropDown = userDropDownData.succesObject;

      })
  }

  loadData() {
    let loadData = this.delegationModifyService.loadData().subscribe(
      data => {
        this.loadDataList = JSON.parse(data["_body"]);
        this.saveForm.patchValue({ userName: this.loadDataList.authSuccesObject.userName });

      })
  }

  tableDetails() {
    this.delegationId = localStorage.getItem('delegationUserId');
    if (this.delegationId == null) {
      this.delegationId = localStorage.getItem('userId');
    }
    let userDropDown = this.delegationModifyService.userDetails(this.delegationId).subscribe(
      data => {
        let tableData = JSON.parse(data["_body"]);
        this.tableDataList = tableData.succesObject[0];
        // this.seqmodel = tableData.succesObject[0].userDelegationDetailsVo.delegationRemarks;

        if(tableData.succesObject !== null){
            this.dataSource = new MatTableDataSource(tableData.succesObject);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.assignButton = true;
        this.updateButton = false;
        this.modifyButton = false;
        this.deleteButton = false;
        this.displayNoRecords = true;
        }
      else{
        this.displayNoRecords = false;
      }
      //this.saveForm.patchValue({delegationRemarks: this.seqmodel });

        if (this.dataSource.filteredData.length == 0) {
          this.displayNoRecords = false;
        }
      })
  }

  duplicatedCheck() {
    let tempId = this.saveForm.value.userDelegationDetailsVo[0].delegatedUserId;

    for (let i = 0; i < this.tableDataList.length; i++) {
      if (this.tableDataList[i].delegatedUserId ==
        this.saveForm.value.userDelegationDetailsVo[0].delegatedUserId) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          disableClose: false,
          panelClass: 'btnCenter',
          width: 'auto',
          data: {
            title: 'Warning',
            server:'servermessage',
            message: "This user has already delegated. Do you want to proceed?",
            btnYes: 'Yes',
            btnNo: 'No'

          }
        });
        dialogRef.afterClosed().subscribe(data => {
          if (data === true) {

          } else {
            this.saveForm.controls['userDelegationDetailsVo'].reset();
          }

        })
      }
    }
  }

  duplicateUserCheck() {
    let tempactiveFrom = moment(this.saveForm.value.userDelegationDetailsVo[0].userActiveFrom).format('DD/MM/YYYY');
    for (let i = 0; i < this.tableDataList.length; i++) {
      if (this.tableDataList[i].delegatedUserId ==
        this.saveForm.value.userDelegationDetailsVo[0].delegatedUserId) {

        let tempActiveTo = moment(this.tableDataList[i].activeTo).format('DD/MM/YYYY');
        if (this.tableDataList[i].delegatedUserId ==
          this.saveForm.value.userDelegationDetailsVo[0].delegatedUserId &&
          tempActiveTo >= tempactiveFrom) {
            const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
              disableClose: false,
              panelClass: 'btnCenter',
              width: 'auto',
              data: {
                title: 'Warning',
                message: "alreadyDelegatedDate",
                btnYes: 'Yes', 
                btnNo: 'No'            
              }
            });
            dialogRef.afterClosed().subscribe(data => {
              if(data === true){

              }else{
                this.saveForm.controls['userDelegationDetailsVo'].reset();
              }
              
            })
        }

      }
    }
  }

  duplicateTypeCheck() {
    let tempactiveFrom = moment(this.saveForm.value.userDelegationDetailsVo[0].userActiveFrom).format('DD/MM/YYYY');
    let tempType = this.saveForm.value.userDelegationDetailsVo[0].userType;
    for (let i = 0; i < this.tableDataList.length; i++) {
      if (this.tableDataList[i].delegatedUserId ==
        this.saveForm.value.userDelegationDetailsVo[0].delegatedUserId) {

        let tempActiveTo = moment(this.tableDataList[i].activeTo).format('DD/MM/YYYY');
        let tempTypeCheck = this.tableDataList[i].userType;
        if (this.tableDataList[i].delegatedUserId ==
          this.saveForm.value.userDelegationDetailsVo[0].delegatedUserId &&
          tempActiveTo >= tempactiveFrom && tempType == tempTypeCheck) {
            const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
              disableClose: false,
              panelClass: 'btnCenter',
              width: 'auto',
              data: {
                title: 'Warning',
                server:'servermessage',
                message: "delegatedDate",
                btnYes: 'Ok',             
              }
            });
            dialogRef.afterClosed().subscribe(data => {
              this.saveForm.controls['userDelegationDetailsVo'].reset();
            })
        }

      }
    }
  }


  recordview(row) {
    this.row = row;
    localStorage.setItem('detailId', row.userDelegationDetailsVo.delegationDetailId);
    localStorage.setItem('delegatedUserId', row.userDelegationDetailsVo.delegatedUserId);
    if (this.selection.selected.length === 1) {
      this.assignButton = false;
      this.updateButton = false;
      this.modifyButton = true;
      this.deleteButton = true;
    } else if (this.selection.selected.length > 1) {
      this.assignButton = false;
      this.updateButton = false;
      this.modifyButton = false;
      this.deleteButton = true;
    } else if (this.selection.selected.length === 0) {
      this.assignButton = true;
      this.updateButton = false;
      this.modifyButton = false;
      this.deleteButton = false;
    }

  }

  projectModify() {
    let row = this.row;
    if (this.selection.selected.length === 1) {

      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        panelClass: 'btnCenter',
        width: 'auto',
        data: {
          title: 'Alert',
          message: "modify",
          btnYes: 'Modify',
          btnNo: 'Delete',
        }
      });

      dialogRef.afterClosed().subscribe(data => {
        if (data == true) {
          this.delegationId = localStorage.getItem('delegationId');
          if (this.delegationId == null) {
            this.delegationId = localStorage.getItem('userDelegationId');
          }

          let viewData = this.delegationModifyService.viewData(this.delegationId, localStorage.getItem('detailId')).subscribe(
            data => {
              let loadData = JSON.parse(data["_body"]);
              let loadDataList = loadData.succesObject;

              row.userDelegationDetailsVo = [loadDataList.userDelegationDetailsVo];
              row.userDelegationDetailsVo[0].userActiveFrom = moment(loadDataList.userDelegationDetailsVo.userActiveFrom).toISOString();
              row.userDelegationDetailsVo[0].userActiveTo = moment(loadDataList.userDelegationDetailsVo.userActiveTo).toISOString();
              row.userDelegationDetailsVo[0].delegatedUserId = loadDataList.userDelegationDetailsVo.delegatedUserId;
              this.saveForm.patchValue(row);

              this.assignButton = false;
              this.updateButton = true;
              this.modifyButton = false;
              this.deleteButton = false;

            })
        } else {
          localStorage.removeItem('detailId');
          this.selection.clear();

        }
      });
    }

    else if (this.selection.selected.length == 0) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        panelClass: 'btnCenter',
        width: 'auto',
        data: {
          title: 'Warning',
          message: "singleSelection",
          btnYes: 'Ok',

        }
      });
    }

  }

  projectUpdate() {
    let updateDelegationUserId = localStorage.getItem('delegationUserId');
    this.dataForm.delegationUserId = updateDelegationUserId;
    let updatedelegationId = localStorage.getItem('delegationId');
    this.dataForm.delegationId = updatedelegationId;

    if (updateDelegationUserId == null) {
      let updateDelegationUserId = localStorage.getItem('userId');
      this.dataForm.delegationUserId = updateDelegationUserId;
    }

    if (updatedelegationId == null) {
      let updatedelegationId = localStorage.getItem('userDelegationId');
      this.dataForm.delegationId = updatedelegationId;
    }


    this.dataForm.userDelegationDetailsVo = this.saveForm.value.userDelegationDetailsVo[0]
    if (localStorage.getItem('detailId') !== null) {
      this.dataForm.userDelegationDetailsVo.delegationDetailId = localStorage.getItem('detailId');
    }
    let viewData = this.delegationModifyService.update(this.dataForm).subscribe(
      data => {
        let updateData = JSON.parse(data["_body"]);

        if (updateData.responseCode == 200) {
          const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            disableClose: false,
            panelClass: 'btnCenter',
            width: 'auto',
            data: {
              title: 'Info',
              server:'servermessage',
              message: updateData.responseMessage,
              btnYes: 'Ok',
            }
          });
          dialogRef.afterClosed().subscribe(data => {
            this.assignButton = true;
            this.updateButton = false;
            localStorage.removeItem('detailId');
            this.loadData();
            this.tableDetails();
            this.assignButton = true;
            this.updateButton = false;
            this.modifyButton = false;
            this.deleteButton = false;
            this.selection.clear();
            this.saveForm.controls['userDelegationDetailsVo'].reset();
          })
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
                this.loadData();
                this.selection.clear();
                this.assignButton = true;
                this.updateButton = false;
                this.modifyButton = false;
                this.deleteButton = false;
                this.saveForm.controls['userDelegationDetailsVo'].reset();
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
        this.assignButton = true;
        this.modifyButton = false;
        this.updateButton = false;
        this.deleteButton = false;
        this.selection.clear();
      })
    }
  }
  
  reset() {
    this.saveForm.patchValue({ userName: this.loadDataList.userName });
    this.saveForm.controls['userDelegationDetailsVo'].reset();
  }

  ngOnDestroy() {
    localStorage.removeItem('delegationId');
    localStorage.removeItem('delegationUserId');
    localStorage.removeItem('detailId');
    localStorage.removeItem('userDelegationId');
    this.dataSource = [];
  }





}

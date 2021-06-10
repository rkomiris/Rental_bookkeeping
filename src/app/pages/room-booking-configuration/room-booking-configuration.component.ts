import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter, Inject, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource,VERSION, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormBuilder, FormGroup, FormArray, Validators, NgForm, Form } from '@angular/forms';
import { Router } from "@angular/router";
import { DOCUMENT } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';
import { RoomBookingConfigurationService } from './room-booking-configuration.service';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { ComponentLoaderService } from '../../shared/component-loader.service';
export interface aminiteListData {
  highlighted?: boolean;
  hovered?: boolean;
  roomWorkFlowId: number;
}
const ELEMENT_DATA: aminiteListData[] = [];
@Component({
  selector: 'app-room-booking-configuration',
  templateUrl: './room-booking-configuration.component.html',
  // styleUrls: ['./room-booking-configuration.component.css']
  styleUrls: ['./room-booking-configuration-srmav.component.css']
})
export class RoomBookingConfigurationComponent implements OnInit {
  searchForm: FormGroup;
  displayNoRecords = true;
  BaseFieldName: any = [];
  dataSource: any = [];
  rowindex: any;
  count: number = 1;
  searchCombo: any;;
  qtd: any = [];
  qtm: any = '';
  add = false;
  modify = false;
  view = false;
  delete = false;
  statuslist = [{name: 'Active'}, {name: 'InActive'} ];
  selection = new SelectionModel<aminiteListData>(true, []);

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  highlight(element: aminiteListData) {
    element.highlighted = !element.highlighted;
  }


  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));

  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
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

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private formBuilder: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private roomBookingConfigurationService: RoomBookingConfigurationService,
    private componentLoaderService: ComponentLoaderService) { }

  ngOnInit() {
    this.componentLoaderService.display(true);
    this.document.body.classList.remove('loginonly');

    this.searchForm = this.formBuilder.group({
      searchDatas: this.formBuilder.array([this.sequenceType()]),
    });

    this.RWF_list_details();
  }




  sequenceType() {
    return this.formBuilder.group({
      dropDownVal: [""],
      textVal: [""],
    })
  }
  addSequence(form) {
    let j = form.controls.searchDatas.controls.length;
   let i = j-1; 
 
   let dropvalue = form.controls.searchDatas.controls[i].controls.dropDownVal.value;
   let textVal = form.controls.searchDatas.controls[i].controls.textVal.value;
   console.log("drop down value of ", i , "is ",dropvalue);
   console.log("text down value of ", i , "is ",textVal);
   
   if (this.count <= 8 && dropvalue !== null && textVal != null) {
     (
     this.searchForm.controls['searchDatas'] as FormArray).push(this.sequenceType());
     this.count++;
   }
 }
  deleteSequence() {
    if (this.count > 1) {
      (this.searchForm.controls['searchDatas'] as FormArray).removeAt(-1);
      this.count--;
      this.qtd.pop();
    }
  }

  changefield(val, ind,form) {
    form.controls.searchDatas.controls[ind].controls.textVal.reset();
    console.log(val, ind);
    console.log(this.qtd);
    let kk = this.hasNoDuplicates(this.qtd);
    console.log(kk);
    if (kk === true) {

    } else { this.qtd[ind] = {}; 
    form.controls.searchDatas.controls[ind].controls.dropDownVal.reset();
    form.controls.searchDatas.controls[ind].controls.textVal.reset();}
  }

  hasNoDuplicates(arr) {
    return arr.every(num => arr.indexOf(num) === arr.lastIndexOf(num));
  }


  onSubmitSearch(val) {
    let finalSearchData = {};
    let formValue = val;
    for (let i = 0; i < formValue.searchDatas.length; i++) {
      let key = formValue.searchDatas[i]['dropDownVal'];
      let value = formValue.searchDatas[i]['textVal'];
      let fullValue = {}
      if(key != '' && value != ''){
      fullValue[key] = value;
      Object.assign(finalSearchData, fullValue);
      }
    }
    this.roomBookingConfigurationService.search_list(finalSearchData).subscribe(data => {
      let reqScrConfigSearchData = JSON.parse(data['_body']);
      this.dataSource = new MatTableDataSource(reqScrConfigSearchData.succesObject);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })

    setTimeout(() => {
      if (this.dataSource.filteredData.length > 0 || this.selection.selected.length > 0) {
        this.displayNoRecords = true;
        this.selection.clear();
      } else {
        this.displayNoRecords = false;
      }
    }, 100);
  }
  removeFilter(filterValue: string): void {
    this.displayNoRecords = true;
    if (filterValue.length == 0) {
      this.RWF_list_details();
    }
  }



  RWF_list_details() {

    let loadRWFList = this.roomBookingConfigurationService.load_RBC_Data().subscribe(data => {
      let RWF_ListData = JSON.parse(data['_body']);
      let RWF_ListTableDate = RWF_ListData.succesObject;
      if(RWF_ListTableDate.roomWorkFlowVoList.length !== 0){
        this.dataSource = new MatTableDataSource(RWF_ListTableDate.roomWorkFlowVoList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.displayNoRecords =true;
      }
      else{
        this.displayNoRecords =false;
      }
    //   this.BaseFieldName = ['select','roomName','locationName', 'subLocationName', 'roomWorkFlowCode','roomWorkFlowDescription','buildingName',
    //         // 'roomName',
    //   'departmentName', 'roomWorkFlowIsActive'
    //   // , 'roomWorkFlowIsMailRequired', 'roomWorkFlowIsMgtEscalationRequired', 'roomWorkFlowIsNotificationRequired'
    // ];
        this.BaseFieldName = RWF_ListData.succesObject.screenFieldDisplayVoList;
        this.searchCombo = [{ Name: 'Choose Field' }];
        let search = [
        // { Name: 'Choose Field' },
        { Name: "Room Name", Value: 'roomName' },
        { Name: "Location Name", Value: 'locationName' },
        { Name: "SubLocation Name", Value: 'subLocationName' },
        { Name: "Room WorkFlow Code", Value: 'roomWorkFlowCode' },
        { Name: "Room WorkFlow Description", Value: 'roomWorkFlowDescription' },
        { Name: "Building Name", Value: 'buildingName' },
        { Name: "Department Name", Value: 'departmentName' },
        { Name: "Status", Value: 'status' },
      ];

      for (let k in search) {
        console.log(search[k].Value);
        let ll = this.BaseFieldName.includes(search[k].Value);
        // console.log(ll);
        if(ll===true) {
         this.searchCombo.push(search[k]);
        }
       }
       let screenFunctionDisplayList = RWF_ListData.succesObject.screenFunctionDisplayList;
      // console.log(this.screenFunctionDisplayList);
       for (let k in screenFunctionDisplayList) {
       // console.log(screenFunctionDisplayList[k]);

        if(screenFunctionDisplayList[k] === 'ADD') {
          this.add = true;
        }
        if(screenFunctionDisplayList[k] === 'MODIFY') {
          this.modify = true;
        }
        if(screenFunctionDisplayList[k] === 'VIEW') {
            this.view = true;
        }
        if(screenFunctionDisplayList[k] === 'DELETE') {
           this.delete = true;
        }
       }
      // this.searchCombo=
      this.componentLoaderService.display(false);

    }, error => {
      if(error.status === 401)
      {
        alert("Error");
      }
    });
  }




  removeSelectedRows() {
    if (this.selection.selected.length === 1) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        width: 'auto',
        data: {
          title: 'Confirmation',
          message: 'Are you sure you want to delete this item?',
          btnYes: 'Yes',
          btnNo: 'No',
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.selection.selected.forEach(item => {
            let reqWorkFlow = [item.roomWorkFlowId];
            this.roomBookingConfigurationService.deleteProjectList(reqWorkFlow).subscribe(data => {
              let resp = JSON.parse(data['_body']);
              if(resp.responseCode == '200'){
                const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                  disableClose: false,
                  panelClass: 'btnCenter',
                  width: 'auto',
                  data: {
                    title: 'Info',
                    message: resp.responseMessage,
                    btnYes: 'Ok',
                  }
                });
              }else{
                const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                  disableClose: false,
                  panelClass: 'btnCenter',
                  width: 'auto',
                  data: {
                    title: 'Alert',
                    message: resp.responseMessage,
                    btnYes: 'Ok',
                  }
                });
              }
              this.RWF_list_details();
            })
          });
          this.selection = new SelectionModel<aminiteListData>(true, []);
        }

      });
    }
    else if (this.selection.selected.length > 0) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        width: 'auto',
        data: {
          title: 'Confirmation',
          message: 'Are you sure you want to delete this item(s)?',
          btnYes: 'Yes',
          btnNo: 'No',
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          let reqWorkFlow = [];
          for(let i = 0; i < this.selection.selected.length; i++){
            reqWorkFlow.push(this.selection.selected[i].roomWorkFlowId)
          }
            this.roomBookingConfigurationService.deleteProjectList(reqWorkFlow).subscribe(data => {
              let resp = JSON.parse(data['_body']);
              if(resp.responseCode == '200'){
                const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                  disableClose: false,
                  panelClass: 'btnCenter',
                  width: 'auto',
                  data: {
                    title: 'Info',
                    message: resp.responseMessage,
                    btnYes: 'Ok',
                  }
                });
                this.RWF_list_details();
              }else{
                const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                  disableClose: false,
                  panelClass: 'btnCenter',
                  width: 'auto',
                  data: {
                    title: 'Alert',
                    message: resp.responseMessage,
                    btnYes: 'Ok',
                  }
                });
              }
            });
          this.selection = new SelectionModel<aminiteListData>(true, []);
        }

      });
    }else if(this.selection.selected.length === 0){
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        panelClass: 'btnCenter',
        width: 'auto',
        data: {
          title: 'Alert',
          message: "Please select a record",
          btnYes: 'Ok',
         // btnNo: 'Cancel',
        }
      });
    }
  }
  
  projectModify() {
    if (this.selection.selected.length === 1) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        panelClass: 'btnCenter',
        width: 'auto',
        data: {
          title: 'Confirmation',
          message: 'Are you sure you want to modify this Record?',
          btnPrjYes: 'Yes',
          btnPrjNo: 'No',
        }
      });
      dialogRef.afterClosed().subscribe(data => {
        if (localStorage.getItem('isCancelled') === 'No') {
          this.componentLoaderService.display(true);
          this.router.navigate(['/room-booking-configuration/room-booking-configuration-modify']);
          let rowId = String(this.selection.selected[0]['roomWorkFlowId']);
          localStorage.setItem('roomWorkFlowId', rowId)

        } else if (localStorage.getItem('isCancelled') === 'Yes') {
          return
        }
      });
    } else if (this.selection.selected.length > 1) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        panelClass: 'btnCenter',
        width: 'auto',
        data: {
          title: 'Alert',
          message: 'Please Select a Single Record',
          btnYes: 'OK',
        }
      });
    }
    else if (this.selection.selected.length < 1) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        panelClass: 'btnCenter',
        width: 'auto',
        data: {
          title: 'Alert',
          message: 'Please Select a  Record',
          btnYes: 'OK',
        }
      });
    }
    localStorage.removeItem('isCancelled');
  }






  projectView() {
    if (this.selection.selected.length === 1) {
      this.componentLoaderService.display(true);
      this.router.navigate(['/room-booking-configuration/room-booking-configuration-view']);
      let rowId = String(this.selection.selected[0]['roomWorkFlowId']);
      localStorage.setItem('roomWorkFlowId', rowId);
     /* const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        panelClass: 'btnCenter',
        width: 'auto',
        data: {
          message: 'Are you sure you want to View this Record?',
          btnPrjYes: 'Yes',
          btnPrjNo: 'No',
        }
      });
      dialogRef.afterClosed().subscribe(data => {
        if (localStorage.getItem('isCancelled') === 'No') {

          this.router.navigate(['/room-booking-configuration/room-booking-configuration-view']);
          let rowId = String(this.selection.selected[0]['roomWorkFlowId']);
          localStorage.setItem('roomWorkFlowId', rowId)

        } else if (localStorage.getItem('isCancelled') === 'Yes') {
          return
        }
      });*/
    } else if (this.selection.selected.length > 1) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        panelClass: 'btnCenter',
        width: 'auto',
        data: {
          title: 'Alert',
          message: 'Please Select a Single Record',
          btnYes: 'OK',
        }
      });
    }
    else if (this.selection.selected.length < 1) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        panelClass: 'btnCenter',
        width: 'auto',
        data: {
          title: 'Alert',
          message: 'Please Select a  Record',
          btnYes: 'OK',
        }
      });
    }
    localStorage.removeItem('isCancelled');
  }


  searchClear(){
    for(let i=0; i < this.searchForm.value.searchDatas.length; i++){
      this.deleteSequence();
    }
    this.displayNoRecords = true;
    this.ngOnInit();
	}

}

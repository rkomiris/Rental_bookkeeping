import { Component, OnInit, ViewChild, Output, EventEmitter, Inject, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource,VERSION, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormBuilder, FormGroup, FormArray, Validators, NgForm, Form } from '@angular/forms';
import { Router } from "@angular/router";
import { DOCUMENT } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';
import { RoomconfigService } from './roomconfig.service';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { ComponentLoaderService } from '../../shared/component-loader.service';
export interface subLocationListData {
  highlighted?: boolean;
  hovered?: boolean;
  roomConfigId: number;
}
const ELEMENT_DATA: subLocationListData[] = [];
@Component({
  selector: 'app-roomconfig',
  templateUrl: './roomconfig.component.html',
  // styleUrls: ['./roomconfig.component.css']
  styleUrls: ['./roomconfig-srmav.component.css']
})
export class RoomconfigComponent implements OnInit {
  searchForm: FormGroup;
  displayNoRecords = true;
  roomConfigBaseFieldName: any = [];
  dataSource: any = [];
  rowindex: any;
  count: number = 1;
  searchCombo: any;
  qtd: any = [];
  qtm: any = '';
  add = false;
  modify = false;
  view = false;
  delete = false;
  priorityList: any[] = [
    {id:1, value: 'Low'},
    {id:2, value:'Medium'},
    {id:3, value:'High'}
  ];
  statuslist = [{name: 'Active'}, {name: 'InActive'} ];
  selection = new SelectionModel<subLocationListData>(true, []);
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  highlight(element: subLocationListData) {
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
    private componentLoaderService: ComponentLoaderService,
    @Inject(DOCUMENT) private document: Document,
    private formBuilder: FormBuilder,
    private router: Router, private dialog: MatDialog,
    private roomconfigService: RoomconfigService) { }
  ngOnInit() {
    this.componentLoaderService.display(true);
    this.document.body.classList.remove('loginonly');
    this.searchForm = this.formBuilder.group({
      searchDatas: this.formBuilder.array([this.sequenceType()]),
    });
    this.roomConfig_list_details();
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
   
   if (this.count <= 3 && dropvalue !== null && textVal != null) {
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
    form.controls.searchDatas.controls[ind].controls.textVal.reset(); }


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
    this.roomconfigService.search_list(finalSearchData).subscribe(data => {
      let reqScrConfigSearchData = JSON.parse(data['_body']);
      this.dataSource = new MatTableDataSource(reqScrConfigSearchData.succesObject);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
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
      this.roomConfig_list_details();
    }
  }
  roomConfig_list_details() {
    let loadRoomConfigList = this.roomconfigService.load_sublocation().subscribe(data => {
      let roomConfigListGetData = JSON.parse(data['_body']);
      let roomConfig_ListTableDate = roomConfigListGetData.succesObject;
      this.dataSource = new MatTableDataSource(roomConfig_ListTableDate.rinRoomConfigVoList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      //this.roomConfigBaseFieldName = ['select','roomConfigCode','userLocationName', 'roomConfigRoomName', 'roomConfigNoOfSeats', 'active'];
      this.roomConfigBaseFieldName = roomConfigListGetData.succesObject.screenFieldDisplayVoList;
        this.searchCombo = [{ Name: 'Choose Field' }];
        let search = [
        //{ Name: 'Choose Field' },
        { Name: 'Choose Field' },
        { Name: "Code", Value: 'roomConfigCode' },
        { Name: "Location", Value: 'userLocationName' },
        { Name: "SubLocation", Value: 'subLocationName' },
        { Name: "Room Configuration Name", Value: 'roomConfigRoomName' },
        { Name: "No of Seats", Value: 'roomConfigNoOfSeats' },,
        {Name : "Room Priority", Value :'roomConfigPriorty'},
        { Name: "Status", Value: 'status' },
      ];

      for (let k in search) {
        console.log(search[k].Value);
        let ll = this.roomConfigBaseFieldName.includes(search[k].Value);
        // console.log(ll);
        if(ll===true) {
         this.searchCombo.push(search[k]);
        }
       }
       let screenFunctionDisplayList = roomConfigListGetData.succesObject.screenFunctionDisplayList;
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

    }, error => {
      if(error.status === 401)
      {
        alert("Error");
      }
    });
    this.componentLoaderService.display(false);
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
            let reqWorkFlow = [item.roomConfigId];
            this.roomconfigService.deleteProjectList(reqWorkFlow).subscribe(data => {
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
                  width: 'auto',
                  panelClass: 'btnCenter',
                  data: {
                    title: 'Alert',
                    message: resp.responseMessage,
                    btnYes: 'Ok',
                  }
                });
              }
              this.roomConfig_list_details();
            })
          });
          this.selection = new SelectionModel<subLocationListData>(true, []);
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
            reqWorkFlow.push(this.selection.selected[i].roomConfigId)
          }
            this.roomconfigService.deleteProjectList(reqWorkFlow).subscribe(data => {
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
                this.roomConfig_list_details();
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
          this.selection = new SelectionModel<subLocationListData>(true, []);
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
        //  btnNo: 'Cancel',
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
          this.router.navigate(['/roomconfig/roomconfig-modify']);
          let rowId = String(this.selection.selected[0]['roomConfigId']);
          localStorage.setItem('roomConfigId', rowId);

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
      this.router.navigate(['/roomconfig/roomconfig-view']);
      let rowId = String(this.selection.selected[0]['roomConfigId']);
      localStorage.setItem('roomConfigId', rowId);
      /*const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
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
          this.router.navigate(['/roomconfig/roomconfig-view']);
          let rowId = String(this.selection.selected[0]['roomConfigId']);
          localStorage.setItem('roomConfigId', rowId)

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

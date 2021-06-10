import { RoombookapprovalService } from './roombookapproval.service';
import {
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
  Inject,
  OnDestroy
} from '@angular/core';
import {
  MatPaginator,
  MatSort,
  MatTableDataSource,
  VERSION,
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material';
import { DOCUMENT } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ComponentLoaderService } from '../../shared/component-loader.service';
export interface requestListData {
  highlighted?: boolean;
  hovered?: boolean;
  requestId: number;
}
@Component({
  selector: 'app-roombookapproval',
  templateUrl: './roombookapproval.component.html',
  // styleUrls: ['./roombookapproval.component.css']
  styleUrls: ['./roombookapproval-srmav.component.css']
})
export class RoombookapprovalComponent implements OnInit {
  dataSource: any = [];
  requestBaseFieldName: any = [];
  displayNoRecords = true;
  rowindex: any;
  count = 1;
  qtd: any = [];
  qtm: any = '';
  add = false;
  modify = false;
  view = false;
  delete = false;
  searchCombo: any;
  statuslist = [{name: 'Active'}, {name: 'InActive'} ];
  searchForm: FormGroup;
  pagenation:boolean;
  errorMsgDisplay: boolean;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  selection = new SelectionModel<requestListData>(true, []);


  // searchCombo = [
  //   { name: 'Choose Field' },
  //   { name: 'Room Booking Code', value: 'roomBookingCode'},
  //   { name: 'Subject', value: 'roomBookingSubject' },
  //   { name: 'From Date', value: 'roomBookingFromDate' },
  //   { name: 'To Date', value: 'roomBookingToDate' },
  //   { name: 'Location', value: 'locationName'},
  //   { name: 'Sub Location', value: 'sublocationName'},
  //   { name: 'Priority', value: 'roomBookingPriority'},
  //   { name: 'No of Seats', value: 'roomBookingNoOfSeats'},
  //   { name: 'Current Status', value: 'currentStatusName' },
  //   { name: 'Decision', value: 'descisionType' },
  // ];


  desicionarr = [{name: 'Choose Field'},
  {name: 'Pending', id: 0}, {name: 'Approved', id: 1}, {name: 'Rejected', id: 2}, {name: 'Resubmit', id: 3}
  , {name: 'Completed', id: 4},
   {name: 'InProgress', id: 5}, {name: 'Reassign', id: 6}, {name: 'Reopen', id: 7}, {name: 'Closed', id: 8},
   {name: 'Not Working', id: 9}];
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  onRowModify(row) {
    row.projectModify = true;
    // row.projectView = true;
    this.rowindex = row.requestId;
  }
  highlight(element: requestListData) {
    element.highlighted = !element.highlighted;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    if (
      this.dataSource.filteredData.length > 0 ||
      this.selection.selected.length > 0
    ) {
      this.displayNoRecords = true;
      this.selection.clear();
      // this.rowindex.length = [];
    } else {
      this.displayNoRecords = false;
    }
  }
  removeFilter(filterValue: string): void {
    this.displayNoRecords = true;
    if (filterValue.length === 0) {
      this.request_list_details();
    }
  }
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }
  constructor(
    private formBuilder: FormBuilder,
    private roombookapprovalService: RoombookapprovalService,
    private dialog: MatDialog,
    private router: Router,
    private componentLoaderService: ComponentLoaderService) { }

    request_list_details() {
      let loadRequestList = this.roombookapprovalService.load_requestGrid().subscribe(
        data => {
          let requestListGetData = JSON.parse(data['_body']);
          let requestListTableDate = requestListGetData.succesObject;
          console.log('Request Response:', requestListTableDate);
            this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
         
          this.requestBaseFieldName = [
            // 'select',
            // 'roomBookingCode',
            // 'roomBookingSubject',
            // 'roomBookingFromDate',
            // 'roomBookingToDate',
            // 'locationName',
            // 'sublocationName',
            // 'roomBookingPriority',
            // 'roomBookingNoOfSeats',
            // 'currentStatusName',
            // 'descisionType'
            'select',
            'roomBookingCode',
            'roomBookingSubject',
            'roomBookingFromDate',
            'roomBookingToDate',
            'locationName',
            'sublocationName',
            'roomBookingPriority',
            'roomBookingNoOfSeats',
            'currentStatusName',
            'descisionType'
          ];
        },
        error => {
          if (error.status === 401) {
            alert('Error');
          }
        });
        this.componentLoaderService.display(false);
    }
    approvalModify() {
      if (this.selection.selected.length > 0) {
        if (this.selection.selected.length !== 1) {
          const dialogRef1 = this.dialog.open(ConfirmationDialogComponent, {
            disableClose: false,
            width: 'auto',
            data: {
              title: 'Alert',
              message: 'Please select a single record',
              btnYes: 'Ok',
              btnNo: 'Cancel'
            }
          });
        } else {
          const dialogRef2 = this.dialog.open(ConfirmationDialogComponent, {
            disableClose: false,
            width: 'auto',
            data: {
              title: 'Confirmation',
              message: 'Are you sure you want to modify this Record?',
              btnYes: 'Yes',
              btnNo: 'No'
            }
          });
          dialogRef2.afterClosed().subscribe(result => {
            if (result) {
              this.selection.selected.forEach(row => {
               // this.router.navigate(['/phonedetails/phone-modify']);
                let rowId = String(this.selection.selected[0]['roomBookingId']);
                localStorage.setItem('roomBookingId', rowId);
                this.componentLoaderService.display(true);
                this.router.navigateByUrl('/roombookapproval/roombookapprovalmodify');
              });
            }
          });
        }
      } else {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          disableClose: false,
          panelClass: 'btnCenter',
          width: 'auto',
          data: {
            title: 'Alert',
            message: 'Please select a record',
            btnYes: 'Ok',
           // btnNo: 'Cancel'
          }
        });
      }
    }
    sequenceType() {
      return this.formBuilder.group({
        dropDownVal: [''],
        textVal: ['']
      });
    }
    addSequence(form) {
      let j = form.controls.searchDatas.controls.length;
     let i = j-1; 
   
     let dropvalue = form.controls.searchDatas.controls[i].controls.dropDownVal.value;
     let textVal = form.controls.searchDatas.controls[i].controls.textVal.value;
     console.log("drop down value of ", i , "is ",dropvalue);
     console.log("text down value of ", i , "is ",textVal);
     
     if (this.count <= 5 && dropvalue !== null && textVal != null) {
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
    changefield(val, ind, form) {
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
        let fullValue = {};
        if (key != '' && value != '') {
        fullValue[key] = value;
        Object.assign(finalSearchData, fullValue);
        }
      }
      this.roombookapprovalService.search_list(finalSearchData).subscribe(data => {
        let reqScrConfigSearchData = JSON.parse(data['_body']);
        this.dataSource = new MatTableDataSource(reqScrConfigSearchData.succesObject);
        console.log("datasource.filteredData.length ",this.dataSource.filteredData.length );
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
    ngOnInit() {
      this.componentLoaderService.display(true);
      this.searchForm = this.formBuilder.group({
        searchDatas: this.formBuilder.array([this.sequenceType()])
      });
      console.log(this.roombookapprovalService);
      this.roombookapprovalService.approvallist().subscribe(
        data => {
         // alert(1);
          let requestListGetData = JSON.parse(data['_body']);
          let requestListTableDate = requestListGetData.succesObject;
          console.log('Request Response:', requestListTableDate);

          this.dataSource = new MatTableDataSource(requestListTableDate.roomBookingVoList);
          console.log("datasource",this.dataSource);
          console.log("datasource.filteredData.length ",this.dataSource.filteredData.length );
          // if(this.dataSource.filteredData.length !== 0){
          //   this.pagenation = true;
          //    this.dataSource.paginator = this.paginator;
          //   this.dataSource.sort = this.sort;
          // }
         

          // this.requestBaseFieldName = [
          //   'select',
          //   'roomBookingCode',
          //   'roomBookingSubject',
          //   'roomBookingFromDate',
          //   'roomBookingToDate',
          //   'locationName',
          //   'sublocationName',
          //   'roomBookingPriority',
          //   'roomBookingNoOfSeats',
          //   'currentStatusName',
          //   'descisionType'
          // ];
          this.requestBaseFieldName = requestListGetData.succesObject.screenFieldDisplayVoList;
          this.searchCombo = [{ name: 'Choose Field' }];
          let search = [
          //{ Name: 'Choose Field' },
            { name: 'Room Booking Code', value: 'roomBookingCode'},
            { name: 'Subject', value: 'roomBookingSubject' },
            { name: 'From Date', value: 'roomBookingFromDate' },
            { name: 'To Date', value: 'roomBookingToDate' },
            { name: 'Location', value: 'locationName'},
            { name: 'Sub Location', value: 'sublocationName'},
            { name: 'Priority', value: 'roomBookingPriority'},
            { name: 'No of Seats', value: 'roomBookingNoOfSeats'},
            // { name: 'Current Status', value: 'currentStatusName' },
            { name: 'Decision', value: 'descisionType' },
          ];

          for (let k in search) {
            console.log(search[k].value);
            let ll = this.requestBaseFieldName.includes(search[k].value);
            // console.log(ll);
            if(ll===true) {
             this.searchCombo.push(search[k]);
            }
           }
           let screenFunctionDisplayList = requestListGetData.succesObject.screenFunctionDisplayList;
          // console.log(this.screenFunctionDisplayList);
           for (let k in screenFunctionDisplayList) {
           // console.log(screenFunctionDisplayList[k]);
    
            // if(screenFunctionDisplayList[k] === 'ADD') {
            //   this.add = true;
            // }
            if(screenFunctionDisplayList[k] === 'MODIFY') {
              this.modify = true;
            }
            //   if(screenFunctionDisplayList[k] === 'VIEW') {
            //     this.view = true;
            //  }
            //  if(screenFunctionDisplayList[k] === 'DELETE') {
            //    this.delete = true;
            //  }
           }
          // this.searchCombo=
          this.componentLoaderService.display(false);
        },
        error => {
          if (error.status === 401) {
            alert('Error');
          }
        }
      );
    }

    searchClear(){
      for(let i=0; i < this.searchForm.value.searchDatas.length; i++){
        this.deleteSequence();
      }
      this.displayNoRecords = true;
      this.ngOnInit();
    }
}

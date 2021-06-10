import { Component, OnInit, ViewChild, Output, EventEmitter, Inject, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, VERSION, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormBuilder, FormGroup, FormArray, Validators, NgForm, Form } from '@angular/forms';
import { Router } from "@angular/router";
import { DOCUMENT } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';
import { CompletedRequestApprovalsService } from './completed-request-approvals.service';
import { ConfirmationDialogComponent } from '../../../shared/confirmation-dialog/confirmation-dialog.component';
export interface summaryReqList {
  highlighted?: boolean;
  hovered?: boolean;
  id: number;
}
@Component({
  selector: 'app-completed-request-approvals',
  templateUrl: './completed-request-approvals.component.html',
  // styleUrls: ['./completed-request-approvals.component.css']
  styleUrls: ['./completed-request-approvals-srmav.component.css']
})
export class CompletedRequestApprovalsComponent implements OnInit {
  dataSource: any;
  rowindex: any;
  count: number;
  displayNoRecords;
  userRoleFieldName: any;
  selection = new SelectionModel<summaryReqList>(true, []);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(@Inject(DOCUMENT) private document: Document, private formBuilder: FormBuilder, private router: Router, private dialog: MatDialog, private completedRequestApprovalsService: CompletedRequestApprovalsService) {
    this.dataSource = [];
    this.count = 1;
    this.displayNoRecords = true;
    this.userRoleFieldName = [];
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  highlight(element: summaryReqList) {
    element.highlighted = !element.highlighted;
  }
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));

  }
  ngOnInit() {
    this.onLoadReqList();
  }
  onLoadReqList() {
    let loadUserRoleList = this.completedRequestApprovalsService.reqList().subscribe(data => {
      let loadUserRoleListGetData = JSON.parse(data['_body']);
      this.dataSource = new MatTableDataSource(loadUserRoleListGetData.succesObject.approvalList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.userRoleFieldName = ['Request Code', 'Status', 'requestTypeName', 'requestSubTypeName', 'userDepartmentName', 'locationName', 'sublocationName' ];
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    })
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
  removeFilter(filterValue: string): void {
    this.displayNoRecords = true;
    if (filterValue.length == 0) {
      this.onLoadReqList();
    }
  }
}

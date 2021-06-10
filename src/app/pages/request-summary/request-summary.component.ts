import { Component, OnInit, ViewChild, Output, EventEmitter, Inject, OnDestroy } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, VERSION, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, FormBuilder, FormGroup, FormArray, Validators, NgForm, Form } from '@angular/forms';
import { Router } from "@angular/router";
import { DOCUMENT } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';
import { RequestSummaryService } from './request-summary.service';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { ComponentLoaderService } from 'src/app/shared/component-loader.service';
export interface summaryReqList {
  highlighted?: boolean;
  hovered?: boolean;
  id: number;
}
export interface approvalReqList {
  highlighted?: boolean;
  hovered?: boolean;
  id: number;
}
@Component({
  selector: 'app-request-summary',
  templateUrl: './request-summary.component.html',
  styleUrls: ['./request-summary.component.css']
  // styleUrls: ['./request-summary-srmav.component.css']
})
export class RequestSummaryComponent implements OnInit {
  dataSource: any;
  rowindex: any;
  count: number;
  displayNoRecords;
  userRoleFieldName: any;
  selection = new SelectionModel<summaryReqList>(true, []);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  waitingApprovalTable: any = [];
  dataSource1: any;
  rowindex1: any;
  count1: number;
  displayNoRecords1;
  userRoleFieldName1: any;
  selection1 = new SelectionModel<approvalReqList>(true, []);
  @ViewChild('paginator1') paginator1: MatPaginator;
  @ViewChild('sort1') sort1: MatSort;
  constructor(private componentLoader : ComponentLoaderService ,@Inject(DOCUMENT) private document: Document, private formBuilder: FormBuilder, private router: Router, private dialog: MatDialog, private requestSummaryService: RequestSummaryService) {
    this.dataSource = [];
    this.count = 1;
    this.displayNoRecords = true;
    this.dataSource1 = [];
    this.count1 = 1;
    this.displayNoRecords1 = true;
    this.userRoleFieldName = [];
    this.userRoleFieldName1 = [];
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
    let loadUserRoleList = this.requestSummaryService.reqList().subscribe(data => {
      let loadUserRoleListGetData = JSON.parse(data['_body']);
      this.dataSource = new MatTableDataSource(loadUserRoleListGetData.succesObject.authRequestList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.userRoleFieldName = ['select', 'Request Code', 'Status', 'Action'];
      this.waitingApprovalTable = loadUserRoleListGetData.succesObject.reportRequestList;
      this.dataSource1 = new MatTableDataSource(loadUserRoleListGetData.succesObject.reportRequestList);
      this.dataSource1.paginator = this.paginator1;
      this.dataSource1.sort = this.sort1;
      this.userRoleFieldName1 = ['select', 'User Name', 'Request Code', 'Action'];
      this.componentLoader.display(false);
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    })
  }
  removeFilter(filterValue: string): void {
    this.displayNoRecords = true;
    if (filterValue.length == 0) {
      this.onLoadReqList();
    }
  }
  removeFilter1(filterValue: string): void {
    this.displayNoRecords1 = true;
    if (filterValue.length == 0) {
      this.onLoadReqList();
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
  applyFilter1(filterValue: string) {
    this.dataSource1.filter = filterValue.trim().toLowerCase();
    if (this.dataSource1.paginator) {
      this.dataSource1.paginator.firstPage();
    }
    if (this.dataSource1.filteredData.length > 0 || this.selection1.selected.length > 0) {
      this.displayNoRecords1 = true;
      this.selection1.clear();
    } else {
      this.displayNoRecords1 = false;
    }
  }
  rejectlRequest(row) {

  }
  resubmitwaitingRequest(row) {

  }
  cancelRequest(row) {

  }
  isAllSelected1() {
    const numSelected = this.selection1.selected.length;
    const numRows = this.dataSource1.data.length;
    return numSelected === numRows;
  }
  highlight1(element: summaryReqList) {
    element.highlighted = !element.highlighted;
  }
  masterToggle1() {
    this.isAllSelected1() ?
      this.selection.clear() :
      this.dataSource1.data.forEach(row => this.selection1.select(row));

  }
}

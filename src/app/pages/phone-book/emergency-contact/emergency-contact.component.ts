import { Component, OnInit, ViewChild } from '@angular/core';
import { PhoneBookService } from '../phone-book.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, MatSort, MatDialog, MatTableDataSource } from '@angular/material';
import { ComponentLoaderService } from 'src/app/shared/component-loader.service';
import { Router } from '@angular/router';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { ContactDetailsViewService } from '../../contact-details/contact-details-view/contact-details-view.service';
import { JsonApiService } from 'src/assets/api/json-api.service';

export interface useRoleListData {

  highlighted?: boolean;
  hovered?: boolean;
  emergencyContactPathId: number;
}
const ELEMENT_DATA: useRoleListData[] = [];
@Component({
  selector: 'app-emergency-contact',
  templateUrl: './emergency-contact.component.html',
  // styleUrls: ['./emergency-contact.component.css']
  styleUrls: ['./emergency-contact-srmav.component.css']
})
export class EmergencyContactComponent implements OnInit {

  dataSource: any;
  searchForm: FormGroup;
  displayNoRecords = true;
  userRoleFieldName: any = [];
  labels: any = {}

  selection = new SelectionModel<useRoleListData>(true, []);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private componentLoaderService: ComponentLoaderService,
    private formBuilder: FormBuilder,
    private router: Router,
    private jsonApiService: JsonApiService,
    private dialog: MatDialog,
    private contactDetailsViewService: ContactDetailsViewService,
    private phoneservice: PhoneBookService) { }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  highlight(element: useRoleListData) {
    element.highlighted = !element.highlighted;
  }
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));

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

  ngOnInit() {
    this.userRoleFieldName = ['select', 'emergencyContactName'];
    this.searchForm = this.formBuilder.group({
      searchDatas: this.formBuilder.array([this.sequenceType()]),
    });
    this.onLoaduserList();
    this.getLabelDetails();

  }
  getLabelDetails() {
    let lang;
    if(localStorage.getItem('langCode') !== null){
      lang = localStorage.getItem('langCode');
    }
    this.jsonApiService.fetch('/'+lang+'.json').subscribe((data) => {
        this.labels = data;
      });
  }
  sequenceType() {
    return this.formBuilder.group({
      dropDownVal: [""],
      textVal: [""],
    })
  }

  onLoaduserList() {
    let loaduserList = this.phoneservice.getAll().subscribe(data => {
      let loaduserListGetData = JSON.parse(data['_body']);
      this.dataSource = [];
      if(loaduserListGetData.succesObject !== null){
        this.dataSource = new MatTableDataSource(loaduserListGetData.succesObject);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.displayNoRecords = true;
      }else{
        this.displayNoRecords = false;
      }

    });
  }
  imageDownloadName;
  download(){
    if (this.selection.selected.length === 1) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        width: 'auto',
        data: {
          title: 'Confirmation',
          message: 'download',
          btnYes: 'Yes',
          btnNo: 'No',
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if(result){
         
    this.contactDetailsViewService.picDownloadFn( this.selection.selected[0].emergencyContactPathId ).subscribe(
      data => {
        let headers = data.headers;
        let contentType =
          headers.get("Content-type") || "application/octet-stream";
        let fileHeaders = headers.get("Content-Disposition");
        // let startIndex = fileHeaders.indexOf("filename =") + 11; // Adjust '+ 10' if filename is not the right one.
        // let endIndex = fileHeaders.length - 1; // Check if '- 1' is necessary
        // let filename = fileHeaders.substring(startIndex, endIndex);
        let filename =  this.selection.selected[0]['emergencyContactPath'];
        let urlCreator =
          window.URL ||
          (<any>window).webkitURL ||
          (<any>window).mozURL ||
          (<any>window).msURL;
        if (urlCreator) {
          let blob = new Blob([data["body"]], { type: contentType });
          let url = urlCreator.createObjectURL(blob);
          let a = document.createElement("a");
          document.body.appendChild(a);
          a.style.display = "none";
          a.href = url;
          a.download = filename; // you may assign this value from header as well
          a.click();
          window.URL.revokeObjectURL(url);
        }
        this.selection.clear();
      },
      error => {
        if (error.status === 401) {
        }
        console.log(error);
      });
      } 
    });
    }else if(this.selection.selected.length === 0){
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        width: 'auto',
        data: {
          title: 'Confirmation',
          message: 'selection',
          btnYes: 'Ok',
        
        }
      });

    }else if(this.selection.selected.length > 1){
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        width: 'auto',
        data: {
          title: 'Alert',
          message: 'singleSelection',
          btnYes: 'Ok',
         
        }
      });

    }else if(this.selection.selected.length < 1){
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        width: 'auto',
        data: {
          title: 'Alert',
          message: 'singleSelection',
          btnYes: 'Ok',
         
        }
      });

    }
  }
}

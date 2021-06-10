
import {  Component,  OnInit,  ChangeDetectorRef,  ChangeDetectionStrategy,  AfterViewInit,
  OnDestroy,  ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {  MatDialog,  MatTableDataSource,  MatPaginator,  MatSort} from '@angular/material';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { FormBuilder, FormGroup, FormArray, NgControlStatus } from '@angular/forms';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { SelectionModel } from '@angular/cdk/collections';
import { ComponentLoaderService } from '../../../shared/component-loader.service';
import { WidgetsAdminService } from '../widgets-admin.service';
import { JsonApiService } from 'src/assets/api/json-api.service';

@Component({
  selector: 'app-widgets-admin-view',
  templateUrl: './widgets-admin-view.component.html',
  // styleUrls: ['./widgets-admin-view.component.css'],
  styleUrls: ['./widgets-admin-view-srmav.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class WidgetsAdminViewComponent  implements OnInit, AfterViewInit, OnDestroy {
  labels: any = {}; /** LABEL CHANGES **/
  saveForm: FormGroup;
  count: any = 1;
  widgetsAddGetData: any = {};
  widgetDetailId: number;
  subsriptionlist: Subscription[] = [];
  dataSource: any = [];
  displayedColumns: any = [];
  initialSelection = [];
  allowMultiSelect = false;
  selection = new SelectionModel<{}>(false, []);
  fromDate : any;
  toDate: any;
  userBaseFieldName: any;
  /** Multiple DownLoad Variables */
  widgetId: number;
  picName: any;
  attName: any;
  data: any;
  widgetIconName: string;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private jsonApiService: JsonApiService/** LABEL CHANGES **/,
    private componentLoaderService: ComponentLoaderService,
    private formBuilder: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private widgetsModifyService: WidgetsAdminService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.getLabelDetails(); /** LABEL CHANGES **/
    this.displayedColumns = [
      'select',
      'heading',
      'status',
      'announcementDate',
      'validFrom',
      'validTo'
    ];
    this.dataSource = new MatTableDataSource<{}>([]);
    this.saveForm = this.formBuilder.group({
      widgetDetailVoList: this.formBuilder.array([this.sequenceType()]), // For Row Add and Remove
      widgetId: [''],
      widgetCode: [''],
      widgetIndex: [''],
      widgetTitle: [''],
      widgetIcon: [''],
      //  widgetSeq: [''],
      widgetIsActive: ['']
    });
    if (localStorage.getItem('widgetId') !== null) {
      let index = localStorage.getItem('widgetId');
      this.loadModifyDetailsById(index);
    }
  }
  ngAfterViewInit() {
    this.cdr.markForCheck();
    // this.patchForm(widgetArray);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  sequenceType() {
    return this.formBuilder.group({
      widgetDetailId: [''],
      widgetDetailHeading: [''],
      // widgetDetailHeadingIndex: [''],
      //   widgetDetailPicIsRequired: [''],
      widgetDetailPicPath: [''],
      widgetDetailDescription: [''],
      //   widgetDetailAttIsRequired: [''],

      widgetDetailAttPath: [''],
      //   widgetDetailMorePath: [''],
      widgetDetailExternalUrl: [''],
      widgetDetailIsActive: [''],
      widgetDetailAnnouncementDate: [''],
      widgetDetailValidFrom: [''],
      widgetDetailValidTo: ['']
    });
  }
  loadModifyDetailsById(id) {
    let widgetsModifySub = this.widgetsModifyService
      .getWidgetById(id)
      .subscribe(
        data => {
          let widgetData = JSON.parse(data['_body']);

          let listData = widgetData.succesObject;
          this.widgetId = listData.widgetId;
          this.widgetIconName = listData.widgetVo.widgetIcon;
          this.userBaseFieldName = widgetData.authSuccesObject.screenFieldDisplayVoList.map(
            element => {
              return element;
            }
          );

          this.patchForm(widgetData.succesObject.widgetVo);
          let tableList = widgetData.succesObject.widgetDetailVoList;
          this.dataSource = new MatTableDataSource(tableList);
          this.intializeDataTable();
          this.componentLoaderService.display(false);
        },
        error => {
          console.log(error);
        }
      );
    this.subsriptionlist.push(widgetsModifySub);
  }
  patchForm(data) {
    this.saveForm.patchValue({
      widgetIndex: data.widgetIndex,
      widgetTitle: data.widgetTitle,
      widgetId: data.widgetId,
      widgetCode: data.widgetCode,
      widgetIsActive: data.widgetIsActive
    });
  }
  widgetDetailVoList(data) {
    let control = this.saveForm.controls.widgetDetailVoList as FormArray;
    data.forEach(x => {
      control.push(
        this.formBuilder.group({
          widgetDetailHeading: x.widgetDetailHeading,
          widgetDetailPicPath: x.widgetDetailPicPath,
          widgetDetailDescription: x.widgetDetailDescription,
          widgetDetailAttPath: x.widgetDetailAttPath,
          widgetDetailExternalUrl: x.widgetDetailExternalUrl,
          widgetDetailIsActive: x.widgetDetailIsActive,
          widgetDetailAnnouncementDate: new Date(
            x.widgetDetailAnnouncementDate
          ),
          widgetDetailValidFrom: new Date(x.widgetDetailValidFrom),
          widgetDetailValidTo: new Date(x.widgetDetailValidTo)
        })
      );
    });
  }
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  highlight(element: any) {
    element.highlighted = !element.highlighted;
  }
  onSubmit(event) {
    if (this.saveForm.valid) {
      this.componentLoaderService.display(true);
      let temp = this.removeFileObjects(this.saveForm.value);

      //let temp = this.saveForm.value;
      temp.screenFieldDisplayVoList = this.userBaseFieldName;

      let formData = new FormData();
      let action = JSON.stringify(temp);
      formData.append('action', action);
      if (
        this.saveForm.value.widgetIcon !== null &&
        this.saveForm.value.widgetIcon !== undefined &&
        this.saveForm.value.widgetIcon !== ''
      ) {
        let file1 = this.saveForm.value.widgetIcon.files[0];
        formData.append('file', file1);
      }
      if (
        this.saveForm.value.widgetDetailVoList[0].widgetDetailPicPath !==
          null &&
        this.saveForm.value.widgetDetailVoList[0].widgetDetailPicPath !==
          undefined &&
        this.saveForm.value.widgetDetailVoList[0].widgetDetailPicPath !== ''
      ) {
        let file2 = this.saveForm.value.widgetDetailVoList[0]
          .widgetDetailPicPath.files[0];
        formData.append('file1', file2);
      }
      if (
        this.saveForm.value.widgetDetailVoList[0].widgetDetailAttPath !==
          null &&
        this.saveForm.value.widgetDetailVoList[0].widgetDetailAttPath !==
          undefined &&
        this.saveForm.value.widgetDetailVoList[0].widgetDetailAttPath !== ''
      ) {
        let file3 = this.saveForm.value.widgetDetailVoList[0]
          .widgetDetailAttPath.files[0];
        formData.append('file2', file3);
      }
      this.widgetsModifyService.updateProjectList(formData).subscribe(
        data => {
          let Response = JSON.parse(data['_body']);
          if (Response.responseCode == '200') {
            const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
              disableClose: false,
              panelClass: 'btnCenter',
              width: 'auto',
              data: {
                title: 'Info',
                server:'servermesage',
                message: Response.responseMessage,
                btnYes: 'OK'
              }
            });
            if (localStorage.getItem('widgetId') !== null) {
              let index = localStorage.getItem('widgetId');
              this.loadModifyDetailsById(index);
              let control = this.saveForm.get('widgetDetailVoList') as FormArray;
              control.controls = [];
              control.push(this.sequenceType());
            }
          } else {
            const dialogRef1 = this.dialog.open(ConfirmationDialogComponent, {
              disableClose: false,
              panelClass: 'btnCenter',
              width: 'auto',
              data: {
                title: 'Alert',
                server:'servermessage',
                message: Response.responseMessage,
                btnYes: 'OK'
              }
            });
          }
          this.componentLoaderService.display(false);
        },
        error => {
          if (error.status === 401) {
          }
          console.log(error);
        }
      );
    } else {
    }
  }
  addSequence() {
    if (this.count <= 2) {
      (this.saveForm.controls['widgetDetailVoList'] as FormArray).push(
        this.sequenceType()
      );
      this.count++;
    }
  }

  deleteSequence() {
    if (this.count > 1) {
      (this.saveForm.controls['widgetDetailVoList'] as FormArray).removeAt(-1);
      this.count--;
    }
  }
  editRecord(event,row) {
    if (event.checked) {
      this.widgetDetailId =  row.widgetDetailId;
      this.mappingRowObject(row);
    } else {
      let control = this.saveForm.get('widgetDetailVoList') as FormArray;
      control.controls=[];
      control.push(this.sequenceType());
      this.widgetDetailId = undefined;
      this.picName = undefined;
      this.attName = undefined;
    }
  }
  mappingRowObject(data) {

    this.data = data;
    if (data.widgetDetailPicPath !== null) {
      if (data.widgetDetailPicPath != null && data.widgetDetailPicPath.includes(',')) {
        this.picName = data.widgetDetailPicPath.split(",");
      }
      else if(data.widgetDetailPicPath != null && !data.widgetDetailPicPath.includes(',')){
        this.picName = [data.widgetDetailPicPath];
      }else{
        this.picName = undefined;
      }
    }
    if (data.widgetDetailAttPath !== null) {
      if (data.widgetDetailAttPath != null && data.widgetDetailAttPath.includes(',')) {
        this.attName = data.widgetDetailAttPath.split(",");
      }
      else if(data.widgetDetailAttPath != null && !data.widgetDetailAttPath.includes(',')) {
        this.attName = [data.widgetDetailAttPath];
      }else{
        this.attName =  undefined;
      }
    }
    let control = this.saveForm.get('widgetDetailVoList') as FormArray;

    let temp: any = {};
    for (let key in data) {
      if (key !== 'widgetDetailAttPath' && key !== 'widgetDetailPicPath' && key !== 'highlighted' && key !== 'hovered') {
        if (key == 'widgetDetailAnnouncementDate' || key == 'widgetDetailValidFrom' || key == 'widgetDetailValidTo') {
          temp[key] = new Date(data[key]);
        } else {
          temp[key] = data[key];
        }
      }
    }
    control.controls=[];
    control.push(this.loadsequenceType(temp));
  }
  loadsequenceType(data) {
    return this.formBuilder.group({
      widgetDetailId: [data.widgetDetailId],
      widgetDetailHeading: [data.widgetDetailHeading],
      widgetDetailPicPath: [data.widgetDetailPicPath],
      widgetDetailDescription: [data.widgetDetailDescription],

      widgetDetailAttPath: [data.widgetDetailAttPath],
      widgetDetailExternalUrl: [data.widgetDetailExternalUrl],
      widgetDetailIsActive: [data.widgetDetailIsActive],
      widgetDetailAnnouncementDate: [data.widgetDetailAnnouncementDate],
      widgetDetailValidFrom:[data.widgetDetailValidFrom],
      widgetDetailValidTo: [data.widgetDetailValidTo]
    });
  }
  attachmentDownload() {
    if(this.widgetDetailId != undefined){
    this.widgetsModifyService.attDownload( this.widgetDetailId ).subscribe(
      data => {
        let headers = data.headers;
        let contentType =
          headers.get("Content-type") || "application/octet-stream";
        let fileHeaders = headers.get("Content-Disposition");
        let startIndex = fileHeaders.indexOf("filename =") + 11; // Adjust '+ 10' if filename is not the right one.
        let endIndex = fileHeaders.length - 1; // Check if '- 1' is necessary
        let filename = fileHeaders.substring(startIndex, endIndex);
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
      },
      error => {
        if (error.status === 401) {
        }
        console.log(error);
      });
    }else{
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        panelClass: 'btnCenter',
        width: 'auto',
        data: {
          title: 'Alert',
          message: 'selection',
          btnYes: 'OK'
        }
      });
    }
  }
  pictureDownload() {
    if(this.widgetDetailId != undefined){
    this.widgetsModifyService.picDownload( this.widgetDetailId ).subscribe(
      data => {
        let headers = data.headers;
        let contentType =
          headers.get("Content-type") || "application/octet-stream";
        let fileHeaders = headers.get("Content-Disposition");
        let startIndex = fileHeaders.indexOf("filename =") + 11; // Adjust '+ 10' if filename is not the right one.
        let endIndex = fileHeaders.length - 1; // Check if '- 1' is necessary
        let filename = fileHeaders.substring(startIndex, endIndex);
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
      },
      error => {
        if (error.status === 401) {
        }
        console.log(error);
      });
    }else{
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        disableClose: false,
        panelClass: 'btnCenter',
        width: 'auto',
        data: {
          title: 'Alert',
          message: 'selection',
          btnYes: 'OK'
        }
      });
    }
  }
  iconDownload() {
    localStorage.getItem('widgetId');
    this.widgetsModifyService.icoDownload( localStorage.getItem('widgetId')).subscribe(
      data => {
        let headers = data.headers;
        let contentType =
          headers.get("Content-type") || "application/octet-stream";
        let fileHeaders = headers.get("Content-Disposition");
        let startIndex = fileHeaders.indexOf("filename =") + 11; // Adjust '+ 10' if filename is not the right one.
        let endIndex = fileHeaders.length - 1; // Check if '- 1' is necessary
        let filename = fileHeaders.substring(startIndex, endIndex);
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
      },
      error => {
        if (error.status === 401) {
        }
        console.log(error);
      });
  }

  removeFileObjects(data) {
    if (Object.keys(data).length > 0) {
      let temp = {};
      for (let key in data) {
        if (key !== 'widgetIcon' && key !== 'widgetDetailVoList') {
          temp[key] = data[key];
        }
        if (key == 'widgetDetailVoList') {
          temp[key] = this.mapwidgetDetailVoList(data[key]);
        }
      }
      return temp;
    }
    return data;
  }
  mapwidgetDetailVoList(data) {
    let temp = [];
    data.forEach(element => {
      let _temp = {};
      for (let key in element) {
        if (key !== 'widgetDetailPicPath' && key !== 'widgetDetailAttPath') {
          // _temp[key] = element[key];
          if (key == 'widgetDetailAnnouncementDate') {
            _temp[key] = moment(element[key]).format('YYYY-MM-DD');
          } else if (key == 'widgetDetailValidFrom') {
            _temp[key] = moment(element[key]).format('YYYY-MM-DD');
          } else if (key == 'widgetDetailValidTo') {
            _temp[key] = moment(element[key]).format('YYYY-MM-DD');
          } else {
            _temp[key] = element[key];
          }
        }
      }
      temp.push(_temp);
    });
    return temp;
  }
  intializeDataTable() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  ngOnDestroy() {
    this.subsriptionlist.forEach(subscription => {
      subscription.unsubscribe();
    });
    localStorage.removeItem('widgetId');
  }
  fromDateVal(eve){
    this.fromDate = eve.value;
  }
  toDateVal(eve){
    this.toDate = eve.value;
  }

  /************ MULTIPLE DOWNLOAD CODE EXCESS *************/
  downloadWidgetIcon(widgetId) {
    this.widgetsModifyService.picDownloadWidgetIcon(widgetId).subscribe(
      data => {
        let headers = data.headers;
        let contentType =
          headers.get("Content-type") || "application/octet-stream";
        let fileHeaders = headers.get("Content-Disposition");
        // let startIndex = fileHeaders.indexOf("filename =") + 11; // Adjust '+ 10' if filename is not the right one.
        // let endIndex = fileHeaders.length - 1; // Check if '- 1' is necessary
        // let filename = fileHeaders.substring(startIndex, endIndex);
        let filename = this.widgetIconName;
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
      },
      error => {
        if (error.status === 401) {
        }
        console.log(error);
      });

  }
  downloadpic(widgetDetailId) {
    this.widgetsModifyService.picDownloadFn(widgetDetailId).subscribe(
      data => {
        let headers = data.headers;
        let contentType =
          headers.get("Content-type") || "application/octet-stream";
        let fileHeaders = headers.get("Content-Disposition");
        let startIndex = fileHeaders.indexOf("filename =") + 11; // Adjust '+ 10' if filename is not the right one.
        let endIndex = fileHeaders.length - 1; // Check if '- 1' is necessary
        let filename = fileHeaders.substring(startIndex, endIndex);
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
      },
      error => {
        if (error.status === 401) {
        }
        console.log(error);
      });

  }
  downloadAttpic(widgetDetailId) {
    this.widgetsModifyService.attDownloadFn(widgetDetailId).subscribe(
      data => {
        let headers = data.headers;
        let contentType =
          headers.get("Content-type") || "application/octet-stream";
        let fileHeaders = headers.get("Content-Disposition");
        let startIndex = fileHeaders.indexOf("filename =") + 11; // Adjust '+ 10' if filename is not the right one.
        let endIndex = fileHeaders.length - 1; // Check if '- 1' is necessary
        let filename = fileHeaders.substring(startIndex, endIndex);
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
      },
      error => {
        if (error.status === 401) {
        }
        console.log(error);
      });

  }
  downloadindpic(widgetDetailId, picName) {
    this.widgetsModifyService.indiviudalpicDownloadFn(widgetDetailId, picName).subscribe(
      data => {
        let headers = data.headers;
        let contentType =
          headers.get("Content-type") || "application/octet-stream";
        let fileHeaders = headers.get("Content-Disposition");
        // let startIndex = fileHeaders.indexOf("filename =") + 11; // Adjust '+ 10' if filename is not the right one.
        // let endIndex = fileHeaders.length - 1; // Check if '- 1' is necessary
        // let filename = fileHeaders.substring(startIndex, endIndex);
        let filename = picName;
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
      },
      error => {
        if (error.status === 401) {
        }
        console.log(error);
      });

  }
  downloadindAttpic(widgetDetailId, picName) {
    let a = this.widgetsModifyService.indiviudalattDownloadFn(widgetDetailId, picName).subscribe(
      data => {
        let headers = data.headers;
        let contentType =
          headers.get("Content-type") || "application/octet-stream";
        let fileHeaders = headers.get("Content-Disposition");
        // let startIndex = fileHeaders.indexOf("filename =") + 11; // Adjust '+ 10' if filename is not the right one.
        // let endIndex = fileHeaders.length - 1; // Check if '- 1' is necessary
        // let filename = fileHeaders.substring(startIndex, endIndex);
        let filename = picName;
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
      },
      error => {
        if (error.status === 401) {
        }
        console.log(error);
      });

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
}

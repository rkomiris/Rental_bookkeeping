
import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  AfterViewInit,
  ViewChild
} from '@angular/core';
import { Router } from '@angular/router';
import {
  MatDialog,
  MatTableDataSource,
  MatPaginator,
  MatSort
} from '@angular/material';
import { ConfirmationDialogComponent } from 'src/app/shared/confirmation-dialog/confirmation-dialog.component';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import * as moment from 'moment';
import { SelectionModel } from '@angular/cdk/collections';
import { ComponentLoaderService } from '../../../shared/component-loader.service';
import { WidgetsAdminAddService } from './widgets-admin-add.service';
import { JsonApiService } from 'src/assets/api/json-api.service';
@Component({
  selector: 'app-widgets-admin-add',
  templateUrl: './widgets-admin-add.component.html',
  // styleUrls: ['./widgets-admin-add.component.css'],
  styleUrls: ['./widgets-admin-add-srmav.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class WidgetsAdminAddComponent implements OnInit, AfterViewInit {
  labels: any = {}; /** LABEL CHANGES **/
  saveForm: FormGroup;
  count: any = 1;
  widgetsAddGetData: any = {};
  submitted = false;
  dataSource: any = [];
  displayedColumns: any = [];
  initialSelection = [];
  allowMultiSelect = false;
  selection = new SelectionModel<{}>(false, []);
  istableData: boolean = true;
  widgetId: number;
  fromDate: any;
  toDate: any;
  userBaseFieldName: any;
  widgetIconName : string;
  widgetCheck: Boolean;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private jsonApiService: JsonApiService/** LABEL CHANGES **/,
    private formBuilder: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private widgetsAddService: WidgetsAdminAddService,
    private cdr: ChangeDetectorRef,
    private componentLoaderService: ComponentLoaderService
  ) { }

  ngOnInit() {
    this.getLabelDetails(); /** LABEL CHANGES **/
    this.componentLoaderService.display(true);
    this.widgetCheck = false;
    this.displayedColumns = [
      // 'select',
      'heading',
      'status',
      'description',
      'announcementDate',
      'validFrom',
      'validTo'
    ];
    this.dataSource = new MatTableDataSource<{}>([]);
    this.saveForm = this.formBuilder.group({
      widgetDetailVoList: this.formBuilder.array([this.sequenceType()]), // For Row Add and Remove
      widgetCode: [''],
      widgetIndex: ['', Validators.required],
      widgetTitle: [''],
      widgetIcon: [''],
      // widgetSeq: [''],
      widgetIsActive: [true ]
    });
    this.call();
  }
  call() {
    
    this.widgetsAddService.addscreen().subscribe(data => {
      let selectGetData = JSON.parse(data['_body']);
      if (selectGetData.succesObject.screenFieldDisplayVoList !== undefined) {
        this.userBaseFieldName = selectGetData.succesObject.screenFieldDisplayVoList.map(
          element => {
            if (element != '') {
              return element;
            }
          }
        );
      }
      this.componentLoaderService.display(false);
    }, error => {
      if (error.status === 401) {
        console.log("Error");
      }
    });
  }
  get f() {
    return this.saveForm.controls;
  }

  ngAfterViewInit() {
    this.cdr.markForCheck();
  }
  sequenceType() {
    return this.formBuilder.group({
      widgetDetailHeading: ['' ,Validators.required],
      //   widgetDetailHeadingIndex: [''],
      //  widgetDetailPicName: [''],
      widgetDetailPicPath: [''],
      widgetDetailDescription: ['',Validators.required],
      // widgetDetailAttIsRequired: [''],
      //    widgetDetailAttachmentName: [''],
      widgetDetailAttPath: [''],
      // widgetDetailMorePath: [''],
      widgetDetailExternalUrl: [''],
      widgetDetailIsActive: [true],
      widgetDetailAnnouncementDate: [null,Validators.required],
      widgetDetailValidFrom: [null,Validators.required],
      widgetDetailValidTo: [null,Validators.required],
      widgetDetailId : [null],
    });
  }
  clearForm() {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => this.router.navigate(['/widgets/widgets-add']));
  }
  onSubmit(event) {
    
    if (this.saveForm.valid) {
      let temp = this.removeFileObjects(this.saveForm.value);
      if (this.widgetId != undefined) {
        temp.widgetId = this.widgetId;
      }
      temp.screenFieldDisplayVoList = this.userBaseFieldName;
      if (temp.widgetDetailVoList[0].widgetDetailAnnouncementDate == 'Invalid date' && temp.widgetDetailVoList[0].widgetDetailValidFrom == 'Invalid date' && temp.widgetDetailVoList[0].widgetDetailValidTo == 'Invalid date') {
        temp.widgetDetailVoList = null;
      }
      let formData = new FormData();
      let action = JSON.stringify(temp);
      formData.append('action', action);
      if (this.saveForm.value.widgetIcon !== null && this.saveForm.value.widgetIcon !== undefined && this.saveForm.value.widgetIcon !== '') {
        if(this.saveForm.value.widgetIcon.files != undefined){
          let file1 = this.saveForm.value.widgetIcon.files[0];
          formData.append('file', file1);
} 
      }
      if (this.saveForm.value.widgetDetailVoList[0].widgetDetailPicPath !== null && this.saveForm.value.widgetDetailVoList[0].widgetDetailPicPath !== undefined && this.saveForm.value.widgetDetailVoList[0].widgetDetailPicPath !== '') {
        for (let i = 0; i < this.saveForm.value.widgetDetailVoList[0].widgetDetailPicPath.files.length; i++) {
          let file2 = this.saveForm.value.widgetDetailVoList[0].widgetDetailPicPath.files[i];
          formData.append('file1', file2);
        }
      }
      if (
        this.saveForm.value.widgetDetailVoList[0].widgetDetailAttPath !== null && this.saveForm.value.widgetDetailVoList[0].widgetDetailAttPath !== undefined && this.saveForm.value.widgetDetailVoList[0].widgetDetailAttPath !== '') {
          for (let i = 0; i < this.saveForm.value.widgetDetailVoList[0].widgetDetailAttPath.files.length; i++) {
            let file3 = this.saveForm.value.widgetDetailVoList[0].widgetDetailAttPath.files[i];
            formData.append('file2', file3);
          }
      }
      this.componentLoaderService.display(true);
      if (this.istableData === true) {
        this.widgetsAddService.addProjectList(formData).subscribe(
          data => {
            let Response = JSON.parse(data['_body']);
            if (Response.responseCode == '200') {
              const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                disableClose: false,
                panelClass: 'btnCenter',
                width: 'auto',
                data: {
                  title: 'Info',
                  server:'servermessage',
                  message: Response.responseMessage,
                  btnYes: 'OK'
                }
              });
              this.widgetId = Response.succesObject.widgetId;
              this.widgetCheck = false;
              // this.widgetsAddService.getProjectList(Response.succesObject.widgetId).subscribe(
              //   data => {
              //     let Response = JSON.parse(data['_body']);
              //     this.saveForm.reset();
              //     this.router.navigate(['/widgets-admin']);
              //     this.istableData = false;
              //     this.dataSource = new MatTableDataSource(Response.succesObject.widgetDetailVoList);
              //     this.dataSource.paginator = this.paginator;
              //     this.dataSource.sort = this.sort;
              //     this.widgetIconName = Response.succesObject.widgetVo.widgetIcon;
              //     this.saveForm.patchValue(Response.succesObject.widgetVo);
              //   },
              //   error => {
              //     if (error.status === 401) {
              //       console.log('Error');
              //     }
              //   });
              this.router.navigate(['widgets-admin']);
            } else {
              const dialogRef1 = this.dialog.open(ConfirmationDialogComponent, {
                disableClose: false,
                panelClass: 'btnCenter',
                width: 'auto',
                data: {
                  title: 'Alert',
                  server: 'servermessage',
                  message: Response.responseMessage,
                  btnYes: 'OK'
                }
              });
            }
            this.componentLoaderService.display(false);
          }
          ,
          error => {
            if (error.status === 401) {
              console.log('Error');
            }
            console.log(error);
          }
        );
      } else if (this.istableData === false) {
        this.widgetsAddService.updateWidget(formData).subscribe(
          data => {
            let Response = JSON.parse(data['_body']);
            if (Response.responseCode == '200') {
              const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                disableClose: false,
                panelClass: 'btnCenter',
                width: 'auto',
                data: {
                  title: 'Info',
                  server: 'servermessage',
                  message: Response.responseMessage,
                  btnYes: 'OK'
                }
              });
              // this.widgetsAddService.getProjectList(this.widgetId).subscribe(
              //   data => {
              //     let Response = JSON.parse(data['_body']);
              //     this.saveForm.reset();
              //     this.istableData = false;
              //     this.widgetId = Response.succesObject.widgetId;
              //     this.dataSource = new MatTableDataSource(Response.succesObject.widgetDetailVoList);
              //     this.dataSource.paginator = this.paginator;
              //     this.dataSource.sort = this.sort;
              //     this.widgetIconName = Response.succesObject.widgetVo.widgetIcon;
              //     this.saveForm.patchValue(Response.succesObject.widgetVo);
              //   },
              //   error => {
              //     if (error.status === 401) {
              //       console.log('Error');
              //     }
              //   });              
              this.router.navigate(['widgets-admin']);
            } else {
              const dialogRef1 = this.dialog.open(ConfirmationDialogComponent, {
                disableClose: false,
                panelClass: 'btnCenter',
                width: 'auto',
                data: {
                  title: 'Alert',
                  server: 'servermessage',
                  message: Response.responseMessage,
                  btnYes: 'OK'
                }
              });
            }
            this.componentLoaderService.display(false);
          }
          ,
          error => {
            if (error.status === 401) {
              console.log('Error');
            }
            console.log(error);
          }
        );
      }
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
            if(element[key] != null){
            _temp[key] = moment(element[key]).format('YYYY-MM-DD');
            }
          } else if (key == 'widgetDetailValidFrom') {
            if(element[key] != null){
            _temp[key] = moment(element[key]).format('YYYY-MM-DD');
            }
          } else if (key == 'widgetDetailValidTo') {
            if(element[key] != null){
            _temp[key] = moment(element[key]).format('YYYY-MM-DD');
            }
          } else {
            _temp[key] = element[key];
          }
        }
      }
      temp.push(_temp);
    });
    return temp;
  }
  fromDateVal(eve){
    this.fromDate = eve.value;
  }
  toDateVal(eve){
    this.toDate = eve.value;
  }
  downloadWidgetIcon(widgetId){
    this.widgetsAddService.picDownloadWidgetIcon( widgetId ).subscribe(
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

  form(form) {
    if (this.widgetIconName !== form.widgetIcon.fileNames) {
      this.widgetIconName = '';
      this.widgetCheck = false;
    }
    if (form.widgetIcon.fileNames === '') {
      form.widgetIcon.fileNames = this.widgetIconName;
      this.widgetIconName = '';
      this.widgetCheck = false;
    }
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

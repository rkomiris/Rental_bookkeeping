import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { tap } from "rxjs/operators";

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';


const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';


@Injectable({
  providedIn: 'root'
})
export class RequestService {
  constructor(private http: Http,
    private httpClient: HttpClient) { }

  private URL: string = environment.API_HOST;

  load_requestGrid(): Observable<{}> {
    let heade = new Headers();
    heade.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    heade.append('Authorization', `Bearer ${authToken}`);
    heade.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: heade });
    let data = { screenJson: { screenId: 18, subScreenId: 33 } };
    return this.http.post(this.URL + '/Req/getAll', data, headeroptions);
  }
  deleteProjectList(requestId, remark): Observable<{}> {
    let heade = new Headers();
    heade.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    heade.append('Authorization', `Bearer ${authToken}`);
    heade.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: heade });
    let bodyoptions = {
      requestList: requestId,
      remarks: remark
    };
    return this.http.post(this.URL + '/Req/delete', bodyoptions, headeroptions);
  }
  search_request(obj: any): Observable<{}> {
    let heade = new Headers();
    let searchData = obj;
    heade.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    heade.append('Authorization', `Bearer ${authToken}`);
    heade.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: heade });
    return this.http.post(this.URL + '/Req/search', searchData, headeroptions);
  }
  loadRequestDetailsById(data) {
    let heade = new Headers();
    let body = {
      requestId: data
    };
    heade.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    heade.append('Authorization', `Bearer ${authToken}`);
    heade.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: heade });
    // let data1 = {screenAuthorizationMaster: {screenMaster: {screenId: 18}, subScreenMaster: {subScreenId: 34}}};
    let data1 = {
      screenJson: { screenId: 18, subScreenId: 34 },
      requestId: data
    };
    return this.http.post(this.URL + '/Req/load', data1, headeroptions);
  }
  getDropdownData(): Observable<{}> {
    let heade = new Headers();
    heade.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    heade.append('Authorization', `Bearer ${authToken}`);
    heade.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: heade });
    return this.http.post(this.URL + '/RT/dropdown', {}, headeroptions);
  }
  reqDeatailList(data): Observable<{}> {
    let heade = new Headers();
    heade.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    heade.append('Authorization', `Bearer ${authToken}`);
    heade.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: heade });
    let bodycontent = JSON.stringify(data);
    return this.http.post(
      this.URL + '/Req/screenlist',
      bodycontent,
      headeroptions
    );
  }
  search_list(list): Observable<{}> {
    let heade = new Headers();
    heade.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    heade.append('Authorization', `Bearer ${authToken}`);
    heade.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: heade });
    return this.http.post(this.URL + '/Req/search', list, headeroptions);
  }
  getSubTypeList(val): Observable<{}> {
    let heade = new Headers();
    heade.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    heade.append('Authorization', `Bearer ${authToken}`);
    heade.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: heade });
    return this.http.post(
      this.URL + '/RSTWF/dropdown',
      {
        requestTypeId: val
      },
      headeroptions
    );
  }
  /* getsequenceList(types): Observable<{}> {
     let headers = new Headers();
     headers.append('Content-Type', 'application/json');
     headers.append('access_token', localStorage.getItem('access_token'));
     let headeroptions = new RequestOptions({ headers: headers });
     return this.http.post(this.URL + '/Req/screenlist', types, headeroptions);
   }*/
  updateRequestDetails(data) {
    let heade = new Headers();
    heade.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    heade.append('Authorization', `Bearer ${authToken}`);
    heade.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: heade });
    return this.http.post(this.URL + '/Req/update', data, headeroptions);
  }
  load_selectBox_LocationData(): Observable<{}> {
    let heade = new Headers();
    heade.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    heade.append('Authorization', `Bearer ${authToken}`);
    heade.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: heade });
    return this.http.post(this.URL + "/user/locationLoad", {}, headeroptions);
  }
  load_selectBox_subLocationData(locationTypeId): Observable<{}> {
    let heade = new Headers();
    heade.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    heade.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: heade });
    heade.append('userId',localStorage.getItem('userId'));
    return this.http.post(this.URL + "/sub/dropdown", { "id": locationTypeId }, headeroptions);
  }
  loadResolverList(data) {
    let heade = new Headers();
    let body = {
      requestId: data
    };
    heade.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    heade.append('Authorization', `Bearer ${authToken}`);
    heade.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: heade });
    return this.http.post(this.URL + '/resolver/viewAllResolver', body, headeroptions);
  }
  loadsubmitDetails(data) {
    let heade = new Headers();
    let body = {
      requestId: data
    };
    heade.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    heade.append('Authorization', `Bearer ${authToken}`);
    heade.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: heade });
    return this.http.post(this.URL + '/resolver/viewResolver', body, headeroptions);
  }
  loadapprovalreopen(data) {
    let heade = new Headers();
    /*let body = {
      requestId: data
    };*/
    heade.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    heade.append('Authorization', `Bearer ${authToken}`);
    heade.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: heade });
    return this.http.post(this.URL + '/Req/reopen', data, headeroptions);
  }
  addProjectList(data): Observable<{}> {
    let heade = new Headers();
    heade.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    heade.append('Authorization', `Bearer ${authToken}`);
    heade.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: heade });
    return this.http.post(this.URL + '/Req/create', data, headeroptions);
  }
  updateProjectList(data): Observable<{}> {
    // let heade = new Headers();
    // heade.append('Content-Type', 'application/json');
    // heade.append('access_token', localStorage.getItem('access_token'));
    // let headeroptions = new RequestOptions({ headers: heade});
    // return this.http.post(this.URL + '/Req/update', data, headeroptions);

    let heade = new Headers();
    // heade.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    heade.append('Authorization', `Bearer ${authToken}`);
    heade.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: heade });
    let bodycontent = JSON.stringify(data);
    return this.http.post(this.URL + '/Req/update', data, headeroptions);
  }
  loadRequestDetailsfromdashboard(data) {
    let heade = new Headers();
    let body = {
      currentStatusId: data
    };
    let data1 = {
      screenJson: {  screenId: 18 ,  subScreenId: 33  }
      , currentStatusId: data
    };

    heade.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    heade.append('Authorization', `Bearer ${authToken}`);
    heade.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: heade });
    return this.http.post(this.URL + '/DR/cr/getAll', data1, headeroptions);
  }

  picDownloadFn(data) {
    let screenOptions = {
      requestId: Number(data)
    };
    let authToken = localStorage.getItem("access_token");
    let headers = new HttpHeaders({
      Authorization: `Bearer ${authToken}`,
      userId: localStorage.getItem('userId')
    });
    let bodyoptions = screenOptions;
    return this.httpClient
      .post(
        this.URL + "/Req/attachmentDownload",
        bodyoptions,
        { headers: headers, observe: "response", responseType: "blob" }
      )
      .pipe(tap(res => res));
  }

  public exportAsExcelFile(json: any[], excelFileName: string): void {
    
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    //const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

  holdStatus(value): Observable<{}> {
    let heade = new Headers();
    heade.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    heade.append('Authorization', `Bearer ${authToken}`);
    heade.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: heade });
    return this.http.post(this.URL + "/requestor/holdstatus", {'requestId': value}, headeroptions);
  }
  
}

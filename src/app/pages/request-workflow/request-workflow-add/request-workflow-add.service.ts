
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class RequestWorkflowAddService {
  constructor(private http: Http) { }
  private URL: string = environment.API_HOST;
  addProjectList(data): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    headers.append('userId',localStorage.getItem('userId'));
    // headers.append('access_token', localStorage.getItem("access_token"));
    let headeroptions = new RequestOptions({ headers: headers });
    let bodycontent = JSON.stringify(data);
    return this.http.post(this.URL + "/RWF/create", bodycontent, headeroptions);
  }
  load_roomBookList_Data(): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    // headers.append('access_token', localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    headers.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: headers });
    return this.http.post(this.URL + "/roombooking/dropdown", {}, headeroptions);
  }
  load_selectBox_subLocationData(locationTypeId): Observable<{}> {
    let head = new Headers();
    head.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    head.append('Authorization', `Bearer ${authToken}`);
    head.append('userId',localStorage.getItem('userId'));
    // head.append('access_token', localStorage.getItem('access_token'));
    let headeroptions = new RequestOptions({ headers: head });
    // return this.http.post(this.URL + '/sub/dropdown', {userLocation: locationTypeId}, headeroptions);
    return this.http.post(this.URL + '/user/departmentLoad', { userLocation: locationTypeId }, headeroptions);
  }
  load_selectBox_subTypeData(typeid): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    // headers.append('access_token', localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    headers.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: headers });
    return this.http.post(this.URL + "/RST/dropdown", { "requestTypeId": typeid }, headeroptions);
  }
  load_LocationData(): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    // headers.append('access_token', localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    headers.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: headers });
    return this.http.post(this.URL + "/user/locationLoad", {}, headeroptions);
  }
  load_subLocationData(locationTypeId): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    headers.append('userId',localStorage.getItem('userId'));
    // headers.append('access_token', localStorage.getItem("access_token"));
    let headeroptions = new RequestOptions({ headers: headers });
    return this.http.post(this.URL + "/sub/dropdown", { "id": locationTypeId }, headeroptions);
  }
  load_selectBoxData_executer(): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    headers.append('userId',localStorage.getItem('userId'));
    // headers.append('access_token', localStorage.getItem("access_token"));
    let headeroptions = new RequestOptions({ headers: headers });
    return this.http.post(this.URL + "/RWF/executerDropdown", {}, headeroptions);
  }
  load_selectBox_subLocationData_executer(exLocationTypeId): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('access_token', localStorage.getItem("access_token"));
    headers.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: headers });
    return this.http.post(this.URL + "/sub/executerDropdown", { "id": exLocationTypeId }, headeroptions);
  }
  load_selectBoxData_sequence(): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('access_token', localStorage.getItem("access_token"));
    headers.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: headers });
    return this.http.post(this.URL + "/RWF/sequenceDropdown", {}, headeroptions);
  }
  load_reqtypeList(): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    // headers.append('access_token', localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('userId',localStorage.getItem('userId'));
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: headers });
    return this.http.post(this.URL + "/RT/dropdown", {}, headeroptions);
  }
  load_DepartmentselectBoxData(): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    // headers.append('access_token', localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    headers.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: headers });
    return this.http.post(this.URL + "/user/departmentLoad", {}, headeroptions);
  }
  load_userRoleelectBoxData(data): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    // headers.append('access_token', localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    headers.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: headers });
    return this.http.post(this.URL + "/user/roleLoad", data, headeroptions);
  }
  getUSer(data): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    // headers.append('access_token', localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    headers.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: headers });
    return this.http.post(this.URL + "/user/dropdown", data, headeroptions);
  }
  addscreen(): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    // headers.append('access_token', localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    headers.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: headers });
    let data = { screenJson:  { screenId: 14 ,  subScreenId: 30  } };
    return this.http.post(this.URL + "/RWF/add", data, headeroptions);
  }
  load_ExselectBox_subLocationData(data): Observable<{}> {
    let head = new Headers();
    head.append('Content-Type', 'application/json');
    // head.append('access_token', localStorage.getItem('access_token'));
    let authToken = localStorage.getItem("access_token");
    head.append('Authorization', `Bearer ${authToken}`);
    head.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: head });
    // return this.http.post(this.URL + '/sub/dropdown', {userLocation: locationTypeId}, headeroptions);
    return this.http.post(this.URL + '/user/departmentLoad', data, headeroptions);
  }
  dynamicRowDelete(reqWorkFlowExecuterId): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    // headers.append('access_token', localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    headers.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: headers });
    let data = {
      "requestWorkFlowExecuterVo": [
        {
          "reqWorkFlowExecuterId": reqWorkFlowExecuterId
        }]
    };
    return this.http.post(this.URL + "/RWF/modifyDelete", data, headeroptions);
  }
  getSeqDepartment( sublocationId, locationTypeId,): Observable<{}> {
    let head = new Headers();
    head.append('Content-Type', 'application/json');
    // head.append('access_token', localStorage.getItem('access_token'));
    let authToken = localStorage.getItem("access_token");
    head.append('Authorization', `Bearer ${authToken}`);
    head.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: head });
    // return this.http.post(this.URL + '/sub/dropdown', {userLocation: locationTypeId}, headeroptions);
    return this.http.post(this.URL + '/user/departmentLoad', { userLocation: locationTypeId, sublocationId : sublocationId }, headeroptions);
  }
  getDept( sublocationId,locationTypeId): Observable<{}> {
    let head = new Headers();
    head.append('Content-Type', 'application/json');
    // head.append('access_token', localStorage.getItem('access_token'));
    let authToken = localStorage.getItem("access_token");
    head.append('Authorization', `Bearer ${authToken}`);
    head.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: head });
    // return this.http.post(this.URL + '/sub/dropdown', {userLocation: locationTypeId}, headeroptions);
    return this.http.post(this.URL + '/user/departmentLoad', { userLocation: locationTypeId ,  sublocationId : sublocationId }, headeroptions);
  }
  check_existinguserList(data): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    // headers.append('access_token', localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    headers.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: headers });
    return this.http.post(this.URL + "/RWF/detailValidation", {requestWorkFlowDetailsVoList: data}, headeroptions);
  }
}

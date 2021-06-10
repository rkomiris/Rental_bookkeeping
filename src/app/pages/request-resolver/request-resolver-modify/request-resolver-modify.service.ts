import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RequestResolverModifyService {
  constructor(private http: Http) { }
  private URL: string = environment.API_HOST;

  getDropdownData(): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: headers });
    return this.http.post(this.URL + '/RT/dropdown', {}, headeroptions);
  }

  loadRequestDetailsById(data) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: headers });
    let bodycontent = {
      screenJson: { screenId: 22, subScreenId: 38 },
      requestId: Number(data),
    };
    return this.http.post(this.URL + '/resolver/load', bodycontent, headeroptions);
  }

  getSubTypeList(val): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: headers });

    return this.http.post(this.URL + '/RST/dropdown', { requestTypeId: val }, headeroptions);
  }

  reqDeatailList(data): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    headers.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: headers });
    let bodycontent = JSON.stringify(data);
    return this.http.post(this.URL + '/Req/screenlist', bodycontent, headeroptions);
  }

  userDropdownData(): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    headers.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: headers });
    return this.http.post(this.URL + '/user/userExecuter', {}, headeroptions);
  }

  updateResolverData(data): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    headers.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: headers });
    return this.http.post(this.URL + '/resolver/updateResolver', data, headeroptions);
  }

  resolveruserDropdownData(): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    headers.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: headers });
    return this.http.post(this.URL + '/Resolver/reassignUser', { 'requestId': Number(localStorage.getItem('requestId') )}, headeroptions);
  }

  load_selectBox_LocationData(): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    headers.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: headers });
    return this.http.post(this.URL + "/user/locationLoad", {}, headeroptions);
  }

  load_selectBox_subLocationData(locationTypeId): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    headers.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: headers });
    return this.http.post(this.URL + "/sub/dropdown", { "id": locationTypeId }, headeroptions);
  }


  loadResolverList(data) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    headers.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: headers });
    let bodycontent = {
      screenJson: { screenId: 22, subScreenId: 38 },
      requestId: data,
    };
    return this.http.post(this.URL + '/resolver/viewAllResolver', bodycontent, headeroptions);
  }


  loadsubmitDetails(data) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    headers.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: headers });
    let bodycontent = { screenJson: { screenId: 22, subScreenId: 38 }, requestId: data, };
    return this.http.post(this.URL + '/resolver/viewResolver', bodycontent, headeroptions);
  }



}

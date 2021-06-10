
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RequestScrconfigModifyService {
  constructor(private http: Http) { }

  private URL: string = environment.API_HOST;
  getModifyData(rowId): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    // headers.append('access_token', localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('userId',localStorage.getItem('userId'));
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: headers });
  //  let data =
  //  {
 //      "requestScreenConfigId": Number(rowId)
  //  }
    let data1 = { screenJson: {screenId: 15, subScreenId: 20},
    requestScreenConfigId: Number(rowId)};
    return this.http.post(this.URL + "/RSC/load", data1, headeroptions);
  }
  modifyScreenConfig(val): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    // headers.append('access_token', localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    headers.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: headers });
    Object.assign(val, {"requestScreenConfigId" : Number(localStorage.getItem('requestScreenConfigId'))})
    return this.http.post(this.URL + "/RSC/update", val, headeroptions);
  }
}

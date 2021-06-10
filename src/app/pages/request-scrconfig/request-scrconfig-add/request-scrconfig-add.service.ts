
import { Injectable } from '@angular/core';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class RequestScrconfigAddService {
  constructor(private http: Http) { }
  private URL: string = environment.API_HOST;
  addProjectList(data): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    // headers.append('access_token', localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    headers.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: headers });
    let bodycontent = JSON.stringify(data);
    return this.http.post(this.URL + "/RSC/create", bodycontent, headeroptions);
  }
  getreqtypeId(): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    // headers.append('access_token', localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    headers.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: headers });
    return this.http.post(this.URL + "/RT/dropdown",{}, headeroptions);
  }
  getSubTypeList(val): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    // headers.append('access_token', localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    headers.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: headers });
    return this.http.post(this.URL + "/RST/dropdown", {
      "requestTypeId": val
    }, headeroptions);
  }
  addScreenConfig(val): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    // headers.append('access_token', localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    headers.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: headers });
    return this.http.post(this.URL + "/RSC/create", val, headeroptions);
  }
  addrequest(): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    // headers.append('access_token', localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    headers.append('userId',localStorage.getItem('userId'));
    let headeroptions = new RequestOptions({ headers: headers});
    let data = {screenJson:  {screenId: 15, subScreenId: 20}};
    return this.http.post(this.URL+"/RSC/add", data,  headeroptions);
  }
}

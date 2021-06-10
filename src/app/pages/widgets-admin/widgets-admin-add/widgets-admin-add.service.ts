
import { Injectable } from '@angular/core';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Observable} from 'rxjs';
import { environment} from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {  tap } from "rxjs/operators";
@Injectable({
  providedIn: 'root'
})
export class WidgetsAdminAddService {
  constructor(private http:Http , private httpClient : HttpClient) { }
  private URL: string = environment.API_HOST;
  addProjectList(data):Observable<{}>{
    
    let headers = new Headers();
    // headers.append('access_token', localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions =new RequestOptions({ headers: headers});
    let bodycontent=JSON.stringify(data);
    return this.http.post(this.URL+'/Wid/create',data, headeroptions);
  }
  getProjectList(data):Observable<{}>{
    let headers = new Headers();
    // headers.append('access_token', localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions =new RequestOptions({ headers: headers});
    let bodycontent=JSON.stringify(data);
    let data1 = { screenAuthorizationMaster: {screenMaster: {screenId: 7}, subScreenMaster: {subScreenId: 26}},
      widgetId: data
    };
    return this.http.post(this.URL+'/Wid/load', data1, headeroptions);
  }
  updateWidget(data):Observable<{}>{
    let headers = new Headers();
    headers.append('access_token', localStorage.getItem("access_token"));
    let headeroptions =new RequestOptions({ headers: headers});
    let bodycontent=JSON.stringify(data);
    return this.http.post(this.URL+'/Wid/update',data, headeroptions);
  }
  addscreen(): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    // headers.append('access_token', localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: headers});
    let data = {screenJson: {screenId: 7, subScreenId: 26}};
    return this.http.post(this.URL+"/Wid/add", data,  headeroptions);
  }
  picDownloadWidgetIcon(data) {
    let screenOptions = {
      widgetId: Number(data)
    };
    let headers = new HttpHeaders({
      access_token: localStorage.getItem("access_token")
    });
    let bodyoptions = screenOptions;
    return this.httpClient
      .post(
        this.URL + "/Wid/download",
        bodyoptions,
        { headers: headers, observe: "response", responseType: "blob" }
      )
      .pipe(tap(res => res));
  }
}

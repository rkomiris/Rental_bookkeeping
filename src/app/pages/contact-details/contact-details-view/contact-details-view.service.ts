import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestOptions, Headers, Http } from '@angular/http';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import {  tap } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ContactDetailsViewService {

  constructor(private http:Http,
    private httpClient: HttpClient) { }
  private URL: string = environment.API_HOST;
  
  getById():Observable<{}>{
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    // headers.append('access_token', localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions =new RequestOptions({ headers: headers});
   // let data = { id : localStorage.getItem('userId')}
    let data1 = { screenJson: {screenId: 26, subScreenId: 49},
    emergencyContactPathId: localStorage.getItem('emergencyId')};
    return this.http.post(this.URL+"/emergency/view", data1 ,  headeroptions);
  }
  
  picDownloadFn(data) {
    let screenOptions = {
      emergencyContactPathId: Number(data)
    };
    let headers = new HttpHeaders({
      // access_token: localStorage.getItem("access_token")
      'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    });
    let bodyoptions = screenOptions;
    return this.httpClient
      .post(
        this.URL + "/emergency/download",
        bodyoptions,
        { headers: headers, observe: "response", responseType: "blob" }
      )
      .pipe(tap(res => res));
  }
}

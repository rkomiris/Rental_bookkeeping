
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Observable,throwError} from 'rxjs';
import { map,catchError } from 'rxjs/operators';
import { environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})


export class RequestSubtypeViewService {

  constructor(private http:Http) { }
  private URL: string = environment.API_HOST;
  load_view_project(data): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    //headers.append('access_token', localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions =new RequestOptions({ headers: headers});
    // let bodycontent ={
   //   "requestSubTypeId": data,
   //  }
    //let data1 = { screenAuthorizationMaster: {screenMaster: {screenId: 3}, subScreenMaster: {subScreenId: 16}},
    //requestSubTypeId: data};
    let data1 ={screenJson: {screenId:3,subScreenId:16}, requestSubTypeId: data };
    return this.http.post(this.URL+"/RST/load", data1, headeroptions);
  }

  load_selectBoxData():Observable<{}>{
    let headers = new Headers();
    headers.append('Content-Type','application/json');
   // headers.append('access_token', localStorage.getItem("access_token"));
   let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions =new RequestOptions({ headers: headers});
    return this.http.post(this.URL+"/RT/dropdown", {}, headeroptions);
  }
}

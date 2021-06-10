import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Observable,throwError} from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocationModifyService {
  constructor(private http:Http) { }
  private URL: string = environment.API_HOST;
  load_countryselectBoxData():Observable<{}>{
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions =new RequestOptions({ headers: headers});
    return this.http.post(this.URL+"/country/dropdown",{}, headeroptions);
  }
  load_CityselectBoxData():Observable<{}>{
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    // headers.append('access_token', localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions =new RequestOptions({ headers: headers});
    return this.http.post(this.URL+"/city/dropdown",{}, headeroptions);
  }
  load_stateselectBoxData():Observable<{}>{
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    // headers.append('access_token', localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions =new RequestOptions({ headers: headers});
    return this.http.post(this.URL+"/state/dropdown",{}, headeroptions);
  }
  modifyLocation(data):Observable<{}>{
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions =new RequestOptions({ headers: headers});
    return this.http.post(this.URL+"/loc/update", data,  headeroptions);
  }
  getModifyData():Observable<{}>{
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions =new RequestOptions({ headers: headers});
    /**let data = { screenAuthorizationMaster: {screenMaster: {screenId: 4}, subScreenMaster: {subScreenId: 36}},
    id : localStorage.getItem('locationId')}; */
    //let data = {screenJson: {screenId:4,subScreenId:36}};
    //let data = {screenId:4,subScreenId:36,id:84};
    let data = {screenId:4,subScreenId:36,id : localStorage.getItem('locationId')};
    return this.http.post(this.URL+"/loc/load", data,   headeroptions);
  }
}

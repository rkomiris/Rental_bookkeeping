
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Observable,throwError} from 'rxjs';
import { map,catchError } from 'rxjs/operators';
import { environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserRoleAddService {
  constructor(private http:Http) { }
  private URL: string = environment.API_HOST;
  
  load_LoactionselectBoxData():Observable<{}>{
    let head = new Headers();
    head.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    head.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: head});
    //return this.http.post(this.URL + '/user/locationLoad', {}, headeroptions);
    return this.http.post(this.URL + '/userrole/loadUserLocation',{}, headeroptions);
  }
  
  load_subLocationselectBoxData(val):Observable<{}>{
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    //headers.append('access_token', localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions =new RequestOptions({ headers: headers});
    return this.http.post(this.URL+"/sub/dropdown",	{	id : val },headeroptions);
  }

  load_DepartmentselectBoxData():Observable<{}>{
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions =new RequestOptions({ headers: headers});
    return this.http.post(this.URL+"/userrole/loadUserDepartment",{},  headeroptions);
  } 

  addUserRole(data):Observable<{}>{
    let headers = new Headers();
    headers.append('Content-Type','application/json');
   // headers.append('access_token', localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions =new RequestOptions({ headers: headers});
    return this.http.post(this.URL+"/userrole/create", data,  headeroptions);
  }
  addUser(): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    //headers.append('access_token', localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: headers});
    //let data = {screenAuthorizationMaster: {screenMaster: {screenId: 12}, subScreenMaster: {subScreenId: 12}}};
    let data = {screenId:12, subScreenId:12};
    return this.http.post(this.URL+"/userrole/add", data,  headeroptions);
  }
  /** load_selectBox_subLocationData(locationTypeId): Observable<{}> {
    let head = new Headers();
    head.append('Content-Type', 'application/json');
   // head.append('access_token', localStorage.getItem('access_token'));
    let authToken = localStorage.getItem("access_token");
    head.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: head});
    // return this.http.post(this.URL + '/sub/dropdown', {userLocation: locationTypeId}, headeroptions);
    return this.http.post(this.URL + '/user/departmentLoad', {userLocation: locationTypeId}, headeroptions);
  } **/


  load_selectBox_departmentData(locationTypeId,sublocationTypeId): Observable<{}> {
    let head = new Headers();
    head.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    head.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: head});
    // return this.http.post(this.URL + '/sub/dropdown', {userLocation: locationTypeId}, headeroptions);
    return this.http.post(this.URL + '/user/departmentLoad', {userLocation: locationTypeId, sublocationId : sublocationTypeId}, headeroptions);
  }  

  getRoleType():Observable<{}>{
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    //headers.append('access_token', localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions =new RequestOptions({ headers: headers});
    return this.http.post(this.URL+'/userRole/RoleType',{}, headeroptions);
  }
}

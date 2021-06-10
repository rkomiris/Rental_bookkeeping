import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Observable,throwError} from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DeparmentService 
{
  constructor(private http:Http) { }
  private URL: string = environment.API_HOST;

  userRoleList():Observable<{}>{
    let headers= new Headers();
    headers.append('Content-Type', 'application/json');
    //headers.append('access_token', localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: headers });
    //let data = {screenMaster: {screenId: 1}, subScreenMaster: {subScreenId: 1}};
    let data = {screenId: 1, subScreenId: 1};
    return this.http.post(this.URL+"/depart/getAll", data, headeroptions );
  }
  search_list(list):Observable<{}>{
    let headers= new Headers();
    headers.append('Content-Type', 'application/json');
   // headers.append('access_token', localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: headers });
    return this.http.post(this.URL+"/depart/search", list, headeroptions);
  }
  deleteUserRoleList(list):Observable<{}>{
    let headers= new Headers();
    headers.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: headers });
    let data = {deleteItem : list}
    return this.http.post(this.URL+"/depart/delete", data, headeroptions);
  }
}

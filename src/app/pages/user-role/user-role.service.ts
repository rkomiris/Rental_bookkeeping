
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Observable,throwError} from 'rxjs';
import { map,catchError } from 'rxjs/operators';
import { environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserRoleService {

  constructor(private http:Http) { }
  private URL: string = environment.API_HOST;

userRoleList():Observable<{}>{    
  let headers= new Headers();
  headers.append('Content-Type', 'application/json');
  //headers.append('access_token', localStorage.getItem("access_token"));
  let authToken = localStorage.getItem("access_token");
  headers.append('Authorization', `Bearer ${authToken}`);
  let headeroptions = new RequestOptions({ headers: headers });   
  //let data = {screenMaster: {screenId: 12}, subScreenMaster: {subScreenId: 11}};
  let data = {screenId:12, subScreenId:11};
  return this.http.post(this.URL+"/userrole/getAll", data, headeroptions ); 
}
search_list(list):Observable<{}>{
  let headers= new Headers();    	
  headers.append('Content-Type', 'application/json');
 // headers.append('access_token', localStorage.getItem("access_token"));
  let authToken = localStorage.getItem("access_token");
  headers.append('Authorization', `Bearer ${authToken}`);
  let headeroptions = new RequestOptions({ headers: headers });   
  return this.http.post(this.URL+"/userrole/search", list, headeroptions);   
}
deleteUserRoleList(list):Observable<{}>{  
  let headers= new Headers();    	
  headers.append('Content-Type', 'application/json');
  //headers.append('access_token', localStorage.getItem("access_token"));
  let authToken = localStorage.getItem("access_token");
  headers.append('Authorization', `Bearer ${authToken}`);
  let headeroptions = new RequestOptions({ headers: headers });   
  let data = {deleteItem : list}
  return this.http.post(this.URL+"/userrole/delete", data, headeroptions);   
}
}

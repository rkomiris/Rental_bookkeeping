import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Observable,throwError} from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment} from '../../../environments/environment';
import { id } from '@swimlane/ngx-charts/release/utils';

@Injectable({
  providedIn: 'root'
})
export class EntityService {

  constructor(private http:Http) { }
  private URL: string = environment.API_HOST;
  private TOKEN_URL: string = environment.LOGIN_HOST;

  entityList():Observable<{}>
  {
    let headers= new Headers();
    headers.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: headers });
    let data = {screenId:29,subScreenId:55};
    return this.http.post(this.URL+"/entity/getAll", data, headeroptions );
  }

  entityListSingle():Observable<{}>
  {
    let headers= new Headers();
    headers.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: headers });
    let data = {screenId:29,subScreenId:55};
    return this.http.post(this.URL+"/entity/getAllEntity", data, headeroptions );
  }

  addData():Observable<{}>{
    let headers= new Headers();
    headers.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: headers });
    let data ={screenJson: {screenId: 29, subScreenId: 62}};
    return this.http.post(this.URL+"/entity/add", data, headeroptions );
  }

  search_list(list):Observable<{}>
  {
    let headers= new Headers();
    headers.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: headers });
    return this.http.post(this.URL+"/entity/search", list, headeroptions);
  }

  entityView():Observable<{}>
  {
    let headers= new Headers();
    headers.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: headers });
    let data = {screenJson:{screenId:29, subScreenId:56},
    id: localStorage.getItem('entityId')};
    return this.http.post(this.URL+"/entity/view",data,headeroptions);
  }

  renewal(data):Observable<{}> {
    let headers= new Headers();
    headers.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: headers });
    return this.http.post(this.URL+"/entityMaster/renewal", data, headeroptions );
  
  }

  update(data):Observable<{}> {
    let headers= new Headers();
    headers.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: headers });
    return this.http.post(this.URL+"/entityMaster/update", data, headeroptions );
  
  }

  entityCreation(data): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('auth', 'Basic dGVzdGp3dGNsaWVudGlkOlhZN2ttem9OemwxMDA=');
    let headeroptions = new RequestOptions({ headers: headers });
    return this.http.post(this.TOKEN_URL + "/entityMaster/create", data, headeroptions);
  }

  planList(){
    let headers= new Headers();
    headers.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: headers });
    return this.http.post(this.URL+"/entityPlanningMaster/planlist", {}, headeroptions );
  }

  planDetails(data):Observable<{}>{
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');    
    let headeroptions = new RequestOptions({ headers: headers });
    return this.http.post(this.TOKEN_URL+"/entityPlanning/load", {'planId': data}, headeroptions );
  }

  languageLoad():Observable<{}>{
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    //headers.append('access_token', localStorage.getItem("access_token"));
    let headeroptions =new RequestOptions({ headers: headers});
    return this.http.post(this.URL+"/language/dropdown",{}, headeroptions);
  }

}

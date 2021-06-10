
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Observable,throwError} from 'rxjs';
import { map,catchError } from 'rxjs/operators';
import { environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserAddService {
  constructor(private http:Http) { }
  private URL: string = environment.API_HOST;

  /** Not valid */
 load_RoleselectBoxData():Observable<{}>{
    let headers = new Headers();
    headers.append('Content-Type','application/json');
   // headers.append('access_token', localStorage.getItem("access_token"));
   let authToken = localStorage.getItem("access_token");
   headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions =new RequestOptions({ headers: headers});
    return this.http.post(this.URL+"/user/roleLoad",{}, headeroptions);
  }  
  load_DeptselectBoxData():Observable<{}>{
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    //headers.append('access_token', localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions =new RequestOptions({ headers: headers});
    return this.http.post(this.URL+"/user/departmentLoad",{}, headeroptions);
  } 

  /** correct method */
  load_selectBox_subLocationData(val): Observable<{}> {
    let head = new Headers();
    head.append('Content-Type', 'application/json');
    //head.append('access_token', localStorage.getItem('access_token'));
    let authToken = localStorage.getItem("access_token");
    head.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: head});
    // return this.http.post(this.URL + '/sub/dropdown', {userLocation: locationTypeId}, headeroptions);
    return this.http.post(this.URL +"/user/departmentLoad", val, headeroptions);

  }

  /** correct method */
  load_userRoleelectBoxData(data): Observable<{}> {
    let heade = new Headers();
    heade.append('Content-Type', 'application/json');
    //heade.append('access_token', localStorage.getItem('access_token'));
    let authToken = localStorage.getItem("access_token");
    heade.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: heade});
    return this.http.post(this.URL +"/user/roleLoad", data,  headeroptions);

  }
  /** correct */
  load_LocationselectBoxData():Observable<{}>{
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    //headers.append('access_token', localStorage.getItem("access_token"));
    let headeroptions =new RequestOptions({ headers: headers});
    return this.http.post(this.URL+"/user/locationLoad",{}, headeroptions);
  }

  /** correct */
  languageLoad():Observable<{}>{
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    //headers.append('access_token', localStorage.getItem("access_token"));
    let headeroptions =new RequestOptions({ headers: headers});
    return this.http.post(this.URL+"/language/dropdown",{}, headeroptions);
  }

  /** correct */
  load_DivisionselectBoxData():Observable<{}>{
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    //headers.append('access_token', localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions =new RequestOptions({ headers: headers});
    return this.http.post(this.URL+"/user/divisionsLoad",{}, headeroptions);
  }
 
  load_levelselectBoxData():Observable<{}>{
    let headers = new Headers();
    headers.append('Content-Type','application/json');
   // headers.append('access_token', localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions =new RequestOptions({ headers: headers});
    return this.http.post(this.URL+"/userlevel/dropdown",{}, headeroptions);
  }  

  addUser(data):Observable<{}>{
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions =new RequestOptions({ headers: headers});
    return this.http.post(this.URL+"/user/userAdd", data,  headeroptions);
  }

  /** Correct */
  load_subLocationData(locationTypeId):Observable<{}>{
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    //headers.append('access_token', localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions =new RequestOptions({ headers: headers});
    return this.http.post(this.URL+"/sub/dropdown", {"id": locationTypeId}, headeroptions);
  }
  adduserscreen(): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: headers});
    //let data = {screenAuthorizationMaster: {screenMaster: {screenId: 10}, subScreenMaster: {subScreenId: 10}}};
    //let data = {screenJson: {screenId:10,subScreenId:10}};
    let data = {screenId:10,subScreenId:10}; 
    return this.http.post(this.URL+"/user/add", data,  headeroptions);
  }
}

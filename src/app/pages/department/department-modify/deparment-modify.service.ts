import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Observable,throwError} from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DeparmentModifyService {

  constructor(private http:Http) { }
  private URL: string = environment.API_HOST;

   load_LoactionselectBoxData():Observable<{}>{
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization',`Bearer ${authToken}`);
    let headeroptions =new RequestOptions({ headers: headers});
    return this.http.post(this.URL+"/user/locationLoad",{}, headeroptions);
  }
  load_subLocationselectBoxData(val): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization',`Bearer ${authToken}`);
    let headeroptions = new RequestOptions({headers: headers});
    //return this.http.post(this.URL+"/sub/dropdown",val, headeroptions);
    return this.http.post(this.URL+"/sub/dropdown",	{	id : val }, headeroptions);
    }
  modifyDepartment(data):Observable<{}>{
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization',`Bearer ${authToken}`);
    let headeroptions =new RequestOptions({ headers: headers});
    return this.http.post(this.URL+"/depart/update", data,  headeroptions);
  }
  getModifyData():Observable<{}>{
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization',`Bearer ${authToken}`);
    let headeroptions =new RequestOptions({ headers: headers});
    // let data = { id : localStorage.getItem('departmentId')};
    let data = {id : localStorage.getItem('departmentId'),screenJson: {screenId: 1, subScreenId: 2}};
    return this.http.post(this.URL+"/depart/load", data,   headeroptions);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Observable,throwError} from 'rxjs';
import { map,catchError } from 'rxjs/operators';
import { environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class AminiteModifyService {

  constructor(private http:Http) { }

  private URL: string = environment.API_HOST;

  load_modify_project(data): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('access_token', localStorage.getItem("access_token"));
    let headeroptions =new RequestOptions({ headers: headers});
   // let bodycontent ={
    //  "amenityId": data,
    // }
    let data1 = { screenAuthorizationMaster: {screenMaster: {screenId: 6}, subScreenMaster: {subScreenId: 4}},
    amenityId: data};
    return this.http.post(this.URL+"/amenity/load", data1, headeroptions);
  }
  update_modify_project(data): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('access_token', localStorage.getItem("access_token"));
    let headeroptions =new RequestOptions({ headers: headers});
    return this.http.post(this.URL+"/amenity/update",data, headeroptions);
  }




}


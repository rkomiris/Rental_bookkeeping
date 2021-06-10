import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Observable,throwError} from 'rxjs';
import { map,catchError } from 'rxjs/operators';
import { environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AminiteAddService {

  constructor(private http:Http) { }

  private URL: string = environment.API_HOST;

  addProjectList(data):Observable<{}>{
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('access_token', localStorage.getItem("access_token"));
    let headeroptions =new RequestOptions({ headers: headers});
    let bodycontent=JSON.stringify(data);
    return this.http.post(this.URL+"/amenity/create",bodycontent, headeroptions);
  }
  addaminity(): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('access_token', localStorage.getItem("access_token"));
    let headeroptions = new RequestOptions({ headers: headers});
    let data = {screenAuthorizationMaster: {screenMaster: {screenId: 6}, subScreenMaster: {subScreenId: 4}}};
    return this.http.post(this.URL+"/amenity/add", data,  headeroptions);
  }

}


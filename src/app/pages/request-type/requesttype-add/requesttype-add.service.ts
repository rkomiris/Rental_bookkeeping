
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Observable,throwError} from 'rxjs';
import { map,catchError } from 'rxjs/operators';
import { environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RequesttypeAddService {

  constructor(private http:Http) { }

  private URL: string = environment.API_HOST;

  addProjectList(data):Observable<{}>{
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    //headers.append('access_token', localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions =new RequestOptions({ headers: headers});
    let bodycontent=JSON.stringify(data);
    return this.http.post(this.URL+"/RT/create",bodycontent, headeroptions);
  }
  addrequest(): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    //headers.append('access_token', localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: headers});
    let data = {screenJson: {screenId: 2, subScreenId: 6}};
    return this.http.post(this.URL+"/RT/Add", data,  headeroptions);
  }



}

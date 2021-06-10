import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Observable,throwError} from 'rxjs';
import { map,catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DelegationService {

  constructor(private http:Http) { }
  private URL: string = environment.API_HOST;

  getAllList(): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: headers });
    let data = {screenId: 28,subScreenId: 53};
    return this.http.post(this.URL + '/delegationMaster/userGetAll', data, headeroptions);
  }

  search(data){
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: headers });
    return this.http.post(this.URL + '/delegationMaster/userSearch', data, headeroptions);
  }

  
  
  
}

import { Injectable } from '@angular/core';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserEntityMappingService {

  constructor(private http: Http) { }
  private URL: string = environment.API_HOST;

  load(): Observable<{}> {
    let heade = new Headers();
    heade.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    heade.append('Authorization', `Bearer ${authToken}`);    
    let headeroptions = new RequestOptions({ headers: heade });
    let bodycontent =  {screenId: 30, subScreenId: 57};
    return this.http.post(this.URL + "/entity/list", bodycontent, headeroptions);
  }

  entityLoad(value): Observable<{}> {
    let heade = new Headers();
    heade.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    heade.append('Authorization', `Bearer ${authToken}`);    
    let headeroptions = new RequestOptions({ headers: heade });
    return this.http.post(this.URL + "/entity/load", {'userId': value}, headeroptions);
  }

  save(temp): Observable<{}> {
    let heade = new Headers();
    heade.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    heade.append('Authorization', `Bearer ${authToken}`);    
    let headeroptions = new RequestOptions({ headers: heade });
    return this.http.post(this.URL + "/entity/saveEntity", temp, headeroptions);
  }

  deleteUserList(list): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    // headers.append('access_token', localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: headers });
    let data = { userId: list };
    return this.http.post(this.URL + "/auth/delete", data, headeroptions);
  }
}

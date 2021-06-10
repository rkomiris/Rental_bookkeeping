import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Http, RequestOptions,Headers } from '@angular/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactDetailsService {

  constructor(private http:Http) { }
  private URL: string = environment.API_HOST;

  getAll():Observable<{}>{
    let headers= new Headers();
    headers.append('Content-Type', 'application/json');
    // headers.append('access_token', localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: headers });
    let data = { screenId: 26, subScreenId: 49};
    return this.http.post(this.URL+"/emergency/getAll", data, headeroptions );
  }

  delete(list):Observable<{}>{
    let headers= new Headers();
    headers.append('Content-Type', 'application/json');
    // headers.append('access_token', localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: headers });
    let data = {deleteItem : list}
    return this.http.post(this.URL+"/emergency/delete", data, headeroptions);
  }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RequestOptions, Headers, Http } from '@angular/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContactDetailsModifyService {

  constructor(private http:Http) { }
  private URL: string = environment.API_HOST;
  
  getById():Observable<{}>{
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    // headers.append('access_token', localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions =new RequestOptions({ headers: headers});
   // let data = { id : localStorage.getItem('userId')}
    let data1 = { screenJson : {screenId: 26, subScreenId: 49},
    emergencyContactPathId: localStorage.getItem('emergencyId')};
    return this.http.post(this.URL+"/emergency/view", data1 ,  headeroptions);
  }

  modify(data):Observable<{}>{
    let headers = new Headers();
    // headers.append('access_token', localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions =new RequestOptions({ headers: headers});
    let bodycontent=JSON.stringify(data);
    return this.http.post(this.URL+'/emergency/update',data, headeroptions);
  }
  
}

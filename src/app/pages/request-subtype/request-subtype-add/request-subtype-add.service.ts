import { Injectable } from '@angular/core';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Observable} from 'rxjs';
import { environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RequestSubtypeAddService {
  constructor(private http:Http) { }
  private URL: string = environment.API_HOST;
  
  addProjectList(data):Observable<{}>{
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    headers.append('access_token', localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions =new RequestOptions({ headers: headers});
    let bodycontent=JSON.stringify(data);
    return this.http.post(this.URL+"/RST/create",bodycontent, headeroptions);
  }
  load_selectBoxData():Observable<{}>{
    let headers = new Headers();
    headers.append('Content-Type','application/json');
   // headers.append('access_token', localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions =new RequestOptions({ headers: headers});
    return this.http.post(this.URL+"/RT/dropdown", {}, headeroptions);
  }
  addsubrequest(): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    //headers.append('access_token', localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: headers});
   // let data = {screenAuthorizationMaster: {screenMaster: {screenId: 3}, subScreenMaster: {subScreenId: 16}}};
   let data = {screenJson: {screenId:3,subScreenId:15}} ;
   return this.http.post(this.URL+"/RST/Add", data,  headeroptions);
  }
}

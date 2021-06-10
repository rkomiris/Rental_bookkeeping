import { Injectable } from '@angular/core';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Observable} from 'rxjs';
import { environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExternalLinkAddService {
  constructor(private http:Http) { }
  private URL: string = environment.API_HOST;
  addProjectList(data):Observable<{}>{
    
    let headers = new Headers();
    // headers.append('access_token', localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions =new RequestOptions({ headers: headers});
    return this.http.post(this.URL+"/externalLink/create",data, headeroptions);
  }
  addexternal(): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    // headers.append('access_token', localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: headers});
    let data = {screenJson: { screenId: 8, subScreenId: 14}};
    return this.http.post(this.URL+"/externalLink/add", data,  headeroptions);
  }
}


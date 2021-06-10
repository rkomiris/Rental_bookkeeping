
import { Injectable } from '@angular/core';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Observable} from 'rxjs';
import { environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http:Http) { }
  private URL: string = environment.API_HOST;

  userList():Observable<{}>{
  let headers= new Headers();
  headers.append('Content-Type', 'application/json');
  let authToken = localStorage.getItem("access_token");
  headers.append('Authorization', `Bearer ${authToken}`);
  let headeroptions = new RequestOptions({ headers: headers });
  //let data = {screenMaster: {screenId: 10}, subScreenMaster: {subScreenId: 9}};
   let data = {screenId:10,subScreenId:9};
  //let data = {screenJson: {screenId:10,subScreenId:10}};
  return this.http.post(this.URL+"/user/userLoad", data, headeroptions );
}
search_list(list):Observable<{}>{
  let headers= new Headers();
  headers.append('Content-Type', 'application/json');
  let authToken = localStorage.getItem("access_token");
  headers.append('Authorization', `Bearer ${authToken}`);

  //headers.append('access_token', localStorage.getItem("access_token"));

  let headeroptions = new RequestOptions({ headers: headers });
  return this.http.post(this.URL+"/user/userSearch", list, headeroptions);
}
deleteUserList(usercurid):Observable<{}>
{
  let headers= new Headers();
  headers.append('Content-Type', 'application/json');
  let authToken = localStorage.getItem("access_token");
  headers.append('Authorization', `Bearer ${authToken}`);  
  let headeroptions = new RequestOptions({ headers: headers });
  let data = {deleteItem: usercurid};
  return this.http.post(this.URL+"/user/userDelete", data, headeroptions);
}
}

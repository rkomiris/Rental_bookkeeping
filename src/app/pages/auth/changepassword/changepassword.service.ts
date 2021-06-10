import { Injectable } from '@angular/core';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Observable} from 'rxjs';
import { environment} from '../../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ChangepasswordService {
  constructor(private http:Http) { }
  fullurl = environment.API_HOST;
  private URL: string = this.fullurl.substring(0, this.fullurl.length - 3);
  changenew_password(userName,oldpassword, newpassword, confirmpassword):Observable<{}>{
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
   // headers.append('access_token', localStorage.getItem("access_token"));
   let authToken = localStorage.getItem("access_token");
   headers.append('Authorization', `Bearer ${authToken}`);  
    let headeroptions = new RequestOptions({ headers: headers });
    let bodycontent = {
      "userId": userName,
      "oldPassword":oldpassword,
      "newPassword":newpassword,
      "confirmPassword":confirmpassword
    }
    return this.http.post(this.URL+"/api/common/changePassword", bodycontent, headeroptions );
  }
}


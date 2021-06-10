import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Observable,throwError} from 'rxjs';
import { map,catchError } from 'rxjs/operators';
import { environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class HelpService {

  constructor(private http:Http) { }

  private URL: string = environment.API_HOST;

  posthelp(helpsearch):Observable<{}>{

    let headers = new Headers();    

    headers.append('Content-Type', 'application/json');            
    // headers.append('access_token', localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);

    let headeroptions = new RequestOptions({ headers: headers });    
    let bodycontent = {      
      "helpSearchText": helpsearch      
    }    
    return this.http.post(this.URL+"/help/view",bodycontent, headeroptions );
  }





}

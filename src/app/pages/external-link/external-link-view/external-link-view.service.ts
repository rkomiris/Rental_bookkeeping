import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Observable,throwError} from 'rxjs';
import { map,catchError, tap } from 'rxjs/operators';
import { environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ExternalLinkViewService {

  constructor(private http:Http , private httpClient : HttpClient) { }

  private URL: string = environment.API_HOST;

  load_view_project(data): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    // headers.append('access_token', localStorage.getItem("access_token"));
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions =new RequestOptions({ headers: headers});
    // let bodycontent ={
   //   "id": data,
    // }
    let data1 = { screenJson: {screenId: 8, subScreenId: 14},
    id: data};
    return this.http.post(this.URL+"/externalLink/load", data1, headeroptions);
  }

  picDownloadExternal(data) {
    let screenOptions = {
      id: Number(data)
    };
    let headers = new HttpHeaders({
      // access_token: localStorage.getItem("access_token")
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('access_token')
    });
    let bodyoptions = screenOptions;
    return this.httpClient
      .post(
        this.URL + "/externalLink/download",
        bodyoptions,
        { headers: headers, observe: "response", responseType: "blob" }
      )
      .pipe(tap(res => res));
  }

}


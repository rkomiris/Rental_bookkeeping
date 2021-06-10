import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Observable, throwError} from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment} from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class PhoneBookDetailsService {

  constructor(private http: Http) { }
  private URL: string = environment.API_HOST;

  load_flashNewsData(): Observable<{}> {
    let head = new Headers();

    head.append('Content-Type', 'application/json');
  //  head.append('access_token', localStorage.getItem('access_token'));
  let authToken = localStorage.getItem("access_token");
  head.append('Authorization', `Bearer ${authToken}`);


    let headeroptions = new RequestOptions({ headers: head });
    // let bodycontent = {};
    let bodycontent = {screenId: 13, subScreenId: 23};
    return this.http.post(this.URL+"/phoneBooking/getAll", bodycontent, headeroptions );

  }




  search_list(list): Observable<{}> {

    let head = new Headers();
    head.append('Content-Type', 'application/json');
   // head.append('access_token', localStorage.getItem('access_token'));
   let authToken = localStorage.getItem("access_token");
   head.append('Authorization', `Bearer ${authToken}`);

    let headeroptions = new RequestOptions({ headers: head });
    // let searchData = data;
    return this.http.post(this.URL+"/phoneBooking/search", list, headeroptions);
  }




  deleteProjectList(id): Observable<{}> {
    let head = new Headers();
    //head.append('access_token', localStorage.getItem('access_token'));
    let authToken = localStorage.getItem("access_token");
    head.append('Authorization', `Bearer ${authToken}`);

    let headeroptions = new RequestOptions({ headers: head});
    let bodyoptions = {
      deleteItem: id,
    };
    return this.http.post(this.URL + '/phoneBook/delete', bodyoptions, headeroptions);
  }
  addProjectList(data): Observable<{}> {
    let head = new Headers();
    let authToken = localStorage.getItem("access_token");
    head.append('Authorization', `Bearer ${authToken}`);

    let headeroptions = new RequestOptions({ headers: head});
    return this.http.post(this.URL+"/phoneBook/profileCreate", data, headeroptions);
  }
  load_dept(): Observable<{}> {
    let head = new Headers();

    head.append('Content-Type', 'application/json');
   let authToken = localStorage.getItem("access_token");
   head.append('Authorization', `Bearer ${authToken}`);


    let headeroptions = new RequestOptions({ headers: head });
    let bodycontent = {};

    return this.http.post(this.URL+"/depart/getAll", bodycontent, headeroptions );

  }
  load_selectBox_LocationData(): Observable<{}> {
    let head = new Headers();
    head.append('Content-Type', 'application/json');
    //head.append('access_token', localStorage.getItem('access_token'));
    let authToken = localStorage.getItem("access_token");
    head.append('Authorization', `Bearer ${authToken}`);

    let headeroptions = new RequestOptions({ headers: head});
    return this.http.post(this.URL+"/user/locationLoad", {}, headeroptions);
  }
  load_selectBox_subLocationData(locationTypeId): Observable<{}> {
    let head = new Headers();
    head.append('Content-Type', 'application/json');
    //head.append('access_token', localStorage.getItem('access_token'));
    let authToken = localStorage.getItem("access_token");
    head.append('Authorization', `Bearer ${authToken}`);

    let headeroptions = new RequestOptions({ headers: head});
    return this.http.post(this.URL + '/sub/dropdown', {id: locationTypeId}, headeroptions);
  }
  
  load_subLocationData(val): Observable<{}> {
    let head = new Headers();
    head.append('Content-Type', 'application/json');
    //head.append('access_token', localStorage.getItem('access_token'));
    let authToken = localStorage.getItem("access_token");
    head.append('Authorization', `Bearer ${authToken}`);

    let headeroptions = new RequestOptions({ headers: head});
    // return this.http.post(this.URL + '/sub/dropdown', {userLocation: locationTypeId}, headeroptions);
    return this.http.post(this.URL+"/user/departmentLoad",val , headeroptions);
  }


  phonebookview(list): Observable<{}> {

    let head = new Headers();
    head.append('Content-Type', 'application/json');
   // head.append('access_token', localStorage.getItem('access_token'));
   let authToken = localStorage.getItem("access_token");
   head.append('Authorization', `Bearer ${authToken}`);

    let headeroptions = new RequestOptions({ headers: head });
    // let searchData = data;
    // let bodycontent = {phoneBookId: list};
    let bodycontent = { screenJson: {screenId: 13, subScreenId: 24},
      phoneBookId: list
    };
    return this.http.post(this.URL+"/phoneBooking/view", bodycontent, headeroptions);
  }
 updateList(data): Observable<{}> {
    let head = new Headers();
    //head.append('access_token', localStorage.getItem('access_token'));
    let authToken = localStorage.getItem("access_token");
    head.append('Authorization', `Bearer ${authToken}`);

    let headeroptions = new RequestOptions({ headers: head});
    return this.http.post(this.URL+"/phoneBook/profileUpdate", data, headeroptions);
  }
  load_userdropData(): Observable<{}> {
    let head = new Headers();

    head.append('Content-Type', 'application/json');
  //  head.append('access_token', localStorage.getItem('access_token'));
  let authToken = localStorage.getItem("access_token");
  head.append('Authorization', `Bearer ${authToken}`);


    let headeroptions = new RequestOptions({ headers: head });
    let bodycontent = {};

    return this.http.post(this.URL+"/phoneBook/userDropDown", bodycontent, headeroptions );

  }


  addPhonebookDetails(): Observable<{}> {
    let headers = new Headers();
    headers.append('Content-Type','application/json');
   // headers.append('access_token', localStorage.getItem("access_token"));
   let authToken = localStorage.getItem("access_token");
   headers.append('Authorization', `Bearer ${authToken}`);

    let headeroptions = new RequestOptions({ headers: headers});
    let data = {screenJson: {screenId: 13, subScreenId: 24}};
    return this.http.post(this.URL+"/phoneBook/loadAdd", data,  headeroptions);
  }


}

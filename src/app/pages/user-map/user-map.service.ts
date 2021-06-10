
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RequestOptions, Http, Headers } from '@angular/http';
import { Observable, throwError} from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserMapService {

  constructor(private http: Http) { }
  private URL: string = environment.API_HOST;

  load_flashNewsData(): Observable<{}> 
  {
    let head = new Headers();
    head.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    head.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: head });
    // let bodycontent = {};
    //let data = {screenMaster: {screenId: 11}, subScreenMaster: {subScreenId: 21}};
    let data = {screenId:11, subScreenId:21};
    return this.http.post(this.URL+'/um/getAll', data, headeroptions );
  }

  search_list(list): Observable<{}> 
  {
    let head = new Headers();
    head.append('Content-Type', 'application/json');
    //head.append('access_token', localStorage.getItem('access_token'));
    let authToken = localStorage.getItem("access_token");
    head.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: head });
    // let searchData = data;
    return this.http.post(this.URL + '/um/search', list, headeroptions);
  }

  deleteProjectList(id): Observable<{}> {
    let head = new Headers();
    //head.append('access_token', localStorage.getItem('access_token'));
    let authToken = localStorage.getItem("access_token");
    head.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: head});
    let bodyoptions = {userMappingList: id};
    return this.http.post(this.URL + '/um/delete', bodyoptions, headeroptions);
  }
   addProjectList(data): Observable<{}> {
    let head = new Headers();
    let authToken = localStorage.getItem("access_token");
    head.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: head});
    return this.http.post(this.URL + '/um/create', data, headeroptions);
  }

  load_dept(): Observable<{}> 
  {
    let head = new Headers();
    head.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    head.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: head });
    let bodycontent = {};
    return this.http.post(this.URL + '/depart/getAll', bodycontent, headeroptions );
  }

  load_selectBox_LocationData(): Observable<{}> {
    let head = new Headers();
    head.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    head.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: head});
    return this.http.post(this.URL + '/user/locationLoad', {}, headeroptions);
  }
  load_selectBox_subLocationData(locationTypeId): Observable<{}> {
    let head = new Headers();
    head.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    head.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: head});
    // return this.http.post(this.URL + '/sub/dropdown', {userLocation: locationTypeId}, headeroptions);
    return this.http.post(this.URL+'/user/departmentLoad', {userSublocation: locationTypeId}, headeroptions);
  }
  load_selectBox_userdepta(locationTypeId): Observable<{}> {
    let head = new Headers();
    head.append('Content-Type', 'application/json');
    //head.append('access_token', localStorage.getItem('access_token'));
    let authToken = localStorage.getItem("access_token");
    head.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: head});
    // return this.http.post(this.URL + '/sub/dropdown', {userLocation: locationTypeId}, headeroptions);
    return this.http.post(this.URL + '/user/dep', {userDepartment: locationTypeId}, headeroptions);
  }
  loadview(list): Observable<{}> {

    let head = new Headers();
    head.append('Content-Type', 'application/json');
    //head.append('access_token', localStorage.getItem('access_token'));
    let authToken = localStorage.getItem("access_token");
    head.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: head });
    // let searchData = data;
   // let bodycontent = {userMappingId: list};
   /** let data = { screenAuthorizationMaster: {screenMaster: {screenId: 11}, subScreenMaster: {subScreenId: 22}},
   userMappingId: list};  */
    let data = {userMappingId: list,screenJson:{screenId:11,subScreenId:22}};
    return this.http.post(this.URL + '/um/load', data, headeroptions);
  }
 updateList(data): Observable<{}> {
    let head = new Headers();
    //head.append('access_token', localStorage.getItem('access_token'));
    let authToken = localStorage.getItem("access_token");
    head.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: head});
    return this.http.post(this.URL + '/um/update', data, headeroptions);
  }
  load_userRoleelectBoxData(data): Observable<{}> {
    let heade = new Headers();
    heade.append('Content-Type', 'application/json');
    //heade.append('access_token', localStorage.getItem('access_token'));
    let authToken = localStorage.getItem("access_token");
    heade.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: heade});
    return this.http.post(this.URL + '/user/roleLoad', data,  headeroptions);
  }
  getUSer(id): Observable<{}> {
    let heade = new Headers();
    heade.append('Content-Type', 'application/json');
   // heade.append('access_token', localStorage.getItem('access_token'));
    let authToken = localStorage.getItem("access_token");
    heade.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: heade});
    return this.http.post(this.URL + '/user/dropdown', {'userRole': id}, headeroptions);
  }
  load_userdropData(): Observable<{}> {
    let head = new Headers();

    head.append('Content-Type', 'application/json');
    head.append('access_token', localStorage.getItem('access_token'));

    let headeroptions = new RequestOptions({ headers: head });
    let bodycontent = {};

    return this.http.post(this.URL + '/phoneBook/userDropDown', bodycontent, headeroptions );

  }
  userList(): Observable<{}> {
    let heade = new Headers();
    heade.append('Content-Type', 'application/json');
    //heade.append('access_token', localStorage.getItem('access_token'));
    let authToken = localStorage.getItem("access_token");
    heade.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: heade });
    return this.http.post(this.URL + '/user/userLoad', {}, headeroptions );
  }
  load_levelselectBoxData(): Observable<{}> {
    let heade = new Headers();
    heade.append('Content-Type', 'application/json');
    //heade.append('access_token', localStorage.getItem('access_token'));
    let authToken = localStorage.getItem("access_token");
    heade.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: heade});
    return this.http.post(this.URL + '/userlevel/dropdown',{}, headeroptions);
  }
  usermapaddscreen(): Observable<{}> 
  {
    let header = new Headers();
    header.append('Content-Type','application/json');
    let authToken = localStorage.getItem("access_token");
    header.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: header});
    let data = {screenJson: {screenId: 11, subScreenId: 22}};
    return this.http.post(this.URL+"/um/Add", data,  headeroptions);
  }

  load_subLocationselectBoxData(val):Observable<{}>
  {
    let headers = new Headers();
    headers.append('Content-Type','application/json');
    let authToken = localStorage.getItem("access_token");
    headers.append('Authorization', `Bearer ${authToken}`);
    let headeroptions =new RequestOptions({ headers: headers});
    return this.http.post(this.URL+"/sub/dropdown",	{	id : val },headeroptions);
  }

  load_selectBox_departmentData(locationTypeId,sublocationTypeId): Observable<{}> {
    let head = new Headers();
    head.append('Content-Type', 'application/json');
    let authToken = localStorage.getItem("access_token");
    head.append('Authorization', `Bearer ${authToken}`);
    let headeroptions = new RequestOptions({ headers: head});
    // return this.http.post(this.URL + '/sub/dropdown', {userLocation: locationTypeId}, headeroptions);
    return this.http.post(this.URL + '/user/departmentLoad', {userLocation: locationTypeId, sublocationId: sublocationTypeId}, headeroptions);
  }  
}

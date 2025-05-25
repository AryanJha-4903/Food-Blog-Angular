import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { StorageService } from './storage.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormService {

  url = environment.apiBaseUrl


  constructor(private storageService:StorageService, private http: HttpClient) { }

  getRandomPost(page: number, size: number) : Observable<any> {
    const token = this.storageService.getItem("token")
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    let params = new HttpParams()
        .set('page', page.toString())
        .set('size', size.toString());
    // params.set('sort', 'createdAt,desc');
    console.log(params.toString())
    return this.http.get<any>(this.url+'/post/getPost', { headers, params });
  }

  getComments(postId: string): Observable<any> {
    const token = this.storageService.getItem("token")
    const headers = new HttpHeaders({
       'Authorization': `Bearer ${token}`
    });
    const payload ={
      postId: postId
    }
    return this.http.post<any>(this.url+'/comments/getComments', payload, { headers });
  }

  addComment(payload: any){
    const token = this.storageService.getItem("token")
    const headers = new HttpHeaders({
       'Authorization': `Bearer ${token}`
    });

    return this.http.post<any>(this.url+'/comments', payload, { headers });
  }

  updatelike(payload: any){
    const token = this.storageService.getItem("token")
    const headers = new HttpHeaders({
       'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(this.url+'/post/like', payload, { headers });

  }

  createPost(payload: any){
     const token = this.storageService.getItem("token")
    const headers = new HttpHeaders({
       'Authorization': `Bearer ${token}`
    });
    return this.http.post<any>(this.url+'/post/create', payload, { headers });
  }

  getPostByUsername(username: string, page: number, size: number): Observable<any> {
    const token = this.storageService.getItem("token")
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    let params = new HttpParams()
        .set('page', page.toString())
        .set('size', size.toString())
        .set('username', username);
    return this.http.get<any>(this.url+'/post/username', { headers, params });
  }

  updateFriends(currentUserId: string, friendId: string, add:boolean): Observable<string> {
    const token = this.storageService.getItem("token")
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      // 'Accept': 'application/json'
    });
    let params = new HttpParams()
        .set('currentUserId', currentUserId)
        .set('friendUserId', friendId)
        .set('add', add.toString());

    return this.http.post<string>(this.url+'/friends/update', {}, { headers, params , responseType: 'text' as 'json'});
  }
}






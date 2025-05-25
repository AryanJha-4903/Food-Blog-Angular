// import { LoginService } from './login.service';
import { FormService } from './form.service';
import { forwardRef, Inject, Injectable } from '@angular/core';
// import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { error } from 'console';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  [x: string]: any;
  private loggedIn = new BehaviorSubject<boolean>(false);
  private authUrl = `${environment.apiBaseUrl}/authenticate`;
  private signupUrl = `${environment.apiBaseUrl}/signup`;
  private claimUrl = `${environment.apiBaseUrl}/getClaims`;
  // private loggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.loggedIn.asObservable();



  constructor(private http: HttpClient,private router: Router,
    @Inject(forwardRef(() => StorageService) ) private storage: StorageService
  ) {
    const token = this.storage.getItem('token');
    this.loggedIn.next(!!token);
  }

  signup(credentials: { username: string; password: string , email:string, roles: string[] }): Observable<any> {
    credentials.roles = ['USER'];
    return this.http.post(this.signupUrl, credentials);
  }

  login(credentials: { username: string; password: string }): Observable<any> {

    return this.http.post(this.authUrl, credentials);
  }

  storeToken(token: string) {
    this.storage.setItem('token', token);
    this.getClaims().subscribe((response) => {
      console.log('Claims:', response);
      this.storage.setItem('userID', response.id)
      this.storage.setItem('username', response.sub)
      this.getProfile(response.id).subscribe({
        next:(data)=>{
          this.storage.setItem('profile', data)
          console.log(this.storage.getItem('profile'))
          this.router.navigate(['/home']);
        },
        error: (err)=>{
          console.log(err)
        }
      })

    });

    this.loggedIn.next(true);
  }

  getToken(): string | null {
    return this.storage.getItem('token');
  }

  logout() {
    this.storage.removeItem('token');
    this.storage.clear();
    this.loggedIn.next(false);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getClaims(): Observable<any> {
    const header = { headers: { Authorization: `Bearer ${this.getToken()}` } };
    const payload = { token: this.getToken() };
    return this.http.post(this.claimUrl, payload, header);
  }

  postProfile(payload: any): Observable<any> {
    // const header = { headers: { Authorization: `Bearer ${this.getToken()}` } };
      const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`,
      'Content-Type': 'application/json'
    });
    return this.http.post(`${environment.apiBaseUrl}/createProfile`, payload, { headers });
  }

  getProfile(payload: any): Observable<any> {
    // const header = { headers: { Authorization: `Bearer ${this.getToken()}` } };
      const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`,
      'Content-Type': 'application/json'
    });
    console.log({"userId": payload})
    return this.http.post(`${environment.apiBaseUrl}/getProfile`, {"userId": payload}, { headers });
  }

  getUser(userId:string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`,
      'Content-Type': 'application/json'
    });
    let params = new HttpParams()
        .set('userId', userId.toString())
    return this.http.get(`${environment.apiBaseUrl}/user`,  { headers , params });
  }

}



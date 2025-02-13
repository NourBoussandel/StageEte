import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';
import {JwtHelperService} from '@auth0/angular-jwt'
import { TokenApiModel } from '../models/token-api.model';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl: string = 'https://localhost:7216/api/User/';
  private userPayload:any;
  constructor(private http: HttpClient, private router: Router) {
    this.userPayload = this.decodedToken();
   }

 getUser(){
  const userJson = localStorage.getItem('currentUser');
    return userJson !== null ? JSON.parse(userJson) : {};
 }
 getUserInformation(id_user:number){
  return this.http.get<any>(`${this.baseUrl}get_user_informations/`+id_user);
}


getNotifications(id_user:number){
  return this.http.get<any>(`${this.baseUrl}get_notifications/`+id_user);
}

MarkNotificationsAsSeen(notif:any){
  return this.http.post<any>(`${this.baseUrl}marker_notif_est_vue`,notif);
}
hasNewNotifications()  {
  return this.http.get<boolean>(`${this.baseUrl}check_new_notifications`);
}

  signIn(loginObj : any){
    return this.http.post<any>(`${this.baseUrl}authenticate`,loginObj)
  }

  signOut(){
    localStorage.clear();
    this.router.navigate(['login'])
  }

 
  storeToken(tokenValue: string){
    localStorage.setItem('token', tokenValue)
  }
  storeRefreshToken(tokenValue: string){
    localStorage.setItem('refreshToken', tokenValue)
  }

  getToken(){
    return localStorage.getItem('token')
  }
  getRefreshToken(){
    return localStorage.getItem('refreshToken')
  }

  isLoggedIn(): boolean{
    return !!localStorage.getItem('token')
  }

  decodedToken(){
    const jwtHelper = new JwtHelperService();
    const token = this.getToken()!;
    console.log(jwtHelper.decodeToken(token))
    return jwtHelper.decodeToken(token)
  }

  

  renewToken(tokenApi : TokenApiModel){
    return this.http.post<any>(`${this.baseUrl}refresh`, tokenApi)
  }
}
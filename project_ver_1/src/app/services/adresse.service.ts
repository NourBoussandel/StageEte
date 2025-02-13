import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdresseService {

  
  private baseUrl: string = 'https://localhost:7216/api/adresse/';
  constructor(private http: HttpClient) {}

saveAdresse(adresseObj:any){
  return this.http.post<string>(`${this.baseUrl}enregistrer_adresse`,adresseObj);
}
getAdresse(id_user:number){
  return this.http.get<any>(`${this.baseUrl}get_adresse/`+id_user);
}
deleteAdresse(id:number){
  return this.http.delete<any>(`${this.baseUrl}supprimer_adresse/`+id);

}
  
}

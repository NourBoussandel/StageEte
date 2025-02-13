import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class DemandeService {

  private baseUrl: string = 'https://localhost:7216/api/demande/';
  constructor(private http: HttpClient) {}


getManagerDemandes(id_manager:number){
  return this.http.get<any>(`${this.baseUrl}get_manager_demandes/`+id_manager);
}
Get_Historique_dmd_Manager(id_manager:number){
  return this.http.get<any>(`${this.baseUrl}get_manager_historique_demande/`+id_manager);
}
GetDemandeForGantt(id_manager:number){
  return this.http.get<any>(`${this.baseUrl}get_demandes_for_gantt/`+id_manager);
}

saveDemande(demandeObj:any){
  return this.http.post<string>(`${this.baseUrl}enregistrer_demande`,demandeObj);
}
getDemande(id_contrat:number){
  return this.http.get<any>(`${this.baseUrl}get_demande/`+id_contrat);
}
deleteDemande(id:number){
  return this.http.delete<any>(`${this.baseUrl}supprimer_demande/`+id);

}
accepterDemande(id:number){
  return this.http.put<string>(`${this.baseUrl}accepter_demande/${id}`, {});
}

refuserDemande(id: number,reasons:string) {
  return this.http.put<any>(`${this.baseUrl}refuser_demande/`+id,JSON.stringify(reasons),{
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  });
    
}
GetJoursFerier( semaineId : number ){
  return this.http.get<any>(`${this.baseUrl}get_jours_type/`+semaineId);
}
getAcceptedDemands(id_contrat:number){
  return this.http.get<any>(`${this.baseUrl}get_Accepted_demandes/`+id_contrat);
}
getDemandesEnAttente(id_contrat:number){
  return this.http.get<any>(`${this.baseUrl}get_demandes_en_attente/`+id_contrat);
}


}

import { Component, OnInit, Renderer2} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/services/auth.service';
import { DemandeService } from 'src/app/services/demande.service';


@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.scss'],

})

export class AccueilComponent  implements OnInit{
 
  
  constructor(
    private demandeService :DemandeService,
    private auth :AuthService) {}

  dates = [ {date:""}];


  dateClass = (d: Date) => {
    const dateSearch = this.dateToString(d);
  
    if (!this.dataLoaded) {
      return "normal"; 
    }
  
    if ( this.dates.find(f => f.date == dateSearch)) 
     {return "example-custom-date-class";}
    else { return "normal"; } 
  };
dataLoaded = false; // Ajoutez ceci dans votre classe

ngOnInit(): void {
  var id_contrat = this.auth.getUser().id_contrat;

  this.getAcceptedDemands(id_contrat);
  this.getDemandesEnAttente(id_contrat);
}



getAcceptedDemands(id_contrat: number) {
  this.demandeService.getAcceptedDemands(id_contrat).subscribe({
    next: (res) => {
      this.dates =  res.map( (item: any) => ({

        date: this.dateToString(item)
      }));
      // Marquer les données comme chargées
      this.dataLoaded = true;
    },
    error: (err) => {
      alert('Erreur lors de la récupération des demandes');
    },
  });
}
  dateToString(dateString: any) {
    if (dateString) {
      const date = new Date(dateString);
      return (
        date.getFullYear() +
        "-" +
        ("0" + (date.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + date.getDate()).slice(-2)
      );
    }
    return ""; // Retourner une chaîne vide si la date est undefined
  }

  displayedColumns: string[] = ['date_debut', 'date_fin', 'description'];
  dataSource!: MatTableDataSource<any>;

  getDemandesEnAttente(id_contrat: number) {
    this.demandeService.getDemandesEnAttente(id_contrat).subscribe({
      next: (res) => {
       this.dataSource=res;
      },
      error: (err) => {
        alert('Erreur lors de la récupération des demandes');
      },
    });
  }


  
}







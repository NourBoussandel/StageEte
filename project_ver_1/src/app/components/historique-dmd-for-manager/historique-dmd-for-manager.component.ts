import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/services/auth.service';
import { DemandeService } from 'src/app/services/demande.service';

@Component({
  selector: 'app-historique-dmd-for-manager',
  templateUrl: './historique-dmd-for-manager.component.html',
  styleUrls: ['./historique-dmd-for-manager.component.scss']
})
export class HistoriqueDmdForManagerComponent {
  displayedColumns: string[] = ['employeeFullName','date_debut', 'date_fin','description','statut_en_cours','raisons_refus'];
  dataSource!: MatTableDataSource<any>;
  ManagerId : number =0;
  

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
     private demandeService : DemandeService,
      private auth: AuthService
     ) {
     
  }
  ngOnInit(): void {
    var ManagerId = this.auth.getUser().Id;
    this.ManagerId= ManagerId;

    this.getAllDemandes(this.ManagerId);

}

getAllDemandes(ManagerId:number){
this.demandeService.Get_Historique_dmd_Manager(ManagerId).subscribe({
  next:(res)=>{
    this.dataSource=new MatTableDataSource(res);
    this.dataSource.paginator= this.paginator;
    this.dataSource.sort=this.sort;

  },
  error:(err)=>{alert("erreur while getting demandes");}
})
}

applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();

  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
}

}

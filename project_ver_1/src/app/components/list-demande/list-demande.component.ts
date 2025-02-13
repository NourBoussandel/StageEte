import { Component, OnInit ,ViewChild} from '@angular/core';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import { DemandeService } from 'src/app/services/demande.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import { DemandeFormComponent } from '../demande-form/demande-form.component';
import { AuthService } from 'src/app/services/auth.service';



@Component({
  selector: 'app-list-demande',
  templateUrl: './list-demande.component.html',
  styleUrls: ['./list-demande.component.scss']
})
export class ListDemandeComponent implements OnInit{
  displayedColumns: string[] = ['date_debut', 'date_fin','description','statut_en_cours','action'];
  dataSource!: MatTableDataSource<any>;
   id_contrat : number =0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(public dialog: MatDialog , private demandeService : DemandeService, private auth: AuthService
     ) {
     
  }
  ngOnInit(): void {
    var contractId = this.auth.getUser().id_contrat;
    this.id_contrat = contractId;
    this.getAllDemandes(this.id_contrat);

}
  openDialog() {
    const dialogRef = this.dialog.open(DemandeFormComponent,{
      width:'30%',height:'75%',data:{id_contrat:this.id_contrat}
    }).afterClosed().subscribe(val=>{
      if(val=='enregistrer'){
        this.getAllDemandes(this.id_contrat);
      }
    })
  }
getAllDemandes(id_contrat:number){
this.demandeService.getDemande(id_contrat).subscribe({
  next:(res)=>{
    this.dataSource=new MatTableDataSource(res);
    this.dataSource.paginator= this.paginator;
    this.dataSource.sort=this.sort;

  },
  error:(err)=>{alert("erreur while getting demandes");}
})
}
edit_demande(row:any){
  if (row.statut_en_cours !== 'en_attente') {
    alert('La demande est déja traitée');
    return;
  }
  this.dialog.open(DemandeFormComponent,{
    width:'30%',data:row
  }).afterClosed().subscribe({
    next:(res)=>{this.getAllDemandes(this.id_contrat);
    }, 
    error:()=>{}
  }

      
  )
}
delete_demande(id:number){
  this.demandeService.deleteDemande(id).subscribe({
    next:(res)=>{
      alert("deleted success");
      this.getAllDemandes(this.id_contrat);
    },
    error:()=>{
      alert("erreur suppression");
    }
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

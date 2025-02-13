import { Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { DemandeService } from 'src/app/services/demande.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { RaisonRefusComponent } from '../raison-refus/raison-refus.component';
@Component({
  selector: 'app-accueil-manager',
  templateUrl: './accueil-manager.component.html',
  styleUrls: ['./accueil-manager.component.scss'],
  encapsulation: ViewEncapsulation.None,
  
})
export class AccueilManagerComponent  implements OnInit{
  displayedColumns: string[] = ['employeeFullName','date_debut', 'date_fin','description','statut_en_cours','action'];
  dataSource!: MatTableDataSource<any>;
  ManagerId : number =0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  title = 'gantt_project';
  public data?: object[];
  public taskSettings ? : object ;
  public timelineView: object = {timelineViewMode:"Week"} //Default one.

  public columnSettings: object[] = [
    {field: "taskName", headerText: "Nom Collaborateur" }  ]
 
 
  
  id_manager : number = 0 ; 
  dataLoaded = false; 
  constructor(private demandeService : DemandeService,
       private auth: AuthService,public dialog: MatDialog
      
    ){}

  ngOnInit(): void {
    this.id_manager=this.auth.getUser().Id;
    this.getDemandesForGantt(this.id_manager);
     this.getAllDemandes(this.id_manager);

     this.taskSettings= {
      id: "taskId",
      name: "taskName",
      startDate: "startDate",
      endDate: "endDate",
      segments:"segments",
      duration: "duration",
      child: "subtasks",
    }

  } 
 
  getDemandesForGantt(ManagerId:number){
    this.demandeService.GetDemandeForGantt(ManagerId).subscribe({
      next:(res)=>{
      this.data=res;
      
      this.dataLoaded = true;
    
      },
      error:(err)=>{alert("erreur while getting demandes");}
    })
    }
    
  
  getAllDemandes(ManagerId:number){
  this.demandeService.getManagerDemandes(ManagerId).subscribe({
    next:(res)=>{
      this.dataSource=new MatTableDataSource(res);
      this.dataSource.paginator= this.paginator;
      this.dataSource.sort=this.sort;
  
    },
    error:(err)=>{alert("erreur while getting demandes");}
  })
  }
  refuser_demande(id: number) {
    const dialogRef = this.dialog.open(RaisonRefusComponent, {
      width: '40%',
      height: '50%',
      data: { ManagerId: this.ManagerId }
    });
  
    dialogRef.afterClosed().subscribe((raisons_refus:string) => {
      if(raisons_refus){
        this.demandeService.refuserDemande(id,raisons_refus).subscribe({
          next: (res) => {
           
            this.getAllDemandes(this.ManagerId);
          },
          error: (x) => {
            alert(x);
          }
        });
      }
  
      
    });
  
  }
  
  
  
    accepter_demande(id:number){
      this.demandeService.accepterDemande(id).subscribe({
        next:(res)=>{
          alert("accepted success");
          this.getAllDemandes(this.id_manager);
          this.getDemandesForGantt(this.id_manager);
        },
        error:()=>{
          alert("erreur acceptation");
        }
      });
  
        
    
  }
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  }

